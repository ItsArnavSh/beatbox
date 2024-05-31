import { beatTimeStamps } from "./beats";
import { get } from "svelte/store";
import { height, width } from "./canvas";
import { pts } from "./rim";
import { writable } from 'svelte/store';

function createSimulation() {
  const { subscribe, set } = writable(false);

  let points = [{x:1,y:1,location:0,direction:2}];

  const minrad = 1;


  let h = get(height),w = get(width);
  let beats;
  let canvasPoints = [0,0,0,0];
  let distance = (h+w)/8
  const edges = [
      {x1:w/2,y1:0,x2:0,y2:h/2},
      {x1:w,y1:h/2,x2:w/2,y2:0},
      {x1:w/2,y1:h,x2:w,y2:h/2},
      {x1:0,y1:h/2,x2:w/2,y2:h}
  ]

  function begin() {
    beats = get(beatTimeStamps);
    generatePoints();
    
    // Now we will level points
    let minw = Infinity, maxw = -Infinity, minh = Infinity, maxh = -Infinity;

    // Find the min and max values for x and y coordinates
    for (let i = 0; i < points.length; i++) {
        if (points[i].x > maxw) {
            maxw = points[i].x;
        }
        if (points[i].x < minw) {
            minw = points[i].x;
        }
        if (points[i].y > maxh) {
            maxh = points[i].y;
        }
        if (points[i].y < minh) {
            minh = points[i].y;
        }
    }

    // Calculate scaling factors
    let ratiox = w / (maxw - minw);
    let ratioy = h / (maxh - minh);

    // Scale and translate points to fit within the desired range
    for (let i = 0; i < points.length; i++) {
        points[i].x = (points[i].x - minw) * ratiox;
        points[i].y = (points[i].y - minh) * ratioy;
    }

    pts.set(points);
    set(true);
}


  function generatePoints() {
    let currentCoord = points[0];
    canvasPoints[currentCoord.location]++;
    for (let i = 0; i < beats.length; i++) {
      let coordinates = findNearest(currentCoord) ;
      canvasPoints[canvasFinder(coordinates.x, coordinates.y)]++;
      currentCoord = coordinates;
    }
  }

  function findNearest(coord) {
    let point = {};
    while (true) {
      const [choosen, angle] = angleFinder(coord);
      point.location = canvasFinder(coord.x, coord.y);
      point.direction = choosen;
      point.x = Math.round(coord.x + distance * Math.cos(angle)),
      point.y = Math.round(coord.y + distance * Math.sin(angle))
      if (checkPoint(coord, point)) {
        points.push(point);
        break;
      }
    }
    return point;
  }

  function angleFinder(coord) {
    //canvasPoints
    let list = [0, 1, 2, 3];
    let loc = canvasFinder(coord.x,coord.y);
    let dir = coord.direction
    let temp = [];
    for (let i = 0; i < 4; i++) {
      if (i != loc && i != dir)
        temp.push(i);
    }
    list = temp;
    //console.log(list)
    //Now temp has coordinates of least ones
    let least = list[0],min = 100000;
    for(let i = 0;i<list.length;i++)
      {
        if(canvasPoints[list[i]]<min)
          {
            least = list[i]
            min = canvasPoints[list[i]]
          }
      }
    let choosen = min
    return [choosen, randomAngle(edges[choosen], coord)];
  }

  function randomAngle(edge, coord) {
    // Calculate the angles using Math.atan2 for proper quadrant consideration
    let fi1 = Math.atan2(edge.y1 - coord.y, edge.x1 - coord.x);
    let fi2 = Math.atan2(edge.y2 - coord.y, edge.x2 - coord.x);
    
    // Ensure angles are in the range [0, 2 * Math.PI]
    fi1 = (fi1 < 0) ? fi1 + 2 * Math.PI : fi1;
    fi2 = (fi2 < 0) ? fi2 + 2 * Math.PI : fi2;
    
    let max = Math.max(fi1, fi2);
    let min = Math.min(fi1, fi2);

    let angle;
    if (max - min <= Math.PI) {
        // Normal case: the random angle is between min and max
        angle = Math.random() * (max - min) + min;
    } else {
        // Wrapping case: the random angle wraps around 0/2*PI
        angle = Math.random() * (2 * Math.PI - max + min);
        if (angle > 2 * Math.PI - max) {
            angle = angle - (2 * Math.PI - max);
        } else {
            angle = angle + min;
        }
    }

    return angle;
}

  function canvasFinder(x, y) {
    if (y <= h / 2) {
      if (x <= w / 2)
        return 0;
      return 1;
    } else {
      if (x <= w / 2)
        return 2;
      return 3;
    }
  }

  function checkPoint(start, end) {
    const distance1 = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
    for (let i = 0; i < points.length; i++) {
      const distance2 = Math.sqrt((start.x - points[i].x) ** 2 + (start.y - points[i].y) ** 2);
      if (distance1 > distance2) {
        let pt = points[i];
        let slope = (end.y - start.y) / (end.x - start.x);
        let c = start.x * slope - start.y;
        let distance = Math.abs(pt.x - slope * start.x * pt.y - c) / (Math.sqrt(1 + slope ** 2));
        if (distance < minrad)
          return false;
      }
    }
    return true;
  }

  return {
    subscribe,
    begin
  };
}

export const simulation = createSimulation();
