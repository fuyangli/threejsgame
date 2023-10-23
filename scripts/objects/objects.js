import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import * as CANNON from 'cannon-es';

import { PhysicObject } from './physicObject';

export function createPlayer(manager) {
  const radius = .48;
  const playerGeometry = new THREE.SphereGeometry(radius);
  playerGeometry.computeBoundingBox();
  const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  const player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.name = "Player";
  const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
  const outlineMesh = new THREE.Mesh(playerGeometry, outlineMaterial);
  outlineMesh.scale.x *= 1.05;
  outlineMesh.scale.y *= 1.05;
  outlineMesh.scale.z *= 1.05;
  player.add(outlineMesh);
  manager.scene.add(player);

  const playerBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(radius),
    position: player.position
  });
  const lockAxisZ = new CANNON.PointToPointConstraint(playerBody, new CANNON.Vec3(0, 0, 0), playerBody, new CANNON.Vec3(0, 0, 0));
  manager.world.addConstraint(lockAxisZ);
  manager.world.addBody(playerBody);

  var obj = new PhysicObject(player, playerBody);
  return obj;
}


export function createPlatform(manager, position) {
  const size = 1;
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xEEEEEE });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;

  const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });

  const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
  outlineMesh.scale.x *= 1.05;
  outlineMesh.scale.y *= 1.05;
  outlineMesh.scale.z *= 1.05;
  cube.add(outlineMesh);
  manager.scene.add(cube);

  const cubeBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(1 / 2, 1 / 2, 1 / 2))
  });
  manager.world.addBody(cubeBody);

  return new PhysicObject(cube, cubeBody);
}