
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export function handleInput(manager) {

    if (manager.state.cameraRotation) return;
    let isGrounded = manager.player.isGrounded(manager.world);
    let axis = manager.player.getXYZ();
    manager.player.body.velocity.set(0,0,0);
    if (manager.keys.A) {
        manager.player.body.velocity[axis] = -manager.values.moveSpeed * (!isGrounded ? 0.5 : 1) * manager.player.moviment[axis];
    }
    else if (manager.keys.D) {
        manager.player.body.velocity[axis] = manager.values.moveSpeed * (!isGrounded ? 0.5 : 1) * manager.player.moviment[axis];
    }
    else if (isGrounded) {
        manager.player.body.velocity[axis] = 0;
        manager.state.jumpCount = 0;
    }

    //if (!isGrounded) return;
    if (manager.keys.E) {
        manager.keys.E = false;
        manager.state.cameraRotation = true;
        resetColliders(manager);
        let rotation = manager.boom.rotation;
        let target = rotation.y + (Math.PI / 2);
        new TWEEN.Tween(rotation)
            .to({ y: target }, 600)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => manager.player.body.velocity.y = 0)
            .onComplete(() => {
                if (target >= 2 * Math.PI) {
                    target %= 2 * Math.PI;
                    rotation.y = target;
                }
                //manager.player.rotate(new Vector3(0, 1, 0), target);
                manager.player.setMovimentFromTarget(target);
                handleColliders(manager);
                manager.state.cameraRotation = false;
            })
            .start();
    }
    if (manager.keys.Q) {
        manager.keys.Q = false;
        manager.state.cameraRotation = true;
        resetColliders(manager);
        let rotation = manager.boom.rotation;
        let target = rotation.y - (Math.PI / 2);
        new TWEEN.Tween(rotation)
            .to({ y: target }, 600)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => manager.player.body.velocity.y = 0)
            .onComplete(() => {
                if (target < 0) {
                    target = (Math.PI) - target;
                    rotation.y = target;
                }
                manager.player.setMovimentFromTarget(target);
                handleColliders(manager);
                manager.state.cameraRotation = false;
            })
            .start();
    }

    

    if (manager.keys.SPACE 
        //&& isGrounded
        ) {
        manager.keys.SPACE = false;
        // manager.player.body.velocity.y = manager.values.jumpSpeed;
        // manager.state.jumpCount++;
        manager.world.gravity.y *= -1;
    }

}

export function resetColliders(manager) {
    let axis = manager.player.getXYZ();
    manager.player.body.position[axis == 'x' ? 'z' : 'x'] = 0;
    manager.physicObjects.forEach(physical =>{
        if(physical != manager.player) {
            physical.body.position.copy(physical.initialPosition);
        }
    });
}

export function handleColliders(manager) {
    
    let axis = manager.player.getXYZ();
    manager.physicObjects.forEach(physical =>{
        physical.body.position[axis == 'x' ? 'z' : 'x'] = 0;
    });
};

export function onKeyUp(e, manager) {
    manager.keys[(e.key.trim() || e.code).toUpperCase()] = false;
}

export function onKeyDown(e, manager) {
    manager.keys[(e.key.trim() || e.code).toUpperCase()] = true;
}

export function onTouchStart(e, manager) {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const screenWidth = manager.viewport.w;

    if (touchY > manager.viewport.h - 100) {
        manager.keys['SPACE']= true;
        return;
    }

    if (touchX > screenWidth / 2) {
        manager.keys['D'] = true;
    } else {
        manager.keys['A'] = true;
    }

    
}

export function onTouchEnd(e, manager) {
    manager.keys['D'] = false;
    manager.keys['A'] = false;
    manager.keys['SPACE'] = false;
}