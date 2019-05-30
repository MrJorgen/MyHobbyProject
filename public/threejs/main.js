document.addEventListener("mousedown", function () {
    mousePressed = true;
});

document.addEventListener("mouseup", function () {
    mousePressed = false;
});

document.addEventListener("click", function (e) {
    console.log(e);
    // poolballs[0].setLinearVelocity(new THREE.Vector3(Math.random() * 10 - 5, Math.random() * 10 - 5, 0));
    poolballs[0].setLinearVelocity(new THREE.Vector3(30, 0.1, 0));
    //     if (e.ctrlKey) {
    // };
    if (e.altKey) {
        poolballs[0].__dirtyPosition = true;
        poolballs[0].setLinearVelocity(new THREE.Vector3(0, 0, 0));
        poolballs[0].setAngularVelocity(new THREE.Vector3(0, 0, 0));
        poolballs[0].position.set(ballPositions[0].x, ballPositions[0].y, -100);
    };
    if (e.shiftKey) {
        camera.lookAt(0, 0, -100);
    }
    // poolballs[Math.floor(1 + Math.random() * 15)].setLinearVelocity(new THREE.Vector3(0, 1, 0));
});

// Poolball params
let size = .75, speed = Math.random() * 0.65 * size, angle = Math.random() * 2 * Math.PI,
    ball = Math.round(Math.random() * 16), friction = 0.996, stats;

let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.shadowMap.type = THREE.PCFShadowMap;

let mousePressed = false;

let tableBounds = { top: -9.33, bottom: 9.33, left: -17.364, right: 17.364 };

// let scene = new THREE.Scene();
let scene, poolballs = [], controls;
let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.setFocalLength(100);
// camera.position.set(new THREE.Vector3(1, -122, -30));
camera.position.set(0, -90, -35);
// camera.lookAt(0, 0, -100);
// camera.position.x = 1;
// camera.position.y = -122;
camera.position.z = 30;

// (x: 1.0812261394919052, y: -122.99472774456271, z: -44.97470153171816)
// camera.position.set(-1.4290316704684365, -160.30228641721038, -30.42973157783624);
// camera.rotation.set(1.1963027175599459, 0.0012154439789643953, -0.003092392921021173);

let ballPositions = [
    { x: -9.5, y: 0 },
    { x: 6, y: 0 },
    { x: 7.75, y: -1 },
    { x: 7.75, y: 1 },
    { x: 9.5, y: 2 },
    { x: 9.5, y: 0 },
    { x: 9.5, y: -2 },
    { x: 11.25, y: -3 },
    { x: 11.25, y: -1 },
    { x: 11.25, y: 1 },
    { x: 11.25, y: 3 },
    { x: 13, y: -4 },
    { x: 13, y: -2 },
    { x: 13, y: 0 },
    { x: 13, y: 2 },
    { x: 13, y: 4 },
];

setup();
// animate();

function setup() {

    Physijs.scripts.worker = 'js/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, 0, -50));
    scene.addEventListener(
        'update',
        function () {
            // applyForce();
            scene.simulate(undefined, 1);
            // physics_stats.update();
        }
    );
    camera.lookAt(0, 0, -100);

    // Lightparams
    let lightIntensity = 110, lightDistance = 20, lightHeight = -20, lightColor = 0xffffff, shadowQuality = 4096;

    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    // controls.target = new THREE.Vector3(0, 0, -100);

    stats = new Stats();

    for (let i = 0; i < 16; i++) {
        addBall("img/poolballs" + i + ".png", i, ballPositions[i].x, ballPositions[i].y);
    }

    poolballs.sort(compare);

    let light = new THREE.AmbientLight(0x202020);
    scene.add(light);

    addLight(-lightDistance, 0, lightHeight, 0xffffff, 1.1, 110, 1);
    addLight(0, 0, lightHeight, 0xffffff, 1.1, 110, 1);
    addLight(lightDistance, 0, lightHeight, 0xffffff, 1.1, 110, 1);

    // addLight(0, 0, lightHeight, lightColor, 1, 1, 1);
    // addLight(lightDistance, 0, lightHeight, lightColor, 1, 1, 1);

    addGround();

    document.body.appendChild(stats.dom);
    // renderer.render(scene, camera);
    requestAnimationFrame(animate);
    scene.simulate();
}


function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function animate() {
    requestAnimationFrame(animate);

    stats.update();
    // scene.simulate();
    renderer.render(scene, camera);
};

/**
 * PointLight( color, intensity, distance, decay )
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 * @param {Number} z z coordinate
 * @param {String} color hexadecimal color of the light. Default is 0xffffff (white).
 * @param {Number} intensity numeric value of the light's strength/intensity. Default is 1.
 * @param {Number} distance The distance from the light where the intensity is 0. When set to 0, then the light never stops. Default is 0.
 * @param {Number} decay The amount the light dims along the distance of the light. Default is 1. For physically correct lighting, set this to 2.
 */
