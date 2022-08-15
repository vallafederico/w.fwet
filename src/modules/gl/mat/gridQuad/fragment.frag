precision mediump float;

uniform sampler2D u_diff; 
varying vec2 v_res;
varying float v_time;
varying vec2 v_uv;
 
 // animation
 varying float v_a_in;
 varying float v_a_hover;



void main() {
    // animate Uvs
    vec2 uv = v_uv;

    uv -= vec2(.5);
    uv *= .6 + .4 * v_a_in; // in/out animation
    uv *= 1. - v_a_hover * .3; // hover animation
    uv += vec2(.5);

    vec4 img = texture2D(u_diff, uv);
    vec3 bw_img = vec3((img.r) / 1.);

    vec3 final_img = img.rgb;



    gl_FragColor.rgb = final_img;
    gl_FragColor.a = 1.;
}

// vec2 st = gl_FragCoord.xy/v_res.xy;

