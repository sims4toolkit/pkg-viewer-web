const DEV = false;

export default {
  DEV,
  API_BASE: DEV ? "http://localhost:3000" : "https://api.sims4toolkit.com",
  TDESC_BASE: DEV ? "http://localhost:8000" : "https://tdesc.lot51.cc/api",
};
