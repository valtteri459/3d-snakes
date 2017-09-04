//polyfill/blob/master/string.polyfill.js // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("keyup", e => {
	if(e.keyCode == 33){
		console.log("kecode 33 pressed");
	}
}, false);

function mouseDown(e){
	var vector = new THREE.Vector3(
		(event.clientX/window.innerWidth)*2-1,
		-(event.clientY/window.innerHeight)*2+1,
		0.5
	);
	var rayCaster = new THREE.Raycaster();
	rayCaster.setFromCamera(vector, camera);
	var intersectedObjects = rayCaster.intersectObjects(scene.children);
	let first = intersectedObjects[0];
	if(first !== undefined){
		if(first.object.hasOwnProperty("snake")){
			console.log(first.object.snake);
		}
	}
}




if(!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
    };
}
function disposeNode (node) {
    if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
        }
        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map) mtrl.map.dispose ();
                    if (mtrl.lightMap) mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap) mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap) mtrl.normalMap.dispose ();
                    if (mtrl.specularMap) mtrl.specularMap.dispose ();
                    if (mtrl.envMap) mtrl.envMap.dispose ();
                    mtrl.dispose (); // disposes any programs associated with the material
                });
            }
            else
            {
                if (node.material.map) node.material.map.dispose ();
                if (node.material.lightMap) node.material.lightMap.dispose ();
                if (node.material.bumpMap) node.material.bumpMap.dispose ();
                if (node.material.normalMap) node.material.normalMap.dispose ();
                if (node.material.specularMap) node.material.specularMap.dispose ();
                if (node.material.envMap) node.material.envMap.dispose ();
                node.material.dispose (); // disposes any programs associated with the material
            }
        }
    }
}   // disposeNode
document.addEventListener('DOMContentLoaded', () => {
	//helper class to make new 3d location coordinates into arrays
	function makeVector(locx, locy, locz){
		return new Array(locx, locy, locz);
	}
	function arraysEqual(arr1, arr2) {
		if(arr1.length != arr2.length){
			return false;
		}
		for(var i = arr1.length; i--;) {
			if(arr1[i] !== arr2[i]){
				return false;
			}
		}
		return true;
        }
	//to test if array exists in a multidimensional array
	function collisionTest(needle, haystack){
		for(var i = 0;i<haystack.length;i++){
			val = haystack[i];
			if(arraysEqual(needle, val))
			{
				return true;
			}
		}
		return false;
	}
	//name expalins
	function indexOfMax(arr) {
	    if (arr.length === 0) {
	        return -1;
	    }
	    var max = arr[0];
	    var maxIndex = 0;
	    for (var i = 1; i < arr.length; i++) {
	        if (arr[i] > max) {
	            maxIndex = i;
	            max = arr[i];
	        }
	    }
	    return maxIndex;
	}
	//class for food item
	window.food = function(scene, renderer, color){
		this.scene = scene;
		this.color = color;
		this.renderer = renderer;
		this.geometry = new THREE.SphereGeometry(0.1,16,16);
		this.material = new THREE.MeshPhongMaterial({color: color, wireframe:false});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.location = new Array(
			Math.floor(Math.random()*175),
			Math.floor(Math.random()*175),
			Math.floor(Math.random()*175)
		);
		//show food on map
		this.show = function(){
			if(this.scene != null)
			{
				this.mesh.position.x = (this.location[0]/10)-8.8;
				this.mesh.position.y = (this.location[1]/10)-8.8;
				this.mesh.position.z = (this.location[2]/10)-8.8;
				this.scene.add(this.mesh);
			}
		};
		//if food is eaten, remove it from scene
		this.eat = function(){
			if(this.scene != null)
			{
				this.scene.remove(this.mesh);
			}
		};
		//new food location generated, then show it
		this.generateNew = function(){
			this.location = new Array(
				Math.floor(Math.random()*175),
				Math.floor(Math.random()*175),
				Math.floor(Math.random()*175)
			);
			this.show();
		};
		this.destroy = function(){
			disposeNode(this.mesh);
		};
		return this;
	}
	//class for snake item
	window.snake = function(scene, renderer, color){
		this.scene = scene;
		this.renderer = renderer;
		this.turnsLived = 0;
		this.turnsWithoutEating = 0;
		this.closestToFood = 0;
		this.maxStamina = 500;
		this.Meshes = new Array();
		this.gm = new THREE.CubeGeometry(0.1,0.1,0.1);
		this.mat = new THREE.MeshPhongMaterial({color: color, wireframe:false});
		this.coords = [[87,87,88],[87,87,87],[87,87,86],[87,87,85],[87,87,84]];
		this.color = color;
		this.score = 4;
		this.isKilled = false;
		this.food = new food(this.scene, this.renderer, color);
		//kill snake, set to isKilled and save score and turns lived
		this.kill = function(){
			this.coords = [];
			if(this.scene != null)
			{
				this.Meshes.forEach(function(item, index){
					this.scene.remove(item);
					disposeNode(item);
				}, this);
			}
			this.Meshes = [];
			this.food.eat();
			this.isKilled = true;
			this.gm.dispose();
			this.mat.dispose();
			this.food.destroy();
		};
		this.food.show();
		this.eat = function(nextLocation){
			if(arraysEqual(nextLocation, this.food.location))
			{
				this.food.eat();
				this.food.generateNew();
				this.score += 1;
				return true;
			}
			else
			{
				return false;
			}
			this.isKilled = true;
		}
		this.move = function(dir){
			//move the snek
			//get current coordinates
			currentCoords = this.coords[this.coords.length-1];
			futureCoords = currentCoords.slice();
			//do a switch for it's direction based on axis
			switch(dir){
				case "+y":
					futureCoords[1]+=1;
					break;
				case "-y":
					futureCoords[1]-=1;
					break;
				case "+x":
					futureCoords[0]+=1;
					break;
				case "-x":
					futureCoords[0]-=1;
					break;
				case "+z":
					futureCoords[2]+=1;
					break;
				case "-z":
					futureCoords[2]-=1;
					break;
			}
			//check if snake went out of bounds
			var lowestCoord = Math.min(...futureCoords);
			var highestCoord= Math.max(...futureCoords);
			if(highestCoord < 176 && lowestCoord > 0)
			{
				//check if starved to death
				if(this.turnsWithoutEating < this.maxStamina){
					//check if it coolides with itself
					if(collisionTest(futureCoords, this.coords))
					{
						//collision, kill
						this.kill();
						this.ShowSnake();
						return false;
					}
					else
					{
						closeness = avg(
							Math.abs(futureCoords[0]-this.food.location[0]),
							Math.abs(futureCoords[1]-this.food.location[1]),
							Math.abs(futureCoords[2]-this.food.location[2])
						);
						if(closeness > this.closestToFood){
							this.closestToFood = closeness;
						}
						//keep going, next check if snek ate a bite
						if(this.eat(futureCoords)){
							this.turnsWithoutEating = 0;
						}
						else{
							if(this.score > 0 )
							{
								//shift tail
								for(var i = 0; i<this.coords.length-1;i++){
									this.coords[i] = this.coords[i+1];
								}
							}
							//no food eaten, shrink tail
							this.turnsWithoutEating +=1;
						}
						//add piece to tail
						this.turnsLived +=1;
						this.coords[this.score] = futureCoords;
						this.ShowSnake();
						return true;
					}
					
				}
				else{
					this.kill();
					this.ShowSnake();
					return false;
				}
			}
			else
			{
				this.kill();
				this.ShowSnake();
				return false;
			}
			
		};
		this.ShowSnake = function(){
			//to render the snek we first need to make it's polygons based on it's coordinates
			/*
					WARNING, CHANGE THIS, HIGHLY INEFFICIENT TO REMOVE ALL MESHES AND MAKE NEW, JUST UPDATE OLD AND ADD IF NEEDED
			*/
			//first remove all old ones just in case
			if(this.scene != null)
			{
				this.Meshes.forEach(function(item, index){
					this.scene.remove(item);
					disposeNode(item);
				}, this);
				this.Meshes = [];
				//game coordinates start at 1,1,1, which is -8.7, -8.7, -8.7
				//and end in 175,175,175, which is 8,7, 8.7, 8.7
				//to create new meshes of size 0.1 in threejs units divide coordinate by 10 and offset it by 8.8 in each direction (minus)
				this.coords.forEach(function(item,index){
					
					var newcube = new THREE.Mesh(this.gm, this.mat);
					newcube.position.x = (item[0]/10)-8.8;
					newcube.position.y = (item[1]/10)-8.8;
					newcube.position.z = (item[2]/10)-8.8;
					newcube.snake	= this;
					this.Meshes.push(newcube);
					this.scene.add(newcube);
				}, this);
			}
		};
		this.ShowSnake();
		return this;
	}
	//create new scene
	window.scene = new THREE.Scene();
	//add new camera
	window.camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight, 0.1, 1000);
	//add a render area to canvas
	window.renderer = new THREE.WebGLRenderer({canvas: gameArea});
	//add event listener for window resize
	window.addEventListener('resize',function(){
		var width = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize(width,height);
		camera.aspect = width/height;
		camera.updateProjectionMatrix();
	});
	//set renderer size and shadows
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowCameraNear = 1;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 90;
	renderer.shadowMapBias = 0.0039;
	renderer.shadowMapDarkness = 0.5;
	renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;
	
	
	//add controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	//set size of game area in THREEJS units, this amounts to roughly a 175x175x175 play area
	var planeSize = 17.5;
	
	//create plane geometry
	var geo2 = new THREE.PlaneGeometry(planeSize,planeSize,12,12);
	
	//create plane material
	var mats = [0xFF0000, 0x00FF00, 0x0000FF, 0xFF00FF, 0xFFFF00, 0x00FFFF].map(mat => {
		return new THREE.MeshPhongMaterial({color: mat, wireframe:true});
	});
	//create the floors and walls
	var floor	= new THREE.Mesh(geo2, mats[0]);
	var roof	= new THREE.Mesh(geo2, mats[1]);
	var wall1	= new THREE.Mesh(geo2, mats[2]);
	var wall2	= new THREE.Mesh(geo2, mats[3]);
	var wall3	= new THREE.Mesh(geo2, mats[4]);
	var wall4	= new THREE.Mesh(geo2, mats[5]);
	//position and rotate them accordingly
	floorPositions = planeSize /2;
	floor.rotation.x -= Math.PI/2;
	floor.position.y -= floorPositions;
	floor.receiveShadow = true;
	
	roof.rotation.x += Math.PI/2;
	roof.position.y +=floorPositions;
	roof.receiveShadow = true;
	wall1.position.z = floorPositions;
	wall2.position.z = -floorPositions;
	wall1.rotation.y -= Math.PI;
	wall3.rotation.y -= Math.PI/2;
	wall4.rotation.y += Math.PI/2;
	wall3.position.x = floorPositions;
	wall4.position.x = -floorPositions;
	//set ambient light
	ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	//add a spotlight to the middle of the game area for shadows
	light = new THREE.PointLight(0xFFFFFF);
	light.position.x = 0;
	light.position.y = 0;
	light.position.z = 0;
	light.intensity = 1;
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	//add lights and cameras to the scene
	scene.add(ambientLight);
	scene.add(light);
	scene.add(floor);
	scene.add(roof);
	scene.add(wall1);
	scene.add(wall2);
	scene.add(wall3);
	scene.add(wall4);
	//set initial camera position
	camera.position.z = 10;
	//initialize stats
	stats = new Stats();
	stats.domElement.style.position = "relative";
	document.getElementById("stats").appendChild(stats.domElement);
	/*
		NEURAL NETWORK STARTS HERE AND CONTIHNUES IN THE UPDATE FUNCTION which is run every frame of rendering
	*/
	var popSize = 50;
	var networks = [];
	var commands = ["+x", "-x", "+y", "-y", "+z", "-z"];
	//variable for loop interval adjustment
	var divideBy = 1;
	//snake maximum view distance (default 100) after this neurons will not have any input
	var maxRange = 100;
	for (var i = 0;i < popSize;i++){
		//first is amount of inputs, for the first iteration it has 78 inputs all calculated from head and on an absolute axis
		//1 straight to each direction = 6
		//2 in 45 degree angles from horisontal axises = 8
		//1 in every horisontal diagonal direction separated by 45 degrees = 4
		//2 in 45 degree angles from diagonal horisontal lines = 8
		//total input neurons is therefore 26X 3 since it needs to detect outside, food and it's owm body in each direction
		//output command is selected by the highest output neuron and fitness is either score or turns lived after death, there are 6 possible detections so 6 output neurons
		
		//amount of hidden layers and neurons per hidden layer can be changed if wanted
		//add network and snake for it into an array
		//numInputs, numOutputs, numHiddenLayers, numNeuronsPerHiddenLayer
		//snakes are given a network, a snake object and a number to tell if their current iteration is "done"
		networks.push([
			new Brainwave.Network(58,6,10,10),
			new snake(scene, renderer,'#'+Math.floor(Math.random()*16777215).toString(16).padEnd(6, "0")),
			false
		]);
	}
	//get a genetics object
	var genetics = new Brainwave.Genetics(popSize, networks[0][0].getNumWeights());
	//add start random weights to the network population
	for (var j = 0; j < popSize; j++) {
    	networks[j][0].importWeights(genetics.population[j].weights);
	}
	
	var t = 0;
	function update()
	{
		//don't train on every frame rendered
		if(t%divideBy == 0)
		{
			
			// Now the networks and genetics are all set up training can begin. Pass each network an input and issue
			// it a fitness depending on how close its output was to the desired output
			//check if everyone reports to be done
			var ready = true;
			for(var i = 0; i<popSize;i++){
				if(networks[i][2] == false){
					ready = false;
				}
			}
			if(ready == false){
				for (var k = 0; k < popSize; k++) {
					//check to see if snake already "done"
					if(networks[k][2] == false)
					{
						//test to see if snek is ded
					    if(networks[k][1].isKilled == false)
					    {
					    	//here we calculate the location of the snake, distance to each wall and to food and add it to it's appropriate sensor, rest will be 0
					    	//snake's maximum view distance is 100(adjustable from settings above) game units, if it's further than that the input will be 0
					    	//the closer something is the higher the neuron input value, for example 1 block away is 100%, 2 away 99%, 98% etc depending on view distance
					    	var inputs = calculateInputs(networks[k][1], maxRange);
					    	var output = networks[k][0].run(inputs);
					    	//outputs are in this order, %+x, %-x, %+y, %-y, %+z, %-z
					    	networks[k][1].move(commands[indexOfMax(output)]);
					    }
					    else
					    {
					    	//fitness will be the turns the snake had lived
					    	var fitness = networks[k][1].score*10 + networks[k][1].closestToFood;
					    	// Now we need to update the genetics with this fitness
					    	genetics.population[k].fitness = fitness;
					    	networks[k][2] = true;
						}
					}
				}
			}
			else
			{
				console.log("gen was ready, revive worms and make epoch - best fitness: "+genetics.bestFitness);
				// After you have decided on a fitness for each network, we can use the genetics
				// object to evolve them based on the results
				genetics.epoch(genetics.population);
				// Then we just need to import the new weights into the networks and repeat again and again
				for (var n = 0; n < popSize; n++) {
				    networks[n][0].importWeights(genetics.population[n].weights);
				    networks[n][1] = new snake(scene, renderer, '#'+Math.floor(Math.random()*16777215).toString(16).padEnd(6, "0"));
				    networks[n][2] = false;
				}
				renderer.clear();
			}
			t = 0;
		}
		t++;
	}
	speedSlider = document.querySelector('#speedSlider');
	function updateHandler(){
		update();
		timeout = parseFloat(speedSlider.value);
		setTimeout(updateHandler, timeout)
	}
	updateHandler();
	function render()
	{
		//renderer function, also update statistics
		renderer.render(scene, camera);
		stats.update();
	}
	function gameLoop()
	{
		//request another frame instantly
		requestAnimationFrame(gameLoop);
		//run neural net function magic
		//render scene
		render();
	}
	//start application
	gameLoop();
});
