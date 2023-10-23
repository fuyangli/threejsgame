import TWEEN from '@tweenjs/tween.js';

export function updateCamera(manager) {
    new TWEEN.Tween(manager.boom.position)
        .to({ x: manager.player.body.position.x, y: manager.player.body.position.y, z: manager.player.body.position.z }, 100)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
}