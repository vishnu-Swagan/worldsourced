"use client";

import React, {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import type { Category } from "@/lib/fees";

const R = 1;
/** Soft sky — matches light page hero */
const SKY = "#e8f2fa";

function latLonToVec3(lat: number, lon: number, radius = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

type Hub = { id: string; name: string; lat: number; lon: number };

/** Global hubs spread around the globe for dense network */
const HUBS: Hub[] = [
  { id: "mumbai", name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { id: "delhi", name: "Delhi", lat: 28.6139, lon: 77.209 },
  { id: "bangalore", name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { id: "chennai", name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { id: "dubai", name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { id: "singapore", name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { id: "shenzhen", name: "Shenzhen", lat: 22.5431, lon: 114.0579 },
  { id: "shanghai", name: "Shanghai", lat: 31.2304, lon: 121.4737 },
  { id: "hongkong", name: "Hong Kong", lat: 22.3193, lon: 114.1694 },
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { id: "seoul", name: "Seoul", lat: 37.5665, lon: 126.978 },
  { id: "jakarta", name: "Jakarta", lat: -6.2088, lon: 106.8456 },
  { id: "bangkok", name: "Bangkok", lat: 13.7563, lon: 100.5018 },
  { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { id: "melbourne", name: "Melbourne", lat: -37.8136, lon: 144.9631 },
  { id: "berlin", name: "Berlin", lat: 52.52, lon: 13.405 },
  { id: "london", name: "London", lat: 51.5074, lon: -0.1278 },
  { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522 },
  { id: "amsterdam", name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
  { id: "zurich", name: "Zurich", lat: 47.3769, lon: 8.5417 },
  { id: "milan", name: "Milan", lat: 45.4642, lon: 9.19 },
  { id: "madrid", name: "Madrid", lat: 40.4168, lon: -3.7038 },
  { id: "nyc", name: "New York", lat: 40.7128, lon: -74.006 },
  { id: "sf", name: "San Francisco", lat: 37.7749, lon: -122.4194 },
  { id: "chicago", name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { id: "la", name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { id: "toronto", name: "Toronto", lat: 43.6532, lon: -79.3832 },
  { id: "sao_paulo", name: "São Paulo", lat: -23.5505, lon: -46.6333 },
  { id: "mexico", name: "Mexico City", lat: 19.4326, lon: -99.1332 },
  { id: "lagos", name: "Lagos", lat: 6.5244, lon: 3.3792 },
  { id: "nairobi", name: "Nairobi", lat: -1.2921, lon: 36.8219 },
  { id: "istanbul", name: "Istanbul", lat: 41.0082, lon: 28.9784 },
  { id: "miami", name: "Miami", lat: 25.7617, lon: -80.1918 },
  { id: "houston", name: "Houston", lat: 29.7604, lon: -95.3698 },
  { id: "vancouver", name: "Vancouver", lat: 49.2827, lon: -123.1207 },
  { id: "bogota", name: "Bogotá", lat: 4.711, lon: -74.0721 },
  { id: "lima", name: "Lima", lat: -12.0464, lon: -77.0428 },
  { id: "santiago", name: "Santiago", lat: -33.4489, lon: -70.6693 },
  { id: "rio", name: "Rio", lat: -22.9068, lon: -43.1729 },
  { id: "buenos_aires", name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
];

const HUB_INDEX: Record<string, Hub> = Object.fromEntries(
  HUBS.map((h) => [h.id, h])
);

type Route = {
  from: string;
  to: string;
  category: Category;
  weight: number;
};

const CATEGORIES: Category[] = [
  "physical_products",
  "physical_services",
  "digital_products",
  "digital_services",
];

/** Bright route colors — readable on light sky */
const CAT_COLOR: Record<Category, string> = {
  physical_products: "#ffc107",
  physical_services: "#2ee59a",
  digital_products: "#1ce8ff",
  digital_services: "#ffd54f",
};

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build ~110–140 arcs: global backbone + dense regional spiderweb */
function buildRoutes(): Route[] {
  const rand = mulberry32(20260911);
  const ids = HUBS.map((h) => h.id);
  const seen = new Set<string>();
  const routes: Route[] = [];

  const add = (from: string, to: string, category: Category, weight: number) => {
    if (from === to) return;
    if (!HUB_INDEX[from] || !HUB_INDEX[to]) return;
    const key = [from, to].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    routes.push({ from, to, category, weight });
  };

  const backbone: [string, string, Category][] = [
    ["shenzhen", "mumbai", "physical_products"],
    ["tokyo", "mumbai", "physical_products"],
    ["shanghai", "nyc", "physical_products"],
    ["hongkong", "singapore", "physical_products"],
    ["dubai", "london", "digital_services"],
    ["singapore", "dubai", "digital_services"],
    ["london", "nyc", "digital_products"],
    ["sf", "bangalore", "digital_products"],
    ["berlin", "mumbai", "physical_services"],
    ["mumbai", "dubai", "physical_services"],
    ["paris", "sao_paulo", "physical_products"],
    ["amsterdam", "jakarta", "physical_products"],
    ["seoul", "sf", "digital_products"],
    ["zurich", "singapore", "digital_services"],
    ["lagos", "london", "physical_services"],
    ["nairobi", "dubai", "physical_services"],
    ["mexico", "chicago", "physical_products"],
    ["toronto", "london", "digital_products"],
    ["melbourne", "singapore", "physical_products"],
    ["istanbul", "berlin", "physical_services"],
    ["delhi", "shanghai", "physical_products"],
    ["bangalore", "amsterdam", "digital_products"],
    ["milan", "dubai", "physical_products"],
    ["sao_paulo", "nyc", "digital_services"],
    ["la", "tokyo", "physical_products"],
    ["chennai", "singapore", "physical_products"],
    ["bangkok", "dubai", "physical_services"],
    ["madrid", "mexico", "digital_products"],
    ["chicago", "berlin", "digital_services"],
    ["sydney", "tokyo", "physical_products"],
    ["lagos", "sao_paulo", "physical_services"],
    ["nairobi", "mumbai", "digital_products"],
    ["istanbul", "nyc", "digital_services"],
    ["hongkong", "sf", "digital_products"],
    ["paris", "delhi", "physical_services"],
    ["amsterdam", "nyc", "digital_products"],
    ["la", "sydney", "physical_products"],
    ["toronto", "tokyo", "digital_products"],
    ["madrid", "dubai", "physical_services"],
    ["chennai", "london", "digital_services"],
    ["sf", "tokyo", "physical_products"],
    ["vancouver", "seoul", "digital_products"],
    ["houston", "dubai", "physical_services"],
    ["miami", "london", "digital_services"],
    ["miami", "lagos", "physical_services"],
    ["bogota", "madrid", "physical_products"],
    ["lima", "miami", "physical_products"],
    ["rio", "london", "digital_products"],
    ["buenos_aires", "madrid", "physical_services"],
    ["vancouver", "tokyo", "physical_products"],
    ["houston", "sao_paulo", "physical_products"],
    ["chicago", "london", "digital_services"],
  ];
  backbone.forEach(([a, b, c]) => add(a, b, c, 0.95));

  const regional: [string, string, Category][] = [
    ["sf", "la", "digital_products"],
    ["sf", "vancouver", "digital_services"],
    ["sf", "chicago", "digital_products"],
    ["la", "houston", "physical_products"],
    ["la", "mexico", "physical_products"],
    ["houston", "mexico", "physical_services"],
    ["houston", "miami", "physical_products"],
    ["chicago", "nyc", "digital_services"],
    ["chicago", "toronto", "digital_products"],
    ["nyc", "toronto", "digital_services"],
    ["nyc", "miami", "digital_products"],
    ["miami", "mexico", "physical_services"],
    ["miami", "bogota", "physical_products"],
    ["vancouver", "la", "physical_services"],
    ["sf", "houston", "digital_products"],
    ["chicago", "houston", "physical_products"],
    ["toronto", "chicago", "physical_services"],
    ["nyc", "houston", "digital_services"],
    ["mexico", "bogota", "physical_products"],
    ["bogota", "lima", "physical_services"],
    ["lima", "santiago", "physical_products"],
    ["santiago", "buenos_aires", "physical_services"],
    ["buenos_aires", "sao_paulo", "physical_products"],
    ["sao_paulo", "rio", "digital_products"],
    ["rio", "buenos_aires", "digital_services"],
    ["bogota", "sao_paulo", "physical_products"],
    ["lima", "sao_paulo", "physical_services"],
    ["mexico", "lima", "digital_products"],
    ["miami", "sao_paulo", "digital_services"],
    ["nyc", "sao_paulo", "physical_products"],
    ["london", "paris", "digital_services"],
    ["london", "amsterdam", "digital_products"],
    ["paris", "berlin", "physical_services"],
    ["berlin", "amsterdam", "digital_products"],
    ["paris", "milan", "physical_products"],
    ["milan", "zurich", "digital_services"],
    ["zurich", "berlin", "digital_products"],
    ["madrid", "paris", "physical_services"],
    ["madrid", "milan", "physical_products"],
    ["amsterdam", "zurich", "digital_services"],
    ["london", "berlin", "digital_products"],
    ["istanbul", "milan", "physical_services"],
    ["istanbul", "paris", "digital_services"],
    ["mumbai", "delhi", "physical_products"],
    ["mumbai", "bangalore", "digital_products"],
    ["bangalore", "chennai", "digital_services"],
    ["delhi", "chennai", "physical_services"],
    ["singapore", "jakarta", "physical_products"],
    ["singapore", "bangkok", "physical_services"],
    ["bangkok", "hongkong", "digital_products"],
    ["hongkong", "shenzhen", "physical_products"],
    ["shenzhen", "shanghai", "physical_products"],
    ["shanghai", "seoul", "digital_products"],
    ["seoul", "tokyo", "digital_services"],
    ["tokyo", "shanghai", "physical_products"],
    ["dubai", "mumbai", "digital_services"],
    ["dubai", "istanbul", "physical_services"],
    ["singapore", "chennai", "physical_products"],
    ["hongkong", "tokyo", "digital_products"],
    ["lagos", "nairobi", "physical_services"],
    ["nairobi", "istanbul", "digital_products"],
    ["sydney", "melbourne", "digital_services"],
    ["melbourne", "jakarta", "physical_products"],
  ];
  regional.forEach(([a, b, c], i) =>
    add(a, b, c, 0.55 + (i % 5) * 0.08)
  );

  const target = 130;
  let guard = 0;
  while (routes.length < target && guard < 3000) {
    guard++;
    const i = Math.floor(rand() * ids.length);
    const j = Math.floor(rand() * ids.length);
    if (i === j) continue;
    const a = HUBS[i];
    const b = HUBS[j];
    const dLat = a.lat - b.lat;
    const dLon = a.lon - b.lon;
    const approx = Math.sqrt(dLat * dLat + dLon * dLon);
    if (approx < 12 && rand() > 0.35) continue;
    const cat = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const weight = 0.45 + rand() * 0.5;
    add(a.id, b.id, cat, weight);
  }

  return routes;
}

const ALL_ROUTES = buildRoutes();

function makeArc(start: THREE.Vector3, end: THREE.Vector3) {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dist = start.distanceTo(end);
  const lift = 0.22 + dist * 0.28;
  mid.normalize().multiplyScalar(R + lift);
  return new THREE.QuadraticBezierCurve3(start, mid, end);
}

/**
 * Soft blue-marble procedural fallback — no hard latitudinal bands
 * (avoid fillRect polar strips that read as "crocodile skin").
 */
function proceduralDayMap() {
  const w = 2048;
  const h = 1024;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  // Smooth ocean — gentle vertical falloff only at poles (soft, not striped)
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#9ec9e0");
  g.addColorStop(0.08, "#1a6fa3");
  g.addColorStop(0.35, "#0d6bab");
  g.addColorStop(0.65, "#0a629e");
  g.addColorStop(0.92, "#1a6fa3");
  g.addColorStop(1, "#a8d0e4");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Soft land blobs (no grid / no repeating UV overlays)
  ctx.fillStyle = "#2f8a45";
  const land = (x: number, y: number, rx: number, ry: number, rot = 0) => {
    ctx.save();
    ctx.translate(x * 2, y * 2);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 2, ry * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  land(270, 210, 95, 72, -0.3);
  land(320, 330, 42, 78, 0.35);
  land(520, 200, 58, 42);
  land(545, 295, 58, 88);
  land(690, 200, 155, 58, 0.1);
  land(800, 275, 48, 28);
  land(860, 355, 42, 22);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  // Anti-banding: no mipmaps on equirect → sphere
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 1;
  tex.needsUpdate = true;
  return tex;
}

/** Apply anti-banding filters to day map (fixes latitudinal "crocodile skin") */
function configureEarthTexture(tex: THREE.Texture) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  // Anisotropy + mipmaps on spheres often creates lat bands — keep at 1
  tex.anisotropy = 1;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Always-visible Earth: TextureLoader + useState (not useLoader).
 * Clean blue-marble look — no Phong banding overlay.
 */
function Earth() {
  const [map, setMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let owned: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.load(
      "/earth/earth-day.jpg",
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        configureEarthTexture(tex);
        owned = tex;
        setMap(tex);
      },
      undefined,
      () => {
        if (cancelled) return;
        const fallback = proceduralDayMap();
        owned = fallback;
        setMap(fallback);
      }
    );
    return () => {
      cancelled = true;
      if (owned) owned.dispose();
    };
  }, []);

  const immediate = useMemo(() => proceduralDayMap(), []);
  const activeMap = map ?? immediate;

  useEffect(() => {
    return () => {
      immediate.dispose();
    };
  }, [immediate]);

  return (
    <Sphere args={[R, 64, 64]}>
      <meshBasicMaterial map={activeMap} toneMapped={false} />
    </Sphere>
  );
}

/** Minimal Earth-only sphere for ErrorBoundary fallback */
function EarthOnlyFallback() {
  const tex = useMemo(() => proceduralDayMap(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <>
      <color attach="background" args={[SKY]} />
      <ambientLight intensity={0.9} />
      <Sphere args={[R, 64, 64]}>
        <meshBasicMaterial map={tex} toneMapped={false} />
      </Sphere>
    </>
  );
}

function Atmosphere() {
  const uniformsOuter = useMemo(
    () => ({
      glowColor: { value: new THREE.Color("#4aa8e0") },
      coef: { value: 3.2 },
      intensity: { value: 0.55 },
    }),
    []
  );

  const ATM_VERT = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vView;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vView = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;
  const ATM_FRAG = /* glsl */ `
uniform vec3 glowColor;
uniform float coef;
uniform float intensity;
varying vec3 vNormalW;
varying vec3 vView;
void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vView);
  float f = pow(1.0 - abs(dot(N, V)), coef);
  gl_FragColor = vec4(glowColor, f * intensity);
}
`;

  return (
    <Sphere args={[R * 1.14, 48, 48]}>
      <shaderMaterial
        vertexShader={ATM_VERT}
        fragmentShader={ATM_FRAG}
        uniforms={uniformsOuter}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  );
}

function Marker({
  position,
  hot,
}: {
  position: THREE.Vector3;
  hot: boolean;
}) {
  const pulse = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2.4) * (hot ? 0.5 : 0.25);
    pulse.current.scale.setScalar(s);
    const mat = pulse.current.material as THREE.MeshBasicMaterial;
    mat.opacity = hot ? 0.5 - (s - 1) * 0.2 : 0.25;
  });
  const color = hot ? "#f0b429" : "#22d3ee";
  return (
    <group position={position}>
      <mesh renderOrder={4}>
        <sphereGeometry args={[hot ? 0.018 : 0.012, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} depthTest />
      </mesh>
      <mesh ref={pulse} renderOrder={4}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

type ArcData = {
  key: string;
  curve: THREE.QuadraticBezierCurve3;
  points: THREE.Vector3[];
  category: Category;
  weight: number;
  phase: number;
};

function ArcLine({ arc, active }: { arc: ArcData; active: boolean }) {
  const color = CAT_COLOR[arc.category];
  const opacity = active ? 1 : 0.78;
  const lineWidth = active
    ? 2.4 + arc.weight * 0.7
    : 1.55 + arc.weight * 0.55;

  return (
    <Line
      points={arc.points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
      depthTest
      depthWrite={false}
      toneMapped={false}
      renderOrder={3}
    />
  );
}

function ArcNetwork({ active, arcs }: { active: Category; arcs: ArcData[] }) {
  const travelers = useMemo(() => {
    return arcs
      .filter((a) => a.category === active)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 16);
  }, [arcs, active]);

  const travelerRefs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    travelers.forEach((a, i) => {
      const mesh = travelerRefs.current[i];
      if (!mesh) return;
      const t = (clock.elapsedTime * (0.12 + a.weight * 0.12) + a.phase) % 1;
      const p = a.curve.getPoint(t);
      const len = p.length();
      mesh.position.copy(p).multiplyScalar((len + 0.028) / len);
    });
  });

  return (
    <group>
      {arcs.map((a) => (
        <ArcLine key={a.key} arc={a} active={a.category === active} />
      ))}
      {travelers.map((a, i) => (
        <mesh
          key={`t-${a.key}`}
          ref={(el) => {
            travelerRefs.current[i] = el;
          }}
          renderOrder={5}
        >
          <sphereGeometry args={[0.016 + a.weight * 0.008, 8, 8]} />
          <meshBasicMaterial
            color={CAT_COLOR[a.category]}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ active }: { active: Category }) {
  const group = useRef<THREE.Group>(null);
  const hotHubs = useMemo(() => {
    const s = new Set<string>();
    ALL_ROUTES.forEach((r) => {
      if (r.category === active) {
        s.add(r.from);
        s.add(r.to);
      }
    });
    return s;
  }, [active]);

  const arcs = useMemo(() => {
    return ALL_ROUTES.map((r, i) => {
      const a = HUB_INDEX[r.from];
      const b = HUB_INDEX[r.to];
      const start = latLonToVec3(a.lat, a.lon, R * 1.02);
      const end = latLonToVec3(b.lat, b.lon, R * 1.02);
      const curve = makeArc(start, end);
      const points = curve.getPoints(48).map((p) => {
        const len = p.length();
        return p.clone().multiplyScalar((len + 0.028) / len);
      });
      return {
        key: `${r.from}-${r.to}-${i}`,
        curve,
        points,
        category: r.category,
        weight: r.weight,
        phase: i * 0.13,
      };
    });
  }, []);

  useEffect(() => {
    if (group.current) group.current.rotation.y = 0.42;
  }, []);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.028;
  });

  return (
    <>
      <color attach="background" args={[SKY]} />
      <ambientLight intensity={0.95} color="#f5f8ff" />
      <hemisphereLight args={["#ffffff", "#7aa8c8", 0.55]} />
      <directionalLight position={[0.2, 0.4, 4.5]} intensity={1.1} color="#fff8f0" />
      <directionalLight position={[-3.2, 1.0, 2.0]} intensity={0.35} color="#a8d4f0" />
      <group ref={group}>
        <Earth />
        <Atmosphere />
        {HUBS.map((h) => (
          <Marker
            key={h.id}
            position={latLonToVec3(h.lat, h.lon, R * 1.02)}
            hot={hotHubs.has(h.id)}
          />
        ))}
        <ArcNetwork active={active} arcs={arcs} />
      </group>
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.45}
        zoomSpeed={0.55}
        minDistance={2.15}
        maxDistance={3.9}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI - 0.45}
        autoRotate={false}
      />
    </>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: Error) {
    console.warn("[EarthGlobe] Scene error — falling back to Earth-only:", err);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function EarthGlobe({ active }: { active: Category }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), {
      threshold: 0.08,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-square w-full overflow-hidden"
      style={{ touchAction: "none", background: SKY }}
    >
      <Canvas
        dpr={[1, 1.75]}
        frameloop={on ? "always" : "never"}
        camera={{ position: [0, 0.28, 2.7], fov: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(SKY), 1);
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <SceneErrorBoundary fallback={<EarthOnlyFallback />}>
          <Suspense fallback={<EarthOnlyFallback />}>
            <Scene active={active} />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>
    </div>
  );
}
