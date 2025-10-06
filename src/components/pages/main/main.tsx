"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function Main() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { 
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add lighting for the sphere
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const texture = new THREE.TextureLoader().load(
        "img.jpg"
      );
      const textureMaterial = new THREE.MeshBasicMaterial({map: texture})
      

    const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, textureMaterial);
    cube.position.set(-3, 0, 0);
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x222222,
      shininess: 100,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(3, 0, 0);
    scene.add(sphere);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.2, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    torus.position.set(0, 1, 1);
    scene.add(torus);


    
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      textureMaterial
    );
    plane.position.set(0, -2, 0);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
