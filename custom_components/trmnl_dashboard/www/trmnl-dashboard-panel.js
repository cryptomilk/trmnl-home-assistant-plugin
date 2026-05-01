// TRMNL Dashboard — HA sidebar panel + Liquid template generator
// The CSS and HomeAssistantRenderer class below are the single source of truth.
// full.liquid is generated from them via generateLiquidTemplate().

// ---------------------------------------------------------------------------
// Section 1: TRMNL CSS (original selectors for template generation)
// ---------------------------------------------------------------------------

const TRMNL_CSS = `
  /* Layout */
  .trmnl .view .layout { flex: 1; }
  .trmnl .view--quadrant .title_bar,
  .trmnl .view--half_horizontal::before { background: none; }

  #root {
    font-family: 'Inter', 'NicoClean', sans-serif;
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  #root:has(.pills-container--left) { flex-direction: row; }
  #root:has(.pills-container--right) { flex-direction: row-reverse; }
  #root:has(.pills-container--top) { flex-direction: column; }
  #root:has(.pills-container--bottom) { flex-direction: column-reverse; }

  .sections-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  /* Pills */
  .pills-container,
  .pills-container--top { margin-bottom: 10px; }
  .pills-container--bottom { margin-top: 10px; }
  .pills-container--left { margin-right: 10px; }
  .pills-container--right { margin-left: 10px; }

  .pill-component {
    border: 2px solid black;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 5px;
  }

  .pills-container--left .pill-component,
  .pills-container--right .pill-component {
    writing-mode: vertical-lr;
    transform: rotate(180deg);
  }

  .app-root.list-layout .pill-component { border: none; }

  /* Entity common styles */
  .entity-name,
  .entity-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .entity-value { max-width: 155px; }

  /* Entity groups */
  .entity-group {
    border: 2px solid black;
    border-radius: 16px;
    padding: 16px;
    margin-top: 15px;
    background: #fff;
    position: relative;
  }

  .group-header {
    position: absolute;
    background: #fff;
    padding: 0 4px;
    z-index: 2;
  }
  .group-header span { color: inherit; }

  .groups-layout .group-header {
    top: 0;
    transform: translateY(-50%);
    line-height: 1;
  }

  .group-content {
    margin-top: 8px;
    gap: 20px;
  }

  .entity-card {
    min-width: 100px;
    margin: 0 auto;
  }

  .entity-header {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  /* Groups layout */
  .groups-layout .free-layout-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 5px;
    grid-auto-flow: dense;
  }
  .groups-layout .free-layout-container .group-content {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    align-items: center;
  }

  /* List layout */
  .list-layout .free-layout-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 5px;
    width: 100%;
  }

  .list-layout .free-layout-container .entity-group {
    width: max-content;
    background: none;
    border: none;
    border-radius: 0;
    padding: 0 0 0 17px;
    margin: 0;
    grid-column: span 2;
  }

  .list-layout .free-layout-container .group-header {
    font-weight: 600;
    margin-bottom: 8px;
    position: static;
    background: none;
    padding: 0;
  }

  .list-layout .free-layout-container .group-content {
    display: grid;
    width: 100%;
    break-inside: avoid;
    gap: 5px;
  }

  /* Dynamic grid columns */
  .list-layout .free-layout-container.show-all .group-content { grid-template-columns: 1fr 28px auto auto; }
  .list-layout .free-layout-container.hide-title .group-content { grid-template-columns: 28px auto auto; }
  .list-layout .free-layout-container.hide-icon .group-content { grid-template-columns: 1fr auto auto; }
  .list-layout .free-layout-container.hide-title.hide-icon .group-content { grid-template-columns: auto auto; }

  .list-layout .free-layout-container .entity-list-row { display: contents; }

  .list-layout .free-layout-container .entity-list-row .entity-name {
    font-weight: 400;
    white-space: nowrap;
    text-align: left;
    align-self: center;
  }

  .list-layout .free-layout-container .entity-list-row .entity-icon {
    justify-self: center;
    align-self: center;
    display: flex;
    align-items: center;
  }

  .list-layout .free-layout-container .entity-list-row .entity-value {
    font-weight: 500;
    white-space: nowrap;
    text-align: left;
    align-self: center;
  }

  /* Grid column assignments */
  .list-layout .free-layout-container.show-all .group-content .entity-name { grid-column: 1; }
  .list-layout .free-layout-container.show-all .group-content .entity-icon { grid-column: 2; }
  .list-layout .free-layout-container.show-all .group-content .entity-value { grid-column: 3; }
  .list-layout .free-layout-container.hide-title .group-content .entity-icon { grid-column: 1; }
  .list-layout .free-layout-container.hide-title .group-content .entity-value { grid-column: 2; }
  .list-layout .free-layout-container.hide-icon .group-content .entity-name { grid-column: 1; }
  .list-layout .free-layout-container.hide-icon .group-content .entity-value { grid-column: 2; }
  .list-layout .free-layout-container.hide-title.hide-icon .group-content .entity-value { grid-column: 1; }

  /* Mashup layouts */
  .mashup--1Lx1R .free-layout-container,
  .mashup--2x2 .free-layout-container {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .free-layout-container.hide-title.hide-icon .entity-group {
    grid-column: span 1;
  }

  /* Weather visualization */
  .visualizations-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .weather-visualization {
    grid-column: span 2 !important;
    grid-row: span 2;
    width: 100% !important;
    min-width: 250px;
    max-width: 380px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .groups-layout .scale-normal .weather-visualization, .groups-layout .scale-small .weather-visualization { grid-row: span 3; }

  .groups-layout .scale-small .weather-visualization { grid-column: span 2; }

  .weather-main-row {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .weather-details-row {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }

  .weather-detail {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 6px;
    border-left: 1px solid #000;
    background: none;
    height: max-content;
  }

  .weather-detail-icon {
    filter: grayscale(1) contrast(1.2);
  }

  .weather-icon-small {
    width: 45px; height: 45px;
  }

  .weather-icon-normal {
    width: 56px; height: 56px;
  }

  .weather-icon-big {
    width: 70px; height: 70px;
  }

  .scale-small .weather-detail-icon { width: 18px; height: 18px; }
  .scale-normal .weather-detail-icon { width: 22px; height: 22px; }
  .scale-big .weather-detail-icon { width: 28px; height: 28px; }

  /* Weather forecast */
  .weather-forecast {
    display: flex;
    flex-direction: row;
    gap: 1px;
    overflow-x: auto;
    padding: 8px 0;
    justify-content: space-between;
  }

  .forecast-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
  }

  .forecast-date {
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }

  .forecast-icon {
    filter: grayscale(1) contrast(1.2);
  }

  .forecast-temps {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .forecast-temp-high {
    font-weight: 600;
  }

  .forecast-temp-low {
    opacity: 0.7;
  }

  .forecast-precip {
    font-size: 0.85em;
    text-align: center;
  }
`;

