precision mediump float;

uniform vec2 u_res;
uniform float u_time;

uniform vec2 u_mouse;
uniform float u_speed;

varying vec2 v_pos;


uniform sampler2D u_diff;
uniform sampler2D u_checker;

// ->> noise
// ->> uv remapping curvature
const vec2 curvature = vec2(5., 5.);
vec2 curveRemapUV(in vec2 uv) {
   
    uv *= 2.;
    uv -= 1.;
    
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + .5;
    return uv;
}


void main() {
  vec2 uv = gl_FragCoord.xy / u_res;

  // curvature
  vec2 d_uv = curveRemapUV(uv);

  // distortion
  float checker = texture2D(u_checker, d_uv).r;

  // mouse
  float dist = distance(u_mouse, v_pos);
  dist = 1. - dist;
  dist = smoothstep(.6, 1., dist);
  

  /* >> texture */
  vec3 img = texture2D(u_diff, d_uv).rgb;
  

  vec3 final_img = img.rgb;


  gl_FragColor.rgb = final_img.rgb;
  // gl_FragColor.rgb = checker;
  gl_FragColor.a = 1.;
}
  


  // vec3 bw_img = vec3((img.r + img.g + img.b) / 3.3333);