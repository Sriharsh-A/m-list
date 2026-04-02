"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  useGLTF, 
  PresentationControls, 
  Stage, 
  PerspectiveCamera, 
  Environment,
  ContactShadows,
  Float
} from "@react-three/drei";

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <primitive object={scene} scale={1.6} position={[0, 0, 0]} />
    </Float>
  );
}

export default function CarShowroom() {
  return (
    <div className="h-full w-full bg-m-carbon">
      <Canvas dpr={[1, 2]} shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={35} />
          
          {/* Pulsing light effect for "Ignited" feel */}
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#81c4ff" castShadow />
          <Environment preset="city" />
          
          <PresentationControls
            speed={1.5}
            global
            zoom={0.8}
            polar={[-0.1, Math.PI / 6]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Stage intensity={0.5} environment="city" contactShadow={false}>
              <Model path="/models/car.glb" />
            </Stage>
          </PresentationControls>

          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}