// ---------------------------------------------------------------------------
// Section 2: MDI icon paths (inline SVG, no external API dependency)
// ---------------------------------------------------------------------------

const MDI_ICONS = {
  'mdi:account': 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
  'mdi:account-group': 'M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z',
  'mdi:air-filter': 'M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z',
  'mdi:alert': 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z',
  'mdi:alert-circle': 'M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  'mdi:battery': 'M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z',
  'mdi:bell': 'M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21',
  'mdi:brightness-6': 'M12,18V6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z',
  'mdi:camera': 'M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z',
  'mdi:chart-line': 'M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z',
  'mdi:checkbox-marked': 'M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z',
  'mdi:cog': 'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z',
  'mdi:counter': 'M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8 18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L13.87,7.31C13.87,7.31 13.88,6.65 14.25,6H13V18H15.58L15.57,17.14L16.54,17.13C16.54,17.13 17.45,16.97 17.46,16.08C17.5,15.08 16.65,15.08 16.5,15.08C16.37,15.08 15.43,15.13 15.43,15.95H13.91C13.91,15.95 13.95,13.89 16.5,13.89C19.1,13.89 18.96,15.91 18.96,15.91C18.96,15.91 19,17.16 17.85,17.63L18.37,18H20M8.92,16H7.42V10.2L5.62,10.76V9.53L8.76,8.41H8.92V16Z',
  'mdi:current-ac': 'M12.43 11C12.28 10.84 10 7 7 7S2.32 10.18 2 11V13H11.57C11.72 13.16 14 17 17 17S21.68 13.82 22 13V11H12.43M7 9C8.17 9 9.18 9.85 10 11H4.31C4.78 10.17 5.54 9 7 9M17 15C15.83 15 14.82 14.15 14 13H19.69C19.22 13.83 18.46 15 17 15Z',
  'mdi:door': 'M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z',
  'mdi:eye': 'M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z',
  'mdi:fan': 'M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z',
  'mdi:flash': 'M7,2V13H10V22L17,10H13L17,2H7Z',
  'mdi:form-textbox': 'M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z',
  'mdi:format-list-bulleted': 'M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z',
  'mdi:gas-cylinder': 'M16,9V14L16,20A2,2 0 0,1 14,22H10A2,2 0 0,1 8,20V14L8,9C8,7.14 9.27,5.57 11,5.13V4H9V2H15V4H13V5.13C14.73,5.57 16,7.14 16,9Z',
  'mdi:gauge': 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z',
  'mdi:help-circle': 'M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z',
  'mdi:home-assistant': 'M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z',
  'mdi:information': 'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  'mdi:lightbulb': 'M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z',
  'mdi:lightning-bolt': 'M11 15H6L13 1V9H18L11 23V15Z',
  'mdi:lock': 'M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z',
  'mdi:map': 'M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z',
  'mdi:map-marker': 'M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z',
  'mdi:message-text': 'M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18',
  'mdi:molecule-co2': 'M5,7A2,2 0 0,0 3,9V15A2,2 0 0,0 5,17H8V15H5V9H8V7H5M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9M16,10.5V12H19V13.5H17.5A1.5,1.5 0 0,0 16,15V18H20.5V16.5H17.5V15H19A1.5,1.5 0 0,0 20.5,13.5V12A1.5,1.5 0 0,0 19,10.5H16Z',
  'mdi:motion-sensor': 'M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z',
  'mdi:numeric': 'M4,17V9H2V7H6V17H4M22,15C22,16.11 21.1,17 20,17H16V15H20V13H18V11H20V9H16V7H20A2,2 0 0,1 22,9V10.5A1.5,1.5 0 0,1 20.5,12A1.5,1.5 0 0,1 22,13.5V15M14,15V17H8V13C8,11.89 8.9,11 10,11H12V9H8V7H12A2,2 0 0,1 14,9V11C14,12.11 13.1,13 12,13H10V15H14Z',
  'mdi:palette': 'M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z',
  'mdi:script-text': 'M17.8,20C17.4,21.2 16.3,22 15,22H5C3.3,22 2,20.7 2,19V18H5L14.2,18C14.6,19.2 15.7,20 17,20H17.8M19,2C20.7,2 22,3.3 22,5V6H20V5C20,4.4 19.6,4 19,4C18.4,4 18,4.4 18,5V18H17C16.4,18 16,17.6 16,17V16H5V5C5,3.3 6.3,2 8,2H19M8,6V8H15V6H8M8,10V12H14V10H8Z',
  'mdi:security': 'M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z',
  'mdi:signal': 'M3,21H6V18H3M8,21H11V14H8M13,21H16V9H13M18,21H21V3H18V21Z',
  'mdi:sine-wave': 'M16.5,21C13.5,21 12.31,16.76 11.05,12.28C10.14,9.04 9,5 7.5,5C4.11,5 4,11.93 4,12H2C2,11.63 2.06,3 7.5,3C10.5,3 11.71,7.25 12.97,11.74C13.83,14.8 15,19 16.5,19C19.94,19 20.03,12.07 20.03,12H22.03C22.03,12.37 21.97,21 16.5,21Z',
  'mdi:smoke-detector': 'M12,18A6,6 0 0,0 18,12C18,8.68 15.31,6 12,6C8.68,6 6,8.68 6,12A6,6 0 0,0 12,18M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19M8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12Z',
  'mdi:speaker': 'M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z',
  'mdi:thermometer': 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
  'mdi:thermostat': 'M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z',
  'mdi:timer': 'M19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C17 22 21 17.97 21 13C21 10.88 20.26 8.93 19.03 7.39M13 14H11V7H13V14M15 1H9V3H15V1Z',
  'mdi:toggle-switch': 'M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z',
  'mdi:volume-high': 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z',
  'mdi:water-percent': 'M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z',
  'mdi:waveform': 'M22 12L20 13L19 14L18 13L17 16L16 13L15 21L14 13L13 15L12 13L11 17L10 13L9 22L8 13L7 19L6 13L5 14L4 13L2 12L4 11L5 10L6 11L7 5L8 11L9 2L10 11L11 7L12 11L13 9L14 11L15 3L16 11L17 8L18 11L19 10L20 11L22 12Z',
  'mdi:weather-cloudy': 'M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z',
  'mdi:weather-fog': 'M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z',
  'mdi:weather-hail': 'M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z',
  'mdi:weather-lightning': 'M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z',
  'mdi:weather-lightning-rainy': 'M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z',
  'mdi:weather-night': 'M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z',
  'mdi:weather-partly-cloudy': 'M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z',
  'mdi:weather-pouring': 'M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z',
  'mdi:weather-rainy': 'M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59',
  'mdi:weather-snowy': 'M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z',
  'mdi:weather-snowy-rainy': 'M18.5,18.67C18.5,19.96 17.5,21 16.25,21C15,21 14,19.96 14,18.67C14,17.12 16.25,14.5 16.25,14.5C16.25,14.5 18.5,17.12 18.5,18.67M4,17.36C3.86,16.82 4.18,16.25 4.73,16.11L7,15.5L5.33,13.86C4.93,13.46 4.93,12.81 5.33,12.4C5.73,12 6.4,12 6.79,12.4L8.45,14.05L9.04,11.8C9.18,11.24 9.75,10.92 10.29,11.07C10.85,11.21 11.17,11.78 11,12.33L10.42,14.58L12.67,14C13.22,13.83 13.79,14.15 13.93,14.71C14.08,15.25 13.76,15.82 13.2,15.96L10.95,16.55L12.6,18.21C13,18.6 13,19.27 12.6,19.67C12.2,20.07 11.54,20.07 11.15,19.67L9.5,18L8.89,20.27C8.75,20.83 8.18,21.14 7.64,21C7.08,20.86 6.77,20.29 6.91,19.74L7.5,17.5L5.26,18.09C4.71,18.23 4.14,17.92 4,17.36M1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,11.85 3.35,12.61 3.91,13.16C4.27,13.55 4.26,14.16 3.88,14.54C3.5,14.93 2.85,14.93 2.47,14.54C1.56,13.63 1,12.38 1,11Z',
  'mdi:weather-sunny': 'M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z',
  'mdi:weather-windy': 'M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z',
  'mdi:weather-windy-variant': 'M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z',
  'mdi:wifi': 'M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z',
  'mdi:window-closed': 'M6,11H10V9H14V11H18V4H6V11M18,13H6V20H18V13M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z',
  'mdi:window-shutter': 'M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z',
};

