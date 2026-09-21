'use client';

import { useEffect, useRef } from 'react';

const RADIUS = 1;
const DEG = Math.PI / 180;

// Palette, kept in sync with :root in globals.css. Three needs numbers, not
// custom properties, so these are the one place the hexes are repeated.
const INK = 0x4f2427;
const OCEAN = 0xf2ece1;
const GRID = 0xc1b394;
const PIN = 0x4f2427;
const PIN_ON = 0x8d6339;

/** Latitude/longitude to a point on the sphere. */
function toVector(lat, lon, radius, V) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new V(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Rotation that swings a given lat/lon round to face the camera. */
function facing(lat, lon) {
  return { x: lat * DEG, y: -lon * DEG - Math.PI / 2 };
}

const shortest = (from, to) => from + Math.atan2(Math.sin(to - from), Math.cos(to - from));

export default function Globe({ places, activeIndex, onSelect, onProject, reducedMotion }) {
  const hostRef = useRef(null);
  // Callbacks change every render; keep them in a ref so the scene is built once.
  const handlers = useRef({ onSelect, onProject, places, activeIndex });
  handlers.current = { onSelect, onProject, places, activeIndex };
  const apiRef = useRef(null);

  // Build the scene once.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let cancelled = false;
    let teardown = () => {};

    (async () => {
      const THREE = await import('three');
      if (cancelled) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        host.dataset.failed = 'true';
        return;
      }
      if (cancelled) {
        renderer.dispose();
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0, 3.15);

      // tilt (latitude) wraps spin (longitude) so the two axes stay independent
      const tilt = new THREE.Group();
      const spin = new THREE.Group();
      tilt.add(spin);
      scene.add(tilt);

      const disposables = [];
      const track = (obj) => {
        disposables.push(obj);
        return obj;
      };

      const ocean = new THREE.Mesh(
        track(new THREE.SphereGeometry(RADIUS * 0.995, 64, 48)),
        track(new THREE.MeshBasicMaterial({ color: OCEAN }))
      );
      spin.add(ocean);

      // graticule — every 30 degrees
      const grid = [];
      for (let lon = -180; lon < 180; lon += 30) {
        for (let lat = -90; lat < 90; lat += 3) {
          grid.push(toVector(lat, lon, RADIUS, THREE.Vector3), toVector(lat + 3, lon, RADIUS, THREE.Vector3));
        }
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        for (let lon = -180; lon < 180; lon += 3) {
          grid.push(toVector(lat, lon, RADIUS, THREE.Vector3), toVector(lat, lon + 3, RADIUS, THREE.Vector3));
        }
      }
      const gridGeo = track(new THREE.BufferGeometry().setFromPoints(grid));
      spin.add(
        new THREE.LineSegments(
          gridGeo,
          track(new THREE.LineBasicMaterial({ color: GRID, transparent: true, opacity: 0.55 }))
        )
      );

      // Frame to the pins. Four places in one province sit within a degree of
      // each other, so a fixed world view would stack them into a single dot;
      // four continents need the camera right back. Measure, then fit.
      const places = handlers.current.places;
      const points = places.map((p) => toVector(p.lat, p.lon, 1, THREE.Vector3));
      const centre = points
        .reduce((acc, v) => acc.add(v), new THREE.Vector3())
        .divideScalar(points.length)
        .normalize();
      const spread = points.reduce(
        (max, v) => Math.max(max, Math.acos(Math.min(1, v.dot(centre)))),
        0.001
      );
      const halfFov = Math.tan((camera.fov / 2) * DEG);
      // Put the spread across half the frame. The near clamp stops the camera
      // dropping so close that the globe stops reading as a globe; the far one
      // keeps a worldwide story from shrinking to nothing.
      const DISTANCE = Math.max(1.3, Math.min(3.4, 1 + spread / (0.5 * halfFov)));
      const zoom = (DISTANCE - 1) / 2.15; // 1 at full world view, ~0.2 zoomed in

      // pins
      const pinGeo = track(new THREE.SphereGeometry(Math.max(0.005, 0.022 * zoom), 16, 12));
      const pinMats = [];
      const pins = places.map((place, index) => {
        const mat = track(new THREE.MeshBasicMaterial({ color: index === 0 ? PIN_ON : PIN }));
        pinMats.push(mat);
        const mesh = new THREE.Mesh(pinGeo, mat);
        mesh.position.copy(toVector(place.lat, place.lon, RADIUS * 1.012, THREE.Vector3));
        mesh.userData.index = index;
        spin.add(mesh);
        return mesh;
      });

      // coastlines, fetched rather than bundled
      let coast = null;
      fetch('data/land.json')
        .then((r) => (r.ok ? r.json() : null))
        .then((rings) => {
          if (cancelled || !rings) return;
          const pts = [];
          rings.forEach((flat) => {
            for (let i = 0; i + 3 < flat.length; i += 2) {
              pts.push(
                toVector(flat[i + 1], flat[i], RADIUS * 1.002, THREE.Vector3),
                toVector(flat[i + 3], flat[i + 2], RADIUS * 1.002, THREE.Vector3)
              );
            }
          });
          const geo = track(new THREE.BufferGeometry().setFromPoints(pts));
          const mat = track(new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.8 }));
          coast = new THREE.LineSegments(geo, mat);
          spin.add(coast);
        })
        .catch(() => {});

      // ---- interaction ----
      const start = facing(places[0].lat, places[0].lon);
      const rot = { x: start.x, y: start.y };
      const target = { x: start.x, y: start.y };
      let drag = null;
      let velocity = 0;
      let idle = 0;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const clamp = (v) => Math.max(-1.1, Math.min(1.1, v));

      const pick = (event) => {
        const box = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - box.left) / box.width) * 2 - 1;
        pointer.y = -((event.clientY - box.top) / box.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const world = new THREE.Vector3();
        const hit = raycaster
          .intersectObjects(pins, false)
          // the globe is opaque — ignore anything round the back
          .find((i) => i.object.getWorldPosition(world).z > -0.15);
        return hit ? hit.object.userData.index : -1;
      };

      const onDown = (event) => {
        drag = { x: event.clientX, y: event.clientY, moved: 0, id: event.pointerId };
        velocity = 0;
        renderer.domElement.setPointerCapture?.(event.pointerId);
      };

      const onMove = (event) => {
        if (!drag || event.pointerId !== drag.id) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        target.y += dx * 0.0062 * zoom;
        target.x = clamp(target.x - dy * 0.0062 * zoom);
        rot.y = target.y;
        rot.x = target.x;
        velocity = dx * 0.0062 * zoom;
        drag.x = event.clientX;
        drag.y = event.clientY;
        idle = 0;
      };

      const onUp = (event) => {
        if (!drag) return;
        const wasTap = drag.moved < 6;
        const id = drag.id;
        drag = null;
        renderer.domElement.releasePointerCapture?.(id);
        if (wasTap) {
          velocity = 0;
          const index = pick(event);
          if (index >= 0) handlers.current.onSelect(index);
        }
        idle = 0;
      };

      renderer.domElement.addEventListener('pointerdown', onDown);
      renderer.domElement.addEventListener('pointermove', onMove);
      renderer.domElement.addEventListener('pointerup', onUp);
      renderer.domElement.addEventListener('pointercancel', onUp);

      // hover affordance on pointers that have one
      const onHover = (event) => {
        if (drag) return;
        renderer.domElement.style.cursor = pick(event) >= 0 ? 'pointer' : 'grab';
      };
      renderer.domElement.addEventListener('pointermove', onHover);

      // ---- sizing ----
      let vw = 1;
      let vh = 1;
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        vw = w;
        vh = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // ease back a little on narrow screens so nothing crops
        camera.position.z = DISTANCE * (w < 420 ? 1.12 : 1);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();

      // ---- loop ----
      const screen = new THREE.Vector3();
      let frame = 0;

      const tick = () => {
        frame = requestAnimationFrame(tick);

        if (!drag) {
          idle += 1;
          if (Math.abs(velocity) > 0.00004) {
            target.y += velocity;
            velocity *= 0.94;
          } else if (!reducedMotion && idle > 160) {
            target.y += 0.0009 * zoom; // slow drift once left alone
          }
        }

        const ease = reducedMotion ? 1 : 0.09;
        rot.y += (shortest(rot.y, target.y) - rot.y) * ease;
        rot.x += (target.x - rot.x) * ease;
        spin.rotation.y = rot.y;
        tilt.rotation.x = rot.x;

        // hand each pin's screen position back for the HTML labels
        const projected = pins.map((mesh) => {
          mesh.getWorldPosition(screen);
          const behind = screen.z < -0.15;
          screen.project(camera);
          return {
            x: (screen.x * 0.5 + 0.5) * vw,
            y: (-screen.y * 0.5 + 0.5) * vh,
            visible: !behind,
          };
        });
        handlers.current.onProject(projected);

        renderer.render(scene, camera);
      };
      tick();

      apiRef.current = {
        focus(index) {
          const place = handlers.current.places[index];
          if (!place) return;
          const next = facing(place.lat, place.lon);
          target.x = clamp(next.x);
          target.y = next.y;
          velocity = 0;
          idle = 0;
          pinMats.forEach((mat, i) => mat.color.setHex(i === index ? PIN_ON : PIN));
        },
      };

      teardown = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        renderer.domElement.removeEventListener('pointerdown', onDown);
        renderer.domElement.removeEventListener('pointermove', onMove);
        renderer.domElement.removeEventListener('pointerup', onUp);
        renderer.domElement.removeEventListener('pointercancel', onUp);
        renderer.domElement.removeEventListener('pointermove', onHover);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
        apiRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      teardown();
    };
    // built once — live values are read through handlers.current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Swing round whenever the active pin changes.
  useEffect(() => {
    apiRef.current?.focus(activeIndex);
  }, [activeIndex]);

  return <div ref={hostRef} className="globe__canvas" />;
}
