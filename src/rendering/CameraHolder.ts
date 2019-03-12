import * as THREE from 'three';
import { PhysicalObject } from '../model/PhysicalObject';

export interface CameraHolder extends PhysicalObject {

    getCamera() : THREE.PerspectiveCamera;

}

