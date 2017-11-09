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
    plane = new THREE.PlaneGeometry( 100, 100, size, size );


  	material = new THREE.MeshBasicMaterial( { color: 'blue',  side: THREE.DoubleSide, vertexColors:THREE.FaceColors, wireframe:true} );

    plane.computeFaceNormals();
    terrain = new THREE.Mesh( plane, material );
    terrain.dynamic = true;
    terrain.position.z = -10;
    terrain.rotation.x = -1;
    scene.add(terrain);


// DAT.GUI Related Stuff

var gui = new dat.GUI();

var box = gui.addFolder('terrain');
box.add(terrain.scale, 'x', 0, 3).name('Width').listen();
box.add(terrain.scale, 'y', 0, 3).name('Height').listen();
box.add(terrain.material, 'wireframe').listen();
box.open();

}


/*  Render the scene.  This is called for each frame of the animation.
 */
function render() {
    stats.begin();
    renderer.render(scene, camera);
    terrain.rotation.z +=0.001;
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
        // case 37:  terrain.rotation.y -= 0.07;    break;    // left arrow
        // case 39:  terrain.rotation.y += 0.07;    break;    // right arrow
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

 var rand = Math.random();
 var i =0;
for (var y = 0; y < size; y++) {
  for (var x = 0; x < size; x++) {
    i++;
    var value = 2.5 *turbulence(x*rand,y*rand, 256*2);
     value = (value > 1) ? 1:value;
    terrain.geometry.vertices[i].z = value;
  }
}

// for (var i = 0; i < terrain.geometry.faces.length; i++) {
//   terrain.geometry.faces[i].materialIndex = 1;
//   terrain.geometry.faces[i].color.setRGB();
// }
console.log();
console.log(terrain.geometry.faces.length);

terrain.geometry.colorsNeedUpdate = true;
terrain.geometry.__dirtyVertices = true;
terrain.geometry.verticesNeedUpdate = true;
}

function turbulence(x,y,isize){
var value = 0;
var size = isize;
  while( size >= 1){
      value+= noise.simplex2(x/size, y/size);
      size/=2;
  }
  return ( 128 * value / isize);
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
