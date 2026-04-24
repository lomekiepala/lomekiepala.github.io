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

L.Control.Layers.include({
  _addItem: function (obj) {
    var label = document.createElement("label"),
      checked = this._map.hasLayer(obj.layer),
      input;
    var ctrlDiv = document.createElement("div");
    ctrlDiv.appendChild(label);

    if (obj.overlay) {
      input = document.createElement("input");
      input.type = "checkbox";
      input.className = "leaflet-control-layers-selector";
      input.defaultChecked = checked;
    } else {
      input = this._createRadioElement(
        "leaflet-base-layers_" + L.Util.stamp(this),
        checked,
      );
    }

    this._layerControlInputs.push(input);
    input.layerId = L.Util.stamp(obj.layer);

    L.DomEvent.on(input, "click", this._onInputClick, this);

    var name = document.createElement("span");
    name.innerHTML = " " + obj.name;

    // Helps from preventing layer control flicker when checkboxes are disabled
    // https://github.com/Leaflet/Leaflet/issues/2771
    var holder = document.createElement("span");

    label.appendChild(holder);
    holder.appendChild(input);
    holder.appendChild(name);
    holder.setAttribute("class", "layer-control-holder");

    if (obj.overlay) {
      let upAndDown = document.createElement("span");
      upAndDown.setAttribute("class", "up-and-down");
      let up = document.createElement("button");
      up.innerText = "^";
      up.class = "layer-up";
      let down = document.createElement("button");
      down.innerText = "v";
      down.class = "layer-down";
      upAndDown.appendChild(up);
      upAndDown.appendChild(down);
      up.layerId = L.Util.stamp(obj.layer);
      down.layerId = L.Util.stamp(obj.layer);
      let onLevelClick = (e) => {
        console.log("level", e.target.class);
        let zdiff = e.target.class == "layer-up" ? 1 : -1;
        let layer = this._getLayer(e.target.layerId);
        console.log(layer.layer);
        layer.layer.setZIndex(layer.layer.options.zIndex + zdiff);
      };
      L.DomEvent.on(down, "click", onLevelClick, null);
      L.DomEvent.on(up, "click", onLevelClick, null);
      holder.appendChild(upAndDown);

      let slidar = document.createElement("input");
      slidar.type = "range";
      slidar.min = "0";
      slidar.max = "100";
      slidar.value = "100";
      slidar.layerId = L.Util.stamp(obj.layer);
      slidar.setAttribute("class", "opacity-slidar");
      L.DomEvent.on(
        slidar,
        "change",
        (s) => {
          console.log("opacityChange: ", this._getLayer(s.target.layerId).name);
          this._getLayer(s.target.layerId).layer.setOpacity(
            s.target.value / 100,
          );
        },
        null,
      );
      ctrlDiv.appendChild(slidar);
    }

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(ctrlDiv);

    this._checkDisabledLayers();
    return ctrlDiv;
  },
});

const moreLayer = L.control
  .layers(null, overlayMaps, { autoZIndex: false })
  .addTo(map);

export { map, cluster, moreLayer, overlayMaps };
