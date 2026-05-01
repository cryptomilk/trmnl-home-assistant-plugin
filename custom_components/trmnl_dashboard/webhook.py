import json
import logging

_LOGGER = logging.getLogger(__name__)

PAYLOAD_LIMIT_FREE = 2048
PAYLOAD_LIMIT_PAID = 65536


class PayloadTooLargeError(Exception):
    def __init__(self, size: int, limit: int):
        self.size = size
        self.limit = limit
        super().__init__(f"Payload {size} bytes exceeds limit of {limit} bytes")


async def send_to_trmnl_webhook(session, data, webhook_url, max_payload_bytes=PAYLOAD_LIMIT_FREE):
    payload = {"merge_variables": data}
    payload_bytes = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    payload_size = len(payload_bytes)

    if payload_size > max_payload_bytes:
        _LOGGER.warning(
            "TRMNL Dashboard: payload %d bytes exceeds %d byte limit, skipping send",
            payload_size,
            max_payload_bytes,
        )
        raise PayloadTooLargeError(payload_size, max_payload_bytes)

    try:
        async with session.post(webhook_url, json=payload) as response:
            resp_text = await response.text()
            if response.status != 200:
                _LOGGER.error("TRMNL Dashboard: Error response: %s", resp_text)
                raise Exception(f"Webhook error: {response.status} {resp_text}")
    except Exception as ex:
        _LOGGER.error("TRMNL Dashboard: Exception during webhook update: %s", ex)
        raise
