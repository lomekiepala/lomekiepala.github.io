import { getDepValue } from "./departements.js";
import { map, cluster } from "./map.js";
import { getOrigin, pushNewOptions } from "./queryParams.js";

let markers = {};

let updatePointsView = (points) => {
  let dep = getDepValue();
  let url = getOrigin();
  cluster.clearLayers();
  cluster.addLayers(
    points.map(
      (p) =>
        (markers[p.id] = L.marker([p.lat, p.long])
          .on("popupopen", () => {
            console.log("tooltipopen");
            pushNewOptions("bssid", p.id);
          })
          .on("popupclose", () => {
            console.log("close");
            pushNewOptions("bssid", undefined);
          })
          .bindPopup(
            undef(p.commune, ` Ville: ${p.commune}<br>`) +
              undef(p.lieudit, `Lieu dit: ${p.lieudit}<br>`) +
              undef(p.nature, `Nature: ${p.nature}<br>`) +
              empty(
                p.rechexpl,
                `Recherche et exploitation: ${p.rechexpl}<br>`,
              ) +
              undef(p.nb_scan, `Nb scan: ${p.nb_scan}<br>`) +
              undef(
                p.id,
                `<a href="http://ficheinfoterre.brgm.fr/InfoterreFiche/ficheBss.action?id=${p.id}" target="_blank">Fiche infoterre</a> ${p.id}<br>`,
              ) +
              undef(
                p.lat,
                `<a href="https://www.google.com/maps?q=${p.lat},${p.long}" target="_blank">GGmap</a><br> `,
              ) +
              undef(
                p.id,
                `<span class="sharebtn" onclick="navigator.clipboard.writeText('${url}?dep=${dep}&bssid=${p.id}');showPopup()">Partager</span> <br>`,
              ),
          )),
    ),
  );
};

function focusPoints(id) {
  let toFocus = markers[id];
  if (toFocus === undefined) {
    pushNewOptions("bssid", undefined);
    return;
  }
  pushNewOptions("bssid", id);
  let latlong = toFocus.getLatLng();
  map.setView(latlong, 15, { animate: false });
  toFocus.openPopup();
}

function updateNbPoints(nbPointsTotal, nbPointsFiltrees) {
  nb_points_span.innerText = nbPointsTotal;
  nb_filtered_points_span.innerText = nbPointsFiltrees;
}

function undef(a, as) {
  if (a !== undefined && a !== "") return as;
  else return "";
}

function empty(a, as) {
  if (a.length > 0) return as;
  else return "";
}

export { updatePointsView, updateNbPoints, focusPoints };