// ---------------------------------------------------------------------------
// Section 3: HomeAssistantRenderer class
// ---------------------------------------------------------------------------

class HomeAssistantRenderer {
  constructor(containerId = 'root', configuration = {}) {
    this.container = document.getElementById(containerId);
    this.iconMap = this.createIconMap();
    this.weatherIconMap = this.createWeatherIconMap();
    this.layoutClass = (configuration.layout || 'groups') + '-layout';
    this.pillPosition = configuration.pill_position || 'top';
    this.showEntityTitle = configuration.show_entity_title !== undefined ? (configuration.show_entity_title === true || configuration.show_entity_title === 'true') : true;
    this.showEntityIcon = configuration.show_entity_icon !== undefined ? (configuration.show_entity_icon === true || configuration.show_entity_icon === 'true') : true;
    this.scale = configuration.scale || 'normal';
    this.initScaleClasses();
    this.init();
  }

  createWeatherVisualization(entity) {
    const stateIcon = this.weatherIconMap[entity.state] || 'mdi:weather-partly-cloudy';

    const attrs = entity.attributes || {};
    const temp = attrs.temperature;
    const tempUnit = attrs.temperature_unit || '°C';

    const valueClass = `value ${this.textClasses.entityValue}`;
    const unitClass = `value ${this.textClasses.entityUnit}`;

    const weatherDetails = [
      { key: 'humidity', value: attrs.humidity, unit: '%', icon: 'mdi:water-percent', label: 'Humidity' },
      { key: 'pressure', value: attrs.pressure, unit: attrs.pressure_unit || 'hPa', icon: 'mdi:gauge', label: 'Pressure' },
      { key: 'wind_speed', value: attrs.wind_speed, unit: attrs.wind_speed_unit || 'km/h', icon: 'mdi:weather-windy', label: 'Wind' },
      { key: 'cloud_coverage', value: attrs.cloud_coverage, unit: '%', icon: 'mdi:weather-cloudy', label: 'Clouds' },
      { key: 'visibility', value: attrs.visibility, unit: attrs.visibility_unit || 'km', icon: 'mdi:eye', label: 'Visibility' }
    ];

    const detailsHtml = weatherDetails
      .filter(detail => detail.value !== undefined)
      .map(detail =>
        `<div class="weather-detail">${this.renderIcon(detail.icon, 'weather-detail-icon')}<span class="weather-detail-value ${valueClass}">${detail.value}<span class="${unitClass}">${detail.unit}</span></span></div>`
      ).join('');

    let forecastHtml = '';
    if (entity.forecast && entity.forecast.length > 0) {
      const forecastDays = entity.forecast.slice(0, 5).map(day => {
        const dayIcon = this.weatherIconMap[day.condition] || 'mdi:weather-partly-cloudy';
        const date = new Date(day.datetime);
        const dayLetter = date.toLocaleDateString(undefined, { weekday: 'short' });
        const temp = day.temperature !== undefined ? Math.round(day.temperature) : '';
        const templow = day.templow !== undefined ? Math.round(day.templow) : undefined;
        const precip = day.precipitation !== undefined ? Math.round(day.precipitation) : undefined;
        return `
          <div class="forecast-day">
            <div class="forecast-date">${dayLetter}</div>
            ${this.renderIcon(dayIcon, `forecast-icon ${this.weatherClasses.forecastIcon}`)}
            <div class="forecast-temps">
              <span class="value value--small forecast-temp-high">${temp}°</span>
              ${templow !== undefined ? `<span class="value value--small forecast-temp-low">${templow}°</span>` : ''}
            </div>
            ${precip !== undefined && precip > 0 ? `<span>${precip}${attrs.precipitation_unit || 'mm'}</span>` : ''}
          </div>
        `;
      }).join('');

      forecastHtml = `
        <div class="weather-forecast">
          ${forecastDays}
        </div>
      `;
    }

    return `
      <div class="entity-group weather-visualization">
        <div class="weather-main-row">
          ${this.renderIcon(stateIcon, this.weatherClasses.weatherIcon)}
          <span class="value ${this.weatherClasses.weatherValue}">${temp !== undefined ? temp + tempUnit : ''}</span>
        </div>
        <div class="weather-details-row">
          ${detailsHtml}
        </div>
        ${forecastHtml}
      </div>
    `;
  }

