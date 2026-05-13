/* wax-seal.jsx — 3D wax seal component built on three.js
   Used in the hold-to-seal moment (review screen) and the envelope reveal (sealed → cracking).

   Props:
     size      number  px square (default 92)
     color     string  CSS hex of the wax (e.g., "#C97B5A")
     monogram  string  one character (default "t")
     progress  number  0..100 — used during hold-to-seal: pushes the wax toward the camera
     phase     string  "idle" | "sealed" | "cracking"
                       - idle:     gentle hover, ready for press
                       - sealed:   stamped flat, slight tilt
                       - cracking: splits into two halves and rotates them away
*/

const { useEffect, useRef } = React;

/* tiny helper — wait for window.THREE if the import-map module hasn't resolved yet */
const whenThree = () => new Promise((resolve) => {
  if (window.THREE) return resolve(window.THREE);
  const handler = () => { window.removeEventListener("threeready", handler); resolve(window.THREE); };
  window.addEventListener("threeready", handler);
});

const hexToColor = (hex) => {
  const THREE = window.THREE;
  return new THREE.Color(hex);
};

/* paint the monogram glyph into a transparent canvas — used as a height map for relief */
const makeMonogramHeightMap = (glyph, size = 512) => {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, size, size);
  g.fillStyle = "#fff";
  g.font = `italic ${Math.round(size * 0.7)}px "Fraunces", Georgia, serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText((glyph || "t").slice(0, 1), size / 2, size * 0.55);
  // soften — gives the height map smoother shoulders so the normal map shading reads as wax-like
  g.filter = "blur(2px)";
  g.drawImage(c, 0, 0);
  g.filter = "none";
  return c;
};

/* derive a normal map from a height map canvas via Sobel-ish gradient */
const heightToNormal = (heightCanvas, strength = 4.0) => {
  const w = heightCanvas.width, h = heightCanvas.height;
  const src = heightCanvas.getContext("2d").getImageData(0, 0, w, h).data;
  const out = document.createElement("canvas");
  out.width = w; out.height = h;
  const oCtx = out.getContext("2d");
  const dst = oCtx.createImageData(w, h);
  const lum = (x, y) => {
    x = Math.max(0, Math.min(w - 1, x));
    y = Math.max(0, Math.min(h - 1, y));
    const i = (y * w + x) * 4;
    return (src[i] + src[i + 1] + src[i + 2]) / (3 * 255);
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (lum(x + 1, y) - lum(x - 1, y)) * strength;
      const dy = (lum(x, y + 1) - lum(x, y - 1)) * strength;
      const nz = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const nx = -dx * nz;
      const ny = -dy * nz;
      const i = (y * w + x) * 4;
      dst.data[i]     = Math.round((nx * 0.5 + 0.5) * 255);
      dst.data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      dst.data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      dst.data[i + 3] = 255;
    }
  }
  oCtx.putImageData(dst, 0, 0);
  return out;
};

const WaxSeal3D = ({ size = 92, color = "#C97B5A", monogram = "t", progress = 0, phase = "idle", className }) => {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  // mount once
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    const mount = mountRef.current;
    if (!mount) return;

    whenThree().then((THREE) => {
      if (cancelled || !mount) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(size, size, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = size + "px";
      renderer.domElement.style.height = size + "px";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
      camera.position.set(0, 0, 6.4);
      camera.lookAt(0, 0, 0);

      // lighting — warm key + soft fill + rim
      const key = new THREE.DirectionalLight(0xfff4e2, 1.7);
      key.position.set(2.5, 3.5, 3.5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xffd9b8, 0.55);
      fill.position.set(-3, -1, 2);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffe8c8, 0.45);
      rim.position.set(-1, 2, -3);
      scene.add(rim);
      scene.add(new THREE.AmbientLight(0xfff1e0, 0.32));

      // height & normal maps for monogram relief
      const heightCanvas = makeMonogramHeightMap(monogram, 512);
      const normalCanvas = heightToNormal(heightCanvas, 6.0);
      const normalTex = new THREE.CanvasTexture(normalCanvas);
      normalTex.anisotropy = 4;
      normalTex.colorSpace = THREE.NoColorSpace;

      // wax material — slightly metallic feel, with subtle clear-coat-ish highlight
      const waxColor = hexToColor(color);
      const waxMat = new THREE.MeshStandardMaterial({
        color: waxColor,
        roughness: 0.42,
        metalness: 0.06,
        normalMap: normalTex,
        normalScale: new THREE.Vector2(1.4, 1.4),
      });

      // group hierarchy:
      // root
      //   sealGroup (the whole disc — for the "press in" transform and for cracking we replace this with two halves)
      //     wax (cylinder)
      //     rim glow (subtle inner ring on the front face — simulates dripped edge)
      const root = new THREE.Group();
      scene.add(root);

      // we'll build either a single wax or two halves depending on phase
      const buildWhole = () => {
        const group = new THREE.Group();
        // bevelled disc — short cylinder with rounded edge approximated via lathe
        // For lightness, just use Cylinder + a slightly larger sphere-cap on top
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(1.0, 1.05, 0.36, 96, 1),
          waxMat
        );
        body.rotation.x = Math.PI / 2; // top face → camera
        group.add(body);

        // top face cap with stronger normal map influence
        const topCap = new THREE.Mesh(
          new THREE.CircleGeometry(0.97, 96),
          waxMat
        );
        topCap.position.z = 0.181;
        group.add(topCap);

        // little raised rim around the edge to suggest wax pooled outward
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.99, 0.06, 12, 96),
          new THREE.MeshStandardMaterial({
            color: waxColor.clone().multiplyScalar(0.86),
            roughness: 0.45, metalness: 0.06,
          })
        );
        ring.position.z = 0.17;
        group.add(ring);

        return group;
      };

      const buildHalf = (side) => {
        // side: -1 left, +1 right — uses thetaStart/length on cylinder + half-circle cap
        const sign = side;
        const start = sign < 0 ? Math.PI / 2 : -Math.PI / 2;
        const group = new THREE.Group();

        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(1.0, 1.05, 0.36, 64, 1, false, start, Math.PI),
          waxMat
        );
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // flat "back" face of the half (the broken interior surface)
        const back = new THREE.Mesh(
          new THREE.PlaneGeometry(0.36, 2.05),
          new THREE.MeshStandardMaterial({
            color: waxColor.clone().multiplyScalar(0.5),
            roughness: 0.9, metalness: 0,
          })
        );
        back.rotation.y = Math.PI / 2;
        back.position.x = 0;
        group.add(back);

        // top circle half (so the monogram normal is visible on each half)
        const cap = new THREE.Mesh(
          new THREE.CircleGeometry(0.97, 64, sign < 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI),
          waxMat
        );
        cap.position.z = 0.181;
        group.add(cap);

        return group;
      };

      const whole = buildWhole();
      root.add(whole);

      const halves = { l: null, r: null, mounted: false };

      // soft drop shadow plane behind the seal
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.5, 48),
        new THREE.MeshBasicMaterial({
          color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false,
        })
      );
      shadow.position.z = -0.5;
      scene.add(shadow);

      // animation
      let raf;
      let t = 0;
      let lastTime = performance.now();
      // smoothed values
      let curProgress = 0;
      const animPhase = { current: "idle", switchedAt: 0 };
      const crackStart = { time: 0, active: false };

      const setPhase = (next) => {
        if (animPhase.current === next) return;
        animPhase.current = next;
        animPhase.switchedAt = t;
        // build halves on demand
        if (next === "cracking" && !halves.mounted) {
          halves.l = buildHalf(-1);
          halves.r = buildHalf(+1);
          root.add(halves.l);
          root.add(halves.r);
          halves.mounted = true;
          whole.visible = false;
          crackStart.time = t;
          crackStart.active = true;
        } else if (next === "idle" || next === "sealed") {
          // reset crack
          whole.visible = true;
          if (halves.mounted) {
            root.remove(halves.l); root.remove(halves.r);
            halves.l.traverse(o => o.geometry && o.geometry.dispose());
            halves.r.traverse(o => o.geometry && o.geometry.dispose());
            halves.mounted = false;
          }
        }
      };

      const onTick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        t += dt;

        // smooth progress
        const target = stateRef.current.progress || 0;
        curProgress += (target - curProgress) * Math.min(1, dt * 12);

        // smooth phase from outside
        const targetPhase = stateRef.current.phase || "idle";
        if (targetPhase !== animPhase.current) setPhase(targetPhase);

        // ---- pose by phase ----
        if (animPhase.current === "idle" || animPhase.current === "sealed") {
          // press-in scale based on progress
          const pressed = curProgress / 100; // 0..1
          const targetScale = animPhase.current === "sealed" ? 0.92 : (1.0 - pressed * 0.08);
          const targetZ = animPhase.current === "sealed" ? -0.18 : (-pressed * 0.22);
          root.scale.setScalar(THREE.MathUtils.lerp(root.scale.x, targetScale, dt * 10));
          root.position.z = THREE.MathUtils.lerp(root.position.z, targetZ, dt * 10);

          // idle hover: gentle rotation
          const idleAmp = animPhase.current === "idle" ? 1 - pressed : 0.08;
          root.rotation.x = Math.sin(t * 0.6) * 0.08 * idleAmp;
          root.rotation.y = Math.sin(t * 0.45) * 0.10 * idleAmp;
          root.rotation.z = animPhase.current === "sealed"
            ? THREE.MathUtils.lerp(root.rotation.z, -0.08, dt * 6)
            : Math.sin(t * 0.3) * 0.03 * idleAmp;

          // shadow follows
          shadow.scale.setScalar(THREE.MathUtils.lerp(shadow.scale.x, 1 - pressed * 0.15, dt * 10));
          shadow.material.opacity = 0.16 + pressed * 0.05;
        } else if (animPhase.current === "cracking") {
          const since = t - crackStart.time;
          const k = Math.min(1, since / 0.85);
          // ease out cubic
          const e = 1 - Math.pow(1 - k, 3);
          if (halves.mounted) {
            // separate halves horizontally + small drop & rotation
            halves.l.position.x = -0.06 - e * 0.55;
            halves.r.position.x =  0.06 + e * 0.55;
            halves.l.position.y = -e * 0.05;
            halves.r.position.y = -e * 0.05;
            halves.l.rotation.z = -e * 0.45;
            halves.r.rotation.z =  e * 0.45;
            // shrink shadow as the seal opens
            shadow.scale.setScalar(1 + e * 0.12);
            shadow.material.opacity = 0.18 * (1 - e * 0.4);
          }
          // overall root: tiny recoil up
          root.position.z = -0.18 + Math.sin(k * Math.PI) * 0.04;
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(onTick);
      };
      raf = requestAnimationFrame(onTick);

      // expose updater
      cleanup = () => {
        cancelAnimationFrame(raf);
        renderer.dispose();
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const m = obj.material;
            if (Array.isArray(m)) m.forEach((x) => x.dispose && x.dispose());
            else m.dispose && m.dispose();
          }
        });
        normalTex.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    });

    return () => { cancelled = true; cleanup(); };
    // size, color, monogram cause a full rebuild — kept intentional so the texture refreshes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, color, monogram]);

  // continuously feed live props into the running animation loop
  useEffect(() => { stateRef.current.progress = progress; stateRef.current.phase = phase; }, [progress, phase]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: size, height: size, display: "inline-block", pointerEvents: "none" }}
    />
  );
};

window.WaxSeal3D = WaxSeal3D;
