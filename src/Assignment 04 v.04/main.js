
function InitializeWindow(gl){

	// Clear the canvas.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    let shaderprogram = initShaderProgram(gl,vsSource,fsSource);
    gl.useProgram(shaderprogram);

    let image = new Image();
    image.src="http://localhost:8080/tile.jpeg";
    image.onload = function(){
    SceneManager.Image = image;
    render(gl, shaderprogram);
    }

    SceneManager.InitializeVariables();
    LoadNewObject(cubeObj);


    document.addEventListener("keydown", doKey, false);

}

function MainLoop(gl, shaderprogram){

  gl.clear(gl.COLOR_BUFFER_BIT);

    let positionLocation = gl.getAttribLocation(shaderprogram, "a_position");
    let vertnormalLocation = gl.getAttribLocation(shaderprogram,"v_normal");
    let ambientLocation = gl.getUniformLocation(shaderprogram,"ambientLight");
    let directionalVectorLocation = gl.getUniformLocation(shaderprogram,"directionalVector");
  	let matrixLocation = gl.getUniformLocation(shaderprogram, "u_matrix");
    let normalmatrixLocation = gl.getUniformLocation(shaderprogram,"uNormalMatrix");
    let textureUVLocation = gl.getAttribLocation(shaderprogram, "a_texCoord");

    gl.uniform3fv(ambientLocation, SceneManager.AmbientLight);
    gl.uniform3fv(directionalVectorLocation, SceneManager.DirectionLightPosition);

    let el = 0 ;
    while( el < SceneManager.SelectedObjectsBuffer.length){

    // bind buffers and pass info to shader program for computing lighting
    let normalmatrix = TransformNormalMatrix();
    BufferVertexNormal(gl, el, vertnormalLocation);
    gl.uniformMatrix4fv(normalmatrixLocation, false, normalmatrix); // set the normalmatrixLocation let to normalmatrix

    // set up texture rendering

    BufferTexture(gl, SceneManager.Image, SceneManager.SelectedObjectsBuffer[el].textureCoords, textureUVLocation);

    // compute transformations
    let matrix = TransformModelMatrix();
    BufferVertexPosition(gl, el, positionLocation); // bind vertex position buffer

    gl.uniformMatrix4fv(matrixLocation, false, matrix); // set the matrixLocation let to matrix

    // Draw the geometry.
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = (SceneManager.SelectedObjectsBuffer[el].verticeIndexes.length > 0)  ? SceneManager.SelectedObjectsBuffer[el].verticeIndexes.length: 0;
    gl.drawArrays(primitiveType, offset, count);

    el++;
}
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // unbinding
}

function BufferTexture(gl, image ,textcoords, texCoordLocation){
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textcoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}

function BufferVertexNormal(gl, elindex, vertnormalLocation){
    let vertnormalbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertnormalbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(SceneManager.SelectedObjectsBuffer[elindex].verticenormals), gl.STATIC_DRAW);

    // Turn on the attribute to pull vertices from the currently binded vertex array buffer
    gl.enableVertexAttribArray(vertnormalLocation);

    // Tell the attribute how to get data out of vertexnormalBuffer (ARRAY_BUFFER)
    let size = 3;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        vertnormalLocation, size, type, normalize, stride, offset);
}

function BufferVertexPosition(gl,elindex,shaderverposition){
    // Create a buffer to put positions in
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(SceneManager.SelectedObjectsBuffer[elindex].vertices), gl.STATIC_DRAW);

    // Turn on the attribute to pull vertices from the currently binded vertex array buffer
    gl.enableVertexAttribArray(shaderverposition);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let size = 3;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        shaderverposition, size, type, normalize, stride, offset);
}

function TransformNormalMatrix(){

    let matrix = m4.identity();
    let scalematrix = m4.scaling(ControlManager.csx, ControlManager.csy, ControlManager.csz);
    let rotationmatrix = m4.rotate(matrix, ControlManager.cxrot, ControlManager.cyrot, ControlManager.czrot);

    matrix = m4.VertexNormalInverseTranspose(matrix, scalematrix, rotationmatrix);
    return matrix;
}

function TransformModelMatrix(){

    var matrix = m4.identity();
    matrix = m4.rotate(matrix, ControlManager.cxrot, ControlManager.cyrot, ControlManager.czrot);
    matrix = m4.scale(matrix, ControlManager.csx, ControlManager.csy, ControlManager.csz);
    matrix = m4.translate(matrix, ControlManager.ctx, ControlManager.cty, ControlManager.ctz);
    matrix = m4.projectPerspective(matrix);
    return matrix;
}

function render(gl, shaderprogram){
  MainLoop(gl,shaderprogram);
  window.setTimeout(function() {render(gl,shaderprogram);}, 1000/60);
}


function doKey(event){

      //----------------------------- keyboard support ----------------------------------

  /*  Responds to user's key press.  Here, it is used to rotate the models.
   */
      var code = event.keyCode;
      event.preventDefault();  // Prevent keys from scrolling the page.
      switch( code ) {
          case 37: updateYRotation(-3); break;    // left arrow
          case 39: updateYRotation(3); break;    // right arrow
          case 38: updateXRotation(3);  break;    // up arrow
          case 40: updateXRotation(-3); break;    // down arrow
      }
}

    const cubeObj = `
# Blender v2.79 (sub 0) OBJ File:
# www.blender.org
mtllib cubewithUVcoords.mtl
o Cube
v 1.000000 -1.000000 -1.000000
v 1.000000 -1.000000 1.000000
v -1.000000 -1.000000 1.000000
v -1.000000 -1.000000 -1.000000
v 1.000000 1.000000 -0.999999
v 0.999999 1.000000 1.000001
v -1.000000 1.000000 1.000000
v -1.000000 1.000000 -1.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 0.000000 0.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 0.000000 0.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 0.000000 0.000000
vt 0.000000 0.000000
vt 1.000000 1.000000
vt 1.000000 0.000000
vt 0.000000 1.000000
vt 1.000000 1.000000
vt 1.000000 1.000000
vt 1.000000 1.000000
vt 1.000000 0.000000
vt 1.000000 1.000000
vn 0.0000 -1.0000 0.0000
vn 0.0000 1.0000 0.0000
vn 1.0000 -0.0000 0.0000
vn 0.0000 -0.0000 1.0000
vn -1.0000 -0.0000 -0.0000
vn 0.0000 0.0000 -1.0000
usemtl Material
s off
f 2/1/1 4/2/1 1/3/1
f 8/4/2 6/5/2 5/6/2
f 5/7/3 2/8/3 1/3/3
f 6/9/4 3/10/4 2/11/4
f 3/12/5 8/13/5 4/2/5
f 1/14/6 8/15/6 5/6/6
f 2/1/1 3/16/1 4/2/1
f 8/4/2 7/17/2 6/5/2
f 5/7/3 6/18/3 2/8/3
f 6/9/4 7/17/4 3/10/4
f 3/12/5 7/19/5 8/13/5
f 1/14/6 4/20/6 8/15/6 `;
