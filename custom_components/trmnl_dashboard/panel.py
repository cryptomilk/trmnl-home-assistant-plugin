import logging
from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

URL_BASE = "/trmnl_dashboard_static"


async def async_setup_panel(hass: HomeAssistant) -> None:
    www_path = Path(__file__).parent / "www"

    await hass.http.async_register_static_paths(
        [StaticPathConfig(URL_BASE, str(www_path), cache_headers=False)]
    )

    await panel_custom.async_register_panel(
        hass=hass,
        frontend_url_path="trmnl-dashboard",
        webcomponent_name="trmnl-dashboard-panel",
        sidebar_title="TRMNL Dashboard",
        sidebar_icon="mdi:monitor-dashboard",
        module_url=f"{URL_BASE}/trmnl-dashboard-panel.js",
        embed_iframe=False,
        require_admin=True,
    )
