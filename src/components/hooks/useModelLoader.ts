import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three-stdlib';
import * as THREE from 'three';

interface ModelLoaderState {
  model: THREE.Group | null;
  progress: number;
  isLoading: boolean;
  error: string | null;
}

export const useModelLoader = (url: string) => {
  const [state, setState] = useState<ModelLoaderState>({
    model: null,
    progress: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loader = new GLTFLoader();
    
    // Progress tracking
    const onProgress = (progressEvent: ProgressEvent) => {
      if (progressEvent.lengthComputable) {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setState(prev => ({
          ...prev,
          progress: Math.round(progress),
        }));
      }
    };

    // Load the model
    loader.load(
      url,
      (gltf) => {
        // Model loaded successfully
        setState({
          model: gltf.scene,
          progress: 100,
          isLoading: false,
          error: null,
        });
      },
      onProgress,
      (error) => {
        // Error loading model
        console.error('Error loading model:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load 3D model',
        }));
      }
    );

    return () => {
      // Cleanup on unmount
      setState({
        model: null,
        progress: 0,
        isLoading: true,
        error: null,
      });
    };
  }, [url]);

  return state;
};
