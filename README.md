# Home Assistant Dashboard Plugin for TRMNL
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A TRMNL plugin for Home Assistant that displays your smart home entities on a TRMNL device. Home Assistant sends entity data to TRMNL via a webhook.

> **Note:** This project is actively under development as we experiment with different layouts to find the optimal design for various setups. You may encounter occasional glitches or rapid changes. Contributions, feedback, and suggestions are highly appreciated!

---

## Features

- 🏠 Display any Home Assistant entity (sensors, switches, lights, etc.)
- 🎨 Customizable dashboard with configurable icons, titles, layout types, and scale sizes
- 🧩 Dynamic entity grouping and layout via UI
- 🌐 Multi-language support for HACS integration
- ⚡ Real-time updates via webhook from Home Assistant

## Screenshots (Default settings for Grid and List layouts)
![Groups Layout](screenshots/groups-layout.png)
![Groups Layout - no vis](screenshots/groups-layout-no-vis.png)
![List layout](screenshots/list-layout.png)

---

## Prerequisites

Before setting up this plugin, ensure you have:

1. **Home Assistant** running and accessible
2. **TRMNL device** set up and connected

---

## Setup Instructions

There are two parts to set up: the TRMNL plugin (on trmnl.com) and the Home
Assistant integration (e.g. via HACS).

### Step 1: Create the TRMNL Private Plugin

1. Log in to [trmnl.com](https://trmnl.com) and go to **Plugins**
2. Search for **"Private Plugin"** and select it
3. Enter the name: **Home Assistant Dashboard**
4. Set the strategy to **Webhook**
5. Click **Save**
6. Copy the **Webhook URL** — you will need it in Step 3

### Step 2: Install the Home Assistant Integration

#### HACS (Recommended)
1. Add this repository to HACS as a custom repository (type: Integration)
2. Install **TRMNL Dashboard** via HACS
3. Restart Home Assistant

#### Manual Installation
1. Copy the `custom_components/trmnl_dashboard` folder into your Home Assistant
   `custom_components` directory
2. Restart Home Assistant

### Step 3: Configure the Integration

1. Go to **Settings > Devices & Services** in Home Assistant
2. Click **Add Integration** and search for **TRMNL Dashboard**
3. Paste the **Webhook URL** from Step 1 when prompted
4. Use the UI to group entities, set labels, and customize your dashboard

### Step 4: Set up the TRMNL Markup

1. In Home Assistant, open **TRMNL Dashboard** from the sidebar
2. Verify the preview looks correct
3. Click **Copy Template**
4. Go back to your plugin on [trmnl.com](https://trmnl.com) and click
   **Edit Markup** (top right of the plugin page)
5. Select the **Full** tab and paste the template into the code editor
6. Save the markup

---

## How It Works

- Home Assistant collects the current state of your configured entities and
  POSTs them to your TRMNL webhook URL every 5 minutes (configurable).
- TRMNL renders the data using the Liquid template and displays it on your
  e-ink screen.
- The **TRMNL Dashboard** sidebar panel in Home Assistant shows a live preview
  of how the display will look, along with payload size information.
- The **Copy Template** button generates the Liquid template from the same
  renderer used for the preview — paste it into TRMNL's markup editor.
- No control or commands are sent from TRMNL to Home Assistant — the
  integration is display-only.

---

## Configuration Screenshots

### HACS configuration
![hacs configuration](screenshots/hacs_configuration.png)

---

## Troubleshooting

**Dashboard not displaying:**
- Use **Force Refresh** on the TRMNL plugin page to manually trigger a screen update
- Restart Home Assistant
- Check logs for errors related to `trmnl_dashboard`
- Verify the integration is listed under **Settings > Devices & Services**

---

## Contributing
We welcome contributions! Please:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by **pwojtaszko** - A TRMNL plugin for seamless Home Assistant integration.

## Support

For support, please:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with details about your setup
