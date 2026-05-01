import logging
from .webhook import (
    TRMNL_TIERS,
    PayloadTooLargeError,
    send_to_trmnl_webhook,
)

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


async def build_webhook_payload(hass, config):
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
                        return_response=True,
                    )
                    if forecast_response and entity_id in forecast_response:
                        forecast = forecast_response[entity_id].get("forecast", [])
                except Exception as forecast_err:
                    _LOGGER.debug("Could not fetch forecast for %s: %s", entity_id, forecast_err)
            updated_visualizations.append(_slim_weather(entity_id, state_obj, forecast))
        else:
            updated_visualizations.append(viz)

    return {
        "groups": updated_groups,
        "pills": updated_pills,
        "visualizations": updated_visualizations,
        "configuration": {
            "layout": config.get("layout", "groups"),
            "pill_position": config.get("pill_position", "top"),
            "show_title_bar": config.get("show_title_bar", "true"),
            "show_entity_title": config.get("show_entity_title", "true"),
            "show_entity_icon": config.get("show_entity_icon", "true"),
            "scale": config.get("scale", "normal"),
        },
    }


async def send_webhook_with_notification(hass, session, webhook_data, webhook_url, config):
    tier_name = config.get("trmnl_tier", "free")
    tier = TRMNL_TIERS.get(tier_name, TRMNL_TIERS["free"])
    max_payload_bytes = tier["max_payload_bytes"]

    try:
        await send_to_trmnl_webhook(session, webhook_data, webhook_url, max_payload_bytes)
    except PayloadTooLargeError as e:
        await hass.services.async_call(
            "persistent_notification",
            "create",
            {
                "title": "TRMNL Dashboard",
                "message": (
                    f"Payload too large: {e.size} bytes "
                    f"(limit: {e.limit} bytes for {tier_name} tier). "
                    "Remove some entities or upgrade your TRMNL plan."
                ),
                "notification_id": "trmnl_payload_too_large",
            },
        )