function addLight(x, y, z, color = 0xffffff, intensity = 1, distance = 0, lightWidth = Math.PI / 4, decay = 1) {
    let shadowQuality = 4096;
    let customLight = new THREE.SpotLight(color, intensity, distance, lightWidth);
    customLight.position.set(x, y, z);
    customLight.castShadow = true;
    customLight.shadow.mapSize.width = shadowQuality;  // default
    customLight.shadow.mapSize.height = shadowQuality; // default

    let targetObject = new THREE.Object3D();
    targetObject.position.set(x, y, -100);
    scene.add(targetObject);

    customLight.target = targetObject;

    scene.add(customLight);


    // PointLight(color, intensity, distance, decay)

    // color - (optional) hexadecimal color of the light.Default is 0xffffff(white).
    // intensity - (optional) numeric value of the light's strength/intensity. Default is 1.
    // distance - (optional) The distance from the light where the intensity is 0. When set to 0, then the light never stops.Default is 0.
    // decay - (optional) The amount the light dims along the distance of the light.Default is 1. For physically correct lighting, set this to 2.

}

function updateBalls(ball) {
    let velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };

    // Bounce
    if (poolballs[ball].position.x + velocity.x < tableBounds.left - 1 + size || poolballs[ball].position.x + velocity.x > tableBounds.right + 1 - size) {
        angle = Math.atan2(velocity.y, -velocity.x);
    }
    if (poolballs[ball].position.y + velocity.y < tableBounds.top - 1 + size || poolballs[ball].position.y + velocity.y > tableBounds.bottom + 1 - size) {
        angle = Math.atan2(-velocity.y, velocity.x);
    }

    // Update ball positions
    poolballs[ball].position.x += velocity.x;
    poolballs[ball].position.y += velocity.y;

    // Update ball rotations
    rotateAroundWorldAxis(poolballs[ball], new THREE.Vector3(
        Math.sin(angle) * -speed,  // x rotation
        Math.cos(angle) * speed,  // y rotation 
        0), // z rotation
        speed * (1 / size)
    );
}

function addGround() {
    // Loader
    let loader = new THREE.TextureLoader();

    // Materials
    let ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            // map: loader.load('img/cloth.jpg'),
            color: 0x009900,
        }),
        .5, // friction
        .1 // restitution
    );
    // ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    // ground_material.map.repeat.set(2.5, 2.5);

    // Table
    let ground = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(tableBounds.right * 2 + size, tableBounds.bottom * 2 + size),
        ground_material,
        0 // mass
    );

    ground.position.z = -100 - size;
    ground.receiveShadow = true;
    scene.add(ground);

    // Bottom wall--------------------------------------------------------------------------
    let bottomWall = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(tableBounds.right * 2 + size, size * 2),
        ground_material,
        0
    );

    bottomWall.position.y = -9.75;
    bottomWall.position.z = -100;
    bottomWall.rotation.x = -Math.PI / 2;
    bottomWall.receiveShadow = true;
    scene.add(bottomWall);
    // ---------------------------------------------------------------------------------------

    // Top wall--------------------------------------------------------------------------
    let topWall = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(tableBounds.right * 2 + size, size * 2),
        ground_material,
        0
    );

    topWall.position.y = 9.75;
    topWall.position.z = -100;
    topWall.rotation.x = Math.PI / 2;
    topWall.receiveShadow = true;
    scene.add(topWall);
    // ---------------------------------------------------------------------------------------

    // Rightwall -----------------------------------------------------------------------------
    let rightWall = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(size * 2, tableBounds.bottom * 2 + size),
        ground_material,
        0
    );

    rightWall.position.x = 17.75;
    rightWall.position.z = -100;
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    // ----------------------------------------------------------------------------------------

    // Leftwall -----------------------------------------------------------------------------
    let leftWall = new Physijs.BoxMesh(
        new THREE.PlaneGeometry(size * 2, tableBounds.bottom * 2 + size),
        ground_material,
        0
    );

    leftWall.position.x = -17.75;
    leftWall.position.z = -100;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    // ----------------------------------------------------------------------------------------
}

function addBall(src, name, x, y) {
    var loader = new THREE.TextureLoader();

    loader.load(src, function (texture) {
        geometry = new THREE.SphereGeometry(size, 64, 64);
        material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
            map: texture,
            overdraw: 0.5,
            specular: 0x101010,
            shininess: 55
        }),
            .5, // Friction
            .8 // Restitution
        );


        // poolball = new THREE.Mesh(geometry, material);
        poolball = new Physijs.SphereMesh(
            geometry,
            material,
            // 1000 // Mass
        );

        poolball.position.x = x * size;
        poolball.position.y = y * size;
        poolball.position.z = -100;

        poolball.velocity = { x: 0, y: 0 };

        poolball.receiveShadow = true;
        poolball.castShadow = true;

        poolball.rotation.x = Math.PI * 2 * Math.random();
        poolball.rotation.y = Math.PI * 2 * Math.random();
        // poolball.rotation.z = Math.PI * 2 * Math.random();

        // rotateAroundWorldAxis(poolball, new THREE.Vector3(Math.random(), Math.random(), Math.random()), 2 * Math.PI * Math.random());

        poolball.name = name;
        poolballs.push(poolball);
        scene.add(poolball);
    });
}

// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    rotWorldMatrix.multiply(object.matrix);        // pre-multiply

    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}


// poolball.addEventListener('collision', function (other_object, linear_velocity, angular_velocity) {
//     // `this` is the mesh with the event listener
//     // other_object is the object `this` collided with
//     // linear_velocity and angular_velocity are Vector3 objects which represent the velocity of the collision
// });