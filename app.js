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
	scene.add(camera);
	//renderizador
	var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });  
	// Utilizar el renderizador WebGL.
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);  // Renderizador del tamaño de la ventana.
	document.body.appendChild(renderer.domElement);  //Añadir el renderizador al elemento DOM body.

	var ambientLight = new THREE.AmbientLight(0xdddddd);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(-20, 20, 30);
	scene.add(directionalLight);

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enablePan = false;
	//Esto para qué??
	var raycaster = new THREE.Raycaster(); //Emite rayos desde la cámara al espcio 3d
	var mouse = new THREE.Vector2();
	var isClicked = false;
	var useraOriginal;
	//Creo las variables isMeshed, que será la malla que una los puntos que muevo y los de forma.
	var isMeshed = false;
	var contador=0;

	// Quiero que cuando pulse enter, la img en 3d cambie su visualización desde perspective a top, left..
	// Para ello defino una función switchCamera. Definidas las cuatro posiciones, éstas cambiarán
	//Cada vez que el contador aunmenta su valor en 1, que responde a cada vez que pulso enter.
switchCamera = function() {
	//si el contador es igual a 0, utilizaremos la primera cámara, una camara ortográfica
  		console.log(contador);
  if (contador==0) { //Perspectiva
    camera = new THREE.OrthographicCamera(
    window.innerWidth / - 16, window.innerWidth / 16,window.innerHeight / 16, window.innerHeight / - 16, -200, 500 );
    camera.position.x = .1;
    camera.position.y = -90;
	camera.position.z = 180;
    camera.lookAt(scene.position);
 	contador++;
  } else if (contador==1) { //LEFT
    camera = new THREE.PerspectiveCamera(45,
    window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.x = 130;
    camera.position.y = 20;
    camera.position.z = 10; 
    camera.lookAt(scene.position);
  contador++;
 } else if (contador==2) { //TOP_
    camera = new THREE.PerspectiveCamera(45,
    window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.x = 0;
    camera.position.y = -130;
    camera.position.z = 10; 
    camera.lookAt(scene.position);
 	contador++;
  } else if (contador==3) { //
    camera = new THREE.PerspectiveCamera(45,
    window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.x = 1;
    camera.position.y = -90;
    camera.position.z = 80; 
    camera.lookAt(scene.position);
    contador=0;
  }
	controls = new THREE.OrbitControls(camera, renderer.domElement );
	controls.enablePan = false;
};

window.addEventListener('mousedown', function(e){
		if(e.buttons == 1){
		isClicked =true;
		}
	})
	window.addEventListener('mouseup', function(e){
		isClicked =false;
	})
window.addEventListener('keypress',function(e){
		if(e.code == "Space"){
			if(isMeshed == false){
				var newMaterial = new THREE.MeshLambertMaterial({color:0xFFE900, transparent:true, opacity: 0.3, side: THREE.DoubleSide});
				newMesh = new THREE.Mesh(jardin.children[0].geometry, newMaterial);
				newMesh.position.z = 6;
				scene.add(newMesh);
				isMeshed = true;
			}else{
				scene.remove(newMesh);
				isMeshed = false;
			}			
		}else if(e.code == "Enter"){ 
			switchCamera();
		}
	})

	window.addEventListener('mousemove', function(e){  //Cada vez que se mueva el ratón
		//console.log(e.clientX);
		mouse.x = (e.clientX / window.innerWidth) * 2 -1;
		mouse.y = -(e.clientY / window.innerHeight) * 2 +1; //Reparametrizar
		raycaster.setFromCamera(mouse,camera);
		var intersects = raycaster.intersectObject(jardin.children[0]);
		if(intersects.length > 0){
			if(isClicked == true){
				console.log(intersects)
				for(var i = 0; i< intersects.length; i++){

					var contador = intersects[i].index;
					intersects[i].object.geometry.vertices[contador].z += 0.9;
					var color = new THREE.Color( 0xffffff);
					color.setHSL( intersects[i].object.geometry.vertices[contador].z/ -10, 1, 0.5 );
					intersects[i].object.geometry.colors[contador] = color;
				}
			}	
		}
	})
	var invisible = new THREE.Group();
	scene.add(invisible);
	invisible.visible = false;
	/*
	var material = new THREE.MeshBasicMaterial({color:0xffffff, map: THREE.TextureLoader().load('ruta-imagen.png')});
	plano.material = material;
	*/
	//Cuando pulse el icono Save en pantalla, se ejecuta la función definida
	//Guarda la situación en la que estaban los puntos y los almacena en ToggleView
	$("#save").on("click",function(){
		var geometry =  new THREE.Geometry();
		geometry.copy(jardin.children[0].geometry);
		var material = new THREE.PointsMaterial({color:0xffffff, size: 0.8, vertexColors: THREE.VertexColors});
		var savedUsera = new THREE.Points( geometry,  material);
		jardin.remove(jardin.children[0]);
		invisible.add(savedUsera);
		var newUsera = new THREE.Points(mappedUsera.geometry.clone(), mappedUsera.material.clone());
		jardin.add(newUsera);
	
	})
	$("#toggleView").on("click",function(){
		if(invisible.visible == true){
			invisible.visible = false;
		}else{
			invisible.visible = true;
		}
	})

	loadObj('usera.obj'); //Cargo el 3D de la ciudad
	//loadObj('mallasuperior.obj');
	var jardin = new THREE.Group(); 
	scene.add(jardin);
	//Creo un plano de puntos que será el que puedo modificar.
	//Vertex colors permite, de alguna manera, dar color a los puntos  (ver bien)
	//en función del valor altura que tomen.
	var planoGeometry = new THREE.PlaneGeometry(140,130,240,240);
		var planeMaterial = new THREE.MeshBasicMaterial({color: 0xFFE900, transparent:true, opacity: 0.2,wireframe:true})
		var planePoints = new THREE.PointsMaterial({color: 0xFFE900, transparent:true, opacity:0.3, vertexColors: THREE.VertexColors});
		var planeMesh = new THREE.Points(planoGeometry, planePoints);
		for(var i = 0; i<planoGeometry.vertices.length; i++){
								
							var p = planoGeometry.vertices[i];
							var color = new THREE.Color( 0xFFE900);
							color.setHSL( planoGeometry.vertices[i].z/ -10, 1, 0.5 );
							planoGeometry.colors.push(color);
					}
					planeMesh.position.z = 6;
		jardin.add(planeMesh);
		//Cargo el modelo 3D en pointCloud
		//Este aparecerá con las primeras propiedades definidas. El resto de objetos cargados con las
		//que aparece debajo de éste
		function loadObj(model){
		var loader = new THREE.OBJLoader();
		loader.load(model, function(obj){
			if(model == "usera.obj"){
				var material = new THREE.PointsMaterial( { color: 0xffffff, size:.5, opacity:.25} );
				obj.traverse(function(child){
					if(child instanceof THREE.Mesh){
						var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
						useraOriginal = new THREE.Points(geometry, material);
						scene.add(useraOriginal);
					}
					
				});
			}else{
				var materialOBJ = new THREE.PointsMaterial({color:0xFFE900, size: 1});
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
			jardin.children[0].geometry.colorsNeedUpdate = true;
			jardin.children[0].geometry.verticesNeedUpdate = true;
		}
		requestAnimationFrame(render);  // la renderización ocurrirá continuamente si la escena está visible.
		renderer.render(scene, camera); //Renderizar escena cada vez que se ejecuta la función "render()".
		controls.update()
	}
	render();  //Llamo a la función la primera vez para que luego pueda comenzar el loop definido arriba
});