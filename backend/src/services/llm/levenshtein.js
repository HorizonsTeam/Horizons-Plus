/**
 * Distance de Levenshtein : nombre minimal de modifications d'un seul caractère
 * (insertion, suppression, substitution) pour transformer `a` en `b`.
 *
 * Sert ici à la tolérance aux fautes de frappe : "Nevrs" -> "Nevers" coûte 1.
 * Implémentation en programmation dynamique sur une seule ligne (O(a*b) temps,
 * O(b) mémoire).
 */
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // suppression
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[b.length];
}

/**
 * Normalise une chaîne pour la comparaison floue : minuscules, sans accents,
 * sans espaces superflus. Permet que "Nevèrs" et "nevers" soient considérés
 * proches sur le seul critère orthographique, pas la casse ou les accents.
 */
export function normalizeForMatch(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Parmi une liste de candidats, retourne celui dont le nom est le plus proche
 * (au sens de Levenshtein) de la requête tapée par l'utilisateur.
 *
 * @param {string} query - texte saisi (ex: "Nevrs")
 * @param {Array} candidates - objets à classer
 * @param {(c:any)=>string} getName - extrait le nom d'un candidat
 * @returns le candidat le plus proche, ou null si la liste est vide
 */
export function pickClosestByName(query, candidates, getName) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const q = normalizeForMatch(query);
  let best = candidates[0];
  let bestDistance = levenshtein(q, normalizeForMatch(getName(candidates[0])));

  for (let i = 1; i < candidates.length; i++) {
    const distance = levenshtein(q, normalizeForMatch(getName(candidates[i])));
    if (distance < bestDistance) {
      best = candidates[i];
      bestDistance = distance;
    }
  }

  return best;
}
