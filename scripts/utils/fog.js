import * as THREE from 'three';

export function createFog(manager) {
    const material = new THREE.MeshLambertMaterial({ color: 0x000000 });
    material.fog = true;  
    //manager.scene.fog = new THREE.Fog(0x000000, manager.camera.position.z, manager.camera.position.z * 1.16);  
}