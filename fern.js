if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, material;

$(function() {
    init();
    animate();
});

var fernSettings = {
    stem: function (geometry) {
	var end = new THREE.Vector3(0, 30, 10);
	geometry.translate(0, 30, 10);
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry.vertices.push(end);
	return end;
    }
};

var fernState = {
    stemLength: 0
};

function rotateX(amount) {
    return function(geometry, fernState) {
	geometry.rotateX(amount);
    }
}

function rotateZ(amount) {
    return function(geometry, fernState) {
	geometry.rotateZ(amount);
    }
}

function scale(amount) {
    return function(geometry) {
	geometry.scale(amount, amount, amount);
    }
}

function stem(length) {
    return function(geometry, fernState) {
        geometry.translate(0, length, 0);
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry.vertices.push(new THREE.Vector3(0, length, 0));
	fernState.stemLength = length;
    }
}

function leaf(stemDistance, tipOffset) {
    return function(geometry, fernState) {
        var startPoint =
            new THREE.Vector3(0,
                              stemDistance * fernState.stemLength,
                              0);
        geometry.vertices.push(startPoint);

        var endPoint = startPoint.clone();
        endPoint.add(tipOffset);
        geometry.vertices.push(endPoint);
    }
}

var fernActions = [
    rotateX(0.1),
    rotateZ(0.01),
    scale(0.8),
    stem(30),
    leaf(1, new THREE.Vector3(50, 10, 0)),
    leaf(1, new THREE.Vector3(-40, 20, 0))
];

function fern(level) {
    if (level <= 0) {
	geometry = new THREE.Geometry();
    }
    else {
	geometry = fern(level - 1);
    }

    var i;
    for (i = 0; i < fernActions.length; i++) {
	fernActions[i](geometry, fernState)
    }

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

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

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

    for (var i = 0; i < scene.children.length; i++) {
	var object = scene.children[ i ];
	if (object instanceof THREE.Line) {
	    object.rotation.y = time;
	}
    }

    renderer.clear();
    renderer.render(scene, camera);
}
