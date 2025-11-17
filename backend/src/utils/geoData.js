import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const communes = [];
const regions = new Map();

const regionsPath = path.join(__dirname, "../csv/regions-france.csv");
const communesPath = path.join(__dirname, "../csv/communes.csv");

function loadRegions() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(regionsPath)
      .pipe(csv({ separator: ',' }))
      .on("data", (row) => {
        const code = row.code_region.trim();
        const name = row.nom_region.trim();
        regions.set(code, name);
      })
      .on("end", resolve)
      .on("error", reject);
  });
}

function loadCommunes() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(communesPath)
      .pipe(csv({ separator: ',' }))
      .on("data", (row) => {
        communes.push({
          insee: row.COM.trim(),
          reg: row.REG.trim(),
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });
}

export async function loadGeoData() {
  await loadRegions();
  await loadCommunes();
  console.log(`${communes.length} communes chargées`);
}

export function getRegionByInsee(inseeCode) {
  const commune = communes.find(c => c.insee === inseeCode);
  console.log("Recherche de la région pour le code INSEE :", inseeCode, "-> Commune trouvée :", commune);
  console.log(regions.get(commune?.reg));
  if (!commune) return null;
  return regions.get(commune.reg) || null;
}
