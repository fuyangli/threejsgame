import * as THREE from 'three';
import GUI from 'lil-gui';

import  CannonDebugRenderer  from './cannonDebugRenderer';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Debug {
    constructor(debug = false, manager) {
        this.debug = debug;
        this.manager = manager;
        this.debugObjects = [];
        this.init(this.debug);
    }

    init = (debug) =>  {
        if (!debug) return;
        this.manager.boom.position.set(0,0,0);
        this.manager.camera.position.set(0,0,20);
        //ThreeJS debug
        this.controls = new OrbitControls(this.manager.camera, this.manager.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.enablePan = true;

        const helper = new THREE.CameraHelper(this.manager.ambientLight.shadow.camera);
        this.manager.scene.add(helper);
        this.debugObjects.push(helper);

        const planeGeometry = new THREE.PlaneGeometry(100, 100, 200, 200);
        const planeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x666666, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.order = 'YXZ';
        plane.rotation.y = - Math.PI / 2;
        plane.rotation.x = - Math.PI / 2;
        plane.receiveShadow = true;
        this.manager.scene.add(plane);
        this.debugObjects.push(plane);

        this.cannonDebugRenderer = new CannonDebugRenderer(this.manager.scene, this.manager.world);
        // this.rendererOriginalPos = new CannonDebugRenderer(this.manager.scene, this.manager.world, { materialColor: 0x0000FF });
        // this.rendererOriginalPos.update();
        
        //GUI debug
        this.gui = new GUI();
        this.gui.close();
        
        this.gui.title('Debug');

        var playerFolder = this.gui.addFolder("PLAYER");
        playerFolder.add(this.manager.player.body.position, 'x').listen();
        playerFolder.add(this.manager.player.body.position, 'y').listen();
        playerFolder.add(this.manager.player.body.position, 'z').listen();
        playerFolder.add(this.manager.player.body.quaternion, 'x').listen();
        playerFolder.add(this.manager.player.body.quaternion, 'y').listen();
        playerFolder.add(this.manager.player.body.quaternion, 'z').listen();
    }

    destroy = () =>  {
        this.controls.dispose();
        this.manager.boom.position.set(0,0,0);
        this.manager.camera.position.set(0,0,20);
        this.manager.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.cannonDebugRenderer._meshes.forEach(obj => {
            this.manager.scene.remove(obj);
        });
        this.debugObjects.forEach(obj => {
            this.manager.scene.remove(obj);
        });
        this.gui.destroy();
    }

    toggle() {
        if(!this.debug) this.init(!this.debug)
        else this.destroy();
        this.debug = !this.debug;
    }

    update = () => {
        if (!this.debug) return;
        this.cannonDebugRenderer.update();
    }


}