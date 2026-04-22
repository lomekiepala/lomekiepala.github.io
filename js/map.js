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
// <TileMap title="MNH issu de LiDAR HD" srs="EPSG:3857" profile="none" extension="png" href="https://data.geopf.fr/tms/1.0.0/IGNF_LIDAR-HD_MNH_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW"/>
// <TileMap title="MNS issu de LiDAR HD" srs="EPSG:3857" profile="none" extension="png" href="https://data.geopf.fr/tms/1.0.0/IGNF_LIDAR-HD_MNS_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW"/>
// <TileMap title="MNT issu de LiDAR HD" srs="EPSG:3857" profile="none" extension="png" href="https://data.geopf.fr/tms/1.0.0/IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW"/>
const cluster = L.markerClusterGroup({
  chunkedLoading: true,
  maxClusterRadius: 50,
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
    let btndiv = L.DomUtil.create("div");
    btndiv.id = "left-control";
    let btnFiltres = L.DomUtil.create("button");
    btnFiltres.id = "hide-filtre";
    L.DomEvent.on(
      btnFiltres,
      "click",
      // btnFiltres.addEventListener("click",
      (e) => {
        console.log("hide", sidebar.style.display, e);
        if (sidebar.style.display === "none") {
          e.target.innerText = "Cacher";
          sidebar.style.display = "block";
        } else {
          e.target.innerText = "Montrer";
          sidebar.style.display = "none";
        }
        map.invalidateSize();
      },
    );
    btnFiltres.innerText = "Cacher";
    btndiv.appendChild(btnFiltres);
    // let geolocbtn = L.DomUtil.create("button");
    // geolocbtn.id = "hide-filtre";
    // L.DomEvent.on(geolocbtn, "click", (e) => {
    //   console.log("geoloc");
    //   map.locate({ watch: true, enableHighAccuracy: true });
    // });
    // geolocbtn.innerText = "GeoLoc";
    // btndiv.appendChild(geolocbtn);

    return btndiv;
  },

  onRemove: function (map) {
    // Nothing to do here
  },
});

L.control.filtres = function (opts) {
  return new L.Control.Filtres(opts);
};

L.control.filtres({}).addTo(map);
// const imageurl = "static/rang.png";
//
// var latLngBounds = L.latLngBounds([
//   [49.3167971239095, 6.031761127403131],
//   [49.29520282944616, 6.069532251484862],
// ]);
//
// var imageOverlay = L.imageOverlay(imageurl, latLngBounds, {
//   opacity: 0.8,
//   interactive: true,
//   className: "rotationeImage",
// }).addTo(map);

const moreLayer = L.control.layers(null, overlayMaps).addTo(map);
export { map, cluster, moreLayer, overlayMaps };
