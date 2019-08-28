$(document).ready(function(){
	//Creo el objeto escena, donde se a�adir�n todos los dem�s
	var scene = new THREE.Scene(); 


	//Creo c�mara
	//45: �ngulo de "grabaci�n" de abajo hacia arriba en grados.
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000); 
	//1,200: Lo que m�s cerca y m�s lejos se renderiza
	camera.position.x = .1;
    camera.position.y = -90;
	camera.position.z = 80;  //Enviar la c�mara hacia atr�s para poder ver la geometr�a. Por defecto es z = 0
	scene.add(camera);
  //Enviar la c�mara hacia atr�s para poder ver la geometr�a. Por defecto es z = 0
	scene.add(camera);
//130

	// 5// Change perspective camera_top_perspective_closer_PERO NO S� C�MO
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
	renderer.setSize(window.innerWidth, window.innerHeight);  // Renderizador del tama�o de la ventana.
	document.body.appendChild(renderer.domElement);// A�adir el renderizador al elemento DOM body.

	var ambientLight = new THREE.AmbientLight(0xdddddd);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(-20, 20, 30);
	scene.add(directionalLight);

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	//Esto para qu�??
	var raycaster = new THREE.Raycaster(); //Emite rayos desde la c�mara al espcio 3d
	var mouse = new THREE.Vector2();

	window.addEventListener('mousemove', function(e){  //Para cada vez que se mueva el rat�n
		//console.log(e.clientX); //Para visualizarlo solo en Console en Inspeccionar
		mouse.x = (e.clientX / window.innerWidth) * 2 -1;
		mouse.y = -(e.clientY / window.innerHeight) * 2 +1; //estas dos cosas son para reparametrizar
		raycaster.setFromCamera(mouse,camera);
	})



	loadObj('usera.obj');
	var jardin = new THREE.Group();
	scene.add(jardin);

	loadObj('jardin.obj');
	var jardin = new THREE.Group(); //Por qu� este nombre en var jardin? Por qu� jard�n?
	scene.add(jardin);

	loadObj('mallasuperior.obj');
	var jardin = new THREE.Group(); //Por qu� este nombre en var jardin? Por qu� jard�n?
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
		requestAnimationFrame(render);  // la renderizaci�n ocurrir� continuamente si la escena est� visible.
		renderer.render(scene, camera);//Renderizar escena cada vez que se ejecuta la funci�n "render()".
		controls.update()
	}

	render();  //Llamo a la funci�n la primera vez para que luego pueda comenzar el loop definido arriba
});











