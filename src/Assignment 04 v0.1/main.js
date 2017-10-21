
var fudgingfactor = document.getElementById("perspectiveviewvalue").value;


function InitializeWindow(gl){

	// Clear the canvas.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var shaderprogram = initShaderProgram(gl,vsSource,fsSource);
    gl.useProgram(shaderprogram);
    render(gl, shaderprogram);

    SceneManager.InitializeVariables();

}

function MainLoop(gl, shaderprogram){

  gl.clear(gl.COLOR_BUFFER_BIT);

    var positionLocation = gl.getAttribLocation(shaderprogram, "a_position");
  	// lookup uniforms
  	var matrixLocation = gl.getUniformLocation(shaderprogram, "u_matrix");
  	
    //perspective to be done in shader
    var fudgefactorlocation = gl.getUniformLocation(shaderprogram, "fudgefactor")
    gl.uniform1f(fudgefactorlocation,fudgingfactor);

    var el = 0 ;
    while( el < SceneManager.SelectedObjectsBuffer.length){

  	// Create a buffer to put positions in
  	var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(SceneManager.SelectedObjectsBuffer[el].vertices), gl.STATIC_DRAW);

    // Turn on the attribute to pull vertices from the currently binded vertex array buffer
    gl.enableVertexAttribArray(positionLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset)

  	// Do all the transformation desired here
    // Compute the matrices
    var matrix = TransformModelMatrix();

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = (SceneManager.SelectedObjectsBuffer[el].verticeIndexes.length > 0)  ? SceneManager.SelectedObjectsBuffer[el].verticeIndexes.length: 0;  
    gl.drawArrays(primitiveType, offset, count);

    el++;
}
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // unbinding
}

function TransformModelMatrix(){

    var matrix = m4.identity();

    matrix = m4.rotate(matrix, ControlManager.cxrot, ControlManager.cyrot, ControlManager.czrot);
    matrix = m4.scale(matrix, ControlManager.csx, ControlManager.csy, ControlManager.csz);
    matrix = m4.translate(matrix, ControlManager.ctx, ControlManager.cty, ControlManager.ctz);

    return matrix;
}


function render(gl, shaderprogram){
  MainLoop(gl,shaderprogram);
  window.setTimeout(function() {render(gl,shaderprogram);}, 1000/60);
}

