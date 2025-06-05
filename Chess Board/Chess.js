"use strict";

var canvas;
var gl;

var positions = [];
var colors = [];
var col = true;
var color1 = ivory_black;
var color2 = snow;
var theta = 0.0;
var thetaLoc;
var spin = false;

var inc_rotation = rotate(0.0, 0.0, 0.0, 1);
var ModelView = scale(0.25, 0.25, 0.25); // Smaller number zooms out
var Projection = ortho(-1, 1, -1, 1, -1, 1);

var ModelViewMatrixLoc;
var ProjectionMatrixLoc;

function quad(a, b, c, d, width, height) {
			
    var vertices = [
        vec4(-4.0 + width, 4.0 - height, 1.0, 1.0), // Left Top  0
        vec4(-4.0 + width, 3.0 - height, 1.0, 1.0), // Left Bot  1
        vec4(-3.0 + width, 4.0 - height, 1.0, 1.0), // Right Top 2
        vec4(-3.0 + width, 3.0 - height, 1.0, 1.0), // Right Bot 3
        vec4(-4.0 + width, 4.0 - height, 0.0, 1.0), // Left Top  4
        vec4(-4.0 + width, 3.0 - height, 0.0, 1.0), // Left Bot  5
        vec4(-3.0 + width, 4.0 - height, 0.0, 1.0), // Right Top 6
        vec4(-3.0 + width, 3.0 - height, 0.0, 1.0), // Right Bot 7
    ];

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        positions.push(vertices[indices[i]]);
    }
}

function cylinder(centerX, centerY, color) {
	
	var numFans = 100;
	var angles = (2*Math.PI) / numFans;
	
	for (var i = 0; i <= numFans; i++) {
		var angle = angles * (i + 1);
		var xCord = centerX + Math.cos(angle) * 0.40;
		var yCord = centerY + Math.sin(angle) * 0.40;
		var point = vec4(xCord, yCord, 1.0, 1.0);
		var point2 = vec4(xCord, yCord, 1.25, 1.0);
		positions.push(point);
		positions.push(point2);
		colors.push(color);
		colors.push(color);
	}
}

function board() {
	
	for (var height = 0; height < 8; height++) {
		for (var width = 0; width < 8; width++) {
			quad(1, 0, 2, 3, width, height);
    		quad(5, 4, 0, 1, width, height);
    		quad(5, 4, 6, 7, width, height);
    		quad(3, 2, 6, 7, width, height);
    		quad(0, 4, 6, 2, width, height);
    		quad(1, 5, 7, 3, width, height);
		}	
	}
	for (var k = 0; k < 4; k++) {
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		// Different Board Colors
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color2);
		}
		for (var i = 0; i < 36; i++) {
			colors.push(color1);
		}
	}
}

function checkers() {
	
	for (var i = 0; i < 8; i = i+2) {
		cylinder(-3.5 + i, 3.5, green);
	}
	for (var i = 0; i < 8; i = i+2) {
		cylinder(-2.5 + i, 2.5, green);
	}
	for (var i = 0; i < 8; i = i+2) {
		cylinder(-3.5 + i, 1.5, green);
	}
	// Different Checker Colors
	for (var i = 0; i < 8; i = i+2) {
		cylinder(-2.5 + i, -1.5, hot_pink);
	}
	for (var i = 0; i < 8; i = i+2) {
		cylinder(-3.5 + i, -2.5, hot_pink);
	}
	for (var i = 0; i < 10; i = i+2) {
		cylinder(-2.5 + i, -3.5, hot_pink);
	}
}

function do_spin() {
	
    ModelView = mult(inc_rotation, ModelView);
}

window.onload = function init() {
	
    canvas = document.getElementById("gl-canvas")

    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }
    
	////////// Make the Board
	board();
    ////////// Make the Checkers
	checkers();
	//////////
	
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    ModelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(ModelView));

    Projection = mult(perspective(45, 1, 1, 10),
     		      lookAt(vec3(0, 0, 5), vec3 (0, 0, 0), vec3(0, 1, 0)));

    ProjectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    gl.uniformMatrix4fv(ProjectionMatrixLoc, false, flatten(Projection));
	
	document.getElementById("StartSpin").onclick = function() {
		inc_rotation=rotate(0.5, 0.6, 0.6, 1);
	};
	document.getElementById("StopSpin").onclick = function() {
		inc_rotation=rotate(0.0, 0.0, 0.0, 1);
	};
    document.getElementById("MyMenu").onclick = function(event) {
     	switch (event.target.index) {
     		case 0:
     	    	ModelView=scale(0.25, 0.25, 0.25);
     	    	break;

     		case 1:
     	    	ModelView=scale(0.0005, 0.0005, 0.0005);
     	    	break;
     	}
    };

    render();
}

function render() {
	
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
    do_spin();

    gl.uniformMatrix4fv(ModelViewMatrixLoc, false, flatten(ModelView));
    gl.drawArrays(gl.TRIANGLES, 0, 2304);
	for (var i = 0; i < 24; i++) {
		gl.drawArrays(gl.TRIANGLE_FAN, 2305 + (i * 202), 202);
	}

    requestAnimationFrame(render);
}

// Specs To Project:
// The board and checkers will start still, with a top down view
// Start Spinning Button will get the board spinning, Stop Spinning will stop its rotation where it is
// New Game will get the board back to starting position
// Quit will get rid of the board all together

// Unfortunatly I couldn't get the checkers to move