/**
 * Bakes the globe's coastlines into public/data/land.json.
 *
 *   node scripts/bake-land.mjs
 *
 * Source is Natural Earth 1:50m land (public domain). Coastlines are simplified
 * hard everywhere, then re-simplified gently inside REGION so the part of the
 * world the story actually happens in keeps its shape when the globe zooms in.
 *
 * Moving the story abroad? Widen REGION to cover the new pins and re-run.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const BASE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson';
// 1:50m is the sweet spot. 1:10m is 10 MB and, once simplified down to a size
// worth shipping, is indistinguishable from this at the zoom the globe uses.
const WORLD_SOURCE = `${BASE}/ne_50m_land.geojson`;
const REGION_SOURCE = WORLD_SOURCE;
const OUT = 'public/data/land.json';

// [west, south, east, north] — the Philippines, with room to spare.
const REGION = [115, 3, 130, 23];

const WORLD_TOLERANCE = 0.7; // degrees — the globe is only ever seen small
const REGION_TOLERANCE = 0.05;
const MIN_ISLAND = 1.2; // drop world specks smaller than this (degrees across)
const MIN_REGION_ISLAND = 0.08; // the archipelago has thousands of islets — keep the real ones

function flatten(coords, out = []) {
  if (coords.length && typeof coords[0][0] === 'number') {
    out.push(coords);
  } else {
    for (const part of coords) flatten(part, out);
  }
  return out;
}

function perpendicular(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

/** Ramer–Douglas–Peucker, iterative so long rings cannot blow the stack. */
function simplify(points, tolerance) {
  if (points.length < 4) return points;
  const keep = new Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    if (j <= i + 1) continue;
    let far = -1;
    let max = tolerance;
    for (let k = i + 1; k < j; k += 1) {
      const d = perpendicular(points[k], points[i], points[j]);
      if (d > max) {
        far = k;
        max = d;
      }
    }
    if (far !== -1) {
      keep[far] = true;
      stack.push([i, far], [far, j]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const intersectsRegion = (ring) => {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < west) west = lon;
    if (lon > east) east = lon;
    if (lat < south) south = lat;
    if (lat > north) north = lat;
  }
  return east >= REGION[0] && west <= REGION[2] && north >= REGION[1] && south <= REGION[3];
};

const load = async (url) => {
  process.stdout.write(`fetching ${url.split('/').pop()}… `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  const geo = await res.json();
  const rings = geo.features.flatMap((f) => flatten(f.geometry.coordinates));
  console.log(`${rings.length} rings`);
  return rings;
};

const span = (ring) => {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < west) west = lon;
    if (lon > east) east = lon;
    if (lat < south) south = lat;
    if (lat > north) north = lat;
  }
  return Math.max(east - west, north - south);
};

const worldRings = await load(WORLD_SOURCE);
const regionRings = REGION_SOURCE === WORLD_SOURCE ? worldRings : await load(REGION_SOURCE);

const baked = [];
const push = (ring, tolerance) => {
  const simplified = simplify(ring, tolerance);
  if (simplified.length < 4) return false;
  const flat = [];
  for (const [lon, lat] of simplified) {
    flat.push(Math.round(lon * 1000) / 1000, Math.round(lat * 1000) / 1000);
  }
  baked.push(flat);
  return true;
};

// The world, minus whatever the region covers in finer detail.
let kept = 0;
for (const ring of worldRings) {
  if (intersectsRegion(ring)) continue;
  if (span(ring) < MIN_ISLAND) continue;
  if (push(ring, WORLD_TOLERANCE)) kept += 1;
}

let detailed = 0;
for (const ring of regionRings) {
  if (!intersectsRegion(ring)) continue;
  if (span(ring) < MIN_REGION_ISLAND) continue;
  if (push(ring, REGION_TOLERANCE)) detailed += 1;
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(baked));

const points = baked.reduce((n, r) => n + r.length / 2, 0);
console.log(
  `${OUT}: ${baked.length} rings (${kept} world, ${detailed} region), ${points} points, ` +
    `${(JSON.stringify(baked).length / 1024).toFixed(1)} kB`
);
