// https://gist.github.com/chiquitto/f8af19f40c4f52699508

function parseColor(color) {
   var match, triplet;

   // Match #aabbcc
   if (match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color)) {
      triplet = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];

      // Match #abc
   } else if (match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color)) {
      triplet = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];

      // Match rgb(n, n, n)
   } else if (match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
      triplet = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];

   } else if (match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color)) {
      triplet = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10),parseFloat(match[4])];

   }
   return triplet;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function calculateSteps(begin, end, numSteps) {
	var colorSteps = [];
	var startRGB = parseColor(begin),
		endRGB = parseColor(end),
		// We don't round the diffs variable in order to have a smooth animation, and in order to prevent some bugs. Rounds are made in the rgbToHex
		diffR = (endRGB[0] - startRGB[0]) / numSteps,
		diffG = (endRGB[1] - startRGB[1]) / numSteps,
		diffB = (endRGB[2] - startRGB[2]) / numSteps,
		current = startRGB;
		
	// Ti.API.info('startRGB ' + startRGB + ' endRGB ' + endRGB + ' diffR ' + diffR + 'diffG ' + diffG + ' diffB ' + diffB);
	
	for (var i = 0; i < numSteps; i++) {
		current[0] += diffR;
		current[1] += diffG;
		current[2] += diffB;
		
		// We make the rgbToHex here in order to have a lighter animation callback
		colorSteps.push(rgbToHex(Math.round(current[0]), Math.round(current[1]), Math.round(current[2])));
	}
	startRGB = endRGB = diffR = diffG = diffB = current = null;
	return colorSteps;
}


exports.animateColor = function (_obj, _newColor, _duration) {
	var step = 0, steps = calculateSteps(_obj.color, _newColor, _duration);
	var interval = setInterval(function() {
		_obj.color = steps[step];
		step++;
		if (step === steps.length) {
			clearInterval(interval);
			steps = null;
			step = null;
			_obj = null;
		}
	}, 1);
};

