window.onload = function () {
  // отримання об'єкта canvas
  let canvas = document.getElementById("myCanvas");

  // отримання контексту WebGL
  let gl = canvas.getContext("webgl");

  var shadowVertexShaderSource = `
  attribute vec4 a_Position;
  uniform mat4 u_MvpMatrix;
  void main() {
     gl_Position = u_MvpMatrix * a_Position;
  }
  `;

  var shadowVertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(shadowVertexShader, shadowVertexShaderSource);
  gl.compileShader(shadowVertexShader);

  var shadowFragmentShaderSource = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  void main() {
     const vec4 bitShift = vec4(1.0, 256.0, 256.0*256.0, 256.0*256.0*256.0);
     const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
     vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
     rgbaDepth -= rgbaDepth.gbaa * bitMask;
     gl_FragColor = rgbaDepth;
  }
  `;

  var shadowFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(shadowFragmentShader, shadowFragmentShaderSource);
  gl.compileShader(shadowFragmentShader);

  var shadowProgram = gl.createProgram();
  gl.attachShader(shadowProgram, shadowVertexShader);
  gl.attachShader(shadowProgram, shadowFragmentShader);
  gl.linkProgram(shadowProgram);

  var vertexShaderSource = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_MvpMatrixFromLight;
  varying vec4 v_PositionFromLight;
  varying vec4 v_Color;
  void main() {
     gl_Position = u_MvpMatrix * a_Position;
     v_PositionFromLight = u_MvpMatrixFromLight * a_Position;
     v_Color = a_Color;
  }
  `;

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  var fragmentShaderSource = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform sampler2D u_ShadowMap;
  varying vec4 v_PositionFromLight;
  varying vec4 v_Color;
  float unpackDepth(const in vec4 rgbaDepth) {
     const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
     float depth = dot(rgbaDepth, bitShift);
     return depth;
  }
  void main() {
     vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w)/2.0 + 0.5;
     vec4 rgbaDepth=texture2D(u_ShadowMap,shadowCoord.xy);
     float depth = unpackDepth(rgbaDepth);
     float visibility = (shadowCoord.z>depth+0.0015) ? 0.5 : 1.0;
     gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
  }
  `;

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var vertices = new Float32Array([
    4, -2, 2, -4, -2, 2, -4, -2, -2, 4, -2, -2, 3, 2, 1, 3, 2, -1, 0.5, 2, 1,
    0.5, 2, -1, -3, 2, 1, -3, 2, -1, -0.5, 2, 1, -0.5, 2, -1,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  var colors = new Float32Array([
    0.0, 0.5, 0.0,  
    0.0, 0.5, 0.0,
    0.0, 0.5, 0.0,
    0.0, 0.5, 0.0,
    
    1.0, 0.0, 0.0,  
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    
    0.0, 0.0, 1.0,  
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
  ]);


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  var indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 5, 6, 7, 8, 9, 10, 9, 10, 11,
  ]);
  var numIndices = indices.length;

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  var shadow_a_Position = gl.getAttribLocation(shadowProgram, "a_Position");
  var shadow_a_Color = gl.getAttribLocation(shadowProgram, "a_Color");
  var shadow_u_MvpMatrix = gl.getUniformLocation(shadowProgram, "u_MvpMatrix");

  var a_Position = gl.getAttribLocation(program, "a_Position");
  var a_Color = gl.getAttribLocation(program, "a_Color");
  var u_MvpMatrix = gl.getUniformLocation(program, "u_MvpMatrix");
  var u_MvpMatrixFromLight = gl.getUniformLocation(
    program,
    "u_MvpMatrixFromLight"
  );
  var u_ShadowMap = gl.getUniformLocation(program, "u_ShadowMap");

  var fbo = initFramebufferObject(gl, 2048, 2048);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

  gl.clearColor(0.0, 0.0, 0.0, 0.3); // Очищення кольору до темно-сірого
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  

  var tmp = new Matrix4();
  var viewProjMatrixFromLight = new Matrix4();
  viewProjMatrixFromLight.perspective(70.0, 1.0, 1.0, 200.0);

  tmp.lookAt(0, 40, 2, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  viewProjMatrixFromLight.multiply_matrix(tmp.entries);

  tmp = new Matrix4();
  var viewProjMatrix = new Matrix4();

  viewProjMatrix.perspective(45, canvas.width / canvas.height, 1.0, 100.0);
  tmp.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  viewProjMatrix.multiply_matrix(tmp.entries);

  var mvpMatrixFromLight_t = new Matrix4();

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  gl.viewport(0, 0, 2048, 2048);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(shadowProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
  gl.vertexAttribPointer(shadow_a_Position, 3, gl.FLOAT, false, 0, 0);
  
  gl.enableVertexAttribArray(shadow_a_Position);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
  g_mvpMatrix.set(viewProjMatrixFromLight);
  
  g_mvpMatrix.multiply_matrix(g_modelMatrix.entries);
  
  gl.uniformMatrix4fv(shadow_u_MvpMatrix, false, g_mvpMatrix.entries);

  gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_BYTE, 0);

  mvpMatrixFromLight_t.set(g_mvpMatrix);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.uniform1i(u_ShadowMap, 0);

  gl.uniformMatrix4fv(
    u_MvpMatrixFromLight,
    false,
    mvpMatrixFromLight_t.entries
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  if (a_Color != undefined) {
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply_matrix(g_modelMatrix.entries);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.entries);
  gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_BYTE, 0);
};

var g_modelMatrix = new Matrix4();

var g_mvpMatrix = new Matrix4();
