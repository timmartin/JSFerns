if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, material, fernObject;

// We use a fixed aspect ratio. This makes it simple to scale the
// canvas to the width of its containing element without having to
// worry about what the correct height should be.
var aspectRatio = 1.6;

$(function() {
    init();
    animate();

    $("#regenerate_button").click(regenerate_fern);
});

var fernState = {
    stemLength: 0
};

function regenerate_fern() {
    scene.remove(fernObject);
    generate_fern();
}

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

function generateFernActions() {
    return [
        rotateX(Math.random()),
        rotateZ(Math.random()),
        scale(0.5 + Math.random() * 0.4),
        stem(30),
        leaf(1, new THREE.Vector3(50, 10, 0)),
        leaf(1, new THREE.Vector3(-40, 20, 0))
    ];
}

var fernActions;

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

function generate_fern() {
    fernActions = generateFernActions();
    
    var geometry = fern(15);
    geometry.normalize();
    geometry.scale(100, 100, 100);
    geometry.translate(0, -40, -15);

    material = new THREE.LineBasicMaterial({color: 0xffffff,
                                            opacity: 1,
                                            linewidth: 3,
                                            vertexColors: THREE.NoColors});

    fernObject = new THREE.LineSegments(geometry, material);
    scene.add(fernObject);
}

function init() {
    camera = new THREE.PerspectiveCamera(33,
                                         aspectRatio,
                                         1,
                                         10000 );
    camera.position.z = 700;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);

    // Force recalculation of the renderer size
    onWindowResize();

    $("#fern_container").append(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    generate_fern();
}

function onWindowResize() {
    var width = $("#fern_container").width();

    renderer.setSize(width, width / aspectRatio);
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
