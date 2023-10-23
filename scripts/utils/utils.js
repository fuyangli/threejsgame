import * as THREE from 'three';

export function getOrSetNestedPropertyValue(object, propertyPath, newValue) {
    const parts = propertyPath.split('.');
    let value = object;

    for (let i = 0; i < parts.length - 1; i++) {
        if (value[parts[i]] === undefined || typeof value[parts[i]] !== 'object') {
            return undefined; // Propriedade não encontrada ou não é um objeto aninhado
        }
        value = value[parts[i]];
    }

    const lastProperty = parts[parts.length - 1];
    if (newValue !== undefined) {
        value[lastProperty] = newValue;
    }

    return value[lastProperty];
}

export function createVectorFromTarget(target) {
    const epsilon = 0.0001; // Um pequeno valor para lidar com imprecisões de ponto flutuante

    if (Math.abs(target) < epsilon || Math.abs(target - (2 * Math.PI)) < epsilon) {
        return new THREE.Vector3(1, 0, 0);
    } else if (Math.abs(target - (Math.PI / 2)) < epsilon) {
        return new THREE.Vector3(0, 0, 1);
    } else if (Math.abs(target - Math.PI) < epsilon) {
        return new THREE.Vector3(-1, 0, 0);
    } else if (Math.abs(target - (3 * Math.PI / 2)) < epsilon) {
        return new THREE.Vector3(0, 0, -1);
    }

    // Se nenhum dos casos acima for atendido, você pode retornar um valor padrão
    return new THREE.Vector3(0, 0, 0);
}
