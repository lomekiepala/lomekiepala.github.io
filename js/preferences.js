import { getCountAll, getDepValue } from "./departements.js";
import { map } from "./map.js";

function isSavedPreference(obj) {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.lat === "number" &&
    typeof obj.long === "number" &&
    typeof obj.zoom === "number" &&
    typeof obj.dep === "string" &&
    obj.dep.length > 0 &&
    typeof obj.countAll === "boolean"
  );
}
const prefKeys = "mapview";
const defaultValue = {
  lat: 49.4,
  long: 6,
  zoom: 9,
  dep: "54",
  countAll: true,
};

function getSavedPreferences() {
  let jsonMapView = localStorage.getItem(prefKeys);

  if (jsonMapView == null) return defaultValue;
  const saved = JSON.parse(jsonMapView);

  if (!isSavedPreference(saved)) return defaultValue;
  return saved;
}

function savePreference(pref) {
  if (isSavedPreference(pref)) {
    localStorage.setItem(prefKeys, JSON.stringify(pref));
  }
}

setInterval(() => {
  const newPref = {
    zoom: map.getZoom(),
    lat: map.getCenter().lat,
    long: map.getCenter().lng,
    dep: getDepValue(),
    countAll: getCountAll(),
  };
  savePreference(newPref);
}, 3000);

export { getSavedPreferences };
