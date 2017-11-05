
var SceneManager = {

/* Canvas width and height */
Width: 900,
Height:600,

/* Perspective View*/
PerspectiveAngle: 0,
PZNear: 1,
PZFar: 2000,

/* List of all objects in the scene*/
Objects: new Array(),
SelectedObjects : new Array(),

ObjectsBuffer: new Array(),
SelectedObjectsBuffer: new Array(),

/* Get/Set variables */
AmbientLight: new Array(),
DirectionLightPosition: new Array(),
DirectionLightColor: new Array(),
Image: new Image(),

SetDirLightPosition: function(arr){
this.DirectionLightPosition = arr;
},

GetPerspectiveAngle: function(){
  return this.PerspectiveAngle;
},

UpdatePerspective: function (angle, near, far){
  this.PerspectiveAngle = angle;
  this.PZNear = near;
  this.PZFar = far;
},

InitializeVariables: function(){

  sliderUpdateXRotation();
  sliderUpdateYRotation();
  ControlManager.ctx = parseFloat(document.getElementById("xlocalpos").value,10);
  ControlManager.cty = parseFloat(document.getElementById("ylocalpos").value,10);
  ControlManager.ctz = parseFloat(document.getElementById("zlocalpos").value,10);
  ControlManager.csx = parseFloat(document.getElementById("xlocalscale").value,10);
  ControlManager.csy = parseFloat(document.getElementById("ylocalscale").value,10);
  ControlManager.csz = parseFloat(document.getElementById("zlocalscale").value,10);
  ControlManager.cxrot = parseFloat(document.getElementById("xlocalrotation").value,10);
  ControlManager.cyrot = parseFloat(document.getElementById("ylocalrotation").value,10);
  ControlManager.czrot = parseFloat(document.getElementById("zlocalrotation").value,10);

  this.Width = document.getElementById("canvas").clientWidth;
  this.Height = document.getElementById("canvas").clientHeight;

var i;
while( i=0 < this.SelectedObjects.length){

	let o = this.SelectedObjects[i];

  	o.tx = ControlManager.ctx; o.ty = ControlManager.cty; o.tz = ControlManager.ctz;
  	o.sx = ControlManager.csx; o.sy = ControlManager.csy; o.sz = ControlManager.csz;
  	o.xrot = ControlManager.cxrot; o.yrot = ControlManager.cyrot; o.zrot = ControlManager.czrot;
}

},

LoadObject: function(verts, vindexes, vnormals, textcoords){

let o = {
vertices : verts,
verticeIndexes: vindexes,
verticenormals: vnormals,
textureCoords: textcoords,
isActive : true,
isSelected : true
}
this.Objects.push(o);
this.SelectedObjects.push(o);
this.SelectedObjectsBuffer.push(o);
this.ObjectsBuffer.push(o);

},

ClearBuffers: function(){

SelectedObjectsBuffer = new Array();
ObjectsBuffer = new Array();
}


}; // End of SceneManager Object
