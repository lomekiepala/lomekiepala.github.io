import { setDep } from "./departements.js";
import { map, cluster } from "./map.js";
import { focusPoints } from "./pointsmap.js";
import { initPoints } from "./PointsModel.js";
import { getSavedPreferences } from "./preferences.js";
import { getQueryParams } from "./queryParams.js";

function init() {
  const params = getQueryParams();

  let savedPref = getSavedPreferences();
  if (params.dep != undefined) {
    savedPref.dep = params.dep;
  }
  setDep(savedPref.dep);
  initPoints(savedPref, () => {
    if (params.bssid != undefined) {
      focusPoints(params.bssid);
    } else if (params.coo != undefined) {
      map.setView(params.coo, 15);
    }
  });
  console.log("onload terminé");
}

window.onload = init;
