import { updatePointsView, updateNbPoints } from "./pointsmap.js";
import {
  recheExplFiltresChanges,
  naturesFiltresChanges,
  hasScanChanged,
} from "./filtres.js";
import { isLoading } from "./state.js";
import { getSavedPreferences } from "./preferences.js";
import { setDep } from "./departements.js";
let points = [];

let selectableRechExpl = [];
let selectableNatures = [];
let communes = [];

let selectedNatures = [];
let selectedRechExpl = [];
let selectedHasScan = false;

function changeHasScan(hs) {
  selectedHasScan = hs === true;
  filtrePoints();
}

function addSelectedRechExpl(id, isChecked) {
  selectedRechExpl = selectedRechExpl.filter((n) => n != id);
  if (isChecked) {
    selectedRechExpl.push(id);
  }
  filtrePoints();
}

function addSelectedNatures(id, isChecked) {
  selectedNatures = selectedNatures.filter((n) => n != id);
  if (isChecked) {
    selectedNatures.push(id);
  }
  filtrePoints();
}

async function initPoints() {
  let savedPref = getSavedPreferences();

  isLoading(true);

  await fetchFiltres();
  await fetchPointsDep(savedPref.dep);

  isLoading(false);
}

async function decompressResToJson(res) {
  let blob = await res.blob();
  let streamin = blob.stream().pipeThrough(new DecompressionStream("gzip"));
  let blobout = await new Response(streamin).blob();
  return JSON.parse(await blobout.text());
}

function filtreListToObjectList(filtre) {
  return filtre.map((nom, i) => {
    return {
      name: nom,
      id: i,
      count: 0,
    };
  });
}

async function fetchFiltres() {
  let res = await fetch(`./static/commNatRechExpl.json.gzip`);

  if (!res.ok) {
    console.error("res filtres not ok " + res.status);
    return;
  }

  let data = await decompressResToJson(res);
  // Recherche_exploit
  selectableRechExpl = filtreListToObjectList(data.Recherche_exploit);
  selectableNatures = filtreListToObjectList(data.Natures);
  communes = filtreListToObjectList(data.Communes);

  console.log(
    `Fetch filtres ok, ${communes.length} communes, ${selectableNatures.length} natures, ${selectableRechExpl.length} rech et expl`,
  );

  updateFiltres();
}

function resetFiltres() {
  selectedNatures = [];
  selectedRechExpl = [];
  selectedHasScan = false;
}

async function changeDep(newDep) {
  isLoading(true);
  await fetchPointsDep(newDep);
  updateFiltres();
  isLoading(false);
}

async function fetchPointsDep(dep = 54) {
  let res = await fetch(`./static/${dep}.json.gzip`);

  if (!res.ok) {
    console.error("res not ok " + res.status);
    return;
  }

  setDep(dep);
  let data = await decompressResToJson(res);

  points = data;
  console.log(`Fetch points ok, ${points.length} points`);

  let countPromise = countPointsFiltres();
  filtrePoints();
  await countPromise;
}
async function countPointsFiltres() {
  selectableRechExpl.forEach((v) => (v.count = 0));
  communes.forEach((v) => (v.count = 0));
  selectableNatures.forEach((v) => (v.count = 0));

  Array.from({ length: points.length / nbField }, (_, i) => {
    let ib = i * nbField;
    points[ib + rechexpl].forEach((i) => {
      selectableRechExpl.find((v) => v.id === i).count++;
    });
    selectableNatures.find((v) => v.id === points[ib + nature]).count++;
    communes.find((v) => v.id === points[ib + commune]).count++;
  });
  updateFiltres();
}

const nbField = 8;

const bssid = 0;
const lat = 1;
const long = 2;
const nbScan = 3;
const commune = 4;
const lieudit = 5;
const nature = 6;
const rechexpl = 7;

function filtrePoints() {
  updatePointsViews(
    Array.from({ length: points.length / nbField }, (_, i) => {
      let ib = i * nbField;

      if (
        !(
          (selectedNatures.length == 0 ||
            selectedNatures.includes(points[ib + nature])) &&
          (selectedRechExpl.length == 0 ||
            points[ib + rechexpl].some((e) => selectedRechExpl.includes(e))) &&
          (!selectedHasScan || points[ib + nbScan] > 0)
        )
      )
        return null;

      return {
        lat: points[ib + lat],
        long: points[ib + long],
        commune: communes[points[ib + commune]].name,
        nature: selectableNatures[points[ib + nature]].name,
        rechexpl: selectableRechExpl
          .filter((_, i) => points[ib + rechexpl].includes(i))
          .map((v) => v.name)
          .join(" "),
        nb_scan: points[ib + nbScan],
        lieudit: points[ib + lieudit],
        id: points[ib + bssid],
      };
    }).filter((e) => e !== null),
  );
}

function updatePointsViews(pointsUpdate) {
  updatePointsView(pointsUpdate);
  updateNbPoints(points.length / nbField, pointsUpdate.length);

  // throw new Error("A faire update points");
}

function updateFiltres() {
  resetFiltres();
  recheExplFiltresChanges(selectableRechExpl);
  naturesFiltresChanges(selectableNatures);
  hasScanChanged(selectedHasScan);
}

export {
  initPoints,
  fetchPointsDep,
  filtrePoints,
  selectedNatures,
  selectedRechExpl,
  selectedHasScan,
  addSelectedRechExpl,
  addSelectedNatures,
  changeDep,
  changeHasScan,
};
