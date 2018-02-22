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
      c,s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  },

  rotationYAxis: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    ];
  },

  rotationXAxis: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      1,0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
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
  shearing: function(sx, sy) {
    return [
      1, sy, 0, 0,
      sx, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  },


  multiply: function(a, b) {

// opengl multiplies col-by-col not row-by-col, so ensure to transpose the transformations (a and b) before passing them here
    return [

      //col-by-col
      a[0]*b[0] + a[4]*b[4] + a[8]*b[8]  + a[12] *b[12],
      a[0]*b[1] + a[4]*b[5] + a[8]*b[9]  + a[12] *b[13],
      a[0]*b[2] + a[4]*b[6] + a[8]*b[10] + a[12] *b[14],
      a[0]*b[3] + a[4]*b[7] + a[8]*b[11] + a[12] *b[15], // end of first row

      a[1]*b[0] + a[5]*b[4] + a[9]*b[8] + a[13]*b[12],
      a[1]*b[1] + a[5]*b[5] + a[9]*b[9] + a[13]*b[13],
      a[1]*b[2] + a[5]*b[6] + a[9]*b[10] + a[13]*b[14],
      a[1]*b[3] + a[5]*b[7] + a[9]*b[11] + a[13]*b[15], // end of second row

      a[2]*b[0] + a[6]*b[4] + a[10]*b[8] + a[14]*b[12],
      a[2]*b[1] + a[6]*b[5] + a[10]*b[9] + a[14]*b[13],
      a[2]*b[2] + a[6]*b[6] + a[10]*b[10] + a[14]*b[14],
      a[2]*b[3] + a[6]*b[7] + a[10]*b[11] + a[14]*b[15], // end of third row

      a[3]*b[0] + a[7]*b[4] + a[11]*b[8] + a[15]*b[12],
      a[3]*b[1] + a[7]*b[5] + a[11]*b[9] + a[15]*b[13],
      a[3]*b[2] + a[7]*b[6] + a[11]*b[10] + a[15]*b[14],
      a[3]*b[3] + a[7]*b[7] + a[11]*b[11] + a[15]*b[15] // end of fourth row

    ];
  },
  invert: function( out, a ){
let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
  },

  transpose:function ( out, a){
     // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a03 = a[3];
    let a12 = a[6], a13 = a[7];
    let a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
},

  translate: function(m, tx, ty,tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  rotate: function(m, xrot,yrot,zrot) {
    xrot = xrot * Math.PI/180;
    yrot = yrot * Math.PI/180;
    zrot = zrot * Math.PI/180;

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
   shear:function(m, sx, sy){
  	return m4.multiply(m, m4.shearing(sx,sy));
  },
  VertexNormalInverseTranspose: function (m, sm, rm){
      let matrix = m4.identity();
      matrix = m4.multiply(m, rm);
      matrix = m4.multiply(m, sm);

      matrix = m4.invert(m,m);
      matrix = m4.transpose(m,m);
      return matrix;
  }
};
