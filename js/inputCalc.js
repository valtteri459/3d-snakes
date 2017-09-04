//to assist in input mapping
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function closest (num, arr) {
    var curr = arr[0];
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}
function avg(a, b){
	return (a+b)/2;
}
function avgb(a, b, c){
	return (a+b+c)/3;
}
function min(num, num2){
	return Math.min(num, num2);
}
function max(num, num2){
	return Math.max(num, num2);
}
//58 input neurons (26 zones with 2 sensors each plus 6 of them have a third wall sensor)
//26 different detection zones, walls only detected in straight lines, others in the angular lines
//3 types of detected thingies
//food, self, wall
function calculateInputs(snakeObject, maxVisionDistance){
	var snakeloc 	= snakeObject.coords; 
	var tail 		= snakeloc.slice();
	//remove last element aka head
	tail.pop();
	var sx			= snakeloc[snakeObject.score][0];
	var sy			= snakeloc[snakeObject.score][1];
	var sz			= snakeloc[snakeObject.score][2];
	var foodloc 	= snakeObject.food.location;
	var fx			= snakeloc[0];
	var fy			= snakeloc[1];
	var fz			= snakeloc[2];
	var minCoords 	= [1,1,1];
	var maxCoords	= [175,175,175];
	var output		= [];
	/*for(i = 0;i < 78;i++){
		output[i] = Math.random();
	}*/
	//let's name each input sector first

	//of course first are the straight directional inputs i.e +x, -x, +y, -y, +z, -z 6 of these for each type
	//+x detector for all 3

		//wall
		wallDist = maxCoords[0] - sx;
		wallDist = min(max(wallDist,0),maxVisionDistance);

		output.push(wallDist.map(maxVisionDistance,0,0,1));
		//food
		if(sy == fy && sz == fz && sx < fx && (fx-sx) <= maxVisionDistance)
		{
			output.push((fx-sx).map(maxVisionDistance,0,0,1));
		}
		else
		{
			output.push(0);
		}
		//self(closest)
		var closest = 0;
		for(var l = 0;l<tail.length;l++)
		{
			var tx = tail[l][0];
			var ty = tail[l][1];
			var tz = tail[l][2];
			if(sy == ty && sz == tz && sx < tx && (tx-sx) <= maxVisionDistance)
			{
				var out = (tx-sx).map(maxVisionDistance,0,0,1);
				if(out > closest){
					closest = out;
				}
			}
		}
		output.push(closest);

	//-x detector for all 3
		//wall
		wallDist = sx-minCoords[0];
		wallDist = min(max(wallDist,0),maxVisionDistance);

		output.push(wallDist.map(maxVisionDistance,0,0,1));
		//food
		if(sy == fy && sz == fz && sx > fx && (sx-fx) <= maxVisionDistance)
		{
			output.push((sx-fx).map(maxVisionDistance,0,0,1));
		}
		else
		{
			output.push(0);
		}
		//self(closest)
		var closest = 0;
		for(var l = 0;l<tail.length;l++)
		{
			var tx = tail[l][0];
			var ty = tail[l][1];
			var tz = tail[l][2];
			if(sy == ty && sz == tz && sx > tx && (sx-tx) <= maxVisionDistance)
			{
				var out = (sx-tx).map(maxVisionDistance,0,0,1);
				if(out > closest){
					closest = out;
				}
			}
		}
		output.push(closest);
		
	//+y detector for all 3

		//wall
		wallDist = maxCoords[1] - sy;
		wallDist = min(max(wallDist,0),maxVisionDistance);

		output.push(wallDist.map(maxVisionDistance,0,0,1));
		//food
		if(sy < fy && sz == fz && sx == fx && (fy-sy) <= maxVisionDistance)
		{
			output.push((fy-sy).map(maxVisionDistance,0,0,1));
		}
		else
		{
			output.push(0);
		}
		//self(closest)
		var closest = 0;
		for(var l = 0;l<tail.length;l++)
		{
			var tx = tail[l][0];
			var ty = tail[l][1];
			var tz = tail[l][2];
			if(sy < ty && sz == tz && sx == tx && (ty-sy) <= maxVisionDistance)
			{
				var out = (ty-sy).map(maxVisionDistance,0,0,1);
				if(out > closest){
					closest = out;
				}
			}
		}
		output.push(closest);

	//-y detector for all 3
		//wall
		wallDist = sy-minCoords[1];
		wallDist = min(max(wallDist,0),maxVisionDistance);

		output.push(wallDist.map(maxVisionDistance,0,0,1));
		//food
		if(sy > fy && sz == fz && sx == fx && (sy-fy) <= maxVisionDistance)
		{
			output.push((sy-fy).map(maxVisionDistance,0,0,1));
		}
		else
		{
			output.push(0);
		}
		//self(closest)
		var closest = 0;
		for(var l = 0;l<tail.length;l++)
		{
			var tx = tail[l][0];
			var ty = tail[l][1];
			var tz = tail[l][2];
			if(sy > ty && sz == tz && sx == tx && (sy-ty) <= maxVisionDistance)
			{
				var out = (sy-ty).map(maxVisionDistance,0,0,1);
				if(out > closest){
					closest = out;
				}
			}
		}
		output.push(closest);
	//+z detector for all 3

		//wall
		wallDist = maxCoords[2] - sz;
		wallDist = min(max(wallDist,0),maxVisionDistance);

		output.push(wallDist.map(maxVisionDistance,0,0,1));
		//food
		if(sy == fy && sz < fz && sx == fx && (fz-sz) <= maxVisionDistance)
		{
			output.push((fz-sz).map(maxVisionDistance,0,0,1));
		}
		else
		{
			output.push(0);
		}
		//self(closest)
		var closest = 0;
		for(var l = 0;l<tail.length;l++)
		{
			var tx = tail[l][0];
			var ty = tail[l][1];
			var tz = tail[l][2];
			if(sy == ty && sz < tz && sx == tx && (tz-sz) <= maxVisionDistance)
			{
				var out = (tz-sz).map(maxVisionDistance,0,0,1);
				if(out > closest){
					closest = out;
				}
			}
		}
		output.push(closest);

	//-z detector for all 3
		//wall
		wallDist = sz-minCoords[2];
		wallDist = min(max(wallDist,0),maxVisionDistance);

		output.push(wallDist.map(maxVisionDistance,0,0,1));
		//food
		if(sy == fy && sz > fz && sx == fx && (sz-fz) <= maxVisionDistance)
		{
			output.push((sz-fz).map(maxVisionDistance,0,0,1));
		}
		else
		{
			output.push(0);
		}
		//self(closest)
		var closest = 0;
		for(var l = 0;l<tail.length;l++)
		{
			var tx = tail[l][0];
			var ty = tail[l][1];
			var tz = tail[l][2];
			if(sy == ty && sz > tz && sx == tx && (sz-tz) <= maxVisionDistance)
			{
				var out = (sz-tz).map(maxVisionDistance,0,0,1);
				if(out > closest){
					closest = out;
				}
			}
		}
		output.push(closest);
		
	//next are the inputs between different axis for example [+x:+z],[-x:+z],[+x:-z], [-x;-z] and same for Y axis
	//xz detection
		//++
			//food
			if(sx < fx && sy == fy && sz < fz)
			{
				output.push(max(avg((fz-sz), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy == ty && sz < tz)
				{
					var out = max(avg((tz-sz), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//+-
			//food
			if(sx < fx && sy == fy && sz > fz)
			{
				output.push(max(avg((sz-fz), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy == ty && sz > tz)
				{
					var out = max(avg((sz-tz), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//-+
			//food
			if(sx > fx && sy == fy && sz < fz)
			{
				output.push(max(avg((fz-sz), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy == ty && sz < tz)
				{
					var out = max(avg((tz-sz), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//--

			//food
			if( sx > fx && sy == fy && sz > fz)
			{
				output.push(max(avg((sz-fz), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy == ty && sz > tz)
				{
					var out = max(avg((sz-tz), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);

	//xy detection
		//++
			//food
			if(sx < fx && sy < fy && sz == fz)
			{
				output.push(max(avg((fy-sy), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy < ty && sz == tz)
				{
					var out = max(avg((ty-sy), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//+-
			//food
			if(sx < fx && sy > fy && sz == fz)
			{
				output.push(max(avg((sy-fy), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy > ty && sz == tz)
				{
					var out = max(avg((sy-ty), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//-+
			//food
			if(sx > fx && sy < fy && sz == fz)
			{
				output.push(max(avg((fy-sy), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy < ty && sz == tz)
				{
					var out = max(avg((ty-sy), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//--

			//food
			if( sx > fx && sy > fy && sz == fz)
			{
				output.push(max(avg((sy-fy), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy > ty && sz == tz)
				{
					var out = max(avg((sy-ty), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
	//yz detection
		//++
			//food
			if(sx == fx && sy < fy && sz < fz)
			{
				output.push(max(avg((fz-sz), (fy-sy)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx == tx && sy < ty && sz < tz)
				{
					var out = max(avg((tz-sz), (ty-sy)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//+-
			//food
			if(sx == fx && sy < fy && sz > fz)
			{
				output.push(max(avg((sz-fz), (fy-sy)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx == tx && sy < ty && sz > tz)
				{
					var out = max(avg((sz-tz), (ty-sy)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//-+
			//food
			if(sx == fx && sy > fy && sz < fz)
			{
				output.push(max(avg((fz-sz), (sy-fy)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx == tx && sy > ty && sz < tz)
				{
					var out = max(avg((tz-sz), (sy-ty)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//--

			//food
			if( sx == fx && sy > fy && sz > fz)
			{
				output.push(max(avg((sz-fz), (sy-fy)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx == tx && sy > ty && sz > tz)
				{
					var out = max(avg((sz-tz), (sy-ty)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);



	//lastly the "corner sensors" aka ones above and below [+x:+y],[-x:+y],[+x:-y], [-x;-y] zones which are away on all 3 planes total 8 of these, and these catch things the others don't :)
	//xy upper detection
		//++
			//food
			if(sx < fx && sy < fy && sz < fz)
			{
				output.push(max(avgb((fy-sy),(fz-sz), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy < ty && sz < tz)
				{
					var out = max(avgb((fy-sy),(tz-sz), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//+-
			//food
			if(sx < fx && sy < fy && sz > fz)
			{
				output.push(max(avgb((fy-sy),(sz-fz), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy < ty && sz > tz)
				{
					var out = max(avgb((fy-sy),(sz-tz), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//-+
			//food
			if(sx > fx && sy < fy && sz < fz)
			{
				output.push(max(avgb((fy-sy),(fz-sz), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy < ty && sz < tz)
				{
					var out = max(avgb((fy-sy),(tz-sz), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//--

			//food
			if( sx > fx && sy < fy && sz > fz)
			{
				output.push(max(avgb((fy-sy),(sz-fz), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy < ty && sz > tz)
				{
					var out = max(avgb((fy-sy),(sz-tz), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);

	//xy lower detection
		//++
			//food
			if(sx < fx && sy > fy && sz < fz)
			{
				output.push(max(avgb((sy-fy),(fz-sz), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy > ty && sz < tz)
				{
					var out = max(avgb((sy-fy),(tz-sz), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//+-
			//food
			if(sx < fx && sy > fy && sz > fz)
			{
				output.push(max(avgb((sy-fy),(sz-fz), (fx-sx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx < tx && sy > ty && sz > tz)
				{
					var out = max(avgb((sy-fy),(sz-tz), (tx-sx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//-+
			//food
			if(sx > fx && sy > fy && sz < fz)
			{
				output.push(max(avgb((sy-fy),(fz-sz), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy > ty && sz < tz)
				{
					var out = max(avgb((sy-fy),(tz-sz), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);
		//--

			//food
			if( sx > fx && sy > fy && sz > fz)
			{
				output.push(max(avgb((sy-fy),(sz-fz), (sx-fx)).map(maxVisionDistance,0,0,1),0));
			}
			else
			{
				output.push(0);
			}
			//self(closest)
			var closest = 0;
			for(var l = 0;l<tail.length;l++)
			{
				var tx = tail[l][0];
				var ty = tail[l][1];
				var tz = tail[l][2];
				if(sx > tx && sy > ty && sz > tz)
				{
					var out = max(avgb((sy-fy),(sz-tz), (sx-tx)).map(maxVisionDistance,0,0,1), 0);
					if(out > closest){
						closest = out;
					}
				}
			}
			output.push(closest);

	
	return output;
}
