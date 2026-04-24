import { map, moreLayer } from "./map";
import { getSavedPreferences } from "./preferences";

let additionalLayers = {};
const xmlLink = "https://data.geopf.fr/tms/1.0.0";

async function fetchMoreMaps() {
  try {
    const res = await fetch(xmlLink);
    if (!res.ok) {
      console.error(```moremaps not ok ${res}```);
      return;
    }
    const domparse = new DOMParser();
    const xml = domparse.parseFromString(await res.text(), "text/xml");
    const tileMaps = xml.querySelectorAll("TileMap");
    if (tileMaps == null) {
      console.error("tilemaps null");
      return [];
    }
    return Array.from(tileMaps)
      .map((e) => {
        const title = e.getAttribute("title");
        const link = e.getAttribute("href");
        const extension = e.getAttribute("extension");
        //leaflet ne supporte pas pbf
        if (extension == "pbf") {
          return null;
        }
        if (title == null || link == null || extension == null) {
          console.warn("moremaps null element", title, link, extension);
          return null;
        }
        const fullLink = gettmsLink(link, extension);
        return {
          title: title,
          link: fullLink,
        };
      })
      .filter((e) => e != null);
  } catch (e) {
    console.error(e);
    return [];
  }
}

function gettmsLink(link, extension) {
  return `${link}/{z}/{x}/{y}.${extension}`;
}

let availableLayers = [];
function replaceLayers(newLayers) {
  more_maps.innerHTML = "";
  newLayers.forEach((l) => {
    let check = document.createElement("input");
    check.type = "checkbox";
    check.value = l.link;
    check.title = l.title;
    check.checked = additionalLayers[l.title] != undefined;
    check.addEventListener("change", (e) => {
      // console.log(e.target.value, e.target.checked);
      let title = e.target.title;
      let link = e.target.value;
      if (e.target.checked) {
        addAdditionalLayer(title, link);
      } else {
        removeAdditionalLayer(title);
      }
    });
    let label = document.createElement("label");
    label.innerText = l.title;
    label.prepend(check);
    more_maps.append(label);
  });
}

function getSelectedLayers() {
  let ret = {};
  for (let title in additionalLayers) {
    ret[title] = additionalLayers[title].link;
  }
  return ret;
}

function addAdditionalLayer(title, link) {
  additionalLayers[title] = { tileLayer: L.tileLayer(link), link: link };
  // console.log(
  //   "addAdditionalLayer",
  //   additionalLayers[title].tileLayer.setZIndex,
  // );

  moreLayer.addOverlay(additionalLayers[title].tileLayer, title);
}

function removeAdditionalLayer(title) {
  moreLayer.removeLayer(additionalLayers[title].tileLayer.remove());
  delete additionalLayers[title];
}

async function init() {
  let pref = getSavedPreferences();
  for (let title in pref.layers) {
    addAdditionalLayer(title, pref.layers[title]);
  }

  fetch_more_maps_btn.addEventListener("click", async () => {
    const layers = await fetchMoreMaps();
    availableLayers = layers;
    replaceLayers(layers);
  });
  layers_search_bar.addEventListener("keyup", (e) => {
    const regexSearch = new RegExp(
      e.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      "i",
    );

    replaceLayers(
      availableLayers.filter(
        (l) =>
          l.title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .match(regexSearch) !== null,
      ),
    );
  });
}

console.log(moreLayer);
export { init, getSelectedLayers };
