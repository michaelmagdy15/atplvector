import * as THREE from 'three';

export const D2R = Math.PI / 180;

export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

export const AVIATION_LOADER_PRESETS = {
  runway: 'Taxiing aircraft onto RWY 27L…',
  windtunnel: 'Pressurizing subsonic wind tunnel…',
  irs: 'IRS [NAV] ALIGNED · HDG 270 · Over to you.',
  cloudbreak: 'BREAK OUT · VISUAL · Clear of cloud. Over to you.',
} as const;

export const PALETTE_LIGHT = {
  white: 0xf7f5f0,
  shade: 0xdad4c8,
  grey: 0x9aa09a,
  ink: 0x1c1e26,
  glass: 0x26323e,
  metal: 0xb5bcc4,
  tyre: 0x22252b,
  gold: 0xf59e0b,
  mag: 0xec4899,
  teal: 0x0d9488,
  red: 0xe11d48,
  sky: 0x0284c7,
  fuel: 0x06b6d4,
  asphalt: 0x3a3f46,
  mark: 0xf8fafc,
  grass: 0x86efac,
  emerald: 0x10b981,
  amber: 0xd97706,
  haze: 0xcbd5e1,
} as const;

export const PALETTE_DARK = {
  white: 0xe2e8f0,
  shade: 0x94a3b8,
  grey: 0x64748b,
  ink: 0xf1f5f9,
  glass: 0x0f172a,
  metal: 0x9aa5b4,
  tyre: 0x171a21,
  gold: 0xfbbf24,
  mag: 0xf472b6,
  teal: 0x2dd4bf,
  red: 0xfb7185,
  sky: 0x38bdf8,
  fuel: 0x22d3ee,
  asphalt: 0x293241,
  mark: 0xe2e8f0,
  grass: 0x1e3a2f,
  emerald: 0x34d399,
  amber: 0xf59e0b,
  haze: 0x475569,
} as const;

export type PaletteKey = keyof typeof PALETTE_DARK;

export interface AviationStudio {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  hemi: THREE.HemisphereLight;
  sun: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
  floor: THREE.Mesh;
  isDark: boolean;
  palette: Record<PaletteKey, number>;
  shadowCadence: number;
  getTokenColor: (key: PaletteKey) => number;
  createMaterial: (
    colorKey: PaletteKey | number,
    opts?: {
      roughness?: number;
      metalness?: number;
      opacity?: number;
      side?: THREE.Side;
      emissiveKey?: PaletteKey | number;
      emissiveIntensity?: number;
      clippingPlanes?: THREE.Plane[];
    }
  ) => THREE.MeshStandardMaterial;
  trackGeometry: <T extends THREE.BufferGeometry>(geom: T) => T;
  trackTexture: <T extends THREE.Texture>(tex: T) => T;
  trackMaterial: <T extends THREE.Material>(mat: T) => T;
  setTheme: (dark: boolean) => void;
  focusShadow: (x: number, z: number, radius?: number) => void;
  resize: (width: number, height: number) => void;
  recordFrameMs: (ms: number) => void;
  render: () => void;
  dispose: () => void;
}

