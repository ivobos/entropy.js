
uniform float u_time;
uniform float u_radius;
varying vec3 vNormal;

void main() {
    vec3 color = vec3(0.95, .85, .3);
    float fNoise = snoise(vec4(vNormal*u_radius*8.,u_time))*.5;
    color += vec3(fNoise);
    gl_FragColor = vec4(color,1.0);
}
