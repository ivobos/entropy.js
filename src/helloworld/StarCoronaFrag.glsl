
varying float vAlpha;

void main () {
    gl_FragColor = vec4(vAlpha, vAlpha*0.8, vAlpha*0.8, 0.4);
}
