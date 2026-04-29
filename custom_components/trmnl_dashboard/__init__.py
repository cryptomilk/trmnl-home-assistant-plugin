import logging
from homeassistant.helpers.aiohttp_client import async_get_clientsession

DOMAIN = "trmnl_dashboard"
_LOGGER = logging.getLogger(__name__)

_ENTITY_ATTRS = {"friendly_name", "device_class", "unit_of_measurement", "icon"}
_WEATHER_ATTRS = {
    "friendly_name", "temperature", "temperature_unit", "humidity",
    "pressure", "pressure_unit", "wind_speed", "wind_speed_unit",
    "cloud_coverage", "visibility", "visibility_unit", "precipitation_unit",
}
_FORECAST_ATTRS = {"datetime", "condition", "temperature", "templow", "precipitation"}

def _slim_entity(entity_id, state_obj):
    attrs = state_obj.attributes
    return {
        "entity_id": entity_id,
        "state": state_obj.state,
        "attributes": {k: attrs[k] for k in _ENTITY_ATTRS if k in attrs},
    }

def _slim_weather(entity_id, state_obj, forecast):
    attrs = state_obj.attributes
    slim_forecast = [
        {k: day[k] for k in _FORECAST_ATTRS if k in day}
        for day in (forecast or [])[:5]
    ]
    return {
        "entity_id": entity_id,
        "state": state_obj.state,
        "attributes": {k: attrs[k] for k in _WEATHER_ATTRS if k in attrs},
        "forecast": slim_forecast,
    }

