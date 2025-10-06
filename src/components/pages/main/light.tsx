"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three-stdlib";
import gsap from "gsap";

export default function LightSchene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // Add lighting for the sphere
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight("white", 10, 60);
    pointLight.position.set(0.5, 1, 1);
    scene.add(pointLight);

    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
    // scene.add(pointLightHelper);
    // eq28745473
    // eq28729928
    // eq29311231

    const spotLight = new THREE.SpotLight("white", 1);
    spotLight.position.set(1, 1, 1);
    scene.add(spotLight);

    // const texture = new THREE.TextureLoader().load("img.jpg");
    // const textureMaterial = new THREE.MeshBasicMaterial({ map: texture });

    const geometry = new THREE.BoxGeometry();
    const originalMaterial = new THREE.MeshStandardMaterial({ color: "white" });
    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: "yellow",
      emissive: "orange",
      emissiveIntensity: 0.5,
    });

    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, originalMaterial);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: "white" })
    );
    sphere.position.set(0, 2, 0);
    scene.add(sphere);

    // gsap
    // gsap.to(cube.position, {
    //   x: 2,
    //   y:2,
    //   duration: 1,
    //   ease: "power2.inOut",
    //   repeat: -1,
    //   yoyo: true,
    // });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovered = false;
    let isAnimating = false;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube);

      if (intersects.length > 0 && !isHovered && !isAnimating) {
        cube.material = highlightMaterial;
        isHovered = true;
        isAnimating = true;

        // Kill any existing animations to prevent conflicts
        gsap.killTweensOf(cube.rotation);
        gsap.killTweensOf(cube.scale);

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
          }
        });

        tl.to(cube.rotation, {
          x: Math.PI / 4,
          y: Math.PI / 4,
          duration: 1.5,
          ease: "power1.out",
        })
        .to(cube.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 1.5,
          ease: "power1.out",
        }, 0); // Start at the same time as rotation

      } else if (intersects.length === 0 && isHovered && !isAnimating) {
        cube.material = originalMaterial;
        isHovered = false;
        isAnimating = true;

        // Kill any existing animations to prevent conflicts
        gsap.killTweensOf(cube.rotation);
        gsap.killTweensOf(cube.scale);

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
          }
        });

        tl.to(cube.rotation, {
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "power1.out",
        })
        .to(cube.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.5,
          ease: "power1.out",
        }, 0); // Start at the same time as rotation
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(cube.rotation);
      gsap.killTweensOf(cube.scale);
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
