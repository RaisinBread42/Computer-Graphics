
$(document).ready(function(){

	// Add event listeners
	document.getElementById('objectfile').addEventListener('change',handlefilechanged,false);


function handlefilechanged(evt){

	var file = evt.target.files[0]; // first file
	if (file ==null) return;


	var reader = new FileReader();

	reader.onloadend = function(e){

		clearBufferAttributes();
		LoadNewObject(reader.result);
	}

	reader.readAsText(file,'UTF-8');

}

/* Functions for reading the file uploaded */
function LoadNewObject(contents){

// arrays that hold vertex attribute information
  var arr = contents.split("\n");
  var verticeindexes = new Array();
  var vertices = new Array();
  var verticenormals = new Array();

// variables for use only to temporarily store information
  var i=0;
  var tempverts = new Array();
  var tempnormalsindexes= new Array();
  var tempnormals= new Array();


  while(i < arr.length){
    var line = arr[i].split(" ");
    
    if(line[0] == "v")
      tempverts.push( new Array( parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]) ));

    if (line[0] == "vn")
      tempnormals.push( new Array( parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3]) ));

    if( line[0] == "f"){

      verticeindexes.push(parseFloat(line[1].split("//")[0]), parseFloat(line[2].split("//")[0]), parseFloat(line[3].split("//")[0]) );
      tempnormalsindexes.push(parseFloat(line[1].split("//")[1]),parseFloat(line[2].split("//")[1]),parseFloat(line[3].split("//")[1]));
    }    
    i++;
    }

// add vertices and vertex normals to main vertex arrays
i=0;
while( i < verticeindexes.length){

  var index = verticeindexes[i];
  var normalindex = tempnormalsindexes[i];

   vertices.push( tempverts[index - 1][0],tempverts[index - 1][1],tempverts[index- 1][2]);
   verticenormals.push(tempnormals[normalindex - 1][0],tempnormals[normalindex - 1][1],tempnormals[normalindex- 1][2]);

i++;
}

SceneManager.LoadObject(vertices, verticeindexes, verticenormals);

}


function clearBufferAttributes(){
  //clear all buffers
  SceneManager.ClearBuffers();
}


// update GUI to show default values
  document.getElementById("xposlabel").textContent = ControlManager.ctx;
  document.getElementById("yposlabel").textContent = ControlManager.cty;
  document.getElementById("zposlabel").textContent = ControlManager.ctz;
  document.getElementById("xscalelabel").textContent = ControlManager.csx;
  document.getElementById("yscalelabel").textContent = ControlManager.csy;
  document.getElementById("zscalelabel").textContent = ControlManager.csz;
  document.getElementById("xrotlabel").textContent = ControlManager.cxrot;
  document.getElementById("yrotlabel").textContent = ControlManager.cyrot;
  document.getElementById("zrotlabel").textContent = ControlManager.czrot;
  document.getElementById("perspectiveviewlabel").textContent = fudgingfactor;

 SceneManager.AmbientLight = [0.2, 0, 0];
 updateDirLight();

}); /* End of document load function */

ControlManager = {

  /* List of GUI controls */
  ctx: 0,
  cty: 0,
  ctz: -1,
  csx: 1,
  csy: 1,
  csz: 1,
  cxrot: 0,
  cyrot: 0,
  czrot: 0
}
/* Events */

function updateperspective(){
var pv = document.getElementById("perspectiveviewvalue").value;
fudgingfactor = pv;
document.getElementById("perspectiveviewlabel").textContent = pv;

}


function updateXTranslate (){
  ControlManager.ctx = document.getElementById("xlocalpos").value;
  document.getElementById("xposlabel").textContent = ControlManager.ctx;
}

function updateYTranslate (){
  ControlManager.cty = document.getElementById("ylocalpos").value;
  document.getElementById("yposlabel").textContent = ControlManager.cty;
}

function updateZTranslate (){
  ControlManager.ctz = document.getElementById("zlocalpos").value;
  document.getElementById("zposlabel").textContent = ControlManager.ctz;
}

function updateXScale (){
  ControlManager.csx = document.getElementById("xlocalscale").value;
  document.getElementById("xscalelabel").textContent = ControlManager.csx;
}

function updateYScale (){
  ControlManager.csy = document.getElementById("ylocalscale").value;
  document.getElementById("yscalelabel").textContent = ControlManager.csy;
}

function updateZScale (){
  ControlManager.csz = document.getElementById("zlocalscale").value;
  document.getElementById("zscalelabel").textContent = ControlManager.csz;
}

function updateXRotation(){
  ControlManager.cxrot = document.getElementById("xlocalrotation").value ;
  document.getElementById("xrotlabel").textContent = ControlManager.cxrot;
}

function updateYRotation (){
  ControlManager.cyrot = document.getElementById("ylocalrotation").value;
  document.getElementById("yrotlabel").textContent = ControlManager.cyrot;
}

function updateZRotation (){
  ControlManager.czrot = document.getElementById("zlocalrotation").value;
  document.getElementById("zrotlabel").textContent = ControlManager.czrot;
}

function updateAmbientColor(){
  let values = document.getElementById("ambientvalue").value.match(/[A-Za-z0-9]{2}/g);
  values = values.map(function(v) { return parseInt(v, 16)/255; });
  SceneManager.AmbientLight = values;
}

function updateDirLight(){
let xpos = document.getElementById("dirlightx").value;
let ypos = document.getElementById("dirlighty").value;
let zpos = document.getElementById("dirlightz").value;

SceneManager.SetDirLightPosition(Normalize(new Array(xpos,ypos,zpos) ));
}

function Normalize(arr){
let mag = Math.sqrt(arr[0]*arr[0] + arr[1]*arr[1]+ arr[2]*arr[2]);
arr[0]= arr[0]/mag;
arr[1]= arr[1]/mag;
arr[2]= arr[2]/mag;

return arr;
}
