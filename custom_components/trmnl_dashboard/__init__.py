import logging
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from .const import DOMAIN
from .webhook import TRMNL_TIERS
from .payload import build_webhook_payload, send_webhook_with_notification

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass, entry):
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["entry"] = entry

    def get_merged_config():
        merged = dict(entry.data)
        if hasattr(entry, "options") and entry.options:
            merged.update(entry.options)
        return merged

    from datetime import timedelta
    from homeassistant.helpers.event import async_track_time_interval

    session = async_get_clientsession(hass)
    merged_config = get_merged_config()
    tier_name = merged_config.get("trmnl_tier", "free")
    tier = TRMNL_TIERS.get(tier_name, TRMNL_TIERS["free"])
    min_interval = tier["min_interval"]
    interval_seconds = max(merged_config.get("interval", 300), min_interval)

    async def periodic_update(now):
        config = get_merged_config()
        webhook_url = config.get("webhook_url")
        if webhook_url:
            try:
                webhook_data = await build_webhook_payload(hass, config)
                await send_webhook_with_notification(hass, session, webhook_data, webhook_url, config)
            except Exception as e:
                _LOGGER.error("TRMNL Dashboard periodic update failed: %s", e)

    remove_listener = async_track_time_interval(
        hass,
        periodic_update,
        timedelta(seconds=interval_seconds),
    )
    hass.data[DOMAIN]["remove_listener"] = remove_listener

    # Initial update
    webhook_url = merged_config.get("webhook_url")
    if webhook_url:
        try:
            webhook_data = await build_webhook_payload(hass, merged_config)
            await send_webhook_with_notification(hass, session, webhook_data, webhook_url, merged_config)
        except Exception as e:
            _LOGGER.error("TRMNL Dashboard initial update failed: %s", e)

    async def _reload_service(call):
        await async_reload_entry(hass, entry)

    hass.services.async_register(DOMAIN, "reload", _reload_service)
    return True


async def async_unload_entry(hass, entry):
    hass.data[DOMAIN].pop("entry", None)
    remove_listener = hass.data[DOMAIN].pop("remove_listener", None)
    if remove_listener:
        remove_listener()
    hass.services.async_remove(DOMAIN, "reload")
    return True


async def async_reload_entry(hass, entry):
    await async_unload_entry(hass, entry)
    await async_setup_entry(hass, entry)
