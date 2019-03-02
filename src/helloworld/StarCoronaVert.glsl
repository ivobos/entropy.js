varying float vAlpha;

void main() {
    vec3 normalWorld = normalMatrix * normal;
    vec4 posWorld = modelViewMatrix * vec4( position, 1.0 );
    vec3 camToPosDir = normalize(cameraPosition - posWorld.xyz);
    vAlpha = abs(dot(normalWorld,camToPosDir))-.5;
    gl_Position = projectionMatrix * posWorld;
}
