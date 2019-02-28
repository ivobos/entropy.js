
varying float vAlpha;
varying vec3 vColor;

void main () {
//    gl_FragColor = vec4(vAlpha, vAlpha, vAlpha, 1.0 /*vAlpha*/);
    gl_FragColor = vec4(vColor, 1.0);
}