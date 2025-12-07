import { changeDep } from "./PointsModel.js";

depdrop.addEventListener("change", (e) => {
  changeDep(e.target.value);
});

function setDep(dep) {
  depdrop.value = dep;
}

function getDepValue() {
  return depdrop.value;
}

export { setDep, getDepValue };
