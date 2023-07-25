import * as THREE from 'three';
import "./style.css"
import gsap from "gsap"
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls'




const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64,64);

const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
})

const mesh =  new THREE.Mesh(geometry, material);
scene.add(mesh)

//size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}


//light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(10, 10, 10);
light.intensity = 1.25
scene.add(light)

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 20;
scene.add(camera)

//render
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({canvas, antialias: true})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2);
renderer.render(scene, camera)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//resize
window.addEventListener('resize', () =>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    
    camera.aspect = sizes.width /sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()

//timeline magic
const t1 = gsap.timeline({defaults: {duration: 1} })
t1.fromTo(mesh.scale, {z:0, x:0, y:0 }, {z:1, x:1, y:1} )
t1.fromTo("nav", {y: "-100%" }, {y: "0%"})
t1.fromTo(".title", {opacity: 0}, {opacity: 1})


//mouse trail color
let mouseDown = false
let rgb = [];
window.addEventListener("mousedown", ()=> (mouseDown = true))
window.addEventListener("mouseup", ()=> (mouseDown = false))

window.addEventListener('mousemove', (e) =>{
    if (mouseDown){
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255), 150,
        ]
        //animate
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        })
    }
});

// Rest of your existing code...

// Function to generate random positions and sizes for stars and avoid positions too close to the sphere
function generateStars(numStars, spherePosition, minDistance) {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 100;
        y = (Math.random() - 0.5) * 100;
        z = (Math.random() - 0.5) * 100;
      } while (spherePosition.distanceTo(new THREE.Vector3(x, y, z)) < minDistance);
  
      const size = Math.random() * 0.05 + 0.01; // Random size between 0.01 and 0.06
      const color = 0xffffff; // White color
  
      stars.push({ x, y, z, size, color });
    }
    return stars;
  }
  
  // Sphere position and minimum distance from the sphere for star generation
  const spherePosition = new THREE.Vector3(0, 0, 0); // Replace with the actual sphere position
  const minDistanceFromSphere = 2; // Minimum distance from the sphere
  
  // Generate stars with random sizes
  const numStars = 1000;
  const stars = generateStars(numStars, spherePosition, minDistanceFromSphere);
  
  // Create star meshes
  const starGeometry = new THREE.SphereGeometry();
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  for (const star of stars) {
    const starMesh = new THREE.Mesh(starGeometry, starMaterial.clone());
    starMesh.position.set(star.x, star.y, star.z);
    starMesh.scale.set(star.size, star.size, star.size);
    scene.add(starMesh);
  }
  
  // Random blinking effect using GSAP
  function blinkStars(starMeshes) {
    for (const starMesh of starMeshes) {
      gsap.to(starMesh.material, {
        opacity: 0.2,
        duration: Math.random() * 0.5 + 0.2,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 3, // Random delay for each star
      });
    }
  }
  
  // Call the blinkStars function to start the blinking effect
  blinkStars(scene.children.filter((child) => child instanceof THREE.Mesh));
  
  // Rest of your existing code...
  
  
  
  