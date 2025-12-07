import { map, cluster } from "./map.js";

let updatePointsView = (points) => {
  cluster.clearLayers();
  cluster.addLayers(
    points.map((p) =>
      L.marker([p.lat, p.long]).bindPopup(
        undef(p.commune, ` Ville: ${p.commune}<br>`) +
          undef(p.lieudit, `Lieu dit: ${p.lieudit}<br>`) +
          undef(p.nature, `Nature: ${p.nature}<br>`) +
          empty(p.rechexpl, `Recherche et exploitation: ${p.rechexpl}<br>`) +
          undef(p.nb_scan, `Nb scan: ${p.nb_scan}<br>`) +
          undef(
            p.id,
            `<a href="http://ficheinfoterre.brgm.fr/InfoterreFiche/ficheBss.action?id=${p.id}" target="_blank">Fiche infoterre</a><br>`,
          ) +
          undef(
            p.lat,
            `<a href="https://www.google.com/maps?q=${p.lat},${p.long}" target="_blank">GGmap</a><br> `,
          ),
      ),
    ),
  );
};

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

export { updatePointsView, updateNbPoints };
