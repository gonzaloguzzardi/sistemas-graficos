
function drawRiverCurve(points)
{
    if (points < 4)
    {
        return;
    }

    var ctx = canvasRiver.getContext("2d");
    ctx.clearRect(0, 0, canvasRiver.width, canvasRiver.height);
    ctx.fillStyle = "#6FA267";
    ctx.fillRect(0,0,canvasRiver.width,canvasRiver.height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2868D5';
    //ctx.strokeStyle = "#333";

    var segments = points.length - 3;

    ctx.beginPath();

    //move to start point
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 0; i < segments; i++)
    {
        var p0 = points[i];
        var p1 = points[i + 1];
        var p2 = points[i + 2];
        var p3 = points[i + 3];

        var accuracy = 0.01;
        for (var u = 0.0; u < 1.0; u += accuracy)
        {
            var curvePoint = bSplineCurve(u, p0, p1, p2, p3);
            ctx.lineTo(curvePoint[0], curvePoint[1]);
        }
        ctx.stroke();
    }


}

function bSplineCurve(t, p0, p1, p2, p3)
{

    var b0 = (1 - 3 * t + 3 * t * t - t * t * t ) * 1 / 6;    // (1 -3u +3u2 -u3)/6
    var b1 = ( 4 - 6 * t * t + 3 * t * t * t ) * 1 / 6;         // (4  -6u2 +3u3)/6
    var b2 = (1 + 3 * t + 3 * t * t - 3 * t * t * t) * 1 / 6;   // (1 -3u +3u2 -3u3)/6
    var b3 = (t * t * t ) * 1 / 6;                              // u3/6 

    var point = [];

    point.push(b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0]);
    point.push(b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1]);
    point.push(b0 * p0[2] + b1 * p1[2] + b2 * p2[2] + b3 * p3[2]);

    return point;
}

function resetRiverCurve(points)
{
    points.push([125.0, 250.0, 0.0]);
    points.push([125.0, 250.0, 0.0]);
    points.push([125.0, 250.0, 0.0]);

    points.push([125.0, 0.0, 0.0]);
    points.push([125.0, 0.0, 0.0]);
    points.push([125.0, 0.0, 0.0]);
}

function sortRiverPoints(points)
{
    points.sort(comparePoints);
}

// compare function to sort points in descendant order using the Y coordinate
function comparePoints(p0, p1) 
{
  if (p0[1] > p1[1]) 
  {
    return -1;
  }
  if (p0[1] < p1[1]) 
  {
    return 1;
  }

  return 0;
}