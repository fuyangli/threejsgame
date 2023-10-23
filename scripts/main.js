import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import TWEEN from '@tweenjs/tween.js'

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';

import { Debug } from './utils/debug';
import { createPlatform, createPlayer } from './objects/objects';
import { handleColliders, handleInput, onKeyDown, onKeyUp, onTouchEnd, onTouchStart } from './input/input';
import { updateCamera } from './camera/camera';
import { createFog } from './utils/fog';

//VIEWPORT
var w = window.innerWidth;
var h = window.innerHeight;
var viewSize = h;
var aspectRatio = w / h;
//MANAGER
const manager = {
    viewport: {
        w,
        h,
        viewSize: viewSize,
        aspectRatio: aspectRatio,
        left: (-aspectRatio * viewSize) / 2,
        right: (aspectRatio * viewSize) / 2,
        top: viewSize / 2,
        bottom: -viewSize / 2,
        near: -1000,
        far: 1000
    },
    physicObjects: [],
    values: {
        jumpSpeed: 6,
        moveSpeed: 4,
        initialPosition: new THREE.Vector3(0, 1, 0),
        deathHeightY: -10
    },
    state: {
        cameraRotation: false,
        jumpCount: 0
    }
}

const world = new CANNON.World()
world.gravity = new CANNON.Vec3(0, -9.8, 0);
manager.world = world;

const scene = new THREE.Scene();
manager.scene = scene;



let camera = new THREE.OrthographicCamera(manager.viewport.left,
    manager.viewport.right,
    manager.viewport.top,
    manager.viewport.bottom,
    manager.viewport.near,
    manager.viewport.far);
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.zoom = 100;
manager.camera = camera;
let boom = new THREE.Group();
boom.add(camera);
scene.add(boom);
boom.position.z = camera.position.z = 20;
manager.boom = boom;
createFog(manager);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
manager.renderer = renderer;

const ambientLight = new THREE.DirectionalLight(0xffffff, 0.5);
ambientLight.position.set(0, 50, 0);
ambientLight.castShadow = true;
scene.add(ambientLight);
manager.ambientLight = ambientLight;

var cubePosition =[
    //BASE
    new THREE.Vector3(-1,0,-1),
    new THREE.Vector3(0,0,-1),
    new THREE.Vector3(1,0,-1),
    new THREE.Vector3(-1,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(1,0,0),
    new THREE.Vector3(-1,0,1),
    new THREE.Vector3(0,0,1),
    new THREE.Vector3(1,0,1),

    new THREE.Vector3(0,2,0),

    new THREE.Vector3(0,2,-2),
    new THREE.Vector3(1,2,-2),

    new THREE.Vector3(0,4,-1),
];

for (var i = 0; i < cubePosition.length; i++) {
    let cube = createPlatform(manager);
    cube.object.name = "Cube " + i;
    cube.setInitialPosition(cubePosition[i]);
    manager.physicObjects.push(cube);
    //cube.startBoucing(Math.random() * (2000 - 500) +  500);
};

let player = createPlayer(manager);
player.setInitialPosition(manager.values.initialPosition);
player.object.updateMatrixWorld();
player.update();
manager.physicObjects.push(player);
manager.player = player;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(manager.scene, manager.camera);
composer.addPass(renderPass);
renderPass.renderToScreen = true;
manager.composer = composer;
camera.updateProjectionMatrix();

var onResize = function () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var viewSize = h;
    var aspectRatio = w / h;

    camera.left = (-aspectRatio * viewSize) / 2;
    camera.right = (aspectRatio * viewSize) / 2;

    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);

manager.keys = {};

// INPUTS
document.addEventListener('keydown', (e) => onKeyDown(e, manager));
document.addEventListener('keyup', (e) => onKeyUp(e, manager));
document.addEventListener('touchstart', (e) => onTouchStart(e, manager));
document.addEventListener('touchend', (e) => onTouchEnd(e, manager));

function checkDeath() {
    if(player.body.position.y < manager.values.deathHeightY || player.body.position.y > -manager.values.deathHeightY) {
        player.setInitialPosition(manager.values.initialPosition);
        player.body.quaternion = new CANNON.Quaternion();
        player.body.velocity.set(0,0,0);
    }
}


var debug = new Debug(false, manager);
document.addEventListener('keydown', (e) => e.key == '.' ? debug.toggle() : '');

handleColliders(manager);

function animate() {
    requestAnimationFrame(animate);
    camera.updateProjectionMatrix();
    debug.update();
    TWEEN.update();

    manager.physicObjects.forEach(function (obj) { obj.update() });

    handleInput(manager);

    checkDeath();

    updateCamera(manager);

    world.step(1 / 60);

    composer.render();
}

animate();
