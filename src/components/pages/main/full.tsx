"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Full() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMessages, setShowMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    // camera.rotation.x = 6;
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Different figures
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshBasicMaterial({ color: "#333" })
    );
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // Model
    const loader = new GLTFLoader();
    let car: THREE.Object3D;

    loader.load(
      "/bmw_m4_gts/scene.gltf",
      (gltf) => {
        car = gltf.scene;
        car.scale.set(0.03, 0.03, 0.03);
        car.position.set(1, 1, 1);
        scene.add(car);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened, ", error);
      }
    );

    // animate car
    let angle = 0;
    const moveCar = () => {
      if (!car) return;
      angle += 0.01;
      car.position.x = 5 * Math.cos(angle);
      car.position.z = 5 * Math.sin(angle);
      car.rotation.y = -angle;
    };

    // Points for show message
    const infoPoints = [
      { position: new THREE.Vector3(5, 0, 0), message: "Hello" },
      { position: new THREE.Vector3(-5, 0, 0), message: "I'm developer" },
      { position: new THREE.Vector3(0, 0, 5), message: "Next.js" },
      { position: new THREE.Vector3(3, 3, 3), message: "Three.js" },
      { position: new THREE.Vector3(4, 4, 4), message: "Animation" },
      { position: new THREE.Vector3(5, 5, 5), message: "3D" },
      { position: new THREE.Vector3(6, 6, 6), message: "BMW M4 GTS" },
    ];

    function checkInfoPoints() {
      if (!car) return;
      const currentMessages = new Set<string>();

      infoPoints.forEach((point) => {
        const distance = car.position.distanceTo(point.position);
        if (distance < 0.5) currentMessages.add(point.message);
      });

      setShowMessages(Array.from(currentMessages));
    }

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      checkInfoPoints();
      moveCar();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative">
      {showMessages.length > 0 && (
        <div className="flex justify-center items-center absolute top-[10px] left-[10px] bg-white p-4 rounded-md">
          {showMessages.join(", ")}
        </div>
      )}
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
