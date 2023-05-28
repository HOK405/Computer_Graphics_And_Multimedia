var program;
var rotation = 0;
window.onload = function()
{
    var canvas = document.getElementById("myCanvas");
    gl = setupWebGL(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Fragment shader
    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    // Vertex shader
    var vertexShaderSource = `
        uniform mat4 uModelMatrix;
        attribute vec4 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        void main() {
            gl_Position = uModelMatrix * aPosition;
            vColor = aColor;
        }
    `;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    // Create program
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    // Create vertex buffer

    var vertices = [
        -0.5, 0.5, 0.0, 1.0, 0.0, 0.0, // верхній лівий кут
        -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,// нижній лівий кут
        0.5, -0.5, 0.0, 0.0, 0.0 , 1.0,  // нижній правий кут
        0.5, 0.5, 0.0, 0.0, 0.0, 1.0, // верхній правий кут
		-0.5, 0.5, 0.0, 0.0, 1.0, 0.0, // верхній лівий кут
		0.5, -0.5, 0.0, 1.0, 0.0, 0.0 // нижній правий кут
    ];

    var vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(aColor);
    
    animate();
}

function animate() {
    // Очищаємо буфер кольору і буфер глибини
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Обертання прямокутника
    rotation += 0.01;
    var rotationMatrix = [
        Math.cos(rotation), Math.sin(rotation),0,  0,
        -Math.sin(rotation), Math.cos(rotation), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    var matrixLocation = gl.getUniformLocation(program, "uModelMatrix");
    gl.uniformMatrix4fv(matrixLocation, false, rotationMatrix);

    // Відтворення прямокутника
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Повторення анімації
    requestAnimationFrame(animate);
}


function setupWebGL(canvas) {
    // Отримуємо контекст WebGL
    var gl = canvas.getContext('webgl');
  
    // Перевірка наявності контексту WebGL
    if (!gl) {
      alert('WebGL not supported!');
      return null;
    }
  
    // Встановлюємо розмір елементу Canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Встановлюємо колір екрану
    gl.clearColor(0.2, 0.2, 0.2, 1.0); // RGBA
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    return gl;
  }