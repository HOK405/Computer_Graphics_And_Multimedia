window.onload = function () {
    let canvas = document.getElementById("myCanvas");
  
    let gl = canvas.getContext("webgl");
  
    if (!gl) {
      alert("WebGL не підтримується вашим браузером!");
      return;
    }
  
    gl.viewport(0, 0, canvas.width, canvas.height);
  
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
  
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    gl.enable(gl.CULL_FACE);
  
    var programBox = initGL_1(gl);
  
    gl.useProgram(programBox);
  
    var vertexBufferBox = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferBox);
  
    var verticesBox = [
      // верхня частина
      -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,
      1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
      // ліва частина 
      -1.0, 1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, 1.0, 0.75, 0.25, 0.5, -1.0,
      -1.0, -1.0, 0.75, 0.25, 0.5, -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,
      // права частина
      1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0,
      -1.0, -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, -1.0, 0.25, 0.25, 0.75,
      // передня частина 
      1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, -1.0, 1.0, 1.0, 0.0, 0.15, -1.0, -1.0,
      1.0, 1.0, 0.0, 0.15, -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
      // задня частина
      1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, -1.0, -1.0, 0.0, 1.0, 0.15, -1.0, -1.0,
      -1.0, 0.0, 1.0, 0.15, -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
      //низ
      -1.0, -1.0, -1.0, 0.5, 0.5, 1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, -1.0,
      1.0, 0.5, 0.5, 1.0, 1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
    ];
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesBox), gl.STATIC_DRAW);
  
    var indexBufferBox = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferBox);
  
    var indicesBox = [
      //верх
      0, 1, 2, 0, 2, 3,
      //ліво
      5, 4, 6, 6, 4, 7,
      // право
      8, 9, 10, 8, 10, 11,
      // перед
      13, 12, 14, 15, 14, 12,
      // задня частина
      16, 17, 18, 16, 18, 19,
      // нижня частина
      21, 20, 22, 22, 20, 23,
    ];
  
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indicesBox),
      gl.STATIC_DRAW
    );
  
    // встановлення покажчиків на атрибути
    var positionPointerBox = gl.getAttribLocation(
      programBox,
      "aVertexPositionBox"
    );
    gl.vertexAttribPointer(
      positionPointerBox,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(positionPointerBox);
  
    var colorPointerBox = gl.getAttribLocation(programBox, "aVertexColorBox");
    gl.vertexAttribPointer(
      colorPointerBox,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(colorPointerBox);
  
    // отримання локаторів змінних
    var modelMatrixLocationBox = gl.getUniformLocation(
      programBox,
      "modelMatrixBox"
    );
    var projectionMatrixLocationBox = gl.getUniformLocation(
      programBox,
      "projectionMatrixBox"
    );
    var viewMatrixLocationBox = gl.getUniformLocation(
      programBox,
      "viewMatrixBox"
    );
  
    var cameraDistance = 8;
    var modelRotationAngle = -1; 
    var cameraPosition;
  
    var modelMatrixBox = mat4.create();
    mat4.identity(modelMatrixBox);
  
    var projectionMatrixBox = mat4.create();
    mat4.perspective(projectionMatrixBox, Math.PI / 4, 1, 2, 10);
  
    var viewMatrixBox = mat4.create();
    function rotateBoxAndCover() {
      cameraPosition = [
        Math.sin(modelRotationAngle) * cameraDistance,
        0,
        Math.cos(modelRotationAngle) * cameraDistance,
      ];
    }
    rotateBoxAndCover();
    mat4.lookAt(viewMatrixBox, cameraPosition, [0, 0, 0], [0, 1, 0]);
  
    gl.uniformMatrix4fv(modelMatrixLocationBox, gl.FALSE, modelMatrixBox);
    gl.uniformMatrix4fv(
      projectionMatrixLocationBox,
      gl.FALSE,
      projectionMatrixBox
    );
    gl.uniformMatrix4fv(viewMatrixLocationBox, gl.FALSE, viewMatrixBox);
  
    function drawBox() {
      gl.useProgram(programBox);
  
      gl.uniformMatrix4fv(modelMatrixLocationBox, gl.FALSE, modelMatrixBox);
      gl.uniformMatrix4fv(viewMatrixLocationBox, gl.FALSE, viewMatrixBox);
  
      gl.drawElements(gl.TRIANGLES, indicesBox.length, gl.UNSIGNED_SHORT, 0);
    }
  
    var programCover = initGL_2(gl);
  
    gl.useProgram(programCover);
  
    var vertexBufferCover = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferCover);
  
    var verticesCover = [
      // верх
    -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, 
    -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 
    1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 
    1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
      // ліва частина
    -1.0, 1.0, 1.0, 1, 0.25, 0.5,
    -1.0, -1.0, 1.0, 1, 0.25, 0.5,
    -1.0,-1.0, -1.0, 1, 0.25, 0.5, 
    -1.0, 1.0, -1.0, 1, 0.25, 0.5,
      // права частина
    1.0, 1.0, 1.0, 0.25, 0.25, 0.75,
    1.0, -1.0, 1.0, 0.25, 0.25, 0.75,
    1.0, -1.0, -1.0, 0.25, 0.25, 0.75, 
    1.0, 1.0, -1.0, 0.25, 0.25, 0.75,
      // верхня частина
    1.0, 1.0, 1.0, 0.0, 0.5, 0.15,
    1.0,-1.0, 1.0, 0.0, 0.5, 0.15,
    -1.0, -1.0, 1.0, 0.0, 0.5, 0.15,
    -1.0, 1.0, 1.0, 0.0, 0.5, 0.15,
      // задня частина
    1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 
    1.0, -1.0, -1.0, 0.0, 1.0, 0.15, 
    -1.0, -1.0, -1.0, 0.0, 1.0, 0.15, 
    -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
      // нижня частина
    -1.0, -1.0, -1.0, 0.9, 0.7, 0.0, 
    -1.0, -1.0, 1.0, 0.9, 0.7, 0.0,
    1.0, -1.0, 1.0, 0.9, 0.7, 0.0,
    1.0, -1.0,-1.0, 0.9, 0.7, 0.0,
    ];
  
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(verticesCover),
      gl.STATIC_DRAW
    );
  
    var indexBufferCover = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferCover);
  
    var indicesCover = [
      0, 1, 2, 0, 2, 3,
      5, 4, 6, 6, 4, 7,
      8, 9, 10, 8, 10, 11,
      13, 12, 14, 15, 14, 12,
      16, 17, 18, 16, 18, 19,
      21, 20, 22, 22, 20, 23,
    ];
  
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indicesCover),
      gl.STATIC_DRAW
    );
  
    // встановлення покажчиків на атрибути
    var positionPointerCover = gl.getAttribLocation(
      programCover,
      "aVertexPositionCover"
    );
    gl.vertexAttribPointer(
      positionPointerCover,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(positionPointerCover);
  
    var colorPointerCover = gl.getAttribLocation(
      programCover,
      "aVertexColorCover"
    );
    gl.vertexAttribPointer(
      colorPointerCover,
      3,
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(colorPointerCover);
  
    // отримання локаторів змінних
    var modelMatrixLocationCover = gl.getUniformLocation(
      programCover,
      "modelMatrixCover"
    );
    var projectionMatrixLocationCover = gl.getUniformLocation(
      programCover,
      "projectionMatrixCover"
    );
    var viewMatrixLocationCover = gl.getUniformLocation(
      programCover,
      "viewMatrixCover"
    );
  
    var modelMatrixCover = mat4.create();
    mat4.identity(modelMatrixCover);
  
    var edgeCenterCover = [0, -1, 1];
    var rotationAngleCover = -0.2;
  
    function animateRotationCover() {
      mat4.identity(modelMatrixCover);
      mat4.translate(modelMatrixCover, modelMatrixCover, [
        -edgeCenterCover[0],
        -edgeCenterCover[1],
        -edgeCenterCover[2],
      ]);
  
      mat4.rotateX(modelMatrixCover, modelMatrixCover, rotationAngleCover);
  
      mat4.translate(modelMatrixCover, modelMatrixCover, edgeCenterCover);
      mat4.translate(modelMatrixCover, modelMatrixCover, [0.0, 1.1, 0.0]);
  
      mat4.scale(modelMatrixCover, modelMatrixCover, [1.0, 0.1, 1.0]);
    }
    animateRotationCover();
  
    var projectionMatrixCover = mat4.create();
    mat4.perspective(projectionMatrixCover, Math.PI / 4, 1, 2, 10);
  
    var viewMatrixCover = mat4.create();
    rotateBoxAndCover();
    mat4.lookAt(viewMatrixCover, cameraPosition, [0, 0, 0], [0, 1, 0]);
  
    gl.uniformMatrix4fv(modelMatrixLocationCover, gl.FALSE, modelMatrixCover);
    gl.uniformMatrix4fv(
      projectionMatrixLocationCover,
      gl.FALSE,
      projectionMatrixCover
    );
    gl.uniformMatrix4fv(viewMatrixLocationCover, gl.FALSE, viewMatrixCover);
  
    function drawCover() {
      gl.useProgram(programCover);
  
      gl.uniformMatrix4fv(modelMatrixLocationCover, gl.FALSE, modelMatrixCover);
      gl.uniformMatrix4fv(viewMatrixLocationCover, gl.FALSE, viewMatrixCover);
  
      gl.drawElements(gl.TRIANGLES, indicesCover.length, gl.UNSIGNED_SHORT, 0);
    }
  
    function drawScene() {
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      drawCover();
      drawBox();
    }
  
    drawScene();
  
    document.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "ArrowUp":
          handleArrowUp();
          break;
        case "ArrowDown":
          handleArrowDown();
          break;
        case "ArrowLeft":
          handleArrowLeft();
          break;
        case "ArrowRight":
          handleArrowRight();
          break;
        default:
          break;
      }
    });
  
    function handleArrowUp() {
      if (rotationAngleCover - 0.1 > 0 || rotationAngleCover < -3) {
        console.log("Stop");
        return;
      }
      rotationAngleCover -= 0.1;
      animateRotationCover();
      drawScene();
      console.log("Стрілка up була натиснута!");
    }
  
    function handleArrowDown() {
      if (rotationAngleCover >= 0 || rotationAngleCover + 0.1 < -3) {
        console.log("Stop");
        return;
      }
      rotationAngleCover += 0.1;
      animateRotationCover();
      drawScene();
      console.log("Стрілка down була натиснута!");
    }
  
    function handleArrowLeft() {
      modelRotationAngle += 0.1;
  
      rotateBoxAndCover();
  
      mat4.lookAt(viewMatrixBox, cameraPosition, [0, 0, 0], [0, 1, 0]);
      mat4.lookAt(viewMatrixCover, cameraPosition, [0, 0, 0], [0, 1, 0]);
  
      drawScene();
      console.log("Стрілка left була натиснута!");
    }
  
    function handleArrowRight() {
      modelRotationAngle -= 0.1;
  
      rotateBoxAndCover();
  
      mat4.lookAt(viewMatrixBox, cameraPosition, [0, 0, 0], [0, 1, 0]);
      mat4.lookAt(viewMatrixCover, cameraPosition, [0, 0, 0], [0, 1, 0]);
  
      drawScene();
      console.log("Стрілка right була натиснута!");
    }
  
    function initGL_1(gl) {
      var boxVertexShaderSource = `
      attribute vec3 aVertexPositionBox;
      attribute vec3 aVertexColorBox;
      uniform mat4 modelMatrixBox;
      uniform mat4 projectionMatrixBox;
      uniform mat4 viewMatrixBox;
      varying vec3 vColorBox;
      void main() {
          gl_Position = projectionMatrixBox * viewMatrixBox * modelMatrixBox * vec4(aVertexPositionBox, 1.0);
          vColorBox = aVertexColorBox;
      }
    `;
  
      var boxVertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(boxVertexShader, boxVertexShaderSource);
      gl.compileShader(boxVertexShader);
  
      if (!gl.getShaderParameter(boxVertexShader, gl.COMPILE_STATUS)) {
        console.error(
          "Помилка компіляції box вершинного шейдера:",
          gl.getShaderInfoLog(boxVertexShader)
        );
        return;
      }
  
      var boxFragmentShaderSource = `
      precision mediump float;
      varying vec3 vColorBox;
      void main() {
          gl_FragColor = vec4(vColorBox, 1.0);
      }
    `;
  
      var boxFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(boxFragmentShader, boxFragmentShaderSource);
      gl.compileShader(boxFragmentShader);
  
      if (!gl.getShaderParameter(boxFragmentShader, gl.COMPILE_STATUS)) {
        console.error(
          "Помилка компіляції box фрагментного шейдера:",
          gl.getShaderInfoLog(boxFragmentShader)
        );
        return;
      }
  
      var boxProgram = gl.createProgram();
      gl.attachShader(boxProgram, boxVertexShader);
      gl.attachShader(boxProgram, boxFragmentShader);
      gl.linkProgram(boxProgram);
  
      if (!gl.getProgramParameter(boxProgram, gl.LINK_STATUS)) {
        console.error(
          "Помилка створення програми шейдерів:",
          gl.getProgramInfoLog(boxProgram)
        );
        return;
      }
  
      return boxProgram;
    }
  
    function initGL_2(gl) {
      var coverVertexShaderSource = `
      attribute vec3 aVertexPositionCover;
      attribute vec3 aVertexColorCover;
      uniform mat4 modelMatrixCover;
      uniform mat4 projectionMatrixCover;
      uniform mat4 viewMatrixCover;
      varying vec3 vColorCover;
      void main() {
          gl_Position = projectionMatrixCover * viewMatrixCover * modelMatrixCover * vec4(aVertexPositionCover, 1.0);
          vColorCover = aVertexColorCover;
      }
    `;
  
      var coverVertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(coverVertexShader, coverVertexShaderSource);
      gl.compileShader(coverVertexShader);
  
      if (!gl.getShaderParameter(coverVertexShader, gl.COMPILE_STATUS)) {
        console.error(
          "Помилка компіляції cover вершинного шейдера:",
          gl.getShaderInfoLog(coverVertexShader)
        );
        return;
      }
  
      var coverFragmentShaderSource = `
      precision mediump float;
      varying vec3 vColorCover;
      void main() {
          gl_FragColor = vec4(vColorCover, 1.0);
      }
    `;
  
      var coverFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(coverFragmentShader, coverFragmentShaderSource);
      gl.compileShader(coverFragmentShader);
  
      if (!gl.getShaderParameter(coverFragmentShader, gl.COMPILE_STATUS)) {
        console.error(
          "Помилка компіляції cover фрагментного шейдера:",
          gl.getShaderInfoLog(coverFragmentShader)
        );
        return;
      }
  
      var coverProgram = gl.createProgram();
      gl.attachShader(coverProgram, coverVertexShader);
      gl.attachShader(coverProgram, coverFragmentShader);
      gl.linkProgram(coverProgram);
  
      if (!gl.getProgramParameter(coverProgram, gl.LINK_STATUS)) {
        console.error(
          "Помилка створення програми шейдерів:",
          gl.getProgramInfoLog(coverProgram)
        );
        return;
      }
  
      return coverProgram;
    }
  };
  