export function createAviationStudio(
  canvas: HTMLCanvasElement,
  opts: { lowPower?: boolean; isDark?: boolean } = {}
): AviationStudio {
  const isDarkInit = opts.isDark ?? true;
  const palette: Record<PaletteKey, number> = {
    ...(isDarkInit ? PALETTE_DARK : PALETTE_LIGHT),
  };

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !opts.lowPower,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.5, 950);

  const hemi = new THREE.HemisphereLight(
    0xffffff,
    isDarkInit ? 0x1e293b : 0xd8d0c4,
    isDarkInit ? 1.25 : 1.75
  );
  const sun = new THREE.DirectionalLight(0xfff7ed, isDarkInit ? 1.8 : 2.25);
  sun.position.set(-16, 36, 26);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(opts.lowPower ? 1024 : 2048);
  sun.shadow.radius = opts.lowPower ? 3 : 4.5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.025;

  const fill = new THREE.DirectionalLight(0xe0e7ff, 0.45);
  fill.position.set(22, 12, -18);

  scene.add(hemi, sun, sun.target, fill);

  // Zero-HDRI procedural PMREM studio reflections
  let envRT: THREE.WebGLRenderTarget | null = null;
  try {
    const envScene = new THREE.Scene();
    const domeGeo = new THREE.SphereGeometry(12, 24, 12);
    const posAttr = domeGeo.attributes.position;
    const cols: number[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      const ny = posAttr.getY(i) / 12;
      const t = 0.5 + 0.5 * smoothstep((ny + 0.35) / 1.2);
      cols.push(t, t, t * 0.985);
    }
    domeGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const domeMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    envScene.add(dome);

    const cardGeo = new THREE.PlaneGeometry(8, 4.5);
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    [
      [-7, 7, 5],
      [8, 5, -5],
    ].forEach(([x, y, z]) => {
      const m = new THREE.Mesh(cardGeo, cardMat);
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    });

    const pmrem = new THREE.PMREMGenerator(renderer);
    envRT = pmrem.fromScene(envScene, 0.03);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.42;
    pmrem.dispose();
    domeGeo.dispose();
    domeMat.dispose();
    cardGeo.dispose();
    cardMat.dispose();
  } catch {
    // Non-fatal fallback if headless software GL skips PMREM
  }

  // Transparent shadow-catcher floor blended onto dot-grid page
  const floorGeo = new THREE.PlaneGeometry(4000, 4000);
  const floorMat = new THREE.ShadowMaterial({
    opacity: isDarkInit ? 0.5 : 0.28,
    color: isDarkInit ? 0x020617 : 0x1e293b,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -4,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.renderOrder = -1;
  scene.add(floor);

  const boundStdMats: Array<{
    mat: THREE.MeshStandardMaterial;
    colorKey?: PaletteKey;
    emissiveKey?: PaletteKey;
  }> = [];
  const trackedGeoms = new Set<THREE.BufferGeometry>([floorGeo]);
  const trackedMats = new Set<THREE.Material>([floorMat]);
  const trackedTexs = new Set<THREE.Texture>();

  const maxDpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2);
  const dprTiers = [maxDpr, Math.max(1, maxDpr * 0.8), Math.max(1, maxDpr * 0.66), 1];
  let dprTierIdx = 0;
  let emaFrameMs = 16;
  let overBudgetMs = 0;
  let curW = 1;
  let curH = 1;

  const studio: AviationStudio = {
    renderer,
    scene,
    camera,
    hemi,
    sun,
    fill,
    floor,
    isDark: isDarkInit,
    palette,
    shadowCadence: opts.lowPower ? 2 : 1,
    getTokenColor(key) {
      return palette[key];
    },
    createMaterial(colorKey, mOpts = {}) {
      const isToken = typeof colorKey === 'string';
      const hex = isToken ? palette[colorKey] : colorKey;
      const emIsToken = typeof mOpts.emissiveKey === 'string';
      const emHex =
        mOpts.emissiveKey !== undefined
          ? emIsToken
            ? palette[mOpts.emissiveKey as PaletteKey]
            : (mOpts.emissiveKey as number)
          : 0x000000;

      const mat = new THREE.MeshStandardMaterial({
        color: hex,
        roughness: mOpts.roughness ?? 0.56,
        metalness: mOpts.metalness ?? 0.08,
        transparent: mOpts.opacity !== undefined && mOpts.opacity < 1,
        opacity: mOpts.opacity ?? 1,
        side: mOpts.side ?? THREE.FrontSide,
        depthWrite: mOpts.opacity === undefined || mOpts.opacity > 0.75,
        emissive: emHex,
        emissiveIntensity: mOpts.emissiveIntensity ?? 0,
      });
      if (mOpts.clippingPlanes) {
        mat.clippingPlanes = mOpts.clippingPlanes;
        mat.clipShadows = true;
      }
      if (isToken || emIsToken) {
        boundStdMats.push({
          mat,
          colorKey: isToken ? colorKey : undefined,
          emissiveKey: emIsToken ? (mOpts.emissiveKey as PaletteKey) : undefined,
        });
      }
      trackedMats.add(mat);
      return mat;
    },
    trackGeometry<T extends THREE.BufferGeometry>(geom: T) {
      trackedGeoms.add(geom);
      return geom;
    },
    trackTexture<T extends THREE.Texture>(tex: T) {
      trackedTexs.add(tex);
      return tex;
    },
    trackMaterial<T extends THREE.Material>(mat: T) {
      trackedMats.add(mat);
      return mat;
    },
    setTheme(dark: boolean) {
      studio.isDark = dark;
      Object.assign(palette, dark ? PALETTE_DARK : PALETTE_LIGHT);
      boundStdMats.forEach(({ mat, colorKey, emissiveKey }) => {
        if (colorKey) mat.color.setHex(palette[colorKey]);
        if (emissiveKey) mat.emissive.setHex(palette[emissiveKey]);
      });
      floorMat.opacity = dark ? 0.5 : 0.28;
      floorMat.color.setHex(dark ? 0x020617 : 0x1e293b);
      hemi.groundColor.setHex(dark ? 0x1e293b : 0xd8d0c4);
      hemi.intensity = dark ? 1.25 : 1.75;
      sun.intensity = dark ? 1.8 : 2.25;
      renderer.shadowMap.needsUpdate = true;
    },
    focusShadow(x: number, z: number, radius = 32) {
      const sc = sun.shadow.camera;
      const far = radius * 3 + 60;
      if (sc.right !== radius || sc.far !== far) {
        sc.left = -radius;
        sc.bottom = -radius;
        sc.right = radius;
        sc.top = radius;
        sc.near = 1;
        sc.far = far;
        sc.updateProjectionMatrix();
      }
      sun.target.position.set(x, 0, z);
      sun.position.set(x - (16 * radius) / 32, 36 * Math.max(1, radius / 32), z + (26 * radius) / 32);
      renderer.shadowMap.needsUpdate = true;
    },
    resize(width: number, height: number) {
      const w = Math.max(1, Math.round(width));
      const h = Math.max(1, Math.round(height));
      if (w === curW && h === curH) return;
      curW = w;
      curH = h;
      renderer.setPixelRatio(dprTiers[Math.min(dprTierIdx, dprTiers.length - 1)]);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    recordFrameMs(ms: number) {
      if (ms > 1000) return;
      const sample = Math.min(ms, 120);
      emaFrameMs += (sample - emaFrameMs) * 0.08;
      overBudgetMs = emaFrameMs > 25 ? overBudgetMs + sample : Math.max(0, overBudgetMs - sample);
      if (overBudgetMs < 2000) return;
      overBudgetMs = 0;
      emaFrameMs = 16;
      if (dprTierIdx < dprTiers.length - 1) {
        dprTierIdx++;
        renderer.setPixelRatio(dprTiers[dprTierIdx]);
        renderer.setSize(curW, curH, false);
      } else if (studio.shadowCadence < 4) {
        studio.shadowCadence++;
      } else if (sun.shadow.mapSize.x > 512) {
        sun.shadow.mapSize.set(512, 512);
        sun.shadow.map?.dispose();
        sun.shadow.map = null;
      }
    },
    render() {
      renderer.render(scene, camera);
    },
    dispose() {
      envRT?.dispose();
      trackedGeoms.forEach((g) => g.dispose());
      trackedMats.forEach((m) => m.dispose());
      trackedTexs.forEach((t) => t.dispose());
      trackedGeoms.clear();
      trackedMats.clear();
      trackedTexs.clear();
      renderer.dispose();
    },
  };

  return studio;
}

export interface A320RigState {
  gear?: number; // 0 retracted .. 1 down
  flapDeg?: number; // 0 .. 35 deg
  bend?: number; // -0.5 .. 2.5 G wing flex
  fanSpeed?: number; // rad/sec multiplier
  cut?: number; // 0 closed .. 1 longitudinal half-cutaway
  cargoRatio?: number; // 0 .. 1 fill inside fwd/aft holds
  fuelRatio?: number; // 0 .. 1 fill in center wing tank
}

export interface A320Rig {
  root: THREE.Group;
  setState: (state: A320RigState) => void;
  tick: (dt: number, elapsed: number) => void;
  reclip: () => void;
  anchors: {
    nose: THREE.Object3D;
    cg: THREE.Object3D;
    wingTipL: THREE.Object3D;
    wingTipR: THREE.Object3D;
    engineL: THREE.Object3D;
    tail: THREE.Object3D;
    gearMain: THREE.Object3D;
    cargoFwd: THREE.Object3D;
    cargoAft: THREE.Object3D;
    fuelTank: THREE.Object3D;
  };
}

function attachWingFlexShader(
  mat: THREE.MeshStandardMaterial,
  bendUniform: { value: number }
): THREE.MeshStandardMaterial {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uBend = bendUniform;
    shader.vertexShader =
      'uniform float uBend;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float wingSpan = max(abs(transformed.z) - 0.9, 0.0);
        transformed.y += uBend * wingSpan * wingSpan;`
      );
  };
  mat.customProgramCacheKey = () => 'a320-wing-flex';
  return mat;
}

function createAirfoilExtrude(chord: number, thickness: number, span: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(chord * 0.12, thickness * 0.95, chord * 0.45, thickness * 0.85, chord, 0.01);
  s.bezierCurveTo(chord * 0.55, -thickness * 0.35, chord * 0.14, -thickness * 0.42, 0, 0);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: span,
    bevelEnabled: false,
    curveSegments: 10,
  });
  return geo;
}

function createBeaconTexture(studio: AviationStudio, hexColor: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.22, hexColor);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return studio.trackTexture(tex);
}

/**
 * Parametric Airbus A320-200 articulated rig.
 * Coordinate frame: aircraft faces -X (nose at -8.8, tail at +9.6), +Y up, +Z right wing / -Z left wing.
 */
export function createA320Rig(
  studio: AviationStudio,
  opts: { ghost?: boolean; opacity?: number; tint?: PaletteKey } = {}
): A320Rig {
  const isGhost = !!opts.ghost;
  const ghostOp = opts.opacity ?? 0.28;
  const root = new THREE.Group();
  const bendUniform = { value: 0 };
  const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1000);
  const clipPlanes = isGhost ? undefined : [clipPlane];

  const mkMat = (
    key: PaletteKey,
    mOpts: { roughness?: number; metalness?: number; side?: THREE.Side; bendable?: boolean } = {}
  ) => {
    const m = studio.createMaterial(key, {
      roughness: mOpts.roughness ?? 0.42,
      metalness: mOpts.metalness ?? 0.12,
      opacity: isGhost ? ghostOp : undefined,
      side: mOpts.side ?? THREE.FrontSide,
      clippingPlanes: clipPlanes,
    });
    return mOpts.bendable ? attachWingFlexShader(m, bendUniform) : m;
  };

  const bodyMat = mkMat(opts.tint ?? 'white', { roughness: 0.38 });
  const innerMat = mkMat('shade', { roughness: 0.8, side: THREE.BackSide });
  const wingMat = mkMat(opts.tint ?? 'white', { roughness: 0.42, bendable: true });
  const trimMat = mkMat('shade', { roughness: 0.55 });
  const glassMat = mkMat('glass', { roughness: 0.15, metalness: 0.65 });
  const metalMat = mkMat('metal', { roughness: 0.28, metalness: 0.72, bendable: true });
  const tyreMat = mkMat('tyre', { roughness: 0.88, metalness: 0.02 });
  const fuelMat = studio.createMaterial('fuel', { opacity: 0.82 });
  const cargoFwdMat = studio.createMaterial('gold', { roughness: 0.5 });
  const cargoAftMat = studio.createMaterial('teal', { roughness: 0.5 });

  // 1. Fuselage via LatheGeometry (aligned along X axis: nose -8.8, tail +9.6)
  const fuseProfile = [
    new THREE.Vector2(0.01, -9.1),
    new THREE.Vector2(0.28, -8.85),
    new THREE.Vector2(0.62, -8.3),
    new THREE.Vector2(0.92, -7.2),
    new THREE.Vector2(1.06, -5.6),
    new THREE.Vector2(1.06, 3.6),
    new THREE.Vector2(0.92, 5.8),
    new THREE.Vector2(0.62, 7.8),
    new THREE.Vector2(0.22, 9.4),
    new THREE.Vector2(0.09, 9.75),
    new THREE.Vector2(0.01, 9.8),
  ];
  const fuseGeo = studio.trackGeometry(new THREE.LatheGeometry(fuseProfile, 28));
  fuseGeo.rotateZ(-Math.PI / 2);
  const fuselage = new THREE.Mesh(fuseGeo, bodyMat);
  fuselage.position.y = 2.05;
  fuselage.castShadow = !isGhost;
  fuselage.receiveShadow = !isGhost;
  root.add(fuselage);

  if (!isGhost) {
    const innerHull = new THREE.Mesh(fuseGeo, innerMat);
    innerHull.position.y = 2.05;
    root.add(innerHull);
  }

  // Interior Cabin Floor, Center Fuel Tank & Cargo Holds (visible during cutaway)
  const cabinFloorGeo = studio.trackGeometry(new THREE.BoxGeometry(12.2, 0.08, 1.78));
  const cabinFloor = new THREE.Mesh(cabinFloorGeo, trimMat);
  cabinFloor.position.set(-0.9, 1.98, 0);
  root.add(cabinFloor);

  const fuelTankGeo = studio.trackGeometry(new THREE.BoxGeometry(2.4, 0.42, 1.7));
  const fuelTank = new THREE.Mesh(fuelTankGeo, fuelMat);
  fuelTank.position.set(-0.2, 1.56, 0);
  root.add(fuelTank);

  const cargoHoldGeo = studio.trackGeometry(new THREE.BoxGeometry(3.2, 0.48, 1.35));
  const cargoFwd = new THREE.Mesh(cargoHoldGeo, cargoFwdMat);
  cargoFwd.position.set(-4.0, 1.55, 0);
  root.add(cargoFwd);

  const cargoAft = new THREE.Mesh(cargoHoldGeo, cargoAftMat);
  cargoAft.position.set(2.9, 1.55, 0);
  root.add(cargoAft);

  // Cockpit Windshield Wrap
  const windshieldGeo = studio.trackGeometry(
    new THREE.CylinderGeometry(0.95, 1.03, 1.05, 18, 1, false, -0.82, 1.64)
  );
  windshieldGeo.rotateZ(-Math.PI / 2);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(-7.35, 2.2, 0);
  windshield.rotation.z = 0.22;
  root.add(windshield);

  // Tailcone vertical fin + horizontal stabilizers
  const vFinShape = new THREE.Shape();
  vFinShape.moveTo(0, 0);
  vFinShape.lineTo(2.9, 0);
  vFinShape.lineTo(3.55, 3.15);
  vFinShape.lineTo(2.45, 3.15);
  vFinShape.lineTo(0.45, 0.7);
  vFinShape.closePath();
  const vFinGeo = studio.trackGeometry(
    new THREE.ExtrudeGeometry(vFinShape, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 2 })
  );
  vFinGeo.translate(0, 0, -0.07);
  const vFin = new THREE.Mesh(vFinGeo, bodyMat);
  vFin.position.set(6.0, 2.65, 0);
  vFin.castShadow = !isGhost;
  root.add(vFin);

  const mkHStab = (sign: 1 | -1) => {
    const g = studio.trackGeometry(createAirfoilExtrude(1.45, 0.12, 3.3));
    const m = new THREE.Mesh(g, bodyMat);
    if (sign < 0) g.scale(1, 1, -1);
    m.position.set(7.2, 2.45, sign * 0.25);
    m.rotation.y = sign * -0.45;
    m.rotation.x = sign * 0.07;
    m.castShadow = !isGhost;
    return m;
  };
  root.add(mkHStab(1), mkHStab(-1));

  // Main Swept Wings + Sharklets + Hinged Flaps + Underwing CFM56 Nacelles
  const wingBuild = (sign: 1 | -1) => {
    const wingGrp = new THREE.Group();
    const span = 8.4;

    // Tapered swept wing loft via Box/Shape transform with airfoil cross-section
    const wShape = new THREE.Shape();
    wShape.moveTo(0, 0);
    wShape.lineTo(2.4, 0.36);
    wShape.lineTo(1.1, 0.14);
    wShape.lineTo(0, 0);

    const wGeo = studio.trackGeometry(createAirfoilExtrude(2.55, 0.24, span));
    // Taper and sweep vertices directly in local coordinates so bend shader applies cleanly
    const pos = wGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const zRaw = pos.getZ(i); // 0 .. span
      const frac = clamp(zRaw / span, 0, 1);
      const chordScale = lerp(1.0, 0.36, frac);
      const sweepX = frac * 2.95;
      const dihedralY = frac * 0.44;
      const xNew = pos.getX(i) * chordScale + sweepX;
      const yNew = pos.getY(i) * chordScale + dihedralY;
      const zNew = sign * (0.9 + zRaw);
      pos.setXYZ(i, xNew, yNew, zNew);
    }
    wGeo.computeVertexNormals();

    const wingMesh = new THREE.Mesh(wGeo, wingMat);
    wingMesh.position.set(-1.35, 1.52, 0);
    wingMesh.castShadow = !isGhost;
    wingMesh.receiveShadow = !isGhost;
    wingGrp.add(wingMesh);

    // Wingtip Sharklet
    const sharkGeo = studio.trackGeometry(new THREE.BoxGeometry(0.62, 0.92, 0.08));
    const shark = new THREE.Mesh(sharkGeo, wingMat);
    shark.position.set(1.9, 2.38, sign * (0.9 + span));
    shark.rotation.z = -0.35;
    shark.rotation.x = sign * 0.28;
    shark.castShadow = !isGhost;
    wingGrp.add(shark);

    // Trailing-edge Flap (hinged around spanwise axis)
    const flapPivot = new THREE.Group();
    flapPivot.position.set(1.15, 1.56, sign * 2.65);
    const flapGeo = studio.trackGeometry(new THREE.BoxGeometry(0.55, 0.09, 3.6));
    const flapMesh = new THREE.Mesh(flapGeo, trimMat);
    flapMesh.position.set(0.24, 0, 0);
    flapMesh.rotation.y = sign * -0.24;
    flapPivot.add(flapMesh);
    wingGrp.add(flapPivot);

    // Underwing Turbofan Nacelle + Pylon + 18-blade Spinning Fan
    const engX = -1.65;
    const engY = 1.04;
    const engZ = sign * 3.15;

    const pylonGeo = studio.trackGeometry(new THREE.BoxGeometry(1.5, 0.55, 0.16));
    const pylon = new THREE.Mesh(pylonGeo, trimMat);
    pylon.position.set(engX + 0.55, engY + 0.48, engZ);
    wingGrp.add(pylon);

    const cowlGeo = studio.trackGeometry(new THREE.CylinderGeometry(0.56, 0.5, 2.1, 24, 1, true));
    cowlGeo.rotateZ(Math.PI / 2);
    const cowl = new THREE.Mesh(cowlGeo, wingMat);
    cowl.position.set(engX, engY, engZ);
    cowl.castShadow = !isGhost;
    wingGrp.add(cowl);

    const lipGeo = studio.trackGeometry(new THREE.TorusGeometry(0.54, 0.065, 12, 24));
    lipGeo.rotateY(Math.PI / 2);
    const lip = new THREE.Mesh(lipGeo, metalMat);
    lip.position.set(engX - 1.03, engY, engZ);
    wingGrp.add(lip);

    const exhaustGeo = studio.trackGeometry(new THREE.ConeGeometry(0.32, 0.85, 18));
    exhaustGeo.rotateZ(-Math.PI / 2);
    const exhaust = new THREE.Mesh(exhaustGeo, metalMat);
    exhaust.position.set(engX + 1.25, engY, engZ);
    wingGrp.add(exhaust);

    // Spinning Fan Assembly
    const fanGrp = new THREE.Group();
    fanGrp.position.set(engX - 0.85, engY, engZ);
    const spinnerGeo = studio.trackGeometry(new THREE.ConeGeometry(0.16, 0.42, 16));
    spinnerGeo.rotateZ(Math.PI / 2);
    const spinner = new THREE.Mesh(spinnerGeo, glassMat);
    spinner.position.x = -0.15;
    fanGrp.add(spinner);

    const bladeGeo = studio.trackGeometry(new THREE.BoxGeometry(0.05, 0.34, 0.08));
    for (let b = 0; b < 14; b++) {
      const ang = (b / 14) * Math.PI * 2;
      const blade = new THREE.Mesh(bladeGeo, metalMat);
      blade.position.set(0, Math.cos(ang) * 0.28, Math.sin(ang) * 0.28);
      blade.rotation.x = ang;
      blade.rotation.y = 0.45;
      fanGrp.add(blade);
    }
    wingGrp.add(fanGrp);

    return { wingGrp, flapPivot, fanGrp };
  };

  const rightWing = wingBuild(1);
  const leftWing = wingBuild(-1);
  root.add(rightWing.wingGrp, leftWing.wingGrp);

  // Landing Gear Assemblies (Nose + Left Main + Right Main)
  const makeWheel = (r: number, w: number) => {
    const g = studio.trackGeometry(new THREE.CylinderGeometry(r, r, w, 18));
    g.rotateX(Math.PI / 2);
    const m = new THREE.Mesh(g, tyreMat);
    m.castShadow = !isGhost;
    return m;
  };

  const gearN = new THREE.Group();
  gearN.position.set(-6.4, 1.15, 0);
  const nStrutGeo = studio.trackGeometry(new THREE.CylinderGeometry(0.08, 0.07, 1.05, 10));
  const nStrut = new THREE.Mesh(nStrutGeo, metalMat);
  nStrut.position.y = -0.45;
  const nW1 = makeWheel(0.24, 0.14);
  nW1.position.set(0, -0.95, 0.13);
  const nW2 = makeWheel(0.24, 0.14);
  nW2.position.set(0, -0.95, -0.13);
  gearN.add(nStrut, nW1, nW2);
  root.add(gearN);

  const makeMainGear = (sign: 1 | -1) => {
    const g = new THREE.Group();
    g.position.set(-0.05, 1.48, sign * 1.9);
    const sGeo = studio.trackGeometry(new THREE.CylinderGeometry(0.11, 0.09, 1.25, 12));
    const strut = new THREE.Mesh(sGeo, metalMat);
    strut.position.y = -0.58;
    const w1 = makeWheel(0.35, 0.18);
    w1.position.set(0, -1.14, 0.19);
    const w2 = makeWheel(0.35, 0.18);
    w2.position.set(0, -1.14, -0.19);
    g.add(strut, w1, w2);
    return g;
  };
  const gearL = makeMainGear(-1);
  const gearR = makeMainGear(1);
  root.add(gearL, gearR);

  // Navigation Lights & Red Anti-Collision Beacons (non-ghost only)
  let beaconTopMat: THREE.SpriteMaterial | null = null;
  let beaconBellyMat: THREE.SpriteMaterial | null = null;
  let navLMat: THREE.SpriteMaterial | null = null;
  let navRMat: THREE.SpriteMaterial | null = null;

  if (!isGhost) {
    const redTex = createBeaconTexture(studio, '#ff2e4c');
    const greenTex = createBeaconTexture(studio, '#10b981');
    beaconTopMat = studio.trackMaterial(
      new THREE.SpriteMaterial({ map: redTex, transparent: true, depthWrite: false })
    );
    beaconBellyMat = studio.trackMaterial(
      new THREE.SpriteMaterial({ map: redTex, transparent: true, depthWrite: false })
    );
    navLMat = studio.trackMaterial(
      new THREE.SpriteMaterial({ map: redTex, transparent: true, depthWrite: false })
    );
    navRMat = studio.trackMaterial(
      new THREE.SpriteMaterial({ map: greenTex, transparent: true, depthWrite: false })
    );

    const mkSprite = (mat: THREE.SpriteMaterial, x: number, y: number, z: number, scale: number) => {
      const sp = new THREE.Sprite(mat);
      sp.position.set(x, y, z);
      sp.scale.setScalar(scale);
      root.add(sp);
    };
    mkSprite(beaconTopMat, -0.8, 3.16, 0, 1.15);
    mkSprite(beaconBellyMat, -0.4, 0.96, 0, 0.85);
    mkSprite(navLMat, 1.8, 2.02, -9.35, 0.95);
    mkSprite(navRMat, 1.8, 2.02, 9.35, 0.95);
  }

  // Named 3D anchor objects for leader callouts
  const mkAnchor = (x: number, y: number, z: number) => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    root.add(o);
    return o;
  };

  const anchors = {
    nose: mkAnchor(-8.9, 2.1, 0),
    cg: mkAnchor(-0.4, 2.1, 0),
    wingTipL: mkAnchor(1.9, 2.2, -9.3),
    wingTipR: mkAnchor(1.9, 2.2, 9.3),
    engineL: mkAnchor(-1.65, 1.05, -3.15),
    tail: mkAnchor(8.5, 5.1, 0),
    gearMain: mkAnchor(-0.05, 0.35, 1.9),
    cargoFwd: mkAnchor(-4.0, 1.55, 0),
    cargoAft: mkAnchor(2.9, 1.55, 0),
    fuelTank: mkAnchor(-0.2, 1.56, 0),
  };

  let curFanSpeed = 2.8;
  let curCut = 0;

  const reclip = () => {
    if (isGhost) return;
    if (curCut <= 0.01) {
      clipPlane.normal.set(0, 0, -1);
      clipPlane.constant = 1000;
      return;
    }
    root.updateWorldMatrix(true, false);
    clipPlane.normal.set(0, 0, -1);
    clipPlane.constant = lerp(3.0, 0.0, clamp(curCut, 0, 1));
    clipPlane.applyMatrix4(root.matrixWorld);
  };

  const setState = (st: A320RigState) => {
    if (st.gear !== undefined) {
      const retract = 1 - clamp(st.gear, 0, 1);
      gearN.rotation.z = -retract * 1.6;
      gearL.rotation.x = -retract * 1.45;
      gearR.rotation.x = retract * 1.45;
      const show = retract < 0.96;
      gearN.visible = gearL.visible = gearR.visible = show;
    }
    if (st.flapDeg !== undefined) {
      const rad = clamp(st.flapDeg, 0, 40) * D2R;
      rightWing.flapPivot.rotation.z = -rad;
      leftWing.flapPivot.rotation.z = -rad;
    }
    if (st.bend !== undefined) {
      bendUniform.value = st.bend * 0.0065;
    }
    if (st.fanSpeed !== undefined) {
      curFanSpeed = st.fanSpeed;
    }
    if (st.cargoRatio !== undefined) {
      const c = clamp(st.cargoRatio, 0, 1);
      cargoFwd.visible = cargoAft.visible = c > 0.02;
      cargoFwd.scale.set(1, Math.max(0.05, c), 1);
      cargoAft.scale.set(1, Math.max(0.05, c), 1);
    }
    if (st.fuelRatio !== undefined) {
      const f = clamp(st.fuelRatio, 0, 1);
      fuelTank.visible = f > 0.02;
      fuelTank.scale.set(1, Math.max(0.05, f), 1);
    }
    if (st.cut !== undefined) {
      curCut = st.cut;
      reclip();
    }
  };

  const tick = (dt: number, elapsed: number) => {
    const spin = (curFanSpeed || 1.2) * dt * 3.5;
    rightWing.fanGrp.rotation.x -= spin;
    leftWing.fanGrp.rotation.x += spin;

    if (!isGhost && beaconTopMat && beaconBellyMat && navLMat && navRMat) {
      const cycle = elapsed % 1.3;
      const pulse =
        Math.exp(-cycle * 9) + (cycle > 0.28 ? Math.exp(-(cycle - 0.28) * 9) * 0.85 : 0);
      const op = clamp(pulse, 0, 1);
      beaconTopMat.opacity = op;
      beaconBellyMat.opacity = op;
      navLMat.opacity = 0.78 + 0.22 * Math.sin(elapsed * 2.4);
      navRMat.opacity = 0.78 + 0.22 * Math.sin(elapsed * 2.4 + 1.4);
    }
  };

  // Default: gear down, subtle 1G wing flex, closed skin, fuel & partial cargo ready
  setState({ gear: 1, flapDeg: 0, bend: 0.4, cut: 0, cargoRatio: 0.75, fuelRatio: 0.8 });

  return { root, setState, tick, reclip, anchors };
}

export interface ForceArrowHandle {
  group: THREE.Group;
  setVector: (origin: THREE.Vector3, vec: THREE.Vector3) => void;
}

export function createForceArrow(
  studio: AviationStudio,
  colorKey: PaletteKey,
  radius = 0.14
): ForceArrowHandle {
  const mat = studio.createMaterial(colorKey, { roughness: 0.35, metalness: 0.15 });
  const shaftGeo = studio.trackGeometry(new THREE.CylinderGeometry(radius, radius, 1, 16));
  const headGeo = studio.trackGeometry(new THREE.ConeGeometry(radius * 2.6, radius * 5.6, 20));
  const shaft = new THREE.Mesh(shaftGeo, mat);
  const head = new THREE.Mesh(headGeo, mat);
  const group = new THREE.Group();
  group.add(shaft, head);

  const up = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();

  return {
    group,
    setVector(origin, vec) {
      const len = vec.length();
      group.visible = len > 0.04;
      if (!group.visible) return;
      group.position.copy(origin);
      dir.copy(vec).normalize();
      group.quaternion.setFromUnitVectors(up, dir);
      const headLen = Math.min(radius * 5.6, len * 0.5);
      const shaftLen = Math.max(0.01, len - headLen);
      shaft.scale.y = shaftLen;
      shaft.position.y = shaftLen / 2;
      head.scale.y = headLen / (radius * 5.6);
      head.position.y = shaftLen + headLen / 2;
    },
  };
}

export interface StreamlinesHandle {
  mesh: THREE.InstancedMesh;
  tick: (elapsed: number, speed: number, aoaDeg: number, criticalAoA?: number) => void;
}

export function createAirflowStreamlines(
  studio: AviationStudio,
  opts: { count?: number; spanZ?: number; lengthX?: number } = {}
): StreamlinesHandle {
  const count = opts.count ?? 48;
  const spanZ = opts.spanZ ?? 18;
  const lengthX = opts.lengthX ?? 22;

  const cylGeo = studio.trackGeometry(new THREE.CylinderGeometry(0.045, 0.045, 1, 6));
  cylGeo.rotateZ(Math.PI / 2);
  const mat = studio.trackMaterial(
    new THREE.MeshBasicMaterial({
      color: studio.getTokenColor('sky'),
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    })
  );
  const mesh = new THREE.InstancedMesh(cylGeo, mat, count);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;

  const particles = Array.from({ length: count }, (_, i) => ({
    phase: (i / count + Math.random() * 0.15) % 1,
    yOff: -1.5 + Math.random() * 4.5,
    zOff: ((i % 12) / 11 - 0.5) * spanZ,
    len: 1.4 + Math.random() * 1.4,
    wobbleSeed: Math.random() * Math.PI * 2,
  }));

  const dummy = new THREE.Object3D();

  return {
    mesh,
    tick(elapsed, speed, aoaDeg, criticalAoA = 15) {
      const stalled = aoaDeg >= criticalAoA;
      mat.color.setHex(studio.getTokenColor(stalled ? 'red' : 'sky'));
      const flowVel = clamp(speed / 28, 3, 22);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const xNorm = (p.phase + (elapsed * flowVel) / lengthX) % 1;
        const x = lerp(-lengthX / 2, lengthX / 2, xNorm);

        // Downwash deflection behind wing + turbulent curling when stalled
        const wakeMask = smoothstep((x + 1) / 5);
        const downwashY = -wakeMask * clamp(aoaDeg / 18, -0.3, 1.2) * 1.1;
        const stallJitterY = stalled
          ? wakeMask * Math.sin(elapsed * 14 + p.wobbleSeed + x * 0.9) * 0.85
          : 0;

        dummy.position.set(x, 1.7 + p.yOff + downwashY + stallJitterY, p.zOff);
        dummy.rotation.set(
          0,
          0,
          stalled ? wakeMask * Math.cos(elapsed * 12 + p.wobbleSeed) * 0.55 : -wakeMask * 0.08
        );
        dummy.scale.set(p.len, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

export function createCloudDeck(
  studio: AviationStudio,
  opts: { count?: number; xMin?: number; xMax?: number; yMin?: number; yMax?: number; zSpan?: number } = {}
) {
  const count = opts.count ?? 8;
  const xMin = opts.xMin ?? -42;
  const xMax = opts.xMax ?? 42;
  const span = xMax - xMin;
  const yMin = opts.yMin ?? 4;
  const yMax = opts.yMax ?? 10;
  const zSpan = opts.zSpan ?? 26;

  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  for (let i = 0; i < 20; i++) {
    const cx = 42 + Math.random() * 172;
    const cy = 64 + (Math.random() - 0.5) * 38;
    const r = 16 + Math.random() * 26;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grd.addColorStop(0, 'rgba(255,255,255,0.28)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  const tex = studio.trackTexture(new THREE.CanvasTexture(c));
  tex.colorSpace = THREE.SRGBColorSpace;

  const mat = studio.trackMaterial(
    new THREE.SpriteMaterial({
      map: tex,
      color: studio.getTokenColor('haze'),
      transparent: true,
      depthWrite: false,
      opacity: 0.45,
    })
  );

  const group = new THREE.Group();
  const clouds = Array.from({ length: count }, (_, i) => {
    const sp = new THREE.Sprite(mat);
    const sz = 4.5 + Math.random() * 4.5;
    sp.position.set(0, lerp(yMin, yMax, Math.random()), (Math.random() - 0.5) * zSpan * 2);
    group.add(sp);
    return { sp, phase: i / count, sz };
  });

  return {
    group,
    tick(elapsed: number, speed = 2.4) {
      mat.color.setHex(studio.getTokenColor('haze'));
      clouds.forEach((cl) => {
        const x = ((cl.phase * span + elapsed * speed) % span + span) % span;
        const fade = smoothstep(Math.min(x, span - x) / (span * 0.14));
        cl.sp.position.x = xMin + x;
        cl.sp.scale.set(cl.sz * 2.1 * fade + 0.01, cl.sz * fade + 0.01, 1);
      });
    },
  };
}

export function createGroundText(
  studio: AviationStudio,
  text: string,
  heightWorld = 1.6,
  opts: { color?: string; mono?: boolean; opacity?: number } = {}
): THREE.Mesh {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  const font = `${opts.mono ? '700' : '800'} 72px ${
    opts.mono ? "'JetBrains Mono', monospace" : "'Archivo', sans-serif"
  }`;
  ctx.font = font;
  const w = Math.max(64, Math.ceil(ctx.measureText(text).width) + 32);
  c.width = w;
  c.height = 96;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = opts.color ?? '#f8fafc';
  ctx.fillText(text, w / 2, 48);

  const tex = studio.trackTexture(new THREE.CanvasTexture(c));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const geo = studio.trackGeometry(new THREE.PlaneGeometry(1, 1));
  const mat = studio.trackMaterial(
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: opts.opacity ?? 0.9,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.scale.set((heightWorld * w) / 96, heightWorld, 1);
  mesh.renderOrder = 2;
  return mesh;
}

export interface RunwayRigHandle {
  group: THREE.Group;
  setConfig: (cfg: {
    showStopway?: boolean;
    showClearway?: boolean;
    wet?: boolean;
    highlightDistFrac?: number;
  }) => void;
  anchors: {
    threshold: THREE.Object3D;
    toraEnd: THREE.Object3D;
    stopway: THREE.Object3D;
    clearway: THREE.Object3D;
    screenGate: THREE.Object3D;
  };
}

/**
 * Procedural Runway 27L Strip with TORA pavement, threshold piano keys,
 * Stopway yellow chevrons, Clearway obstacle-free plane, and 35 ft Screen Gate.
 * Runs along X axis: +X threshold (+32) to -X liftoff end (-58).
 */
export function createRunwayRig(studio: AviationStudio): RunwayRigHandle {
  const group = new THREE.Group();

  const asphaltMat = studio.createMaterial('asphalt', { roughness: 0.78, metalness: 0.05 });
  const markMat = studio.createMaterial('mark', { roughness: 0.55 });
  const amberMat = studio.createMaterial('amber', { roughness: 0.5 });
  const clearwayMat = studio.createMaterial('emerald', { opacity: 0.22, side: THREE.DoubleSide });
  const screenMat = studio.createMaterial('teal', { opacity: 0.26, side: THREE.DoubleSide });
  const barMat = studio.createMaterial('mag', { opacity: 0.88 });

  // Main TORA Pavement (length 90 units, width 14 units, x from -50 to +40)
  const rwyGeo = studio.trackGeometry(new THREE.BoxGeometry(90, 0.14, 14));
  const rwy = new THREE.Mesh(rwyGeo, asphaltMat);
  rwy.position.set(-5, 0.02, 0);
  rwy.receiveShadow = true;
  group.add(rwy);

  // Threshold Piano Keys (+37)
  const keyGeo = studio.trackGeometry(new THREE.PlaneGeometry(3.4, 0.72));
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    const key = new THREE.Mesh(keyGeo, markMat);
    key.rotation.x = -Math.PI / 2;
    key.position.set(37.2, 0.1, i * 1.55);
    group.add(key);
  }

  // Runway 27L Designator
  const rwyNum = createGroundText(studio, '27L', 3.4, { color: '#f8fafc', mono: true });
  rwyNum.position.set(31.5, 0.11, 0);
  rwyNum.rotation.z = Math.PI / 2;
  group.add(rwyNum);

  // Centerline Dashes
  const dashGeo = studio.trackGeometry(new THREE.PlaneGeometry(3.8, 0.34));
  for (let x = 25; x >= -48; x -= 7.5) {
    const dash = new THREE.Mesh(dashGeo, markMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(x, 0.1, 0);
    group.add(dash);
  }

  // Stopway Zone (beyond DER: -50 to -64) with Amber Chevrons
  const stopwayGroup = new THREE.Group();
  const stopGeo = studio.trackGeometry(new THREE.BoxGeometry(14, 0.12, 14));
  const stopPad = new THREE.Mesh(stopGeo, asphaltMat);
  stopPad.position.set(-57, 0.01, 0);
  stopPad.receiveShadow = true;
  stopwayGroup.add(stopPad);

  const chevGeo = studio.trackGeometry(new THREE.PlaneGeometry(3.5, 0.48));
  [-53.5, -58.5, -63.0].forEach((cx) => {
    [-1, 1].forEach((side) => {
      const ch = new THREE.Mesh(chevGeo, amberMat);
      ch.rotation.x = -Math.PI / 2;
      ch.rotation.z = side * 0.65;
      ch.position.set(cx, 0.09, side * 1.6);
      stopwayGroup.add(ch);
    });
  });
  group.add(stopwayGroup);

  // Clearway Zone (-50 to -74) obstacle-free corridor
  const clearwayGroup = new THREE.Group();
  const cwGeo = studio.trackGeometry(new THREE.PlaneGeometry(24, 20));
  const cwPlane = new THREE.Mesh(cwGeo, clearwayMat);
  cwPlane.rotation.x = -Math.PI / 2;
  cwPlane.position.set(-62, 0.12, 0);
  clearwayGroup.add(cwPlane);
  group.add(clearwayGroup);

  // 35 ft Screen Height Gate at -58
  const screenGateGeo = studio.trackGeometry(new THREE.PlaneGeometry(18, 4.2));
  const screenGate = new THREE.Mesh(screenGateGeo, screenMat);
  screenGate.rotation.y = Math.PI / 2;
  screenGate.position.set(-58, 2.2, 0);
  group.add(screenGate);

  // Highlight Ground Distance Strip along shoulder
  const distBarGeo = studio.trackGeometry(new THREE.BoxGeometry(1, 0.08, 0.85));
  const distBar = new THREE.Mesh(distBarGeo, barMat);
  distBar.position.set(40, 0.11, -8.2);
  group.add(distBar);

  const mkAnchor = (x: number, y: number, z: number) => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    group.add(o);
    return o;
  };

  return {
    group,
    setConfig({ showStopway = true, showClearway = true, wet = false, highlightDistFrac = 0.72 }) {
      stopwayGroup.visible = showStopway;
      clearwayGroup.visible = showClearway;
      asphaltMat.roughness = wet ? 0.18 : 0.78;
      asphaltMat.metalness = wet ? 0.42 : 0.05;
      const clampedFrac = clamp(highlightDistFrac, 0.1, 1);
      const len = 90 * clampedFrac;
      distBar.scale.x = len;
      distBar.position.x = 40 - len / 2;
    },
    anchors: {
      threshold: mkAnchor(36, 0.4, 0),
      toraEnd: mkAnchor(-50, 0.5, 0),
      stopway: mkAnchor(-57, 0.4, 0),
      clearway: mkAnchor(-66, 0.4, 6),
      screenGate: mkAnchor(-58, 4.4, 0),
    },
  };
}