  initScaleClasses() {
    const scaleConfig = {
      small: {
        pillValue: 'value--xxsmall',
        entityValue: 'value--xsmall',
        entityUnit: 'value--xxsmall',
        deviceClass: 'value--xxsmall',
        groupHeader: 'value--xsmall',
        entityName: 'value--xxsmall',
        iconSize: '20px',
      },
      normal: {
        pillValue: 'value--xsmall',
        entityValue: 'value--small',
        entityUnit: 'value--xsmall',
        deviceClass: 'value--xsmall',
        groupHeader: 'value--small',
        entityName: 'value--xsmall',
        iconSize: '25px',
      },
      big: {
        pillValue: 'value--small',
        entityValue: 'value--regular',
        entityUnit: 'value--small',
        deviceClass: 'value--small',
        groupHeader: 'value--medium',
        entityName: 'value--small',
        iconSize: '30px',
      }
    };

    const weatherScale = {
      small: {
        weatherIcon: 'weather-icon-small',
        weatherValue: 'value--regular',
        forecastIcon: 'weather-icon-small',
        forecastValue: 'value--regular'
      },
      normal: {
        weatherIcon: 'weather-icon-normal',
        weatherValue: 'value--large',
        forecastIcon: 'weather-icon-small',
        forecastValue: 'value--regular'
      },
      big: {
        weatherIcon: 'weather-icon-big',
        weatherValue: 'value--xlarge',
        forecastIcon: 'weather-icon-small',
        forecastValue: 'value--regular'
      }
    };

    this.textClasses = scaleConfig[this.scale] || scaleConfig.normal;
    this.weatherClasses = weatherScale[this.scale] || weatherScale.normal;
  }

  init() {
    if (!this.container) {
      return;
    }
    this.container.className = `app-root ${this.layoutClass}`;
  }

