let scene, renderer, cube;
let perspectiveCamera, orthographicCamera;
let currentCamera;

function init() {
    scene = new THREE.Scene();

    perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    perspectiveCamera.position.z = 5;

    let aspectRatio = window.innerWidth / window.innerHeight;
    let cameraWidth = 10;
    let cameraHeight = cameraWidth / aspectRatio;
    orthographicCamera = new THREE.OrthographicCamera(
        cameraWidth / -2,  
        cameraWidth / 2,   
        cameraHeight / 2,  
        cameraHeight / -2,
        0.1,                
        1000                
    );
    orthographicCamera.position.z = 5;

    // Set current camera to perspective
    currentCamera = perspectiveCamera;

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let materials = [
        new THREE.MeshBasicMaterial({color: 0x00ff00}),
        new THREE.MeshBasicMaterial({color: 0xff0000}),
        new THREE.MeshBasicMaterial({color: 0x0000ff}),
        new THREE.MeshBasicMaterial({color: 0xffff00}),
        new THREE.MeshBasicMaterial({color: 0xff00ff}),
        new THREE.MeshBasicMaterial({color: 0x00ffff})
    ];
    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('keydown', switchCamera, false);

    animate();
}

function switchCamera(e) {             // переключення камер за допомогою клавіші "с"
    if(e.key === 'c' || e.key === 'C') {
        if(currentCamera === perspectiveCamera) {
            currentCamera = orthographicCamera;
        } else {
            currentCamera = perspectiveCamera;
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.005;

    renderer.render(scene, currentCamera);
}

init();

