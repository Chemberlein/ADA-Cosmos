import { useEffect } from 'react';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function useBloomPass(fgRef: React.RefObject<any>) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        fgRef.current &&
        typeof fgRef.current.postProcessingComposer === 'function'
      ) {
        const composer = fgRef.current.postProcessingComposer();
        if (composer) {
          const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
          );
          bloomPass.strength = 3;
          bloomPass.radius = 1;
          bloomPass.threshold = 0;
          composer.addPass(bloomPass);
          clearInterval(interval);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [fgRef]);
}
