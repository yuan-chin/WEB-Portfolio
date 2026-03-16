/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useRef, useState, useMemo, Component, ReactNode, Suspense, useCallback } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('[Lanyard ErrorBoundary]', error, info);
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

const cardGLB = '/assets/lanyard/card.glb';
const lanyardTexture = '/assets/lanyard/lanyard.png';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true
}: {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Handle WebGL context loss and restoration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('[Lanyard] WebGL context lost');
    };

    const handleContextRestored = () => {
      console.log('[Lanyard] WebGL context restored, re-mounting...');
      setErrorKey(prev => prev + 1);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [errorKey]);

  const handleError = useCallback(() => {
    // Auto-retry once after a short delay
    setTimeout(() => {
      setErrorKey(prev => prev + 1);
    }, 1000);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <ErrorBoundary key={errorKey} onError={handleError}>
        <Canvas
          key={`canvas-${errorKey}`}
          camera={{ position, fov }}
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{
            alpha: transparent,
            antialias: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
            gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          }}
        >
          <ambientLight intensity={Math.PI} />

          <Suspense fallback={null}>
            <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
              <Band isMobile={isMobile} />
            </Physics>

            <Environment blur={0.75}>
              <Lightformer intensity={2} position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: { maxSpeed?: number; minSpeed?: number; isMobile?: boolean }) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardTexture);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Rope physics
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);

  // Attach lanyard to top of card clip (adjusted for group offset inside card)
  useSphericalJoint(j3, card, [
    [0, -1.1, 0],   // anchor on j3
    [0, 1.20, 0]  // anchor on card RigidBody at top of clip
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; }
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current) return;
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  const meshLineMat = useMemo(() => {
    return new MeshLineMaterial({
      color: new THREE.Color(1, 1, 1),
      depthTest: false,
      resolution: new THREE.Vector2(1000, isMobile ? 2000 : 1000),
      useMap: true,
      map: texture,
      repeat: new THREE.Vector2(-4, 1),
      lineWidth: 2
    } as any);
  }, [texture, isMobile]);

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={3.0}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => { e.target.releasePointerCapture(e.pointerId); drag(false) }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band} material={meshLineMat}>
        <meshLineGeometry />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
useTexture.preload(lanyardTexture);