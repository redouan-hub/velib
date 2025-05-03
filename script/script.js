let allStations = []; // Stockage global

fetch(
  "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&rows=1000"
)
  .then((response) => response.json())
  .then((data) => {
    allStations = data.records;
    const communes = new Set();

    allStations.forEach((station) => {
      const fields = station.fields;
      if (fields.nom_arrondissement_communes) {
        communes.add(fields.nom_arrondissement_communes);
      }
    });

    const select = document.getElementById("communeSelect");
    Array.from(communes)
      .sort()
      .forEach((commune) => {
        const option = document.createElement("option");
        option.value = commune;
        option.textContent = commune;
        select.appendChild(option);
      });

    select.addEventListener("change", () => {
      updateDisplay(select.value);
    });

    updateDisplay("all"); // Affichage initial
  });

let markers = [];

function updateDisplay(filterCommune) {
  const tableBody = document.getElementById("dataBody");
  tableBody.innerHTML = "";

  // Supprimer anciens marqueurs
  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  allStations.forEach((station) => {
    const fields = station.fields;
    if (!fields.coordonnees_geo) return;

    const lat = fields.coordonnees_geo[0];
    const lon = fields.coordonnees_geo[1];
    const name = fields.name || "Inconnu";
    const commune = fields.nom_arrondissement_communes || "N/A";
    const bikes = fields.numbikesavailable || 0;
    const docks = fields.numdocksavailable || 0;
    const isOpen =
      fields.is_installed && fields.is_renting && fields.is_returning;
    const status = isOpen ? "✅ Ouverte" : "❌ Fermée";

    if (filterCommune !== "all" && commune !== filterCommune) return;

    const popupContent = `
      <strong>${name}</strong><br>
      Commune : ${commune}<br>
      Vélos : ${bikes} | Bornes : ${docks}<br>
      État : ${status}
    `;

    const marker = L.marker([lat, lon]).addTo(map).bindPopup(popupContent);
    markers.push(marker);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${commune}</td>
      <td>${bikes}</td>
      <td>${docks}</td>
      <td>${status}</td>
    `;
    tableBody.appendChild(row);
  });
}
