var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var currentColor = "#000000";
var drawingMode = 'points'; 
var points = [];
var circle = null; 

document.getElementById('colorPicker').addEventListener('change', function() {
    currentColor = this.value;
});

canvas.addEventListener('click', function(event) {
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    ctx.fillStyle = currentColor;

    if (drawingMode === 'points') {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
        ctx.fill();
    } else if (drawingMode === 'triangles' && points.length < 3) {
        points.push({x: x, y: y});

        if (points.length === 3) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.lineTo(points[2].x, points[2].y);
            ctx.closePath();
            ctx.fill();
            points = [];
        }
    } else if (drawingMode === 'circle') {
        if (circle === null) {
            circle = {x: x, y: y};
        } else {
            var radius = Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2));
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, radius, 0, 2 * Math.PI, false);
            ctx.fill();
            circle = null;
        }
    }
});

document.getElementById('clearButton').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('pointMode').addEventListener('click', function() {
    drawingMode = 'points';
});

document.getElementById('triangleMode').addEventListener('click', function() {
    drawingMode = 'triangles';
});

document.getElementById('circleMode').addEventListener('click', function() {
    drawingMode = 'circle';
});


