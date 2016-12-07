
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 5, 10000);
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xEEEEEE));

renderer.setSize(window.innerWidth, window.innerHeight);
var axes = new THREE.AxisHelper(1000);
axes.position.set(0,0,0);
scene.add(axes);
var controls = new THREE.TrackballControls( camera );

addImage('img/cup.png', 159, 489, 300, -300)
addImage('img/medal.png',627,382, 300, 300)
addImage('img/camera.png', 481, 410, -300, -300)
addImage('img/star1.png',121,167, -300, 300)
//addImage('img/bg.jpg',5689, 2208, 0, 0)
function addImage(url, w, h,x, y){
        var loader = new THREE.TextureLoader();
        // load a resource
        loader.load(
                // resource URL
                url,
                // Function when resource is loaded
                function ( texture ) {
                        var planeGeometry = new THREE.PlaneGeometry(w, h);
                        var planeMaterial = new THREE.MeshBasicMaterial({map: texture, transparent:true,depthWrite:false});
                        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
                        // rotate and position the plane
                        plane.position.x = x;
                        plane.position.y = y;
                        plane.position.z = 0
                        plane.rotation.y = 0;
                        plane.rotation.z = 0;
                        scene.add(plane);

                        // create a cube
                        var controls;
                        controls = new THREE.TrackballControls( camera );
                        document.body.appendChild(renderer.domElement);
                        renderer.render(scene, camera);
                }
        );
}
var angle = 0;
var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// position the cube
cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;
// add the cube to the scene
scene.add(cube);

// position and point the camera to the center of the scene
camera.position.set(45,0,600);
camera.lookAt(scene.position);

var cubeMap = new THREE.CubeTexture( [] );
cubeMap.format = THREE.RGBFormat;
var loader = new THREE.ImageLoader();
loader.load( '0.jpg', function ( image ) {

        var getSide = function ( x, y ) {

                var size = 1024;

                var canvas = document.createElement( 'canvas' );
                canvas.width = size;
                canvas.height = size;

                var context = canvas.getContext( '2d' );
                context.drawImage( image, - x * size, - y * size );

                return canvas;

        };

        cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
        cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
        cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
        cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
        cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
        cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
        cubeMap.needsUpdate = true;

} );

animate();

function animate() {

        requestAnimationFrame( animate );

        document.getElementById('ship').style.transform = 'translate(0, '+ Math.sin(angle) * 2 +'px)'
        angle += 0.12;
        controls.update();
        document.body.appendChild(renderer.domElement);

        renderer.render(scene, camera);
}

