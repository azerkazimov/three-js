"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three-stdlib";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export default function BMW() {
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
    // controls.maxDistance = 1000;

    // Postprocessing
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.4, 0.5);

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

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

    // load model
    const loader = new GLTFLoader();
    loader.load(
      "/bmw_m4_gts/scene.gltf",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        scene.add(model);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened, ", error);
      }
    );

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    };

    // const handleResize = () => {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(window.innerWidth, window.innerHeight);
    // };

    // window.addEventListener("mousemove", handleMouseMove);
    // window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      raycaster.setFromCamera(mouse, camera);

      controls.update();
      renderer.setClearColor('khaki');
    //   renderer.render(scene, camera);
    composer.render();
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    //   window.removeEventListener("resize", handleResize);
      
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
