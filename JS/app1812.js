$(document).ready(function(){
	//Creo el objeto escena, donde se añadirán todos los demás
	var scene = new THREE.Scene(); 


	//Creo cámara
	//45: Ángulo de "grabación" de abajo hacia arriba en grados.
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000); 
	//1,200: Lo que más cerca y más lejos se renderiza
	camera.position.x = .1;
    camera.position.y = -90;
	camera.position.z = 80;  //Enviar la cámara hacia atrás para poder ver la geometría. Por defecto es z = 0
	scene.add(camera);
  //Enviar la cámara hacia atrás para poder ver la geometría. Por defecto es z = 0
	scene.add(camera);
//130

	// 5// Change perspective camera_top_perspective_closer_PERO NO SÉ CÓMO
switchCamera = function() {
  if (camera instanceof THREE.PerspectiveCamera) {
    camera = new THREE.OrthographicCamera(
    window.innerWidth / - 16, window.innerWidth / 16,window.innerHeight / 16, window.innerHeight / - 16, -200, 500 );
    camera.position.x = .1;
    camera.position.y = -90;
	camera.position.z = 180;
    camera.lookAt(scene.position);
 
  } else {
    camera = new THREE.PerspectiveCamera(45,
    window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 130; camera.lookAt(scene.position);
    perspective = "TOP";
  }
};

	//renderizador
	var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });  
	// Utilizar el renderizador WebGL.
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);  // Renderizador del tamaño de la ventana.
	document.body.appendChild(renderer.domElement);// Añadir el renderizador al elemento DOM body.

	var ambientLight = new THREE.AmbientLight(0xdddddd);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(-20, 20, 30);
	scene.add(directionalLight);

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	//Esto para qué??
	var raycaster = new THREE.Raycaster(); //Emite rayos desde la cámara al espcio 3d
	var mouse = new THREE.Vector2();

	window.addEventListener('mousemove', function(e){  //Para cada vez que se mueva el ratón
		//console.log(e.clientX); //Para visualizarlo solo en Console en Inspeccionar
		mouse.x = (e.clientX / window.innerWidth) * 2 -1;
		mouse.y = -(e.clientY / window.innerHeight) * 2 +1; //estas dos cosas son para reparametrizar
		raycaster.setFromCamera(mouse,camera);
	})



	loadObj('usera.obj');
	var jardin = new THREE.Group();
	scene.add(jardin);

	loadObj('jardin.obj');
	var jardin = new THREE.Group(); //Por qué este nombre en var jardin? Por qué jardín?
	scene.add(jardin);

	loadObj('mallasuperior.obj');
	var jardin = new THREE.Group(); //Por qué este nombre en var jardin? Por qué jardín?
	scene.add(jardin);



	function loadObj(model){
		var loader = new THREE.OBJLoader();
		loader.load(model, function(obj){
			if(model == "usera.obj"){
				var materialOBJ = new THREE.PointsMaterial({color:0xDAFF03, size:0.5});
				 //  ????  materialOBJ.add(point.z.getValue())
				//var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, size:.2} );
				obj.traverse(function(child){
					if(child instanceof THREE.Mesh){
						var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
						var points = new THREE.Points(geometry, materialOBJ);
						scene.add(points);
					}
				});
			}else{
				var materialOBJ = new THREE.PointsMaterial({color:0xDAFF03, size: .2});
				obj.traverse(function(child){
					if(child instanceof THREE.Mesh){
						var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
						var points = new THREE.Points(geometry, materialOBJ);
						jardin.add(points);
					}
				});
			}
		})
	}

	function render() {
		if(jardin.children.length){
			jardin.children[0].geometry.verticesNeedUpdate = true;
		}
		requestAnimationFrame(render);  // la renderización ocurrirá continuamente si la escena está visible.
		renderer.render(scene, camera);//Renderizar escena cada vez que se ejecuta la función "render()".
		controls.update()
	}

	render();  //Llamo a la función la primera vez para que luego pueda comenzar el loop definido arriba
});











