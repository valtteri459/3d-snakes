
<!DOCTYPE html>
<html>
<head>
	<title>webgl test</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<script src="js/jquery.js" type="text/javascript"></script>
	<script src="js/three.min.js" type="text/javascript"></script>




	<script src="js/Brainwave.js"></script>
	<script src="js/inputCalc.js"></script>
	<script src="js/main.js" type="text/javascript"></script>
	<script src="js/OrbitControls.js" type="text/javascript"></script>
	<script src="js/stats.min.js" type="text/javascript"></script>
	<style type="text/css">
	* {margin:0;padding:0;box-sizing:border-box;font-family:arial,sans-serif;resize:none;}
	html,body {width:100%;height:100%;overflow:hidden;background:gray;position:fixed;}
	#wrapper{height:100%;width:100%;position:fixed;}
	#gameArea{height:100%;width:100%;float:left;background:white;}
	#speedSlider{width:100%;direction:rtl;}
	#stats{position:fixed;bottom:0;left:0;overflow:hidden;}
	</style>
</head>
<body>
	<input type="range" min="0.01" max="500" step="1" id="speedSlider" />

	<div id="wrapper">
		<canvas id="gameArea">
			Error, your browser doesn't support the canvas element :C
		</canvas>
	</div>

	<div id="stats"></div>
</body>
</html>