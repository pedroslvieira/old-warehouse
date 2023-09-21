import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {Lethargy} from 'lethargy'
import {WheelGesture, wheelOptions, sharedOptions} from '@use-gesture/vanilla'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded',
    directionalLightIntensity: 2,
    directionalLightX: 0,
    directionalLightY: 1,
    directionalLightZ: 0,
    pointLightIntensity: 2,
    pointLightX: 1,
    pointLightY: -0.5,
    pointLightZ: -3.5,
    ambientLightIntensity: -2,
    pointLightColor: 0xffffff, 
    cameraX: -12,
    cameraY: -2.8,
    cameraZ: -9,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: -4,
    cameraZoom: 1,
}

// old camera initial position
// cameraX: -4,
// cameraY: -0.02,
// cameraZ: -3.8,
// lookAtX: -5,
// lookAtY: 0,
// lookAtZ: -4,

// Directional light 
const directionalLightFolder = gui.addFolder('Directional light')

directionalLightFolder
.add(parameters, 'directionalLightIntensity')
.min(- 100)
.max(100)
.step(1)
.name('Intensity')
.onChange(() => {
    directionalLight.intensity = parameters.directionalLightIntensity
})

directionalLightFolder
.add(parameters, 'directionalLightX')
.min(- 100)
.max(100)
.step(0.01)
.name('x')
.onChange(() => {
    directionalLight.position.x = parameters.directionalLightX
})

directionalLightFolder
.add(parameters, 'directionalLightY')
.min(- 100)
.max(100)
.step(0.01)
.name('y')
.onChange(() => {
    directionalLight.position.y = parameters.directionalLightY
})

directionalLightFolder
.add(parameters, 'directionalLightZ')
.min(- 100)
.max(100)
.step(0.01)
.name('z')
.onChange(() => {
    directionalLight.position.z = parameters.directionalLightZ
})

// Point Light
const pointLightFolder = gui.addFolder('Point light')

pointLightFolder
.addColor(parameters, 'pointLightColor')
.name('color')
.onChange(() => {
    pointLight.color = new THREE.Color(parameters.pointLightColor)
})

pointLightFolder
.add(parameters, 'pointLightIntensity')
.min(- 100)
.max(100)
.step(1)
.name('Intensity')
.onChange(() => {
    pointLight.intensity = parameters.pointLightIntensity
})

pointLightFolder
.add(parameters, 'pointLightX')
.min(- 100)
.max(100)
.step(0.01)
.name('x')
.onChange(() => {
    pointLight.position.x = parameters.pointLightX
})


pointLightFolder
.add(parameters, 'pointLightY')
.min(- 100)
.max(100)
.step(0.01)
.name('y')
.onChange(() => {
    pointLight.position.y = parameters.pointLightY
})

pointLightFolder
.add(parameters, 'pointLightZ')
.min(- 100)
.max(100)
.step(0.01)
.name('z')
.onChange(() => {
    pointLight.position.z = parameters.pointLightZ
})

// Ambient light
const ambientLightFolder = gui.addFolder('Ambient Light')
ambientLightFolder
.add(parameters, 'ambientLightIntensity')
.min(- 100)
.max(100)
.step(1)
.name('intensity')
.onChange(() => {
    ambientLight.intensity = parameters.ambientLightIntensity
})



// Camera
const cameraFolder = gui.addFolder('Camera')

cameraFolder
.add(parameters, 'cameraX')
.min(- 100)
.max(100)
.step(1)
.name('x')
.onChange(() => {
    camera.position.x = parameters.cameraX
})

cameraFolder
.add(parameters, 'cameraY')
.min(- 100)
.max(100)
.step(1)
.name('y')
.onChange(() => {
    camera.position.y = parameters.cameraY
})

cameraFolder
.add(parameters, 'cameraZ')
.min(- 100)
.max(100)
.step(1)
.name('z')
.onChange(() => {
    camera.position.z = parameters.cameraZ
})

const setTarget = () => { target =
    new THREE.Vector3(parameters.lookAtX, parameters.lookAtY, parameters.lookAtZ)
}

cameraFolder
.add(parameters, 'lookAtX')
.min(- 100)
.max(100)
.step(1)
.name('look at x')
.onChange(() => {setTarget()})

cameraFolder
.add(parameters, 'lookAtY')
.min(- 100)
.max(100)
.step(1)
.name('look at y')
.onChange(() => {setTarget()})

cameraFolder
.add(parameters, 'lookAtZ')
.min(- 100)
.max(100)
.step(1)
.name('look at z')
.onChange(() => {setTarget()})

