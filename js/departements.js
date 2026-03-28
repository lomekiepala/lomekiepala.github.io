import { changeDep } from "./PointsModel.js";
import { pushNewOptions } from "./queryParams.js";

depdrop.addEventListener("change", (e) => {
  changeDep(e.target.value);
});

function setDep(dep) {
  depdrop.value = dep;
  pushNewOptions("dep", dep);
}

function getDepValue() {
  return depdrop.value;
}
function getCountAll() {
  return count_all.checked;
}

export { setDep, getDepValue, getCountAll };
