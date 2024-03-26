const DEV = window.location.hostname === "localhost";

if (DEV) console.log("Running in dev mode.");

export default {
  DEV,
  DISCORD_API: DEV
    ? "http://localhost:3000"
    : "https://api.sims4toolkit.com",
  TDESC_ICON_API: "https://tdesc.lot51.cc/api/simdex/icon",
  TDESC_SEARCH_API: DEV
    ? "http://localhost:8000/simdex/search"
    : "https://tdesc.lot51.cc/api/simdex/search",
  TDESC_TUNING_API: DEV
    ? "http://localhost:8000/simdex/tuning"
    : "https://tdesc.lot51.cc/api/simdex/tuning",
};
