


function step2(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 5, 20000);
    //var renderer = new THREE.WebGLRenderer();
    var renderer = new THREE.WebGLRenderer({
            antialias:true, 
            precision:"highp", 
            alpha:true, 
            preserveDrawingBuffer:true,
            maxLights:1 
        });
    //renderer.setClearColor(new THREE.Color(0xEEEEEE),1);

    renderer.setSize(window.innerWidth, window.innerHeight);
    var axes = new THREE.AxisHelper(6000);
    axes.position.set(0,0,0);
    scene.add(axes);
    var controls = new THREE.TrackballControls( camera );
    addImage('img/cup.png', 159, 489, 300, -300)
    addImage('img/medal.png',627,382, 300, 300)
    addImage('img/camera.png', 481, 410, -300, -300)
    addImage('img/star1.png',121,167, -300, 300)
    addImage('img/cup.png', 159, 489, 600, -600)
    addImage('img/medal.png',627,382, 600, 600)
    addImage('img/camera.png', 481, 410, -600, -600)
    addImage('img/star1.png',121,167, -600, 600)
    function addImage(url, w, h,x, y,z){
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
                            plane.position.z = z || 0;
                            
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

    camera.position.set(0,0,600);
    animate();

    function animate() {

            requestAnimationFrame( animate );

            document.getElementById('ship').style.transform = 'translate(0, '+ Math.sin(angle) * 6 +'px)'
            angle += 0.28;
            controls.update();
            document.body.appendChild(renderer.domElement);

            renderer.render(scene, camera);
    }
}


//step2();
step1();
var globalTag = 0;
function step1(){
    $('.back').on('touchmove',function(e){
        e.preventDefault();
        //return false;
    })
    // var top = -6200;
    // var left = -1417;
    var top = 6200;
    var left = -16000;
    var touchy = 0;
    document.getElementById('step1').addEventListener( 'touchstart', function( event ) {

        event.preventDefault();
        event.stopPropagation();

        switch ( event.touches.length ) {

            case 1:
                touchy = event.touches[ 0 ].pageY;
                break;
        }

    }, false );
    document.getElementById('step1').addEventListener( 'touchmove', function( event ) {

        event.preventDefault();
        event.stopPropagation();

        switch ( event.touches.length ) {

            case 1:
                var dy = event.touches[ 0 ].pageY - touchy;
                touchy = event.touches[ 0 ].pageY;
                // _zoomStart.y -= dy * 0.00025;
                globalTag = globalTag + dy;
                $('.back').css({
                        top: top,
                        left: left
                    })

                    top = top + dy;
                    left = left - dy ;
                
                console.log(globalTag)
                break;
        }

    }, false );


    //animate();
    function animate() {
        requestAnimationFrame( animate );
        $('.back').css({
            top: top,
            left: left
        })

        top = top + 3;
        left = left -3 ;
    }


}

