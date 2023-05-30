const container = document.querySelector(".canvas-container");
const buttonMoveLightUp = document.querySelector(".move-light-up");
const buttonMoveLightRight = document.querySelector(".move-light-right");
const buttonMoveLightDown = document.querySelector(".move-light-down");
const buttonMoveLightLeft = document.querySelector(".move-light-left");
const buttonIncreaseLightIntensity = document.querySelector(".increase-light-intensity");
const buttonDecreaseLightIntensity = document.querySelector(".decrease-light-intensity");
const buttonChangeLightColor = document.querySelector(".change-light-color");

let camera, renderer, cube, scene, light;

const width = 640;
const height = 480;

function render() {
  renderer.render(scene, camera);
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000);
  
    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 150;
  
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
  
    const material = new THREE.MeshPhongMaterial({ color: 0x006400 });  // Dark Green color
  
    const geometry = new THREE.PlaneGeometry(100, 100);
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  
    light = new THREE.PointLight(0xffffff, 2, 1000);  // Increased light intensity
    light.position.set(0, 0, 150);
    scene.add(light);

    render();

    buttonMoveLightUp.addEventListener("click", () => {
        light.position.y += 5;
        render();
    });

    buttonMoveLightRight.addEventListener("click", () => {
        light.position.x += 5;
        render();
    });

    buttonMoveLightDown.addEventListener("click", () => {
        light.position.y -= 5;
        render();
    });

    buttonMoveLightLeft.addEventListener("click", () => {
        light.position.x -= 5;
        render();
    });

    buttonIncreaseLightIntensity.addEventListener("click", () => {
        light.intensity += 0.1;
        render();
    });

    buttonDecreaseLightIntensity.addEventListener("click", () => {
        if (light.intensity > 0) {
          light.intensity -= 0.1;
        }
        render();
    });

    buttonChangeLightColor.addEventListener("click", () => {
        light.color = new THREE.Color(Math.random() * 0xffffff);
        render();
    });
}

init();