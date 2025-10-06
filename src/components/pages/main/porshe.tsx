
'use client';

import { ModelViewer } from '../../three/ModelViewer';

export default function Porshe() {
    return (
        <div className="w-full h-screen bg-black">
            <ModelViewer 
                modelUrl="/model/scene.gltf"
                className="w-full h-full"
            />
        </div>
    )
}