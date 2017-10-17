// 3x3 matrix helper to apply matrices to model view matrix
// WebGL Fundamentals provided a great help in the logical understanding and implementation 
var m4 = {
  projection: function(width, height) {
    //This matrix flips the Y axis so that 0 is at the top.
    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      -1, 1, 1, 1
    ];
  },

  identity: function() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  },

  translation: function(tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1
    ];
  },

  rotationZAxis: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  },

  rotationYAxis: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ];
  },

  rotationXAxis: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      1,0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ];
  },

  shearing: function(sx,sy,sz){ // need to find the right matrix 
	return [
      1, 0, 0, sx,
      0, 1, 0, sy,
      0, 0, 1, sz,
      0, 0, 0, 1
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    ];
  },

  multiply: function(a, b) {

    return [

      a[0]*b[0] + a[1]*b[4] + a[2]*b[8] + a[3]*b[12],
      a[0]*b[1] + a[1]*b[5] + a[2]*b[9] + a[3]*b[13],
      a[0]*b[2] + a[1]*b[6] + a[2]*b[10] + a[3]*b[14],
      a[0]*b[3] + a[1]*b[7] + a[2]*b[11] + a[3]*b[15], // end of first row

      a[4]*b[0] + a[5]*b[4] + a[6]*b[8] + a[7]*b[12],
      a[4]*b[1] + a[5]*b[5] + a[6]*b[9] + a[7]*b[13],
      a[4]*b[2] + a[5]*b[6] + a[6]*b[10] + a[7]*b[14],
      a[4]*b[3] + a[5]*b[7] + a[6]*b[11] + a[7]*b[15], // end of second row

      a[8]*b[0] + a[9]*b[4] + a[10]*b[8] + a[11]*b[12],
      a[8]*b[1] + a[9]*b[5] + a[10]*b[9] + a[11]*b[13],
      a[8]*b[2] + a[9]*b[6] + a[10]*b[10] + a[11]*b[14],
      a[8]*b[3] + a[9]*b[7] + a[10]*b[11] + a[11]*b[15], // end of third row

      a[12]*b[0] + a[13]*b[4] + a[14]*b[8] + a[15]*b[12],
      a[12]*b[1] + a[13]*b[5] + a[14]*b[9] + a[15]*b[13],
      a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14],
      a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15], // end of fourth row

    ];

    // previous 3x3 matrix multiplication

    // var a00 = a[0];
    // var a01 = a[1];
    // var a02 = a[2];
    // var a10 = a[3];
    // var a11 = a[4];
    // var a12 = a[5];
    // var a20 = a[6];
    // var a21 = a[7];
    // var a22 = a[8];
    // var b00 = b[0];
    // var b01 = b[1];
    // var b02 = b[2];
    // var b10 = b[3];
    // var b11 = b[4];
    // var b12 = b[5];
    // var b20 = b[6];
    // var b21 = b[7];
    // var b22 = b[8];

    // return [
    //   b00 * a00 + b01 * a10 + b02 * a20,
    //   b00 * a01 + b01 * a11 + b02 * a21,
    //   b00 * a02 + b01 * a12 + b02 * a22,
    //   b10 * a00 + b11 * a10 + b12 * a20,
    //   b10 * a01 + b11 * a11 + b12 * a21,
    //   b10 * a02 + b11 * a12 + b12 * a22,
    //   b20 * a00 + b21 * a10 + b22 * a20,
    //   b20 * a01 + b21 * a11 + b22 * a21,
    //   b20 * a02 + b21 * a12 + b22 * a22,
    // ];
  },

  translate: function(m, tx, ty,tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  rotate: function(m, xrot,yrot,zrot) {

    var matrix = m4.multiply(m, m4.rotationXAxis(xrot));
    matrix = m4.multiply(matrix, m4.rotationYAxis(yrot));
    matrix = m4.multiply(matrix, m4.rotationZAxis(zrot));
    return matrix;
  },

  scale: function(m, sx, sy,sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
  reflect:function(m, angleInRadians){
  	return m4.multiply(m, m4.rotation(angleInRadians));
  },
   shear:function(m, sx,sy,sz){
  	return m4.multiply(m, m4.shearing(sx,sy,sz));
  }
};