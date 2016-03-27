if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,

    camera, scene, renderer, material;

$(function() {
    init();
    animate();
});

function fern(level) {
    if (level <= 0) {
	geometry = new THREE.Geometry();
    }
    else {
	geometry = fern(level - 1);
    }

    geometry.rotateX(0.1);
    geometry.rotateZ(0.01);
    geometry.scale(0.8, 0.8, 0.8);
    geometry.translate(0, 30, 10);

    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 30, 10));
    geometry.vertices.push(new THREE.Vector3(0, 30, 10));
    geometry.vertices.push(new THREE.Vector3(50, 40, 0));
    geometry.vertices.push(new THREE.Vector3(0, 30, 10));
    geometry.vertices.push(new THREE.Vector3(-40, 70, 0));

    return geometry;
}

function init() {

    var i, container;

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera(33,
					 window.innerWidth / window.innerHeight,
					 1,
					 10000 );
    camera.position.z = 700;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    var geometry = fern(12);
    geometry.normalize();
    geometry.scale(100, 100, 100);
    geometry.translate(0, -40, -15);
    
    // lines

    material = new THREE.LineBasicMaterial({color: 0xffffff,
					    opacity: 1,
					    linewidth: 3,
					    vertexColors: THREE.NoColors});

    var line = new THREE.LineSegments(geometry, material);
    scene.add( line );
    
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    camera.lookAt( scene.position );

    var time = Date.now() * 0.0005;

    for ( var i = 0; i < scene.children.length; i ++ ) {
	var object = scene.children[ i ];
	if ( object instanceof THREE.Line ) {
	    object.rotation.y = time;
	}
    }

    renderer.clear();
    renderer.render(scene, camera);
}