  createIconMap() {
    return {
      'light': 'mdi:lightbulb',
      'switch': 'mdi:toggle-switch',
      'sensor': 'mdi:chart-line',
      'climate': 'mdi:thermostat',
      'cover': 'mdi:window-shutter',
      'fan': 'mdi:fan',
      'lock': 'mdi:lock',
      'media_player': 'mdi:speaker',
      'camera': 'mdi:camera',
      'alarm_control_panel': 'mdi:security',
      'automation': 'mdi:cog',
      'script': 'mdi:script-text',
      'scene': 'mdi:palette',
      'input_boolean': 'mdi:checkbox-marked',
      'input_number': 'mdi:numeric',
      'input_select': 'mdi:format-list-bulleted',
      'input_text': 'mdi:form-textbox',
      'timer': 'mdi:timer',
      'counter': 'mdi:counter',
      'person': 'mdi:account',
      'device_tracker': 'mdi:map-marker',
      'zone': 'mdi:map',
      'sun': 'mdi:weather-sunny',
      'weather': 'mdi:weather-partly-cloudy',
      'conversation': 'mdi:message-text',
      'notify': 'mdi:bell',
      'tts': 'mdi:volume-high',
      'group': 'mdi:account-group',
      'homeassistant': 'mdi:home-assistant',
      'temperature': 'mdi:thermometer',
      'humidity': 'mdi:water-percent',
      'pressure': 'mdi:gauge',
      'battery': 'mdi:battery',
      'illuminance': 'mdi:brightness-6',
      'motion': 'mdi:motion-sensor',
      'door': 'mdi:door',
      'window': 'mdi:window-closed',
      'smoke': 'mdi:smoke-detector',
      'gas': 'mdi:gas-cylinder',
      'power': 'mdi:flash',
      'energy': 'mdi:lightning-bolt',
      'current': 'mdi:current-ac',
      'voltage': 'mdi:sine-wave',
      'frequency': 'mdi:waveform',
      'signal_strength': 'mdi:signal',
      'connectivity': 'mdi:wifi',
      'co2': 'mdi:molecule-co2',
      'pm25': 'mdi:air-filter',
      'default': 'mdi:information',
      'error': 'mdi:alert-circle',
      'unknown': 'mdi:help-circle'
    };
  }

  createWeatherIconMap() {
    return {
      'clear-night': 'mdi:weather-night',
      'cloudy': 'mdi:weather-cloudy',
      'fog': 'mdi:weather-fog',
      'hail': 'mdi:weather-hail',
      'lightning': 'mdi:weather-lightning',
      'lightning-rainy': 'mdi:weather-lightning-rainy',
      'partlycloudy': 'mdi:weather-partly-cloudy',
      'pouring': 'mdi:weather-pouring',
      'rainy': 'mdi:weather-rainy',
      'snowy': 'mdi:weather-snowy',
      'snowy-rainy': 'mdi:weather-snowy-rainy',
      'sunny': 'mdi:weather-sunny',
      'windy': 'mdi:weather-windy',
      'windy-variant': 'mdi:weather-windy-variant',
      'exceptional': 'mdi:alert'
    };
  }

  getEntityIcon(entity) {
    if (!entity.attributes) {
      return;
    }
    if (entity.attributes.icon) {
      return entity.attributes.icon;
    }
    if (entity.error) {
      return this.iconMap.error;
    }

    const entityId = entity.entity_id || '';
    const domain = entityId.split('.')[0];
    const deviceClass = entity.attributes?.device_class;

    if (deviceClass && this.iconMap[deviceClass]) {
      return this.iconMap[deviceClass];
    }

    if (domain && this.iconMap[domain]) {
      return this.iconMap[domain];
    }

    return this.iconMap.default;
  }

  getEntityName(entity) {
    if (entity.error) {
      return 'Error';
    }

    return entity.attributes?.friendly_name || entity.entity_id || 'Unknown Entity';
  }

