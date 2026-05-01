import voluptuous as vol
import logging
from homeassistant import config_entries
from homeassistant.core import callback
from .const import DOMAIN
from .payload import build_webhook_payload, send_webhook_with_notification
from homeassistant.helpers.selector import selector
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)


def _build_schema(prev_data=None, user_input=None, num_groups=1, include_remove=False):
    prev_data = prev_data or {}
    webhook_url_default = ""
    if user_input and "webhook_url" in user_input:
        webhook_url_default = user_input["webhook_url"]
    else:
        webhook_url_default = prev_data.get("webhook_url", "")
    schema_dict: dict = {
        vol.Required("webhook_url", default=webhook_url_default): str,
    }

    trmnl_tier_default = user_input.get("trmnl_tier") if user_input else prev_data.get("trmnl_tier", "free")
    schema_dict[vol.Optional("trmnl_tier", default=trmnl_tier_default)] = selector({"select": {"options": ["free", "paid"], "translation_key": "trmnl_tier"}})

    layout_default = user_input.get("layout") if user_input else prev_data.get("layout", "groups")
    schema_dict[vol.Optional("layout", default=layout_default)] = selector({"select": {"options": ["groups", "list"], "translation_key": "layout"}})

    pill_position_default = user_input.get("pill_position") if user_input else prev_data.get("pill_position", "top")
    schema_dict[vol.Optional("pill_position", default=pill_position_default)] = selector({"select": {"options": ["top", "bottom", "left", "right"], "translation_key": "pill_position"}})

    show_title_bar_default = user_input.get("show_title_bar", prev_data.get("show_title_bar", True)) if user_input is not None else prev_data.get("show_title_bar", True)
    if isinstance(show_title_bar_default, str):
        show_title_bar_default = show_title_bar_default == "true"
    schema_dict[vol.Optional("show_title_bar", default=show_title_bar_default)] = bool

    show_entity_title_default = user_input.get("show_entity_title", prev_data.get("show_entity_title", True)) if user_input is not None else prev_data.get("show_entity_title", True)
    if isinstance(show_entity_title_default, str):
        show_entity_title_default = show_entity_title_default == "true"
    schema_dict[vol.Optional("show_entity_title", default=show_entity_title_default)] = bool

    show_entity_icon_default = user_input.get("show_entity_icon", prev_data.get("show_entity_icon", True)) if user_input is not None else prev_data.get("show_entity_icon", True)
    if isinstance(show_entity_icon_default, str):
        show_entity_icon_default = show_entity_icon_default == "true"
    schema_dict[vol.Optional("show_entity_icon", default=show_entity_icon_default)] = bool

    scale_default = user_input.get("scale") if user_input else prev_data.get("scale", "normal")
    schema_dict[vol.Optional("scale", default=scale_default)] = selector({"select": {"options": ["small", "normal", "big"], "translation_key": "scale"}})

    pill_entities_default = []
    if user_input:
        pill_entities_default = user_input.get("pill_entities", [e.get("entity_id") for e in prev_data.get("pills", [])])
    elif prev_data.get("pills"):
        pill_entities_default = [e.get("entity_id") for e in prev_data["pills"]]
    schema_dict[vol.Optional("pill_entities", default=pill_entities_default)] = selector({"entity": {"multiple": True}})

    visualization_entities_default = []
    if user_input:
        visualization_entities_default = user_input.get("visualization_entities", [e.get("entity_id") for e in prev_data.get("visualizations", [])])
    elif prev_data.get("visualizations"):
        visualization_entities_default = [e.get("entity_id") for e in prev_data["visualizations"]]
    schema_dict[vol.Optional("visualization_entities", default=visualization_entities_default)] = selector({"entity": {"multiple": True, "domain": "weather"}})

    groups = prev_data.get("groups", [])
    for i in range(num_groups):
        group_name_default = None
        group_entities_default = []
        if user_input:
            group_name_default = user_input.get(f"group_{i}_name", groups[i].get("groupName", f"Group {i+1}") if i < len(groups) else f"Group {i+1}")
            group_entities_default = user_input.get(f"group_{i}_entities", [e.get("entity_id") for e in groups[i].get("entities", [])] if i < len(groups) else [])
        elif i < len(groups):
            group_name_default = groups[i].get("groupName", f"Group {i+1}")
            group_entities_default = [e.get("entity_id") for e in groups[i].get("entities", [])]
        else:
            group_name_default = f"Group {i+1}"
            group_entities_default = []
        schema_dict[vol.Optional(f"group_{i}_name", default=group_name_default)] = str
        schema_dict[vol.Optional(f"group_{i}_entities", default=group_entities_default)] = selector({"entity": {"multiple": True}})
        if include_remove:
            schema_dict[vol.Optional(f"remove_group_{i}", default=False)] = bool
    schema_dict[vol.Optional("add_another_group", default=False)] = bool
    return vol.Schema(schema_dict)


class TrmnlWebhookConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    async def async_step_user(self, user_input=None):
        prev_data = {}
        if hasattr(self, "config_entry") and self.config_entry:
            prev_data = {**self.config_entry.data, **self.config_entry.options}

        # Always build groups from user_input if present, else from prev_data
        if user_input is not None:
            # Determine current number of groups from user_input
            i = 0
            while f"group_{i}_name" in user_input or f"group_{i}_entities" in user_input:
                i += 1
            num_groups = i if i > 0 else 1
            add_group = user_input.get("add_another_group", False)
            # Build groups from user_input (just entity IDs)
            new_groups = []
            for idx in range(num_groups):
                group_name = user_input.get(f"group_{idx}_name", f"Group {idx+1}")
                group_entities = user_input.get(f"group_{idx}_entities", [])
                group_dict = {
                    "entities": [{"entity_id": ent} for ent in group_entities if ent]
                }
                if group_name:
                    group_dict["groupName"] = group_name
                new_groups.append(group_dict)
            if add_group:
                new_groups.append({"groupName": f"Group {len(new_groups)+1}", "entities": []})
                num_groups = len(new_groups)
                schema = _build_schema(prev_data, user_input, num_groups)
                # Build description_placeholders for dynamic group labels
                placeholders = {}
                for i in range(num_groups):
                    placeholders[f"group_{i}_name"] = {"number": str(i + 1)}
                    placeholders[f"group_{i}_entities"] = {"number": str(i + 1)}
                return self.async_show_form(
                    step_id="user",
                    data_schema=schema,
                    description_placeholders=placeholders,
                )
            webhook_url = user_input.get("webhook_url") or prev_data.get("webhook_url", "")
            pill_entities = user_input.get("pill_entities", [])
            pills_obj = [{"entity_id": ent} for ent in pill_entities if ent]
            visualization_entities = user_input.get("visualization_entities", [])
            visualizations_obj = [{"entity_id": ent} for ent in visualization_entities if ent]
            data = {
                "webhook_url": webhook_url,
                "trmnl_tier": user_input.get("trmnl_tier", "free"),
                "groups": new_groups,
                "pills": pills_obj,
                "visualizations": visualizations_obj,
                "layout": user_input.get("layout", "groups"),
                "pill_position": user_input.get("pill_position", "top"),
                "show_title_bar": "true" if user_input.get("show_title_bar", True) else "false",
                "show_entity_title": "true" if user_input.get("show_entity_title", True) else "false",
                "show_entity_icon": "true" if user_input.get("show_entity_icon", True) else "false",
                "scale": user_input.get("scale", "normal")
            }
            # Send webhook on config creation
            if data.get("webhook_url"):
                hass = self.hass
                session = async_get_clientsession(hass)
                try:
                    webhook_data = await build_webhook_payload(hass, data)
                    await send_webhook_with_notification(hass, session, webhook_data, data["webhook_url"], data)
                except Exception as e:
                    _LOGGER.error("TRMNL Dashboard config_flow initial webhook failed: %s", e)
            return self.async_create_entry(title="TRMNL Dashboard", data=data)
        else:
            groups = prev_data.get("groups", [])
            num_groups = len(groups) if groups else 1
            schema = _build_schema(prev_data, user_input, num_groups)

            # Build description_placeholders for dynamic group labels
            placeholders = {}
            for i in range(num_groups):
                placeholders[f"group_{i}_name"] = {"number": str(i + 1)}
                placeholders[f"group_{i}_entities"] = {"number": str(i + 1)}
            
            return self.async_show_form(
                step_id="user",
                data_schema=schema,
                description_placeholders=placeholders,
            )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return TrmnlWebhookOptionsFlowHandler(config_entry)

