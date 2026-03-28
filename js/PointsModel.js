import { updatePointsView, updateNbPoints } from "./pointsmap.js";
import {
  recheExplFiltresChanges,
  naturesFiltresChanges,
  hasScanChanged,
  hasCountAllChanged,
} from "./filtres.js";
import { isLoading } from "./state.js";
import { getSavedPreferences } from "./preferences.js";
import { setDep } from "./departements.js";
import { BenchMarker } from "./bench.js";
let points = [];

let selectableRechExpl = [];
let selectableNatures = [];
let communes = [];

let selectedNatures, selectedRechExpl, selectedHasScan, search;
let countAll = false;
//real default values in resetFiltres()
resetFiltres();
function changeSearch(value) {
  search = value;
  filtrePoints();
}

function changeHasScan(hs) {
  selectedHasScan = hs === true;
  filtrePoints();
}

function changeCountAll(ca) {
  countAll = ca === true;
  countPointsFiltres();
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

async function initPoints(savedPref, onLoadingFinished) {
  countAll = savedPref.countAll;

  isLoading(true);
  const bench = new BenchMarker("initPoints");

  await fetchFiltres();
  bench.markNow("fetchFiltres");
  await fetchPointsDep(savedPref.dep);
  bench.finish("fetchPointsDep");

  onLoadingFinished();

  isLoading(false);
}

async function decompressResToJson(res) {
  const bench = new BenchMarker("DecompressResToJson", true);
  let blob = await res.blob();
  bench.markNow("blob");
  let streamin = blob.stream().pipeThrough(new DecompressionStream("gzip"));
  bench.markNow("streamin");
  let blobout = await new Response(streamin).blob();
  bench.markNow("blobout");
  const json = JSON.parse(await blobout.text());
  bench.finish("json");
  return json;
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

/**
 * Default values
 */
function resetFiltres() {
  selectedNatures = [];
  selectedRechExpl = [];
  selectedHasScan = false;
  search = "";
}

async function changeDep(newDep) {
  isLoading(true);
  await fetchPointsDep(newDep);
  updateFiltres();
  isLoading(false);
}

async function fetchPointsDep(dep = 54) {
  const bench = new BenchMarker("fetchPointsDep");
  let res = await fetch(`./static/${dep}.json.gzip`);
  bench.markNow("fetch");

  if (!res.ok) {
    console.error("res not ok " + res.status);
    return;
  }

  setDep(dep);
  let data = await decompressResToJson(res);
  bench.markNow("decompressResToJson");

  points = data;
  console.log(`Fetch points ok, ${points.length} points`);

  let countPromise = countPointsFiltres();
  filtrePoints();
  bench.markNow("filtresPoints");
  await countPromise;
  bench.finish("countPointsFiltres");
}
async function countPointsFiltres() {
  let bench = new BenchMarker("CountPointsFiltres", true);
  selectableRechExpl.forEach((v) => (v.count = 0));
  communes.forEach((v) => (v.count = 0));
  selectableNatures.forEach((v) => (v.count = 0));

  for (let re of selectableRechExpl) {
    for (let i = 0; i < points.length / nbField; i++) {
      let ib = i * nbField;
      for (let pre of points[ib + rechexpl]) {
        if (pre === re.id) {
          re.count++;
          if (!countAll) break;
        }
      }
      if (re.count > 0 && !countAll) {
        break;
      }
    }
  }
  bench.markNow("Recherche exploit");

  for (let nat of selectableNatures) {
    for (let i = 0; i < points.length / nbField; i++) {
      let ib = i * nbField;
      if (points[ib + nature] == nat.id) {
        nat.count++;
        if (!countAll) break;
      }
    }
  }
  bench.markNow("Natures");
  updateFiltres();
  bench.finish("updateFiltres");
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
  const regexSearch = new RegExp(
    search.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    "i",
  );
  updatePointsViews(
    Array.from({ length: points.length / nbField }, (_, i) => {
      let ib = i * nbField;
      // .normalize('NFD')
      //     .replace(/[\u0300-\u036f]/g, '')

      if (
        !(
          (selectedNatures.length == 0 ||
            selectedNatures.includes(points[ib + nature])) &&
          (selectedRechExpl.length == 0 ||
            points[ib + rechexpl].some((e) => selectedRechExpl.includes(e))) &&
          (!selectedHasScan || points[ib + nbScan] > 0) &&
          (search.length == 0 ||
            points[ib + lieudit]
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .match(regexSearch) !== null ||
            communes[points[ib + commune]].name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .match(regexSearch) !== null)
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
  hasCountAllChanged(countAll);
}

function inverseRechExplFilters() {
  console.log(
    "inversRechExplfiltres selected natures: ",
    selectedRechExpl.length,
  );
  selectableRechExpl = selectableRechExpl.map((n) => {
    n.checked = selectedRechExpl.find((sid) => sid == n.id) == undefined;
    return n;
  });
  selectedRechExpl = selectableRechExpl
    .filter((n) => n.checked)
    .map((n) => n.id);
  recheExplFiltresChanges(selectableRechExpl);
  console.log(
    "inversRechExplfiltres selected natures après inverse: ",
    selectedRechExpl.length,
  );
  filtrePoints();
}
function inverseNaturesFilters() {
  console.log(
    "inversNaturesfiltres selected natures: ",
    selectedNatures.length,
  );
  selectableNatures = selectableNatures.map((n) => {
    n.checked = selectedNatures.find((sid) => sid == n.id) == undefined;
    return n;
  });
  selectedNatures = selectableNatures.filter((n) => n.checked).map((n) => n.id);
  naturesFiltresChanges(selectableNatures);
  console.log(
    "inversNaturesfiltres selected natures après inverse: ",
    selectedNatures.length,
  );
  filtrePoints();
}

export {
  initPoints,
  fetchPointsDep,
  filtrePoints,
  inverseNaturesFilters,
  inverseRechExplFilters,
  selectedNatures,
  selectedRechExpl,
  selectedHasScan,
  addSelectedRechExpl,
  addSelectedNatures,
  changeDep,
  changeHasScan,
  changeSearch,
  changeCountAll,
};
