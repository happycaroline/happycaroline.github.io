var mythree = function(){
    //鍒濆鍖栧満鏅�
    //闃绘榛樿
    $(document).on('touchmove',function(e){
        e.preventDefault();
    });
    //鐢诲竷
    var scene = new THREE.Scene();
    //闀滃ご
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
    //娓叉煋WebGL娓叉煋鐨�
    var renderer = new THREE.WebGLRenderer({
        antialias:true, 
        precision:"highp",
        alpha:true, 
        preserveDrawingBuffer:true, 
        maxLights:1 
    });
    //娓叉煋鍦烘櫙
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //鍒濆闀滃ご浣嶇疆
    camera.position.z = 2;
    //娣诲姞鍦烘櫙鍏冪礌
    addCube(function(cube){
        scene.add( cube );
    },.062,.638,"img/camera.png",0,-.18,0);
    addCube(function(cube){
        cube.rotation.y = 3.1;
        scene.add( cube );
    },.234,.199,"img/tm/1.png",.3,0,1.5);
    addCube(function(cube){
        scene.add( cube );
    },.234,.199,"img/tm/1.png",-.3,0,1.5);
    addCube(function(cube){
        scene.add( cube );
    },.181,.331,"img/tm/2.png",-.15,.3,.12);
    addCube(function(cube){
        cube.rotation.y = 3.1;
        scene.add( cube );
    },.181,.331,"img/tm/2.png",.15,.3,.12);
    addCube(function(cube){
        scene.add( cube );
    },.174,.344,"img/tm/3.png",.2,-.04,.53);
    addCube(function(cube){
        cube.rotation.y = 3.1;
        scene.add( cube );
    },.174,.344,"img/tm/3.png",-.2,-.04,.53);
    addCube(function(cube){
        scene.add( cube );
    },.250,.253,"img/tm/4.png",.3,.5,.34);
    addCube(function(cube){
        scene.add( cube );
    },.193,.302,"img/tm/5.png",-.15,-.1,.15);
    addCube(function(cube){
        cube.rotation.y = 3.1;
        scene.add( cube );
    },.193,.302,"img/tm/5.png",.15,-.1,.15);
    addCube(function(cube){
        cube.rotation.y = 3.1;
        scene.add( cube );
    },.133,.386,"img/tm/6.png",-.1,-.1,1.67);
    addCube(function(cube){
        scene.add( cube );
    },.133,.386,"img/tm/6.png",.1,-.1,1.67);
    addCube(function(cube){
        scene.add( cube );
    },.122,.392,"img/tm/7.png",-.2,-.1,2.1);
    addCube(function(cube){
        cube.rotation.y = 3.1;
        scene.add( cube );
    },.122,.392,"img/tm/7.png",.2,-.1,2.1);
    addCube(function(cube){
        scene.add( cube );
    },.142,.198,"img/tm/8.png",.15,.15,.78);
    addCube(function(cube){
        cube.rotation.y = 3.1;
        scene.add( cube );
    },.142,.198,"img/tm/8.png",-.15,.15,.78);
    //瑙︽懜浜嬩欢
    var curX;
    $("body").on("touchmove",function(e){
        if(curX > e.touches[0].pageY){
            camera.position.z += .1;
        }else{
            if(camera.position.z > .4){
                camera.position.z -= .1;
            }
        }
        curX = e.touches[0].pageY;
        renderer.render(scene, camera);
    });


    var renderTime = 0, renderEvent = 0;
    var render = function(){
        if(renderTime == 0){
            requestAnimationFrame(render);
            if(camera.position.z <= 20){
                camera.position.z +=.3;
                if(camera.position.z >= 20)
                    renderTime = 1;
            }
        } else if(renderTime == 1){
            requestAnimationFrame(render);
            if(camera.position.z >= .4){
                camera.position.z -=.2;
                if(camera.position.z <= 2.5){
                    camera.position.z = 2.5;
                    renderTime = 2;
                }
            }
        } else {
            if(!renderEvent){
                renderEvent = 1;
                window.addEventListener('deviceorientation', function(e){
                    //鎽囦竴鎽�
                    // e.alpha
                    var _x = e.gamma * 0.005;
                    if(_x < .08 && _x > -.08){
                        camera.position.x = _x;
                        renderer.render(scene, camera);
                        $('#res').html(_x);
                    } 



                    // demo
                    // console.log('absolute: ' + e.absolute)
                    // console.log('alpha: ' + e.alpha)
                    // console.log('beta: ' + e.beta)
                    // console.log('gamma: ' + e.gamma)
                });
            }else {
                camera.position.x = 0;
            }
        }
        renderer.render(scene, camera);
    }
    // 璧峰鍔ㄧ敾
    render();



var Spiral = 0;



}

//------------------------------------------------------------------------------------------------------------
//鍒涘缓涓€涓敾鏉垮厓绱�
// addCube
// data : width,height,zindex,imageURL
var addCube = function(callback,width,height,imageURL,positionx,positiony,positionz){
    var thiswidth = width || 1; 
    var thisheight = height || 1; 
    var thisimageURL = imageURL || "img/tm.png";
    var thispx = positionx != undefined ? positionx : fRandomBy(-4,4);
    var thispy = positiony != undefined ? positiony : fRandomBy(-4,4);
    var thispz = positionz != undefined ? positionz : fRandomBy(-4,4);
    var geometry = new THREE.PlaneGeometry( thiswidth, thisheight );

    var loader = new THREE.TextureLoader();
    // 鍔犺浇涓€涓祫婧�
    loader.load(
        // 璧勬簮閾炬帴
        thisimageURL,
        // 璧勬簮鍔犺浇瀹屾垚鍚庣殑鍥炶皟鍑芥暟
        function ( texture ) {
            var material = new THREE.MeshBasicMaterial( {map:texture, side: THREE.DoubleSide, transparent: true} );
            var cube = new THREE.Mesh( geometry, material );
            cube.position.x= thispx;
            cube.position.y= thispy;
            cube.position.z= thispz;
            return callback(cube);
        },
        // 璧勬簮鍔犺浇杩囩▼涓殑鍥炶皟鍑芥暟
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // 璧勬簮涓嬭浇鍑洪敊鏃剁殑鍥炶皟鍑芥暟
        function ( xhr ) {
            console.log( 'An error happened' );
        }
    );
}

// //闅忔満鏁�
// function fRandomBy(under, over){
//    switch(arguments.length){
//      case 1: return parseInt(Math.random()*under+1); 
//      case 2: return parseInt(Math.random()*(over-under+1) + under); 
//      default: return 0; 
//    } 
// } 


