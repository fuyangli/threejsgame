import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import * as CANNON from 'cannon-es';

export class PhysicObject {
    constructor(object, body) {
        this.object = object;
        this.body = body;
        this.initialPosition = body.position;
        this.moviment = new CANNON.Vec3(1, 0, 0);
    }

    rotate = (axis, rads) => {
        var angle = rads * 57.2958;
        this.body.quaternion.setFromAxisAngle(axis, angle);
    }

    setMovimentFromTarget = (target) => {
        this.body.velocity.set(0,0,0);
        const epsilon = 0.001;

        if (Math.abs(target) < epsilon || Math.abs(target - (2 * Math.PI)) < epsilon) {
            return this.moviment = new THREE.Vector3(1, 0, 0);
        } else if (Math.abs(target - (Math.PI / 2)) < epsilon) {
            return this.moviment = new THREE.Vector3(0, 0, -1);
        } else if (Math.abs(target - Math.PI) < epsilon) {
            return this.moviment = new THREE.Vector3(-1, 0, 0);
        } else if (Math.abs(target - (3 * Math.PI / 2)) < epsilon) {
            return this.moviment = new THREE.Vector3(0, 0, 1);
        }
        return this.moviment = new THREE.Vector3(0, 0, 0);
    }

    getXYZ = () => {
        if (this.moviment.x != 0)
            return 'x';
        if (this.moviment.y != 0)
            return 'y';
        if (this.moviment.z != 0)
            return 'z';
    }

    isGrounded = (world) => {
        var contactNormal = new CANNON.Vec3(0, 0, 0);
        var upVector = new CANNON.Vec3(0, 1, 0);
        if (world.contacts.length > 0) {
            for (var i = 0; i < world.contacts.length; i++) {
                var contact = world.contacts[i];
                if (contact.bi.id == this.body.id || contact.bj.id == this.body.id) {
                    if (contact.bi.id == this.body.id) {
                        contact.ni.negate(contactNormal);
                    } else {
                        contact.ni.copy(contactNormal);
                    }
                    return contactNormal.dot(upVector) > 0.5 || contactNormal.dot(upVector) < -0.5;
                }
            }
        }
        return false;
    }

    setInitialPosition(pos) {
        this.body.position.copy(pos);
        this.initialPosition = pos;
    }

    startBoucing(time) {
        let offset = .1;
        new TWEEN.Tween(this.body.position)
            .to({ y: this.body.position.y + offset }, time)
            .repeat(Infinity)
            .yoyo(true)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onRepeat(() => offset *= -1)
            .start();
    }

    update = () => {
        this.object.position.copy(this.body.position);
        this.object.quaternion.copy(this.body.quaternion);
    };

}
