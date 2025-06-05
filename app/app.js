"use strict";

var gl;
var points;
var colors = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    // Fill in the points for all our shapes
     points = new Float32Array([
	 	-1.0,   1.0,
         1.0,   1.0,
		 1.0,  -1.0,
        -1.0,  -1.0,
		-1.0,   1.0,
		 1.0,  -1.0,
		-1.0,  -1.0,
		 1.0,   1.0,	// Lines, 8
		 0.0,   0.5,
		 0.0,  -0.5,
		 0.5,   0.0,
		-0.5,   0.0,	// Points, 12
		-0.55,  0.55,
		 0.55,  0.55,
		 0.0,   1.0,
		 0.55,  0.55,
		 0.55, -0.55,
		 1.0,   0.0,
		-0.55, -0.55,
		 0.55, -0.55,
		 0.0,  -1.0,
		-0.55,  0.55,
		-0.55, -0.55,
		-1.0,   0.0,	// Triangles, 24
		-1.0,   1.0,
		-1.0,   0.55,
		-0.55,  1.0,
		-0.55,  0.55,
		-1.0,  -0.55,
		-1.0,  -1.0,
		-0.55, -0.55,
		-0.55, -1.0,
		 0.55,  1.0,
		 0.55,  0.55,
		 1.0,   1.0,
		 1.0,   0.55,
		 0.55, -0.55,
		 0.55, -1.0,
		 1.0,  -0.55,
		 1.0,  -1.0,	// Squares, 40
		 0.0,   0.0,		
		 0.17,  0.33,
		 0.33,  0.17,
		 0.33, -0.17,
		 0.17, -0.33,
		-0.17, -0.33,
		-0.33, -0.17,
		-0.33,  0.17,
		-0.17,  0.33,
		 0.17,  0.33,	// Polygon, 50
     ]);
	
	for (var i = 0; i <= 7; i++) { // Lines
		colors.push(black);
	}
	
	for (var i = 0; i <= 3; i++) { // Points
		colors.push(red);
	}
	
	for (var i = 0; i <= 11; i++) { // Triangles
		colors.push(green);
	}
	
	for (var i = 0; i <= 15; i++) { // Squares
		colors.push(blue);
	}
	
	for (var i = 0; i <= 3; i++) { // Polygon
		colors.push(red);
		colors.push(green);
		colors.push(blue);
	}
	
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( aPosition );

	// For Colors
	var cBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
	
	var colorLoc = gl.getAttribLocation(program, "aColor");
	gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(colorLoc);
	
    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP, 0, 8);
	gl.drawArrays(gl.POINTS, 8, 4);
	gl.drawArrays(gl.TRIANGLES, 12, 12);
	gl.drawArrays(gl.TRIANGLE_STRIP, 24, 4);
	gl.drawArrays(gl.TRIANGLE_STRIP, 28, 4);
	gl.drawArrays(gl.TRIANGLE_STRIP, 32, 4);
	gl.drawArrays(gl.TRIANGLE_STRIP, 36, 4);
	gl.drawArrays(gl.TRIANGLE_FAN, 40, 10);
}