class TrmnlWebhookOptionsFlowHandler(config_entries.OptionsFlow):
    def __init__(self, config_entry):
        # Store entry_id for context lookup
        self.entry_id = config_entry.entry_id

    async def async_step_init(self, user_input=None):
        entry = self.hass.config_entries.async_get_entry(self.entry_id)
        prev_data = {**entry.data, **entry.options} if entry else {}
        hass = self.hass

        # Always build groups from user_input if present, else from prev_data
        if user_input is not None:
            # Determine current number of groups from user_input
            i = 0
            while f"group_{i}_name" in user_input or f"group_{i}_entities" in user_input:
                i += 1
            num_groups = i if i > 0 else 1
            add_group = user_input.get("add_another_group", False)
            # Handle group removal
            removed_indices = []
            for idx in range(num_groups):
                if user_input.get(f"remove_group_{idx}"):
                    removed_indices.append(idx)
            # Build groups from user_input (just entity IDs)
            updated_groups = []
            for idx in range(num_groups):
                if idx in removed_indices:
                    continue
                group_name = user_input.get(f"group_{idx}_name", f"Group {idx+1}")
                group_entities = user_input.get(f"group_{idx}_entities", [])
                group_dict = {
                    "entities": [{"entity_id": ent} for ent in group_entities if ent]
                }
                if group_name:
                    group_dict["groupName"] = group_name
                updated_groups.append(group_dict)
            if add_group:
                updated_groups.append({"groupName": f"Group {len(updated_groups)+1}", "entities": []})
                num_groups = len(updated_groups)
                schema = _build_schema(prev_data, user_input, num_groups, include_remove=True)
                # Build description_placeholders for dynamic group labels
                placeholders = {}
                for i in range(num_groups):
                    placeholders[f"group_{i}_name"] = {"number": str(i + 1)}
                    placeholders[f"group_{i}_entities"] = {"number": str(i + 1)}
                    placeholders[f"remove_group_{i}"] = {"number": str(i + 1)}
                return self.async_show_form(
                    step_id="init",
                    data_schema=schema,
                    description_placeholders=placeholders
                )
            webhook_url = user_input.get("webhook_url", prev_data.get("webhook_url", ""))
            pills_entities = user_input.get("pill_entities", [])
            pills_obj = [{"entity_id": ent} for ent in pills_entities if ent]
            visualization_entities = user_input.get("visualization_entities", [])
            visualizations_obj = [{"entity_id": ent} for ent in visualization_entities if ent]
            data = {
                "webhook_url": webhook_url,
                "trmnl_tier": user_input.get("trmnl_tier", "free"),
                "groups": updated_groups,
                "pills": pills_obj,
                "visualizations": visualizations_obj,
                "layout": user_input.get("layout", "groups"),
                "pill_position": user_input.get("pill_position", "top"),
                "show_title_bar": "true" if user_input.get("show_title_bar", True) else "false",
                "show_entity_title": "true" if user_input.get("show_entity_title", True) else "false",
                "show_entity_icon": "true" if user_input.get("show_entity_icon", True) else "false",
                "scale": user_input.get("scale", "normal")
            }
            # Send webhook on options update
            if data.get("webhook_url"):
                session = async_get_clientsession(hass)
                try:
                    webhook_data = await build_webhook_payload(hass, data)
                    await send_webhook_with_notification(hass, session, webhook_data, data["webhook_url"], data)
                except Exception as e:
                    _LOGGER.error("TRMNL Dashboard config_flow options webhook failed: %s", e)
            return self.async_create_entry(title="config_flow.options_title", data=data)
        else:
            groups = prev_data.get("groups", [])
            num_groups = len(groups) if groups else 1
            schema = _build_schema(prev_data, user_input, num_groups, include_remove=True)

            # Build description_placeholders for dynamic group labels
            placeholders = {}
            for i in range(num_groups):
                placeholders[f"group_{i}_name"] = {"number": str(i + 1)}
                placeholders[f"group_{i}_entities"] = {"number": str(i + 1)}
                placeholders[f"remove_group_{i}"] = {"number": str(i + 1)}
            
            return self.async_show_form(step_id="init", data_schema=schema, description_placeholders=placeholders)

