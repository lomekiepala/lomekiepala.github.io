import { getDepValue } from "./departements.js";
import { map } from "./map.js";

function isSavedPreference(obj) {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.lat === "number" &&
    typeof obj.long === "number" &&
    typeof obj.zoom === "number" &&
    typeof obj.dep === "string" &&
    obj.dep.length > 0
  );
}
const prefKeys = "mapview";
const defaultValue = {
  lat: 49.4,
  long: 6,
  zoom: 9,
  dep: "54",
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
  };
  savePreference(newPref);
}, 5000);

export { getSavedPreferences };
