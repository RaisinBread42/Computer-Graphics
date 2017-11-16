"use strict";

var scene, camera, renderer;
var canvas;
var model;
var terrain;
var plane;
var continous = true;
var stats;
var material;
var size=128;
function createWorld() {

    /*_________________________________Setting up scene lighting_______________________________ */

    renderer.setClearColor( 0 );  // Set background color (0, or 0x000000, is black).
    scene = new THREE.Scene();

    // create a camera, sitting on the positive z-axis.  The camera is not part of the scene.
    camera = new THREE.PerspectiveCamera(90, canvas.width/canvas.height, 1, 300);
    camera.position.z = 20;

    // create some lights and add them to the scene.
    scene.add( new THREE.DirectionalLight( 0xffffff, 0.4 ) ); // dim light shining from above
    var viewpointLight = new THREE.DirectionalLight( 0xffffff, 0.8 );  // a light to shine in the direction the camera faces
    viewpointLight.position.set(0,0,1);  // shines down the z-axis
    scene.add(viewpointLight);

    /*_________________________________Setting up Terrain_______________________________ */
    plane = new THREE.PlaneGeometry( 40, 40, size-1, size-1 );

  	material = new THREE.MeshBasicMaterial( { color: 'white',  side: THREE.DoubleSide, wireframe:false} );

    plane.computeFaceNormals();
    terrain = new THREE.Mesh( plane, material );
    terrain.dynamic = true;
    terrain.position.z = -10;
    terrain.rotation.x = -1;
    scene.add(terrain);


// DAT.GUI Related Stuff
var TerrainFunctions = {
  expPow: 1,
  useExponential: false,
  useSine: false,
  piecewise: false
};

var gui = new dat.GUI();

var box = gui.addFolder('terrain');
box.add(terrain.scale, 'x', 0, 3).name('Width').listen();
box.add(terrain.scale, 'y', 0, 3).name('Height').listen();
box.add(terrain.material, 'wireframe').listen();
box.add(TerrainFunctions,'useExponential', 1, 5).name('Use Exponential').listen();
box.add(TerrainFunctions,'expPow', 1, 5).name('Exp. Power').listen();
box.add(TerrainFunctions,'useSine', 1, 5).name('Use Sine').listen();
box.open();

var PieceWiseFunctions = gui.addFolder('Piecewise Generation');
PieceWiseFunctions.add( TerrainFunctions, 'piecewise').name('Use Piecewise').listen();
PieceWiseFunctions.open();
}


/*  Render the scene.  This is called for each frame of the animation.
 */
function render() {
    stats.begin();
    renderer.render(scene, camera);
    //terrain.rotation.z += 0.001;
    stats.end();
    requestAnimationFrame(render);

}

//----------------------------- keyboard support ----------------------------------

/*  Responds to user's key press.  Here, it is used to rotate the models.
 */
function doKey(event) {
    var code = event.keyCode;
    //console.log(code);
    var rotated = true;
    switch( code ) {
        case 37:  terrain.rotation.z -= 0.07;    break;    // left arrow
        case 39:  terrain.rotation.z += 0.07;    break;    // right arrow
        // case 38:  terrain.rotation.x -= 0.07;    break;    // up arrow
        // case 40:  terrain.rotation.x += 0.07;    break;    // down arrow
        // case 33:  terrain.rotation.z -= 0.07;    break;    // page up
        // case 34:  terrain.rotation.z += 0.07;    break;    // page down
        // case 36:  terrain.rotation.set(0.2,-0.4,0); break;    // home
        case 80:  ApplyPerlinNoise(); break; // p button

        default: rotated = false;
    }
    if (rotated) {
        event.preventDefault();  // Prevent keys from scrolling the page.
        render();
    }
}

function ApplyPerlinNoise(){

// must also apply image to canvas "imagecanvas"
var imagecanvas = document.getElementById('noiseimage');
var ctx = imagecanvas.getContext('2d');
var image  = ctx.createImageData(128,128);
imagecanvas.width = imagecanvas.height = 128;

 var rand = Math.random();
 var dgrand = Math.random();
for (var y=0, i=0, pxi=0; y < size; y++) {
  for (var x=0; x < size; x++, i++, pxi+=4) {

    var value = turbulence(x*rand,y*rand, 256);
    //value = Math.pow(value,6); // uncomment to add exponential mountains curves
    //value = Math.log2(value); // uncomment to add log2 mountain curves
    //value = (value <= 0.4) ? Math.pow(value,4): (value > 0.4 && value <= 0.5) ? (0.5 - value):Math.sin(value);

    value = THREE.Math.clamp(value,0,2.5);

    terrain.geometry.vertices[i].z = 10.5* value;
    setTerrainTexturePixel(value, image, pxi);

  }
ctx.putImageData(image,0,0);
}

var texture = new THREE.TextureLoader().load(imagecanvas.toDataURL(), function(texture){
  terrain.material.map = texture;
  terrain.material.needsUpdate = true;
});
//terrain.geometry.colorsNeedUpdate = true;
terrain.geometry.__dirtyVertices = true;
terrain.geometry.verticesNeedUpdate = true;
}

function turbulence(x,y,isize){
var value = 0;
var size = isize;
  while( size >= 1){
      value+= Math.abs(noise.perlin2(x/size, y/size));
      size/=2;
  }
  return ( 128 * value / isize);
}

function setTerrainTexturePixel(c,image, pxi){
  let color = Math.round(c * 255);
  let gradient = THREE.Math.clamp(c,0,1);

  if(color <= 25){
    image.data[pxi] = 16;
    image.data[pxi+ 1] = 5;
    image.data[pxi +2] = 143;
  }
  else if(color > 25 && color <= 50){ // give Water color

    image.data[pxi] = 7;
    image.data[pxi+ 1] = 72;
    image.data[pxi +2] = 234;
  }
  else if( color > 50 && color <= 100){ // give DARKER grass color

     let r  = 1 * gradient, g = 33* gradient, b =  22* gradient;
    image.data[pxi] = r;
    image.data[pxi+ 1] = g;
    image.data[pxi +2] = b;
  }
  else if(color > 100 && color <= 200){ // give grass color
    let r  = 3 * gradient, g = 73* gradient, b = 52* gradient;

    image.data[pxi] = r;
    image.data[pxi+ 1] = g;
    image.data[pxi +2] = b;
  }
  else if (color >200 && color <= 250){ // DIRTY snow
    image.data[pxi] = 200 * gradient;
    image.data[pxi+ 1] = 200* gradient;
    image.data[pxi +2] = 200* gradient;
  }
  else{ // pure white snow
    image.data[pxi] = image.data[pxi+1] = image.data[pxi+2] = 255;
  }

  image.data[pxi+3] = 255;

}
//----------------------------------------------------------------------------------

/**
 *  This init() function is called when by the onload event when the document has loaded.
 */
function init() {

      stats = new Stats();
      stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.getElementById("stats").appendChild( stats.domElement );

    try {
        canvas = document.getElementById("glcanvas");
        renderer = new THREE.WebGLRenderer( {
            canvas: canvas,
            antialias: true
        } );
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
                 "<h3><b>Sorry, WebGL is required but is not available.</b><h3>";
        return;
    }
    document.addEventListener("keydown", doKey, false);
    createWorld();
    render();
}
