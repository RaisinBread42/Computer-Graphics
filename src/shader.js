const vsSource = `
attribute vec3 a_position;
uniform float fudgefactor;
uniform mat4 u_matrix;
 
void main() {

  float zToDivideBy = 1.0 + a_position.z * fudgefactor;
  vec4 position = u_matrix * vec4( a_position, 1);
    
  gl_Position = vec4( position.xy/ zToDivideBy, position.zw);
}
  `;

  // Fragment shader program
  const fsSource = `

    void main() {
      gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0);
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