async def async_setup_entry(hass, entry):
    # Register static path for frontend JS
    # Static www directory registration removed
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["entry"] = entry

    # Always use merged config: options override data
    def get_merged_config():
        merged = dict(entry.data)
        if hasattr(entry, "options") and entry.options:
            merged.update(entry.options)
        return merged

    # Interval update setup
    from datetime import timedelta
    from homeassistant.helpers.event import async_track_time_interval
    from .webhook import send_to_trmnl_webhook

    session = async_get_clientsession(hass)
    merged_config = get_merged_config()
    interval_seconds = merged_config.get("interval", 300)  # Default 5 min (TRMNL free: 12 req/hour)

    try:
        async def periodic_update(now):
            config = get_merged_config()
            webhook_url = config.get("webhook_url")  # Always fetch latest
            # Build dynamic data from entity states
            groups = config.get("groups", [])
            pills = config.get("pills", [])
            visualizations = config.get("visualizations", [])
            updated_groups = []
            for group in groups:
                updated_entities = []
                for entity in group.get("entities", []):
                    entity_id = entity.get("entity_id")
                    state_obj = hass.states.get(entity_id)
                    updated_entities.append(
                        _slim_entity(entity_id, state_obj) if state_obj else entity
                    )
                updated_group = dict(group)
                updated_group["entities"] = updated_entities
                updated_groups.append(updated_group)
            updated_pills = []
            for pill in pills:
                entity_id = pill.get("entity_id")
                state_obj = hass.states.get(entity_id)
                updated_pills.append(
                    _slim_entity(entity_id, state_obj) if state_obj else pill
                )
            updated_visualizations = []
            for viz in visualizations:
                entity_id = viz.get("entity_id")
                state_obj = hass.states.get(entity_id)
                if state_obj:
                    forecast = []
                    if entity_id.startswith("weather."):
                        try:
                            forecast_response = await hass.services.async_call(
                                "weather",
                                "get_forecasts",
                                {"entity_id": entity_id, "type": "daily"},
                                blocking=True,
                                return_response=True
                            )
                            if forecast_response and entity_id in forecast_response:
                                forecast = forecast_response[entity_id].get("forecast", [])
                        except Exception as forecast_err:
                            _LOGGER.debug(f"Could not fetch forecast for {entity_id}: {forecast_err}")
                    updated_visualizations.append(_slim_weather(entity_id, state_obj, forecast))
                else:
                    updated_visualizations.append(viz)
            webhook_data = {
                "groups": updated_groups,
                "pills": updated_pills,
                "visualizations": updated_visualizations,
                "configuration": {
                    "layout": config.get("layout", "groups"),
                    "pill_position": config.get("pill_position", "top"),
                    "show_title_bar": config.get("show_title_bar", "true"),
                    "show_entity_title": config.get("show_entity_title", "true"),
                    "show_entity_icon": config.get("show_entity_icon", "true"),
                    "scale": config.get("scale", "normal")
                }
            }
            if webhook_url:
                try:
                    await send_to_trmnl_webhook(session, webhook_data, webhook_url)
                except Exception as e:
                    _LOGGER.error(f"TRMNL Dashboard periodic update failed: {e}")

        remove_listener = async_track_time_interval(
            hass,
            periodic_update,
            timedelta(seconds=interval_seconds)
        )
        hass.data[DOMAIN]["remove_listener"] = remove_listener

        # Initial update
        webhook_url = merged_config.get("webhook_url")  # Always fetch latest
        if webhook_url:
            # Build dynamic data from entity states (same as periodic_update)
            groups = merged_config.get("groups", [])
            pills = merged_config.get("pills", [])
            visualizations = merged_config.get("visualizations", [])
            updated_groups = []
            for group in groups:
                updated_entities = []
                for entity in group.get("entities", []):
                    entity_id = entity.get("entity_id")
                    state_obj = hass.states.get(entity_id)
                    updated_entities.append(
                        _slim_entity(entity_id, state_obj) if state_obj else entity
                    )
                updated_group = dict(group)
                updated_group["entities"] = updated_entities
                updated_groups.append(updated_group)
            updated_pills = []
            for pill in pills:
                entity_id = pill.get("entity_id")
                state_obj = hass.states.get(entity_id)
                updated_pills.append(
                    _slim_entity(entity_id, state_obj) if state_obj else pill
                )
            updated_visualizations = []
            for viz in visualizations:
                entity_id = viz.get("entity_id")
                state_obj = hass.states.get(entity_id)
                if state_obj:
                    forecast = []
                    if entity_id.startswith("weather."):
                        try:
                            forecast_response = await hass.services.async_call(
                                "weather",
                                "get_forecasts",
                                {"entity_id": entity_id, "type": "daily"},
                                blocking=True,
                                return_response=True
                            )
                            if forecast_response and entity_id in forecast_response:
                                forecast = forecast_response[entity_id].get("forecast", [])
                        except Exception as forecast_err:
                            _LOGGER.debug(f"Could not fetch forecast for {entity_id}: {forecast_err}")
                    updated_visualizations.append(_slim_weather(entity_id, state_obj, forecast))
                else:
                    updated_visualizations.append(viz)
            webhook_data = {
                "groups": updated_groups,
                "pills": updated_pills,
                "visualizations": updated_visualizations,
                "configuration": {
                    "layout": merged_config.get("layout", "groups"),
                    "pill_position": merged_config.get("pill_position", "top"),
                    "show_title_bar": merged_config.get("show_title_bar", "true"),
                    "show_entity_title": merged_config.get("show_entity_title", "true"),
                    "show_entity_icon": merged_config.get("show_entity_icon", "true"),
                    "scale": merged_config.get("scale", "normal")
                }
            }
            try:
                await send_to_trmnl_webhook(session, webhook_data, webhook_url)
            except Exception as e:
                _LOGGER.error(f"TRMNL Dashboard initial update failed: {e}")

    except Exception as setup_ex:
        _LOGGER.error(f"TRMNL Dashboard: Error in async_setup_entry: {setup_ex}")

    async def _reload_service(call):
        await async_reload_entry(hass, entry)

    hass.services.async_register(DOMAIN, "reload", _reload_service)
    return True

async def async_unload_entry(hass, entry):
    # Remove stored entry and unregister service
    hass.data[DOMAIN].pop("entry", None)
    # Remove interval listener if exists
    remove_listener = hass.data[DOMAIN].pop("remove_listener", None)
    if remove_listener:
        remove_listener()
    hass.services.async_remove(DOMAIN, "reload")
    return True

async def async_reload_entry(hass, entry):
    # Unload and re-setup entry for live config reload
    await async_unload_entry(hass, entry)
    await async_setup_entry(hass, entry)
