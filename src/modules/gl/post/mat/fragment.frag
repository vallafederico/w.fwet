precision mediump float;
#define PI 3.14159265359

uniform vec2 u_res;
uniform float u_time;

uniform vec2 u_mouse;
uniform float u_speed;

varying vec2 v_pos;

uniform sampler2D u_diff;
uniform sampler2D u_checker;

// ->> scanlines
 vec3 scanLines(in float uv, in float resolution, in float opacity) {
     float intensity = sin((uv) * resolution * PI * 2.0);
     intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
     return vec3(vec3(pow(intensity, opacity)));
 }


// ->> noise

// ->> uv remapping curvature
vec2 curveRemapUV(in vec2 uv, in vec2 curv) {
   
    uv *= 2.;
    uv -= 1.;
    
    vec2 offset = abs(uv.yx) / vec2(
      curv.x, 
      curv.y
    );

    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + .5;
    return uv;
}

// ->> blend modes
float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}
vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}
vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}



void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float abs_speed = abs(u_speed);

  // curvature
  vec2 curv = vec2(5., 5.);
  vec2 d_uv = curveRemapUV(uv, curv);
  

  // distortion
  float checker = texture2D(u_checker, d_uv).r;

  // mouse
  float dist = distance(u_mouse, v_pos);
  dist = 1. - dist;
  dist = smoothstep(.9, 1., dist);


  /* >> texture */
  // float checker_dist = checker * u_speed * .02;
  float mouse_dist = dist * (u_time) * .003;

  // texture
  vec2 mouse_uv = d_uv;
  vec3 img = texture2D(u_diff, mouse_uv).rgb;
  

  // final image
  vec3 final_img = img.rgb;

  /* >> Scanlines */
  float banding = .9 - cos((sin(mouse_uv.y * 10.) + (u_time)) * 20. + (u_time * 10.)) * .1;
  vec3 scalnline_diff = scanLines(
    mouse_uv.y + u_time * 10., 
    500., 
    banding
  );

  final_img.rgb = blendOverlay(
    final_img, 
    scalnline_diff, 
    .1 + abs(sin(u_time) * .2)
  );


  gl_FragColor.rgb = final_img.rgb;
  // gl_FragColor.rgb = (scalnline_diff);
  gl_FragColor.a = 1.;
}
  


  // vec3 bw_img = vec3((img.r + img.g + img.b) / 3.3333);