import json
import logging

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .payload import build_webhook_payload
from .webhook import TRMNL_TIERS

_LOGGER = logging.getLogger(__name__)


def async_register_api(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_get_preview)


@websocket_api.websocket_command(
    {vol.Required("type"): "trmnl_dashboard/get_config"}
)
@websocket_api.require_admin
@callback
def ws_get_config(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    entry = hass.data.get(DOMAIN, {}).get("entry")
    if not entry:
        connection.send_error(msg["id"], "not_configured", "No TRMNL Dashboard config entry found")
        return

    merged = dict(entry.data)
    if hasattr(entry, "options") and entry.options:
        merged.update(entry.options)
    merged.pop("webhook_url", None)
    connection.send_result(msg["id"], {"config": merged})


@websocket_api.websocket_command(
    {vol.Required("type"): "trmnl_dashboard/get_preview"}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_get_preview(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    entry = hass.data.get(DOMAIN, {}).get("entry")
    if not entry:
        connection.send_error(msg["id"], "not_configured", "No TRMNL Dashboard config entry found")
        return

    merged = dict(entry.data)
    if hasattr(entry, "options") and entry.options:
        merged.update(entry.options)

    payload = await build_webhook_payload(hass, merged)

    payload_bytes = json.dumps(
        {"merge_variables": payload}, separators=(",", ":")
    ).encode("utf-8")
    payload_size = len(payload_bytes)

    tier_name = merged.get("trmnl_tier", "free")
    tier = TRMNL_TIERS.get(tier_name, TRMNL_TIERS["free"])

    connection.send_result(msg["id"], {
        "payload": payload,
        "payload_size": payload_size,
        "max_payload_bytes": tier["max_payload_bytes"],
        "tier": tier_name,
    })
