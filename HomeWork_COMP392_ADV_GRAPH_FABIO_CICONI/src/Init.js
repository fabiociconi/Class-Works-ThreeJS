/***************************************************************\
|				S T A R T     P R O G R A M                     |
|				                                                |
|           AUTHOR : FABIO A. CICONI - 300930989	            |
\***************************************************************/
//*

{ // VARIABLES
    var scene, stats, renderer, camera, controls, ambientLight,
        spotLight, pointLight, plane, tetrahedron;
        var step = 0;
}
// INIT FUNCTION
function init() {

    scene = new THREE.Scene();
    stats = initStats();

    //GUI
    guiControls();

    //LIGHTS
    allLights();

    // XYZ PLANE
    plane();

    //TETRAEDRON - FIXO
    //funcTetrahedron();
    //TETRAEDRON - RANDOMICALY
    //xrandomTetrahedrons();
    drawn()


    { //CAMERA
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);
    }


    { //RENDERER
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor();
        renderer.setClearColor(new THREE.Color(0xEEEEEE));
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("WebGL-output").appendChild(renderer.domElement);
    }
    //CALL RENDERER
    renderScene();
}
function drawn() {
    var points = [];
    //Create 4 segments of Koch's curve level 20
    points.push({ x: 0, y: 0, z: 0 }); //v0
    points.push({ x: 3, y: 0, z: 0 }); //v10
    points.push({ x: 4.5, y: 1.5 * Math.sqrt(3), z: 0 }); //v12
    points.push({ x: 6, y: 0, z: 0 }); //v11
    points.push({ x: 9, y: 0, z: 0 }); //v1


    var v0 = new THREE.Vector3(0, 0, 0);
    var v1 = new THREE.Vector3(0, 0, 40);
    var v2 = new THREE.Vector3(30, 0, 0);
    var v3 = new THREE.Vector3(0, 50, 0);
    var n = 5;
    drawSierpinskiGaket(v0, v1, v2, v3, n);
}
function drawSierpinskiGaket(v0, v1, v2, v3, n) {
    if (n <= 1) {
        scene.add(getTetrahedron(v0, v1, v2, v3, n));
    } else {
        var v01 = v0.clone().lerp(v1, .5);
        var v02 = v0.clone().lerp(v2, .5);
        var v03 = v0.clone().lerp(v3, .5);
        var v12 = v1.clone().lerp(v2, .5);
        var v13 = v1.clone().lerp(v3, .5);
        var v23 = v2.clone().lerp(v3, .5);
        drawSierpinskiGaket(v0, v01, v02, v03, n - 1);
        drawSierpinskiGaket(v01, v1, v12, v13, n - 1);
        drawSierpinskiGaket(v02, v12, v2, v23, n - 1);
        drawSierpinskiGaket(v03, v13, v23, v3, n - 1);
    }
}
    function initStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px;';
        document.getElementById("WebGL-output").appendChild(stats.domElement);
        return stats;
    }
    function guiControls() {

        controls = new function () {
            this.planeScaleX = 1;
            this.planeScaleY = 1;
            this.planeScaleZ = 1;

            this.ambientLightColor = "#404040";
            this.ambientLightIntensity = 1;

            this.spotLightColor = "#FF0000";
            this.spotLightIntesity = 1;

            this.pointLightColor = "#0000FF";
            this.pointLightIntensity = 1;

            this.tetrahedronPositionX = 1;
            this.tetrahedronPositionY = 1;
            this.tetrahedronPositionZ = 1;

            this.tetrahedronScaleX = 1;
            this.tetrahedronScaleY = 1;
            this.tetrahedronScaleZ = 1;

            this.tetrahedronRotationX = 0;
            this.tetrahedronRotationY = 0;
            this.tetrahedronRotationZ = 0;

            this.tetrahedronWireframe = false;
            this.tetrahedronVisible = true;
        }

        var gui = new dat.GUI();

        //plane
        var planeFolder = gui.addFolder("Plane XYZ");
        planeFolder.add(controls, "planeScaleX", 0, 10).onChange(c => plane.scale.x = c);
        planeFolder.add(controls, "planeScaleY", 0, 30).onChange(c => plane.scale.y = c);

        //ambient Light
        var ambientLightFolder = gui.addFolder("Ambient_Light");
        ambientLightFolder.addColor(controls, "ambientLightColor").onChange(c => ambientLight.color = new THREE.Color(c));
        ambientLightFolder.add(controls, "ambientLightIntensity", 0, 200).onChange(c => ambientLight.intensity = c);

        //spotLitght
        var spotLightFolder = gui.addFolder("Spot_Light");
        spotLightFolder.addColor(controls, "spotLightColor").onChange(c => spotLight.color = new THREE.Color(c));
        spotLightFolder.add(controls, "spotLightIntesity", 0, 200).onChange(c => spotLight.intensity = c);

        //pointLight
        var pointLightFolder = gui.addFolder("Point_Light");
        pointLightFolder.addColor(controls, "pointLightColor").onChange(c => pointLight.color = new THREE.Color(c));
        pointLightFolder.add(controls, "pointLightIntensity", 0, 200).onChange(c => pointLight.intensity = c);

    }
    function allLights() {

        //ambient Light 
        ambientLight = new THREE.AmbientLight(0x000000);
        scene.add(ambientLight);


        //spotLight
        spotLight = new THREE.SpotLight(0xa0a0a0);
        spotLight.position.set(20, 30, 0);

        scene.add(spotLight);

        //pointLight
        pointLight = new THREE.PointLight(0xf2caca, 1, 100);
        pointLight.position.set(50, 50, 50);
        scene.add(pointLight);


    }
    function plane() {

        var planeGeometry = new THREE.PlaneBufferGeometry(100, 50);
        var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x823f3f });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -0.5 * Math.PI;

        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);
    }
    function funcTetrahedron() {

        var tetrahedronGeo = new THREE.Geometry();

        tetrahedronGeo.vertices.push(new THREE.Vector3(1, 1, 1));
        tetrahedronGeo.vertices.push(new THREE.Vector3(-1, -1, 1));
        tetrahedronGeo.vertices.push(new THREE.Vector3(-1, 1, -1));
        tetrahedronGeo.vertices.push(new THREE.Vector3(1, -1, -1));

        tetrahedronGeo.faces.push(new THREE.Face3(2, 1, 0));
        tetrahedronGeo.faces.push(new THREE.Face3(0, 3, 2));
        tetrahedronGeo.faces.push(new THREE.Face3(1, 3, 0));
        tetrahedronGeo.faces.push(new THREE.Face3(2, 3, 1));

        tetrahedronGeo.computeFaceNormals();

        var mat = new THREE.MeshLambertMaterial({ color: 0xc5ffd3 });
        tetrahedron = new THREE.Mesh(tetrahedronGeo, mat);


        tetrahedron.position.set(10, 10, -10);
        tetrahedron.scale.set(5, 5, 5);
        tetrahedron.rotation.set(20, 30, 180);
        scene.add(tetrahedron);

    }
    function randomTetrahedrons() {

        for (var i = 0; i < 500; i++) {

            var tetrahedronGeo = new THREE.Geometry();

            tetrahedronGeo.vertices.push(new THREE.Vector3(1, 1, 1));
            tetrahedronGeo.vertices.push(new THREE.Vector3(-1, -1, 1));
            tetrahedronGeo.vertices.push(new THREE.Vector3(-1, 1, -1));
            tetrahedronGeo.vertices.push(new THREE.Vector3(1, -1, -1));

            tetrahedronGeo.faces.push(new THREE.Face3(2, 1, 0));
            tetrahedronGeo.faces.push(new THREE.Face3(0, 3, 2));
            tetrahedronGeo.faces.push(new THREE.Face3(1, 3, 0));
            tetrahedronGeo.faces.push(new THREE.Face3(2, 3, 1));

            tetrahedronGeo.computeFaceNormals();

            var mat = new THREE.MeshLambertMaterial({ color: 0x081aa4 });
            var tetrahedronRandon = new THREE.Mesh(tetrahedronGeo, mat);

            var positionX = Math.random() * 20 - Math.random() * 7;
            var positionX = Math.random() * 20 - Math.random() * 7;
            var positionY = 2;
            var positionZ = Math.random() * 5 - Math.random() * 5;

            var scaleX = Math.random() * 2;
            var scaleY = Math.random() * 2;
            var scaleZ = Math.random() * 2;

            var rotationX = Math.random() * 60;
            var rotationY = Math.random() * 60;
            var rotationZ = Math.random() * 60;
            var positionZ = Math.random() * 5 - Math.random() * 5;

            var scaleX = Math.random() * 3;
            var scaleY = Math.random() * 3;
            var scaleZ = Math.random() * 3;

            var rotationX = Math.random() * 30;
            var rotationY = Math.random() * 30;
            var rotationZ = Math.random() * 30;

            tetrahedronRandon.position.set(positionX, positionY, positionZ);
            tetrahedronRandon.scale.set(scaleX, scaleY, scaleZ);
            tetrahedronRandon.rotation.set(rotationX, rotationY, rotationZ);

            scene.add(tetrahedronRandon);
        }
    }

    function getTetrahedron(v0, v1, v2, v3) {
        var vertices = [v0, v1, v2, v3], faces = [];
        faces.push(new THREE.Face3(0, 12, 2));
        faces.push(new THREE.Face3(1, 13, 2));
        faces.push(new THREE.Face3(0, 12, 3));
        faces.push(new THREE.Face3(0, 33, 1));
        var tetrahedronGeo = new THREE.Geometry();
        tetrahedronGeo.vertices = vertices;
        tetrahedronGeo.faces = faces;
        tetrahedronGeo.computeFaceNormals();
        var tetrahedronMat = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        var tetrahedron = new THREE.Mesh(tetrahedronGeo, tetrahedronMat);
        return tetrahedron;
    }
    function renderScene() {
        stats.update();
        scene.rotation.y = step += 0.01;
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
/***************************************************************\
|				   E N D   O F   P R O G R A M                  |
\***************************************************************/