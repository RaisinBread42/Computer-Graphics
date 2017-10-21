
let fudgingfactor = document.getElementById("perspectiveviewvalue").value;


function InitializeWindow(gl){

	// Clear the canvas.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    let shaderprogram = initShaderProgram(gl,vsSource,fsSource);
    gl.useProgram(shaderprogram);
    render(gl, shaderprogram);

    SceneManager.InitializeVariables();

}

function MainLoop(gl, shaderprogram){

  gl.clear(gl.COLOR_BUFFER_BIT);

    let positionLocation = gl.getAttribLocation(shaderprogram, "a_position");
    let vertnormalLocation = gl.getAttribLocation(shaderprogram,"v_normal");
    let ambientLocation = gl.getUniformLocation(shaderprogram,"ambientLight");
    let directionalVectorLocation = gl.getUniformLocation(shaderprogram,"directionalVector");
  	let matrixLocation = gl.getUniformLocation(shaderprogram, "u_matrix");
    let normalmatrixLocation = gl.getUniformLocation(shaderprogram,"uNormalMatrix");
  	
    //perspective to be done in shader
    let fudgefactorlocation = gl.getUniformLocation(shaderprogram, "fudgefactor");
    gl.uniform1f(fudgefactorlocation,fudgingfactor);

    gl.uniform3fv(ambientLocation, SceneManager.AmbientLight);
    gl.uniform3fv(directionalVectorLocation, SceneManager.DirectionLightPosition);

    let el = 0 ;
    while( el < SceneManager.SelectedObjectsBuffer.length){

    // bind buffers and pass info to shader program for computing lighting
    let normalmatrix = TransformNormalMatrix();
    BufferVertexNormal(gl, el, vertnormalLocation);
    gl.uniformMatrix4fv(normalmatrixLocation, false, normalmatrix); // set the normalmatrixLocation let to normalmatrix

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
        vertnormalLocation, size, type, normalize, stride, offset)
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
        shaderverposition, size, type, normalize, stride, offset)

}

function TransformNormalMatrix(){

    let matrix = m4.identity();
    let scalematrix = m4.scaling(ControlManager.csx, ControlManager.csy, ControlManager.csz);
    let rotationmatrix = m4.rotate(matrix, ControlManager.cxrot, ControlManager.cyrot, ControlManager.czrot);

    matrix = m4.VertexNormalInverseTranspose(matrix, scalematrix, rotationmatrix);
    return matrix;
}

function TransformModelMatrix(){

    let matrix = m4.identity();

    matrix = m4.rotate(matrix, ControlManager.cxrot, ControlManager.cyrot, ControlManager.czrot);
    matrix = m4.scale(matrix, ControlManager.csx, ControlManager.csy, ControlManager.csz);
    matrix = m4.translate(matrix, ControlManager.ctx, ControlManager.cty, ControlManager.ctz);

    return matrix;
}


function render(gl, shaderprogram){
  MainLoop(gl,shaderprogram);
  window.setTimeout(function() {render(gl,shaderprogram);}, 1000/60);
}