  getDeviceClassTitle(entity) {
    if (entity.error) {
      return null;
    }

    const deviceClass = entity.attributes?.device_class ?? '';

    return entity.attributes?.friendly_name ?? (deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1).replace(/_/g, ' '));
  }

  formatEntityState(entity) {
    if (entity.error) {
      return {
        value: entity.error,
        unit: '',
        isError: true,
        isNumeric: false
      };
    }

    const state = entity.state;
    const unit = entity.attributes?.unit_of_measurement || '';

    if (state === 'on' || state === 'off') {
      return {
        value: state.toUpperCase(),
        unit: '',
        isError: false,
        isNumeric: false
      };
    }

    if (!isNaN(state) && state !== '') {
      const numValue = parseFloat(state);
      return {
        value: numValue % 1 === 0 ? numValue.toString() : numValue.toFixed(1),
        unit: unit,
        isError: false,
        isNumeric: true
      };
    }

    if (state && state.includes('T') && state.includes(':')) {
      try {
        const date = new Date(state);
        return {
          value: date.toLocaleString(),
          unit: '',
          isError: false,
          isNumeric: false
        };
      } catch (e) {
        // fall through
      }
    }

    return {
      value: state || 'N/A',
      unit: unit,
      isError: false,
      isNumeric: false
    };
  }

  getEntityIconClass(entity) {
    if (entity.error) {
      return 'entity-icon error';
    }

    const entityId = entity.entity_id || '';
    const domain = entityId.split('.')[0];
    const deviceClass = entity.attributes?.device_class;

    const iconClass = deviceClass || domain || 'default';
    return `entity-icon ${iconClass}`;
  }

  formatIconForUrl(iconName) {
    if (!iconName) {
      return 'mdi:help-circle';
    }

    if (iconName.includes(':')) {
      return iconName;
    }

    if (iconName.startsWith('mdi-')) {
      return iconName.replace('mdi-', 'mdi:');
    }

    return `mdi:${iconName}`;
  }

  renderIcon(iconName, className, size) {
    const name = this.formatIconForUrl(iconName);
    const path = MDI_ICONS[name] || MDI_ICONS['mdi:help-circle'] || '';
    const sizeAttr = size ? ` width="${size}" height="${size}"` : '';
    return `<svg class="${className}"${sizeAttr} viewBox="0 0 24 24" fill="currentColor"><path d="${path}"/></svg>`;
  }

  createPill(entity) {
    const name = this.getEntityName(entity);
    const icon = entity.icon ?? this.getEntityIcon(entity);
    const stateInfo = this.formatEntityState(entity);

    return `
      <div class="pill-component rounded--full" data-entity-id="${entity.entity_id || 'error'}">
        ${this.renderIcon(icon, 'image', this.textClasses.iconSize)}
        <span class="pill-value ${this.textClasses.pillValue} ${stateInfo.isNumeric ? 'value--tnums' : ''}">${stateInfo.value}${stateInfo.unit ? ' ' + stateInfo.unit : ''}</span>
      </div>
    `;
  }

  createEntityCard(entity, label) {
    const name = this.getEntityName(entity);
    const icon = entity.icon ?? this.getEntityIcon(entity);
    const iconClass = this.getEntityIconClass(entity);
    const stateInfo = this.formatEntityState(entity);
    const deviceClassTitle = this.showEntityTitle ? this.getDeviceClassTitle(entity) : '';

    const baseCardClass = entity.error ? 'entity-card error' : 'entity-card';

    return `
      <div class="${baseCardClass}" data-entity-id="${entity.entity_id || 'error'}" data-label="${label}">
        ${deviceClassTitle ? `<div class="device-class-title value ${this.textClasses.deviceClass}">${deviceClassTitle}</div>` : ''}
        <div class="entity-header">
          ${this.showEntityIcon ? this.renderIcon(icon, `image ${iconClass}`, this.textClasses.iconSize) : ''}
          <div class="entity-value value ${this.textClasses.entityValue} ${stateInfo.isNumeric ? 'value--tnums' : ''} ${stateInfo.isError ? 'entity-error' : ''}">
            ${stateInfo.value}
            ${stateInfo.unit ? `<span class="entity-unit value ${this.textClasses.entityUnit}">${stateInfo.unit}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  createPillsContainer(pills) {
    if (!pills || pills.length === 0) {
      return '';
    }

    const allPills = pills.map(pill => this.createPill(pill));

    if (allPills.length === 0) {
      return '';
    }

    let flexClass = '';
    switch (this.pillPosition) {
      case 'top':
        flexClass = 'flex flex--row flex--center-x flex--top';
        break;
      case 'bottom':
        flexClass = 'flex flex--row flex--center-x flex--bottom';
        break;
      case 'left':
        flexClass = 'flex flex--col flex--left flex--center-y';
        break;
      case 'right':
        flexClass = 'flex flex--col flex--right flex--center-y';
        break;
      default:
        flexClass = 'flex flex--row flex--center-x flex--top';
    }
    return `
      <div class="pills-container pills-container--${this.pillPosition} ${flexClass} gap">
        ${allPills.join('')}
      </div>
    `;
  }

  createEntitySection({ entities, groupName }) {
    if (this.layoutClass === 'list-layout') {
      const entityRows = entities.map(entity => {
        const name = this.getEntityName(entity);
        const icon = entity.icon ?? this.getEntityIcon(entity);
        const iconClass = this.getEntityIconClass(entity);
        const stateInfo = this.formatEntityState(entity);
        return `
          <div class="entity-list-row" data-entity-id="${entity.entity_id || 'error'}">
            ${this.showEntityTitle ? `<span class="entity-name value ${this.textClasses.entityName}">${name}</span>` : ''}
            ${this.showEntityIcon ? this.renderIcon(icon, `entity-icon ${iconClass}`, this.textClasses.iconSize) : ''}
            <span class="entity-value value ${this.textClasses.entityValue} ${stateInfo.isNumeric ? 'value--tnums' : ''}">${stateInfo.value}</span>
            <span class="enitity-unit value ${this.textClasses.entityUnit}">${stateInfo.unit}</span>
          </div>
        `;
      });

      return `
        <div class="entity-group" data-label="${groupName}">
          <div class="group-header">
            ${groupName ? `<span class="value ${this.textClasses.groupHeader}">${groupName}</span>` : ''}
          </div>
          <div class="group-content">
            ${entityRows.join('')}
          </div>
        </div>
      `;
    } else {
      const entitiesHtml = entities
        .map(entity => this.createEntityCard(entity, groupName))
        .join('');
      return `
        <div class="entity-group" style="grid-column: span ${entities.length} !important;" data-label="${groupName}">
          <div class="group-header">
            ${groupName ? `<span class="value ${this.textClasses.groupHeader}">${groupName}</span>` : ''}
          </div>
          <div class="group-content grid grid--wrap grid--min-56 entities-grid">
            ${entitiesHtml}
          </div>
        </div>
      `;
    }
  }

  render(webhookData) {
    if (!this.container) {
      return;
    }

    this.container.innerHTML = '';

    const { groups, pills, visualizations } = webhookData || {};

    if (!visualizations?.length && !groups?.length && !pills?.length ) {
      this.renderEmptyState();
      return;
    }

    const pillsHtml = this.createPillsContainer(pills);

    let mainContentHtml = '';

    let vizSections = [];
    if (visualizations?.length > 0) {
      vizSections = visualizations.map((viz, i) => {
        const domain = viz.entity_id.split('.')[0];
        if (domain === 'weather') {
          return this.createWeatherVisualization(viz, i);
        } else {
          return `<div class="visualization-container" data-viz-id="${viz.entity_id}"></div>`;
        }
      });
    }

    let sections = [];
    if (groups.length > 0) {
      sections = groups.map(group => {
        return this.createEntitySection(group);
      });
    }

    let showDetailsClass = 'show-all';
    if (!this.showEntityTitle && !this.showEntityIcon) {
      showDetailsClass = 'hide-title hide-icon';
    } else if (!this.showEntityTitle) {
      showDetailsClass = 'hide-title';
    } else if (!this.showEntityIcon) {
      showDetailsClass = 'hide-icon';
    }

    mainContentHtml += `<div class="free-layout-container scale-${this.scale} ${showDetailsClass}">${vizSections.join('')}${sections.join('')}</div>`;

    if (pillsHtml) {
      this.container.innerHTML = `
        ${pillsHtml}
        ${mainContentHtml}
      `;
    } else {
      this.container.innerHTML = `
        ${mainContentHtml}
      `;
    }
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon value value--xxxlarge">⚠</div>
        <h3 class="value value--large">No entities found</h3>
        <p class="value value--small">Check your Home Assistant configuration and ensure entities are properly configured.</p>
      </div>
    `;
  }

  updateEntity(entityId, newData) {
    const card = this.container.querySelector(`[data-entity-id="${entityId}"]`);
    if (card) {
      const label = card.getAttribute('data-label');
      card.outerHTML = this.createEntityCard(newData, label);
    }
  }

  refresh(responsesByLabel, pillsByLabel) {
    this.render(responsesByLabel, pillsByLabel);
  }
}

// ---------------------------------------------------------------------------
// Section 4: Liquid template generator
// ---------------------------------------------------------------------------

const TITLE_BAR_SVG = `<svg class="image" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 240 240" fill="none">
      <path d="M240 224.762C240 233.012 233.25 239.762 225 239.762H15C6.75 239.762 0 233.012 0 224.762V134.762C0 126.512 4.77 114.993 10.61 109.153L109.39 10.3725C115.22 4.5425 124.77 4.5425 130.6 10.3725L229.39 109.162C235.22 114.992 240 126.522 240 134.772V224.772V224.762Z" fill="#F2F4F9"/>
      <path d="M229.39 109.153L130.61 10.3725C124.78 4.5425 115.23 4.5425 109.4 10.3725L10.61 109.153C4.78 114.983 0 126.512 0 134.762V224.762C0 233.012 6.75 239.762 15 239.762H107.27L66.64 199.132C64.55 199.852 62.32 200.262 60 200.262C48.7 200.262 39.5 191.062 39.5 179.762C39.5 168.462 48.7 159.262 60 159.262C71.3 159.262 80.5 168.462 80.5 179.762C80.5 182.092 80.09 184.322 79.37 186.412L111 218.042V102.162C104.2 98.8225 99.5 91.8425 99.5 83.7725C99.5 72.4725 108.7 63.2725 120 63.2725C131.3 63.2725 140.5 72.4725 140.5 83.7725C140.5 91.8425 135.8 98.8225 129 102.162V183.432L160.46 151.972C159.84 150.012 159.5 147.932 159.5 145.772C159.5 134.472 168.7 125.272 180 125.272C191.3 125.272 200.5 134.472 200.5 145.772C200.5 157.072 191.3 166.272 180 166.272C177.5 166.272 175.12 165.802 172.91 164.982L129 208.892V239.772H225C233.25 239.772 240 233.022 240 224.772V134.772C240 126.522 235.23 115.002 229.39 109.162V109.153Z" fill="#000"/>
    </svg>`;

function generateLiquidTemplate() {
  const rendererSource = HomeAssistantRenderer.toString();

  return `<style>
${TRMNL_CSS}
</style>

<div class="layout">
  <script>

const MDI_ICONS = ${JSON.stringify(MDI_ICONS)};

${rendererSource}

function initializeHomeAssistantRenderer() {
  try {
    const webhookData = {
      groups: {{ groups | json }},
      pills: {{ pills | json }},
      visualizations: {{ visualizations | json }},
      configuration: {{ configuration | json }}
    };

    if (!webhookData) {
      throw new Error('No webhook data received. Please ensure the HACS TRMNL Dashboard integration is properly configured and sending data.');
    }

    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }

    const renderer = new HomeAssistantRenderer('root', webhookData.configuration || {});
    renderer.render(webhookData);
  } catch (error) {
    console.error('Error initializing renderer:', error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = \`
        <div style="padding: 20px; text-align: center;">
          <h3 class="value value--large">\\u274c Error Loading Home Assistant Data</h3>
          <p class="value value--small">Please check the browser console for details.</p>
          <pre class="value value--small" style="background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px; text-align: left; overflow: auto;">\\\${error.message}</pre>
        </div>
      \`;
    }
  }
}
  </script>

  <div id="root"></div>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      try {
        initializeHomeAssistantRenderer();

        if (window.trmnl) {
          window.trmnl.ready();
        } else {
          document.dispatchEvent(new CustomEvent('trmnl-ready'));
          window.trmnlReady = true;
        }
      } catch (error) {
        if (window.trmnl) {
          window.trmnl.ready();
        } else {
          document.dispatchEvent(new CustomEvent('trmnl-ready'));
          window.trmnlReady = true;
        }
      }
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => {
        try {
          initializeHomeAssistantRenderer();

          if (window.trmnl) {
            window.trmnl.ready();
          } else {
            document.dispatchEvent(new CustomEvent('trmnl-ready'));
            window.trmnlReady = true;
          }
        } catch (error) {
          if (window.trmnl) {
            window.trmnl.ready();
          } else {
            document.dispatchEvent(new CustomEvent('trmnl-ready'));
            window.trmnlReady = true;
          }
        }
      }, 100);
    }
  </script>
</div>

{% if configuration.show_title_bar != 'false' %}
  <div class="title_bar">
    ${TITLE_BAR_SVG}
    <span class="title">Home Assistant Dashboard</span>
  </div>
{% endif %}
`;
}

// ---------------------------------------------------------------------------
// Section 5: TrmnlDashboardPanel custom element
// ---------------------------------------------------------------------------

const PANEL_CSS = `
  :host {
    display: block;
    height: 100%;
    background: #f5f5f5;
  }
  .panel-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .toolbar h2 {
    margin: 0;
    font-size: 20px;
    flex: 1;
  }
  .toolbar button {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
  }
  .toolbar button:hover {
    background: #e8e8e8;
  }
  .toolbar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .payload-info {
    font-size: 13px;
    color: #666;
    white-space: nowrap;
  }
  .payload-info.over-limit {
    color: #c00;
    font-weight: 600;
  }
  .viewport-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
  }
  .viewport {
    width: 800px;
    height: 480px;
    border: 2px solid #333;
    background: #fff;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
  }
  .error-msg {
    color: #c00;
    padding: 20px;
    text-align: center;
  }
  .copy-feedback {
    color: #080;
    font-size: 13px;
    transition: opacity 0.3s;
  }
`;

class TrmnlDashboardPanel extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._rendered = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._rendered = true;
      this._render();
      this._fetchPreview();
    }
  }

  set panel(_panel) {
    // required by HA, no action needed
  }

  _render() {
    this.innerHTML = '';

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>${PANEL_CSS}</style>
      <div class="panel-container">
        <div class="toolbar">
          <h2>TRMNL Dashboard Preview</h2>
          <button id="refresh-btn">Refresh Preview</button>
          <button id="copy-btn">Copy Template</button>
          <span class="copy-feedback" id="copy-feedback"></span>
          <span class="payload-info" id="payload-info"></span>
        </div>
        <div class="viewport-wrapper">
          <div class="viewport">
            <style>${TRMNL_CSS.replace(/#root/g, '#trmnl-preview-root')}</style>
            <div id="trmnl-preview-root"></div>
          </div>
        </div>
      </div>
    `;

    shadow.getElementById('refresh-btn').addEventListener('click', () => this._fetchPreview());
    shadow.getElementById('copy-btn').addEventListener('click', () => this._copyTemplate());
  }

  async _fetchPreview() {
    const shadow = this.shadowRoot;
    const btn = shadow.getElementById('refresh-btn');
    const info = shadow.getElementById('payload-info');
    const root = shadow.getElementById('trmnl-preview-root');

    btn.disabled = true;
    btn.textContent = 'Loading...';
    info.textContent = '';
    info.className = 'payload-info';

    try {
      const result = await this._hass.callWS({ type: 'trmnl_dashboard/get_preview' });
      const { payload, payload_size, max_payload_bytes, tier } = result;

      root.innerHTML = '';
      const renderer = new HomeAssistantRenderer(null, payload.configuration);
      renderer.container = root;
      renderer.init();
      renderer.render(payload);

      const pct = Math.round((payload_size / max_payload_bytes) * 100);
      info.textContent = `${payload_size.toLocaleString()} / ${max_payload_bytes.toLocaleString()} bytes (${tier} tier, ${pct}%)`;
      if (payload_size > max_payload_bytes) {
        info.className = 'payload-info over-limit';
      }
    } catch (err) {
      root.innerHTML = `<div class="error-msg">Failed to load preview: ${err.message || err}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Refresh Preview';
    }
  }

  async _copyTemplate() {
    const shadow = this.shadowRoot;
    const feedback = shadow.getElementById('copy-feedback');

    try {
      const template = generateLiquidTemplate();
      await navigator.clipboard.writeText(template);
      feedback.textContent = 'Copied!';
      feedback.style.opacity = '1';
      setTimeout(() => { feedback.style.opacity = '0'; }, 2000);
    } catch (err) {
      feedback.textContent = 'Copy failed';
      feedback.style.opacity = '1';
      setTimeout(() => { feedback.style.opacity = '0'; }, 2000);
    }
  }
}

customElements.define('trmnl-dashboard-panel', TrmnlDashboardPanel);
