import { setDep } from "./departements.js";
import { map, cluster } from "./map.js";
import { initPoints } from "./PointsModel.js";
import { getSavedPreferences } from "./preferences.js";

function init() {
  let savedPref = getSavedPreferences();
  setDep(savedPref.dep);

  initPoints();

  console.log("onload terminé");
}

window.onload = init;