cameraFolder.add(parameters, 'cameraZoom', 0, 100, 1).onChange(() => {
    camera.zoom = parameters.cameraZoom
    camera.updateProjectionMatrix()
})
    
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const gltfLoader = new GLTFLoader()


gltfLoader.load(
    'models/OldWarehouse/glTF/scene.gltf',
    (gltf) => {
        // scene.add(gltf.scene.children[0])

        // const children = [...gltf.scene.children]
        // console.log(children);

        // for(const child of children[0].children[0].children) {
        //     scene.add(child)
        //     console.log(child)
        // }
        
        scene.add(gltf.scene)
    },
    () => {
        console.log('progress')
    },
    (gltf) => {
        console.log(gltf)
    },
)

/**
 * Objects
 */

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})


/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(38, 16, -32)

const ambientLight = new THREE.AmbientLight(0xffffff, parameters.ambientLightIntensity)

const pointLight = new THREE.PointLight(0xffffff, parameters.pointLightIntensity)
pointLight.position.set(parameters.pointLightX, parameters.pointLightY, parameters.pointLightZ)

scene.add(directionalLight, ambientLight, pointLight)

// Light helpers
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// const pointLightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(pointLightHelper)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Camera group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.x = parameters.cameraX
camera.position.y = parameters.cameraY
camera.position.z = parameters.cameraZ
let target = new THREE.Vector3(parameters.lookAtX, parameters.lookAtY, parameters.lookAtZ)

cameraGroup.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.enableZoom = true
// controls.target.set(parameters.lookAtX, parameters.lookAtY, parameters.lookAtZ)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll animations
 */

const lethargy = new Lethargy()

const cameraPosition = [
    {x: -12, y: -2.8, z: -9},
    {x: -12, y: -2.8, z: -9},
    {x: -4, y: -1, z: -7},
    {x: -4, y: -1, z: -7},
];

const cameraTarget = [
    {x: 0, y: 0, z: -4},
    {x: 0, y: 0, z: -4},
    {x: -4, y: -1, z: 4},
    {x: -4, y: -12, z: -4},
]

const ambientLightTransition = [
    -2, 1, 1, 1
]

const pointLightTransition = [
    2, 2, 6, 2
]

const titleOpacity = [
    1, 0, 0, 0
]

const title = document.getElementById('title')
console.log(title)
let currentSection = 0;
let animating = false

const body = document.getElementsByTagName('body')[0]
const gesture = new WheelGesture(body, (state) => {
    
    const check = lethargy.check(state.event)
    const newSection = currentSection - check

    const togleAnimation = () => {
        animating = !animating
    }

    if (newSection > 3 || newSection < 0) {
        return
    } else if(check !== false && animating === false) {
        
        togleAnimation()
        currentSection = currentSection - check;           

        gsap.to(camera.position, {
            x: cameraPosition[currentSection].x,
            y: cameraPosition[currentSection].y, 
            z: cameraPosition[currentSection].z,
            duration: 3, ease: 'power.inOut', onComplete: togleAnimation
        })
        gsap.to(target, {
            x: cameraTarget[currentSection].x,
            y: cameraTarget[currentSection].y, 
            z: cameraTarget[currentSection].z,
            duration: 3, ease: 'power.inOut'
        })
        gsap.to(ambientLight,{intensity: ambientLightTransition[currentSection], duration: 3, ease: 'power.inOut'})
        gsap.to(pointLight,{intensity: pointLightTransition[currentSection], duration: 3, ease: 'power.inOut'})
        gsap.to(title,{opacity: titleOpacity[currentSection], duration: 2, ease: 'power.inOut'})
    }
}
, {...sharedOptions})

/**
 * Cursor
 */
// const cursor = {}
// cursor.x = 0
// cursor.y = 0

// window.addEventListener('mousemove', (event) => {
//     cursor.x = event.clientX / sizes.width - 0.5
//     cursor.y = event.clientY / sizes.height - 0.5
// })

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    // camera.position.y = - scrollY / sizes.height * objectsDistance
    
    // if (spiderman && scrollY > 1) {
    //     spiderman.scale.set(scrollY, scrollY, scrollY)
    // }

    
    // const parallaxX = cursor.x * 0.2
    // const parallaxY = - cursor.y * 0.2
    // cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    // cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    // for(const mesh of sectionMeshes)
    // {
    //     mesh.rotation.x += deltaTime * 0.1
    //     mesh.rotation.y += deltaTime * 0.12
    // }

    // Update controls
    // controls.update()

    // Render
    // const currentCamera = currentSection === 1 ? camera : camera2
    camera.lookAt(target)
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()