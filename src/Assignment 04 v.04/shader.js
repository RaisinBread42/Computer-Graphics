const vsSource = `
attribute vec3 a_position;
uniform mat4 u_matrix;

attribute vec3 v_normal;
uniform mat4 uNormalMatrix;

uniform vec3 ambientLight;
uniform vec3 directionalVector;
varying highp vec3 vLighting;
uniform float fudgefactor;

attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {

  // position
  float zToDivideBy = 1.0 + a_position.z * fudgefactor;
  vec4 position = u_matrix * vec4( a_position, 1);
  gl_Position = vec4( position.xy/ zToDivideBy, position.zw);

  // lighting
   highp vec3 directionalLightColor = vec3(1, 1, 1);
   highp vec4 transformedNormal = uNormalMatrix * vec4(v_normal, 1.0);
   highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

  vLighting = ambientLight + (directionalLightColor * directional);
  v_texCoord = a_texCoord;
}
  `;

  // Fragment shader program
  const fsSource = `
precision mediump float;

  varying highp vec3 vLighting;
  varying vec2 v_texCoord;
  uniform sampler2D u_image;

    void main() {
      highp vec3 color = vec3( 0.5, 0.5, 0.5);
      gl_FragColor = vec4( color * vLighting * texture2D(u_image, v_texCoord).rgb, 1.0);
    }
  `;


function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

// creates a shader of the given type, uploads the source and
// compiles it.
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
