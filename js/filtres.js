import {
  selectedHasScan,
  selectedNatures,
  selectedRechExpl,
  filtrePoints,
  changeHasScan,
  addSelectedRechExpl,
  addSelectedNatures,
} from "./PointsModel.js";

const recheExplFiltresChanges = (newRechExpl) => {
  changeFilter(
    filtres_rechexpl,
    newRechExpl
      .filter((e) => e.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name)),
    addSelectedRechExpl,
  );
};

const naturesFiltresChanges = (newNatures) => {
  changeFilter(
    filtres_natures,
    newNatures
      .filter((e) => e.count > 0)
      .sort((a, b) => a.name.localeCompare(b.name)),
    addSelectedNatures,
  );
};

function hasScanChanged(hs) {
  has_scan.checked = hs === true;
}

has_scan.addEventListener("change", (e) => {
  changeHasScan(e.target.checked);
});

/**
 * callback
 */
function changeFilter(htmlNode, labelList, callback) {
  htmlNode.innerHTML = "";
  let nodeId = htmlNode.id;

  labelList.map((cur) => {
    let check = document.createElement("input");
    check.type = "checkbox";
    check.id = nodeId + "" + cur.id;
    check.value = cur.id;
    check.addEventListener("change", (e) => {
      callback(cur.id, e.target.checked);
    });
    let label = document.createElement("label");
    label.for = check.id;
    label.innerText = cur.name + ` (${cur.count})`;
    label.prepend(check);
    htmlNode.append(label);
  });
}

export { recheExplFiltresChanges, naturesFiltresChanges, hasScanChanged };
