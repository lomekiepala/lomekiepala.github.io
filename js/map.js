import { setDep } from "./departements.js";
import { getSavedPreferences } from "./preferences.js";

const baseLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: "© OpenStreetMap" },
);

const overlayMaps = {
  "Photographies aériennes": L.tileLayer(
    "https://data.geopf.fr/tms/1.0.0/ORTHOIMAGERY.ORTHOPHOTOS/{z}/{x}/{y}.jpeg",
  ),
  "Photographies aériennes 2000-2005": L.tileLayer(
    "https://data.geopf.fr/tms/1.0.0/ORTHOIMAGERY.ORTHOPHOTOS2000-2005/{z}/{x}/{y}.jpeg",
  ),
  "Photographies aériennes 2006-2010": L.tileLayer(
    "https://data.geopf.fr/tms/1.0.0/ORTHOIMAGERY.ORTHOPHOTOS2006-2010/{z}/{x}/{y}.jpeg",
  ),
  "Photographies aériennes 2011-2015": L.tileLayer(
    "https://data.geopf.fr/tms/1.0.0/ORTHOIMAGERY.ORTHOPHOTOS2011-2015/{z}/{x}/{y}.jpeg",
  ),
  "Photographies aériennes historiques 1950-1965": L.tileLayer(
    "https://data.geopf.fr/tms/1.0.0/ORTHOIMAGERY.ORTHOPHOTOS.1950-1965/{z}/{x}/{y}.png",
  ),
};

const cluster = L.markerClusterGroup({
  chunkedLoading: true,
  maxClusterRadius: 60,
});

let savedPref = getSavedPreferences();
setDep(savedPref.dep);

const map = L.map("map", {
  layers: [baseLayer, cluster],
}).setView([savedPref.lat, savedPref.long], savedPref.zoom);

L.Control.Filtres = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function (map) {
    let btnFiltres = L.DomUtil.create("button");
    btnFiltres.id = "hide-filtre";
    L.DomEvent.on(
      btnFiltres,
      "click",
      // btnFiltres.addEventListener("click",
      (e) => {
        console.log("hide", sidebar.style.display, e);
        if (sidebar.style.display === "none") {
          e.target.innerText = "Cache";
          sidebar.style.display = "block";
        } else {
          e.target.innerText = "Montre";
          sidebar.style.display = "none";
        }
        map.invalidateSize();
      },
    );
    btnFiltres.innerText = "Cache";

    return btnFiltres;
  },

  onRemove: function (map) {
    // Nothing to do here
  },
});

L.control.filtres = function (opts) {
  return new L.Control.Filtres(opts);
};

L.control.filtres({}).addTo(map);

const moreLayer = L.control.layers(null, overlayMaps).addTo(map);

export { map, cluster };
