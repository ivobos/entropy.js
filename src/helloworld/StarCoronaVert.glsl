varying float vAlpha;

void main() {
    vec4 normalInCameraCoord = modelViewMatrix * vec4( normal, 1.0);
    // vec3 viewVector = cameraPosition - position;
    // viewVector = normalize(viewVector);
    // vAlpha = abs(dot(viewVector, normal));
    // vAlpha = abs(normalize(position).x);

    vAlpha = 1.0 - abs(dot(normalInCameraCoord.xyz,vec3(0.0,0.0,1.0)));
    // vAlpha = cameraDirection.z;
    // vAlpha = 1.0-abs(normal.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
