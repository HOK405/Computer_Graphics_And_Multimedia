window.onload = function()
{
    var canvas = document.getElementById("myCanvas");
    var gl = setupWebGL(canvas);
    
    // створюємо шейдери
    var vertexShaderSource = `
    attribute vec2 a_position;
    uniform float u_time;

    void main() {
      gl_Position = vec4(a_position.x, a_position.y + 0.4 * sin(u_time), 0, 1);
    }
    `;

    var fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;

    void main() {
      gl_FragColor = u_color;
    }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // створюємо програму та зв'язуємо з нею шейдери
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // отримуємо розташування атрибутів та змінних
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var timeLocation = gl.getUniformLocation(program, "u_time");

    // створюємо буфер вершин
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var vertices = 
    [
    -0.5, 0,
    0.5, 0,
    0, 0.5,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // встановлюємо розмір області відображення
    gl.viewport(0, 0, canvas.width, canvas.height);

    // запускаємо цикл анімації
    var startTime = performance.now();
    function animate() 
    {
        // обчислюємо час від початку анімації
        var time = performance.now() - startTime;

        // очищуємо область відображення
        gl.clear(gl.COLOR_BUFFER_BIT);

        // використовуємо програму
        gl.useProgram(program);

        // передаємо атрибути
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // передаємо змінні
        gl.uniform4f(colorLocation, 1, 0, 0, 1);
        gl.uniform1f(timeLocation, time / 500);

        // малюємо трикутник
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

        // запускаємо наступну ітерацію анімації
        requestAnimationFrame(animate);
    }

    animate();
}

function setupWebGL(canvas) {
  var gl = canvas.getContext('webgl');

  if (!gl) {
      alert('WebGL not supported!');
      return null;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return gl;
}