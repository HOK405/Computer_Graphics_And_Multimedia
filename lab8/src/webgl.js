window.onload = function () {
    let canvas = document.getElementById("myCanvas");
  
    let gl = canvas.getContext("webgl");
  
    gl.viewport(0, 0, canvas.width, canvas.height);
  
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
  
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    gl.enable(gl.CULL_FACE);
  
    // створення вершинного шейдера
    var vertexShaderSource = `
          attribute vec3 aVertexPosition;
          attribute vec3 aNormal;
          uniform mat4 modelMatrix;
          uniform mat4 projectionMatrix;
          uniform mat4 viewMatrix;
          varying vec3 v_position;
          varying vec3 v_normal;
          void main() {
              vec4 pos = vec4(aVertexPosition, 1.0);
              vec4 normal = vec4(aNormal, 0.0);
  
              v_position = (viewMatrix * modelMatrix * pos).xyz;
              v_normal = normalize((viewMatrix * modelMatrix * normal).xyz);
  
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
          }
      `;
  
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
  
    // створення фрагментного шейдера
    var fragmentShaderSource = `
          precision mediump float;
          varying vec3 v_position;
          varying vec3 v_normal;
  
          void main() {
            vec3 u_light_position = vec3(5.0, 5.0, 0.0);  // розташування джерела світла
            vec3 u_ambient_color = vec3(0.0, 0.1, 0.2);   // ambient навколишній колір сцени
            vec3 u_diffuse_color = vec3(0.8, 0.1, 0.0);   // diffuse дифузний колір поверхні
            vec3 u_specular_color = vec3(0.5, 0.5, 0.5);  // specular дзеркальний колір поверхні
            float u_shininess = 2.0;      // shininess блиск поверхні
  
            vec3 L = normalize(u_light_position - v_position);
            vec3 N = normalize(v_normal);
            vec3 V = normalize(-v_position);
          
            float diffuse = max(dot(N, L), 0.0);
            vec3 diffuse_color = u_diffuse_color * diffuse;
          
            vec3 R = reflect(-L, N);
            float specular = pow(max(dot(R, V), 0.0), u_shininess);
            vec3 specular_color = u_specular_color * specular;
            
            vec3 lambertian = u_ambient_color + diffuse_color;
      
            vec3 blinnPhong = lambertian + specular_color;
      
            gl_FragColor = vec4(blinnPhong, 1.0);
          
          }
      `;
  
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
   
    // створення програми шейдерів та прив'язка шейдерів до програми
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // створення буфера вершин
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
    // встановлення значень вершин
    var vertices = [
      // верхня частина
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
  
      // ліва частина
      -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
  
      // права частина
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
  
      // лицева частина
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
  
      // задня частина
      1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
  
      // нижня частина
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0,
    ];
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    // створення буфера індексів
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
    // індекси вершин для створення граней квадрата
    var indices = [
      // верхня частина
      0, 1, 2, 0, 2, 3,
  
      // ліва частина
      5, 4, 6, 6, 4, 7,
  
      // права частина
      8, 9, 10, 8, 10, 11,
  
      // лицева частина
      13, 12, 14, 15, 14, 12,
  
      // верхня частина
      16, 17, 18, 16, 18, 19,
  
      // нижня частина
      21, 20, 22, 22, 20, 23,
    ];
  
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  
    // створення буфера normals
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  
    // встановлення значень вершин трикутника та їх кольорів
    var normals = [
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
       0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
  
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
  
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
  
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
       0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
  
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
       0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    ];
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var positionPointer = gl.getAttribLocation(program, "aVertexPosition");
    gl.vertexAttribPointer(positionPointer, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(positionPointer);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    var normalPointer = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalPointer, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(normalPointer);
  
    gl.useProgram(program);
  
    var modelMatrixLocation = gl.getUniformLocation(program, "modelMatrix");
    var projectionMatrixLocation = gl.getUniformLocation(
      program,
      "projectionMatrix"
    );
    var viewMatrixLocation = gl.getUniformLocation(program, "viewMatrix");
  
    var modelMatrix = mat4.create();
    mat4.identity(modelMatrix);
  
    var projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, 1, 2, 10);
  
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
  
    gl.uniformMatrix4fv(modelMatrixLocation, gl.FALSE, modelMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, gl.FALSE, projectionMatrix);
    gl.uniformMatrix4fv(viewMatrixLocation, gl.FALSE, viewMatrix);
  
    function drawScene() {
      // обертання кубу
      mat4.rotateY(modelMatrix, modelMatrix, 0.006);
      mat4.rotateZ(modelMatrix, modelMatrix, 0.003);
  
      gl.uniformMatrix4fv(modelMatrixLocation, gl.FALSE, modelMatrix);
  
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
  
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  
      requestAnimationFrame(drawScene);
    }
  
    requestAnimationFrame(drawScene);
  };
  