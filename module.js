/** @type{HTMLCanvasElement} */
var canvas = document.getElementById("mycanvas");
var gl = canvas.getContext("webgl");

var angleParameter1 = 0, angleParameter2 = 0;
var onMouseMove = function(event) {
    // console.log("mouse dragging");
    angleParameter1 += event.movementX;
    angleParameter2 += event.movementY;
}
var beingDragged = false;
canvas.onmousedown = function(event) {
    if (event.clientX < 0 || event.clientX > canvas.width) return null;
    if (event.clientY < 0 || event.clientY > canvas.height) return null;
    canvas.addEventListener("mousemove", onMouseMove);
    beingDragged = true;
};
canvas.onmouseup = function(event) {
    canvas.removeEventListener("mousemove", onMouseMove);
    beingDragged = false;
}

var vShaderSource = document.getElementById("vertexShader").textContent;
var fShaderSource = document.getElementById("fragmentShader").textContent;

function generateVertices(point, length, width, height) {
    var vertices = [];
    for (let i = 0; i <= 1; ++i) {
        for (let j = 0; j <= 1; ++j) {
            vertices.push(point[0]);
            vertices.push(point[1] + i * height);
            vertices.push(point[2] + j * width);
            vertices.push(i, j);
        }
    }
    for (let i = 0; i <= 1; ++i) {
        for (let j = 0; j <= 1; ++j) {
            vertices.push(point[0] + i * length);
            vertices.push(point[1]);
            vertices.push(point[2] + j * width);
            vertices.push(i, j);
        }
    }
    for (let i = 0; i <= 1; ++i) {
        for (let j = 0; j <= 1; ++j) {
            vertices.push(point[0] + i * length);
            vertices.push(point[1] + j * height);
            vertices.push(point[2]);
            vertices.push(i, j);
        }
    }
    point[0] += length; 
    point[1] += height; 
    point[2] += width;
    for (let i = 0; i >= -1; --i) {
        for (let j = 0; j >= -1; --j) {
            vertices.push(point[0]);
            vertices.push(point[1] + i * height);
            vertices.push(point[2] + j * width);
            vertices.push(-i, -j);
        }
    }
    for (let i = 0; i >= -1; --i) {
        for (let j = 0; j >= -1; --j) {
            vertices.push(point[0] + i * length);
            vertices.push(point[1]);
            vertices.push(point[2] + j * width);
            vertices.push(-i, -j);
        }
    }
    for (let i = 0; i >= -1; --i) {
        for (let j = 0; j >= -1; --j) {
            vertices.push(point[0] + i * length);
            vertices.push(point[1] + j * height);
            vertices.push(point[2]);
            vertices.push(-i, -j);
        }
    }
    return new Float32Array(vertices);
}

function generateIndices(squareNumbers) {
    indices = [];
    for (let i = 0; i < squareNumbers; ++i) {
        var index = i * 4;
        indices.push(index, index + 1, index + 3);
        indices.push(index, index + 2, index + 3);
    }
    return new Uint8Array(indices);
} 

var squares = 6;
var indices;
var leftWallVertices;

function getModelData() {
    indices = generateIndices(squares);
    leftWallVertices = generateVertices([-1, -1, -1], 2, 0.5, 2);
}

var setup = function() {
    // console.log("setup");
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        return null;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    gl.useProgram(shaderProgram);
    var vPositionLocation = gl.getAttribLocation(shaderProgram, "vPosition");
    var vTexCoordLocation = gl.getAttribLocation(shaderProgram, "vTexCoord");
    var mvpMatrixLocation = gl.getUniformLocation(shaderProgram, "uMVP");

    getModelData();
    // console.log(leftWallVertices);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, leftWallVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPositionLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(vPositionLocation);

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, leftWallVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vTexCoordLocation, 2, gl.FLOAT, false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(vTexCoordLocation);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    var image1 = document.getElementById("image1");
    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    
    var draw = function() {
        gl.clearColor(0, 0.7, 0.8, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        

        
        var angle1 = angleParameter1 * Math.PI / 180 / 2;
        var angle2 = angleParameter2 * Math.PI / 180 / 2;
        var rotation = mat4.create();
        mat4.rotateY(rotation, rotation, angle1);
        mat4.rotateX(rotation, rotation, angle2);

        var tModel = mat4.create();
        mat4.multiply(tModel, rotation, tModel);

        var tCamera = mat4.create();
        mat4.lookAt(tCamera, [0, 2, 5], [0, 0, 0], [0, 1, 0]);

        var tProjection = mat4.create();
        mat4.perspective(tProjection, Math.PI/4, canvas.width / canvas.height, 0.1, 1000);

        var tMVP = mat4.create();
        mat4.multiply(tMVP, tCamera, tModel);
        mat4.multiply(tMVP, tProjection, tMVP);

        gl.uniformMatrix4fv(mvpMatrixLocation, false, tMVP);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
}

window.onload = setup;