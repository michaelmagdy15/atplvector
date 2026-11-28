import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
  runway: 'Taxiing Airbus A320 onto RWY 27L…',
  windtunnel: 'Calibrating subsonic wind tunnel…',
  irs: 'IRS [NAV] ALIGNED · HDG 270 · Over to you.',
  cloudbreak: 'BREAK OUT · VISUAL · Clear of cloud. Over to you.',
} as const;

export const PALETTE_LIGHT = {
  white: 0xf7f5f0,
  shade: 0xcbd5e1,
  grey: 0x8f98a6,
  ink: 0x1c1e26,
  glass: 0x1e293b,
  metal: 0xb5bcc4,
  tyre: 0x1e2024,
  gold: 0xf59e0b,
  mag: 0xec4899,
  teal: 0x0d9488,
  red: 0xe11d48,
  sky: 0x0284c7,
  fuel: 0x06b6d4,
  asphalt: 0x333842,
  mark: 0xf8fafc,
  grass: 0x86efac,
  emerald: 0x10b981,
  amber: 0xd97706,
  haze: 0xf8fafc,
} as const;

export const PALETTE_DARK = {
  white: 0xf8fafc,
  shade: 0x94a3b8,
  grey: 0x64748b,
  ink: 0xf1f5f9,
  glass: 0x0f172a,
  metal: 0xaab4c2,
  tyre: 0x181b20,
  gold: 0xfbbf24,
  mag: 0xf472b6,
  teal: 0x2dd4bf,
  red: 0xfb7185,
  sky: 0x38bdf8,
  fuel: 0x22d3ee,
  asphalt: 0x262d38,
  mark: 0xf1f5f9,
  grass: 0x1e3a2f,
  emerald: 0x34d399,
  amber: 0xf59e0b,
  haze: 0xe2e8f0,
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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(27, 1, 0.5, 950);

  const hemi = new THREE.HemisphereLight(
    0xffffff,
    isDarkInit ? 0x242c3d : 0xd8d0c4,
    isDarkInit ? 1.45 : 1.85
  );
  const sun = new THREE.DirectionalLight(0xfff9f0, isDarkInit ? 2.15 : 2.35);
  sun.position.set(-16, 38, 24);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(opts.lowPower ? 1024 : 2048);
  sun.shadow.radius = opts.lowPower ? 3 : 4.5;
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.022;

  const fill = new THREE.DirectionalLight(0xdbeafe, 0.62);
  fill.position.set(22, 14, -20);

  const rim = new THREE.DirectionalLight(0x93c5fd, 0.35);
  rim.position.set(16, -6, 22);

  scene.add(hemi, sun, sun.target, fill, rim);

  // Zero-HDRI procedural PMREM studio dome + dual softboxes
  let envRT: THREE.WebGLRenderTarget | null = null;
  try {
    const envScene = new THREE.Scene();
    const domeGeo = new THREE.SphereGeometry(12, 24, 12);
    const posAttr = domeGeo.attributes.position;
    const cols: number[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      const ny = posAttr.getY(i) / 12;
      const t = 0.55 + 0.45 * smoothstep((ny + 0.35) / 1.2);
      cols.push(t, t, t * 0.99);
    }
    domeGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    const domeMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    envScene.add(dome);

    const cardGeo = new THREE.PlaneGeometry(9, 5);
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    [
      [-7, 8, 5],
      [8, 6, -5],
    ].forEach(([x, y, z]) => {
      const m = new THREE.Mesh(cardGeo, cardMat);
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    });

    const pmrem = new THREE.PMREMGenerator(renderer);
    envRT = pmrem.fromScene(envScene, 0.03);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.56;
    pmrem.dispose();
    domeGeo.dispose();
    domeMat.dispose();
    cardGeo.dispose();
    cardMat.dispose();
  } catch {
    // Non-fatal fallback for software WebGL contexts
  }

  // Transparent shadow-catcher floor blended onto dot-grid page
  const floorGeo = new THREE.PlaneGeometry(4000, 4000);
  const floorMat = new THREE.ShadowMaterial({
    opacity: isDarkInit ? 0.58 : 0.25,
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
        roughness: mOpts.roughness ?? 0.5,
        metalness: mOpts.metalness ?? 0.1,
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
      floorMat.opacity = dark ? 0.58 : 0.25;
      floorMat.color.setHex(dark ? 0x020617 : 0x1e293b);
      hemi.groundColor.setHex(dark ? 0x242c3d : 0xd8d0c4);
      hemi.intensity = dark ? 1.45 : 1.85;
      sun.intensity = dark ? 2.15 : 2.35;
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
      sun.position.set(x - (16 * radius) / 32, 38 * Math.max(1, radius / 32), z + (24 * radius) / 32);
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
  ready: Promise<void>;
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

interface NormalizedA320Template {
  geometry: THREE.BufferGeometry;
  map: THREE.Texture | null;
}

let cachedA320Promise: Promise<NormalizedA320Template> | null = null;

/**
 * Loads `/models/a320-atplvector.glb` once and bakes normalization into a shared
 * BufferGeometry matching AviationKit coordinates:
 * nose at -X (-9.6), tail at +X (+9.6), wingspan along Z (-9.04..+9.04), belly at y=+0.89.
 */
function loadNormalizedA320Template(): Promise<NormalizedA320Template> {
  if (!cachedA320Promise) {
    cachedA320Promise = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        '/models/a320-atplvector.glb',
        (gltf) => {
          gltf.scene.updateMatrixWorld(true);
          let foundGeo: THREE.BufferGeometry | null = null;
          let foundMap: THREE.Texture | null = null;

          gltf.scene.traverse((obj) => {
            if (foundGeo) return;
            const mesh = obj as THREE.Mesh;
            if (mesh.isMesh && mesh.geometry) {
              const baked = mesh.geometry.clone();
              baked.applyMatrix4(mesh.matrixWorld);
              baked.computeBoundingBox();
              const bb = baked.boundingBox!;
              const sizeX = bb.max.x - bb.min.x;
              const centerX = (bb.min.x + bb.max.x) / 2;
              const centerZ = (bb.min.z + bb.max.z) / 2;
              const uniformScale = 19.2 / Math.max(0.001, sizeX);

              // Raw GLB faces +X; rotate PI around Y so nose faces -X, tail at +X, belly lifted to y=+0.89
              const normMatrix = new THREE.Matrix4()
                .makeTranslation(0, 1.73, 0)
                .multiply(new THREE.Matrix4().makeRotationY(Math.PI))
                .multiply(new THREE.Matrix4().makeScale(uniformScale, uniformScale, uniformScale))
                .multiply(new THREE.Matrix4().makeTranslation(-centerX, 0, -centerZ));

              baked.applyMatrix4(normMatrix);
              baked.computeBoundingBox();
              baked.computeBoundingSphere();

              const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
              if (mat && 'map' in mat && (mat as THREE.MeshStandardMaterial).map) {
                foundMap = (mat as THREE.MeshStandardMaterial).map!;
                foundMap.colorSpace = THREE.SRGBColorSpace;
                foundMap.anisotropy = 4;
              }
              foundGeo = baked;
            }
          });

          if (foundGeo) {
            resolve({ geometry: foundGeo, map: foundMap });
          } else {
            reject(new Error('No mesh geometry found in a320-atplvector.glb'));
          }
        },
        undefined,
        (err) => reject(err)
      );
    });
  }
  return cachedA320Promise;
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
        float wingSpan = max(abs(transformed.z) - 1.05, 0.0);
        transformed.y += uBend * wingSpan * wingSpan;`
      );
  };
  mat.customProgramCacheKey = () => 'a320-wing-flex-v2';
  return mat;
}

function createBeaconTexture(studio: AviationStudio, hexColor: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.24, hexColor);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return studio.trackTexture(tex);
}

/**
 * Airbus A320 articulated rig backed by the open-source CC BY 4.0 GLB airframe
 * (`amvlab/aircraft-models`, studio white & matte slate livery) plus GLSL wing-flex,
 * cutaway clipping plane, retractable landing gear, hinged flaps, and nav strobes.
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

  const metalMat = studio.createMaterial('metal', {
    roughness: 0.28,
    metalness: 0.72,
    opacity: isGhost ? ghostOp : undefined,
    clippingPlanes: clipPlanes,
  });
  const tyreMat = studio.createMaterial('tyre', {
    roughness: 0.88,
    metalness: 0.04,
    opacity: isGhost ? ghostOp : undefined,
    clippingPlanes: clipPlanes,
  });
  const flapMat = studio.createMaterial('shade', {
    roughness: 0.45,
    metalness: 0.14,
    opacity: isGhost ? ghostOp : undefined,
    clippingPlanes: clipPlanes,
  });
  attachWingFlexShader(flapMat, bendUniform);

  const cabinFloorMat = studio.createMaterial('shade', { roughness: 0.65 });
  const fuelMat = studio.createMaterial('fuel', { opacity: 0.85 });
  const cargoFwdMat = studio.createMaterial('gold', { roughness: 0.5 });
  const cargoAftMat = studio.createMaterial('teal', { roughness: 0.5 });

  // Cutaway interior structure (visible only when longitudinal cutaway `cut > 0.04` opens!)
  const interiorGrp = new THREE.Group();
  interiorGrp.visible = false;
  const cabinFloor = new THREE.Mesh(
    studio.trackGeometry(new THREE.BoxGeometry(11.4, 0.07, 1.55)),
    cabinFloorMat
  );
  cabinFloor.position.set(-0.7, 1.86, 0);
  const fuelTank = new THREE.Mesh(
    studio.trackGeometry(new THREE.BoxGeometry(2.3, 0.4, 1.5)),
    fuelMat
  );
  fuelTank.position.set(-0.2, 1.44, 0);
  const cargoFwd = new THREE.Mesh(
    studio.trackGeometry(new THREE.BoxGeometry(2.8, 0.44, 1.2)),
    cargoFwdMat
  );
  cargoFwd.position.set(-3.9, 1.42, 0);
  const cargoAft = new THREE.Mesh(
    studio.trackGeometry(new THREE.BoxGeometry(2.8, 0.44, 1.2)),
    cargoAftMat
  );
  cargoAft.position.set(2.8, 1.42, 0);
  interiorGrp.add(cabinFloor, fuelTank, cargoFwd, cargoAft);
  root.add(interiorGrp);

  // Subtle hinged trailing-edge flaps aligned with real swept A320 inner wing
  const makeFlap = (sign: 1 | -1) => {
    const flapPivot = new THREE.Group();
    flapPivot.position.set(1.15, 1.38, sign * 2.55);
    const flapGeo = studio.trackGeometry(new THREE.BoxGeometry(0.42, 0.06, 2.8));
    const flapMesh = new THREE.Mesh(flapGeo, flapMat);
    flapMesh.position.set(0.2, 0, 0);
    flapMesh.rotation.y = sign * -0.26;
    flapPivot.add(flapMesh);
    return flapPivot;
  };
  const flapR = makeFlap(1);
  const flapL = makeFlap(-1);
  flapR.visible = false;
  flapL.visible = false;
  root.add(flapR, flapL);

  // Articulated Nose & Main Landing Gear (tyres touch y=0 cleanly below +0.89 belly)
  const makeWheel = (r: number, w: number) => {
    const g = studio.trackGeometry(new THREE.CylinderGeometry(r, r, w, 18));
    g.rotateX(Math.PI / 2);
    const m = new THREE.Mesh(g, tyreMat);
    m.castShadow = !isGhost;
    return m;
  };

  const gearN = new THREE.Group();
  gearN.position.set(-6.5, 0.96, 0);
  const nStrut = new THREE.Mesh(
    studio.trackGeometry(new THREE.CylinderGeometry(0.06, 0.055, 0.85, 10)),
    metalMat
  );
  nStrut.position.y = -0.38;
  const nW1 = makeWheel(0.2, 0.12);
  nW1.position.set(0, -0.76, 0.12);
  const nW2 = makeWheel(0.2, 0.12);
  nW2.position.set(0, -0.76, -0.12);
  gearN.add(nStrut, nW1, nW2);
  root.add(gearN);

  const makeMainGear = (sign: 1 | -1) => {
    const g = new THREE.Group();
    g.position.set(0.15, 1.15, sign * 1.9);
    const strut = new THREE.Mesh(
      studio.trackGeometry(new THREE.CylinderGeometry(0.085, 0.075, 0.95, 12)),
      metalMat
    );
    strut.position.y = -0.45;
    const w1 = makeWheel(0.29, 0.16);
    w1.position.set(0, -0.86, 0.16);
    const w2 = makeWheel(0.29, 0.16);
    w2.position.set(0, -0.86, -0.16);
    g.add(strut, w1, w2);
    return g;
  };
  const gearL = makeMainGear(-1);
  const gearR = makeMainGear(1);
  root.add(gearL, gearR);

  // Subtle Anti-Collision Strobe & Wingtip Navigation Beacons
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
    mkSprite(beaconTopMat, -0.6, 3.16, 0, 0.72);
    mkSprite(beaconBellyMat, -0.4, 0.85, 0, 0.58);
    mkSprite(navLMat, 2.35, 2.32, -8.98, 0.62);
    mkSprite(navRMat, 2.35, 2.32, 8.98, 0.62);
  }

  // Named 3D Anchor Points synced to GLB geometry coordinates
  const mkAnchor = (x: number, y: number, z: number) => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    root.add(o);
    return o;
  };

  const anchors = {
    nose: mkAnchor(-9.5, 1.9, 0),
    cg: mkAnchor(-0.2, 2.0, 0),
    wingTipL: mkAnchor(2.35, 2.32, -8.95),
    wingTipR: mkAnchor(2.35, 2.32, 8.95),
    engineL: mkAnchor(-2.0, 0.9, -3.2),
    tail: mkAnchor(7.6, 3.8, 0),
    gearMain: mkAnchor(0.15, 0.3, 1.9),
    cargoFwd: mkAnchor(-3.9, 1.45, 0),
    cargoAft: mkAnchor(2.8, 1.45, 0),
    fuelTank: mkAnchor(-0.2, 1.44, 0),
  };

  let curCut = 0;

  // Load real open-source CC BY 4.0 Airbus A320 GLB & wire wing-flex + cutaway
  const ready = loadNormalizedA320Template()
    .then(({ geometry, map }) => {
      const airframeMat = studio.trackMaterial(
        new THREE.MeshStandardMaterial({
          color: isGhost
            ? studio.getTokenColor(opts.tint ?? 'sky')
            : 0xffffff,
          map: isGhost ? null : map,
          roughness: isGhost ? 0.5 : 0.34,
          metalness: isGhost ? 0.1 : 0.14,
          transparent: isGhost,
          opacity: isGhost ? ghostOp : 1,
          depthWrite: !isGhost,
          clippingPlanes: clipPlanes,
          clipShadows: true,
        })
      );
      attachWingFlexShader(airframeMat, bendUniform);

      const airframe = new THREE.Mesh(geometry, airframeMat);
      airframe.castShadow = !isGhost;
      airframe.receiveShadow = !isGhost;
      root.add(airframe);

      if (!isGhost) {
        const innerMat = studio.createMaterial('shade', {
          roughness: 0.85,
          metalness: 0.05,
          side: THREE.BackSide,
          clippingPlanes: clipPlanes,
        });
        const innerHull = new THREE.Mesh(geometry, innerMat);
        root.add(innerHull);
      }

      studio.renderer.shadowMap.needsUpdate = true;
    })
    .catch((err) => {
      console.warn('AviationKit A320 GLB load error:', err);
    });

  const reclip = () => {
    if (isGhost) return;
    if (curCut <= 0.02) {
      clipPlane.normal.set(0, 0, -1);
      clipPlane.constant = 1000;
      interiorGrp.visible = false;
      return;
    }
    interiorGrp.visible = true;
    root.updateWorldMatrix(true, false);
    clipPlane.normal.set(0, 0, -1);
    clipPlane.constant = lerp(2.8, 0.0, clamp(curCut, 0, 1));
    clipPlane.applyMatrix4(root.matrixWorld);
  };

  const setState = (st: A320RigState) => {
    if (st.gear !== undefined) {
      const retract = 1 - clamp(st.gear, 0, 1);
      gearN.rotation.z = -retract * 1.55;
      gearL.rotation.x = -retract * 1.45;
      gearR.rotation.x = retract * 1.45;
      const show = retract < 0.94;
      gearN.visible = gearL.visible = gearR.visible = show;
    }
    if (st.flapDeg !== undefined) {
      const deg = clamp(st.flapDeg, 0, 40);
      const rad = deg * D2R;
      flapR.rotation.z = -rad;
      flapL.rotation.z = -rad;
      flapR.visible = flapL.visible = deg > 1;
    }
    if (st.bend !== undefined) {
      bendUniform.value = st.bend * 0.0065;
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

  const tick = (_dt: number, elapsed: number) => {
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

  setState({ gear: 1, flapDeg: 0, bend: 0.35, cut: 0, cargoRatio: 0.75, fuelRatio: 0.8 });

  return { root, ready, setState, tick, reclip, anchors };
}

export interface ForceArrowHandle {
  group: THREE.Group;
  setVector: (origin: THREE.Vector3, vec: THREE.Vector3) => void;
}

export function createForceArrow(
  studio: AviationStudio,
  colorKey: PaletteKey,
  radius = 0.13
): ForceArrowHandle {
  const mat = studio.createMaterial(colorKey, {
    roughness: 0.32,
    metalness: 0.15,
    emissiveKey: colorKey,
    emissiveIntensity: 0.25,
  });
  const shaftGeo = studio.trackGeometry(new THREE.CylinderGeometry(radius, radius, 1, 16));
  const headGeo = studio.trackGeometry(new THREE.ConeGeometry(radius * 2.5, radius * 5.2, 20));
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
      const headLen = Math.min(radius * 5.2, len * 0.5);
      const shaftLen = Math.max(0.01, len - headLen);
      shaft.scale.y = shaftLen;
      shaft.position.y = shaftLen / 2;
      head.scale.y = headLen / (radius * 5.2);
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
  const count = opts.count ?? 54;
  const spanZ = opts.spanZ ?? 18;
  const lengthX = opts.lengthX ?? 24;

  const cylGeo = studio.trackGeometry(new THREE.CylinderGeometry(0.02, 0.02, 1, 6));
  cylGeo.rotateZ(Math.PI / 2);
  const mat = studio.trackMaterial(
    new THREE.MeshBasicMaterial({
      color: studio.getTokenColor('sky'),
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    })
  );
  const mesh = new THREE.InstancedMesh(cylGeo, mat, count);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;

  const particles = Array.from({ length: count }, (_, i) => ({
    phase: (i / count + Math.random() * 0.15) % 1,
    yOff: -1.4 + Math.random() * 4.2,
    zOff: ((i % 14) / 13 - 0.5) * spanZ,
    len: 1.5 + Math.random() * 1.5,
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

        const wakeMask = smoothstep((x + 1) / 5);
        const downwashY = -wakeMask * clamp(aoaDeg / 18, -0.3, 1.2) * 1.05;
        const stallJitterY = stalled
          ? wakeMask * Math.sin(elapsed * 14 + p.wobbleSeed + x * 0.9) * 0.85
          : 0;

        dummy.position.set(x, 1.85 + p.yOff + downwashY + stallJitterY, p.zOff);
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

/**
 * Dimensional cumulus cloud deck (bright white cloud tops + cool slate bases + soft ground shadow puffs).
 */
export function createCloudDeck(
  studio: AviationStudio,
  opts: { count?: number; xMin?: number; xMax?: number; yMin?: number; yMax?: number; zSpan?: number } = {}
) {
  const count = opts.count ?? 7;
  const xMin = opts.xMin ?? -44;
  const xMax = opts.xMax ?? 44;
  const span = xMax - xMin;
  const yMin = opts.yMin ?? 2.2;
  const yMax = opts.yMax ?? 7.8;
  const zSpan = opts.zSpan ?? 24;

  // Multi-lobed painterly cumulus sprite
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 144;
  const ctx = c.getContext('2d')!;
  const lobes = [
    [128, 62, 46, 'rgba(255,255,255,0.92)'],
    [86, 80, 38, 'rgba(255,255,255,0.88)'],
    [168, 78, 40, 'rgba(255,255,255,0.88)'],
    [54, 96, 28, 'rgba(241,245,249,0.78)'],
    [200, 96, 28, 'rgba(241,245,249,0.78)'],
    [126, 98, 42, 'rgba(203,213,225,0.72)'],
  ] as const;

  for (const [cx, cy, r, col] of lobes) {
    const grd = ctx.createRadialGradient(cx, cy - r * 0.15, r * 0.15, cx, cy, r);
    grd.addColorStop(0, col);
    grd.addColorStop(0.62, col);
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = studio.trackTexture(new THREE.CanvasTexture(c));
  tex.colorSpace = THREE.SRGBColorSpace;

  const mat = studio.trackMaterial(
    new THREE.SpriteMaterial({
      map: tex,
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    })
  );

  const group = new THREE.Group();
  const clouds = Array.from({ length: count }, (_, i) => {
    const sp = new THREE.Sprite(mat);
    const sz = 4.6 + (i % 3) * 1.4;
    sp.position.set(0, lerp(yMin, yMax, ((i * 0.618) % 1)), (((i * 0.37) % 1) - 0.5) * zSpan * 1.6);
    sp.renderOrder = -2;
    group.add(sp);
    return { sp, phase: i / count, sz };
  });

  return {
    group,
    tick(elapsed: number, speed = 2.6) {
      mat.opacity = studio.isDark ? 0.86 : 0.94;
      clouds.forEach((cl) => {
        const x = ((cl.phase * span + elapsed * speed) % span + span) % span;
        const fade = smoothstep(Math.min(x, span - x) / (span * 0.14));
        cl.sp.position.x = xMin + x;
        cl.sp.scale.set(cl.sz * 2.05 * fade + 0.01, cl.sz * 1.15 * fade + 0.01, 1);
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
      opacity: opts.opacity ?? 0.92,
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
  tick?: (elapsed: number) => void;
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
 * Architectural Runway 27L Diorama with TORA asphalt, white edge stripes,
 * glowing amber edge lights, threshold piano keys, Stopway chevrons, Clearway
 * corridor, 35 ft Screen Gate, animated windsock, and minimalist ATC tower.
 */
export function createRunwayRig(studio: AviationStudio): RunwayRigHandle {
  const group = new THREE.Group();

  const asphaltMat = studio.createMaterial('asphalt', { roughness: 0.78, metalness: 0.06 });
  const markMat = studio.createMaterial('mark', { roughness: 0.45 });
  const amberMat = studio.createMaterial('amber', {
    roughness: 0.35,
    emissiveKey: 'amber',
    emissiveIntensity: 0.45,
  });
  const towerBodyMat = studio.createMaterial('white', { roughness: 0.42, metalness: 0.08 });
  const towerCabMat = studio.createMaterial('glass', { roughness: 0.16, metalness: 0.65 });
  const sockOrangeMat = studio.createMaterial('red', { roughness: 0.48 });
  const clearwayMat = studio.createMaterial('emerald', { opacity: 0.2, side: THREE.DoubleSide });
  const screenMat = studio.createMaterial('teal', { opacity: 0.24, side: THREE.DoubleSide });
  const barMat = studio.createMaterial('mag', { opacity: 0.9 });

  // Main TORA Pavement (-50 to +40, width 14)
  const rwy = new THREE.Mesh(studio.trackGeometry(new THREE.BoxGeometry(90, 0.14, 14)), asphaltMat);
  rwy.position.set(-5, 0.02, 0);
  rwy.receiveShadow = true;
  group.add(rwy);

  // Crisp White Shoulder Edge Stripes
  const edgeStripeGeo = studio.trackGeometry(new THREE.PlaneGeometry(90, 0.22));
  [-6.65, 6.65].forEach((zPos) => {
    const stripe = new THREE.Mesh(edgeStripeGeo, markMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(-5, 0.1, zPos);
    group.add(stripe);
  });

  // Runway Edge Lights (amber pearls along both sides)
  const lightGeo = studio.trackGeometry(new THREE.SphereGeometry(0.18, 10, 8));
  for (let x = 38; x >= -48; x -= 9.5) {
    [-7.1, 7.1].forEach((zPos) => {
      const bulb = new THREE.Mesh(lightGeo, amberMat);
      bulb.position.set(x, 0.2, zPos);
      group.add(bulb);
    });
  }

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

  // Sculpted Minimalist ATC Tower (set back off right shoulder for skyline parallax)
  const towerGrp = new THREE.Group();
  towerGrp.position.set(8, 0, -24);
  const shaft = new THREE.Mesh(
    studio.trackGeometry(new THREE.CylinderGeometry(1.05, 1.55, 11.5, 18)),
    towerBodyMat
  );
  shaft.position.y = 5.75;
  shaft.castShadow = true;
  const cab = new THREE.Mesh(
    studio.trackGeometry(new THREE.CylinderGeometry(2.6, 1.9, 1.9, 18)),
    towerCabMat
  );
  cab.position.y = 12.2;
  cab.castShadow = true;
  const roof = new THREE.Mesh(
    studio.trackGeometry(new THREE.CylinderGeometry(2.85, 2.75, 0.4, 18)),
    towerBodyMat
  );
  roof.position.y = 13.3;
  const radarBar = new THREE.Mesh(
    studio.trackGeometry(new THREE.BoxGeometry(2.8, 0.32, 0.45)),
    towerBodyMat
  );
  radarBar.position.y = 14.2;
  towerGrp.add(shaft, cab, roof, radarBar);
  group.add(towerGrp);

  // Animated Orange/White Windsock near RWY 27L Threshold
  const sockPoleGrp = new THREE.Group();
  sockPoleGrp.position.set(33, 0, 10.5);
  const pole = new THREE.Mesh(
    studio.trackGeometry(new THREE.CylinderGeometry(0.08, 0.1, 4.6, 10)),
    towerBodyMat
  );
  pole.position.y = 2.3;
  pole.castShadow = true;
  const sockArm = new THREE.Group();
  sockArm.position.y = 4.45;
  for (let seg = 0; seg < 4; seg++) {
    const r0 = 0.42 - seg * 0.06;
    const r1 = 0.36 - seg * 0.06;
    const cSeg = new THREE.Mesh(
      studio.trackGeometry(new THREE.CylinderGeometry(r1, r0, 0.62, 12)),
      seg % 2 === 0 ? sockOrangeMat : towerBodyMat
    );
    cSeg.rotation.z = -Math.PI / 2;
    cSeg.position.x = -0.35 - seg * 0.6;
    cSeg.castShadow = true;
    sockArm.add(cSeg);
  }
  sockPoleGrp.add(pole, sockArm);
  group.add(sockPoleGrp);

  // Stopway Zone (beyond DER: -50 to -64) with Amber Chevrons
  const stopwayGroup = new THREE.Group();
  const stopPad = new THREE.Mesh(studio.trackGeometry(new THREE.BoxGeometry(14, 0.12, 14)), asphaltMat);
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
  const cwPlane = new THREE.Mesh(studio.trackGeometry(new THREE.PlaneGeometry(24, 20)), clearwayMat);
  cwPlane.rotation.x = -Math.PI / 2;
  cwPlane.position.set(-62, 0.12, 0);
  clearwayGroup.add(cwPlane);
  group.add(clearwayGroup);

  // 35 ft Screen Height Gate at -58
  const screenGate = new THREE.Mesh(studio.trackGeometry(new THREE.PlaneGeometry(18, 4.2)), screenMat);
  screenGate.rotation.y = Math.PI / 2;
  screenGate.position.set(-58, 2.2, 0);
  group.add(screenGate);

  // Highlight Ground Distance Strip along shoulder
  const distBar = new THREE.Mesh(studio.trackGeometry(new THREE.BoxGeometry(1, 0.08, 0.85)), barMat);
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
    tick(elapsed: number) {
      radarBar.rotation.y = elapsed * 1.6;
      sockArm.rotation.z = Math.sin(elapsed * 3.1) * 0.06;
      sockArm.rotation.y = Math.cos(elapsed * 1.8) * 0.1;
    },
    setConfig({ showStopway = true, showClearway = true, wet = false, highlightDistFrac = 0.72 }) {
      stopwayGroup.visible = showStopway;
      clearwayGroup.visible = showClearway;
      asphaltMat.roughness = wet ? 0.16 : 0.78;
      asphaltMat.metalness = wet ? 0.45 : 0.06;
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
