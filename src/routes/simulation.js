import { beatTimeStamps } from "./beats";
import { get } from "svelte/store";
import { height,width } from "./canvas";
import { pts } from "./rim";
import { writable } from 'svelte/store';

function createSimulation() {
  const { subscribe, set } = writable(false);



/*
x:
y:
location:
direction:


*/
const velocity = 50;
const minrad = 1;
let timeinterval = [10];
let dist;
let h = get(height),w = get(width);
let points = [{x:500,y:700,location:canvasFinder(500,700),direction:3}];
let beats;
let canvasPoints = [0,0,0,0];
const edges = [
    {x1:w/2,y1:h,x2:0,y2:h/2},
    {x1:w,y1:h/2,x2:w/2,y2:h},
    {x1:0,y1:h/2,x2:w/2,y2:0},
    {x1:w/2,y1:0,x2:w,y2:h/2}
]
function begin()
{
    beats = get(beatTimeStamps);
    convert()
    generatePoints()
    console.log(points)
    pts.set(points)
    set(true);
    
}
function convert()
{
    for(let i=1;i<beats.length;i++)
     timeinterval.push(Math.round((beats[i]-beats[i-1])/100));
    //Now we have values like 0 122 32 etc. This is the time dap in decisecs between each collision
    dist = timeinterval.map(x => velocity * x / 10);
}

function generatePoints()
{
    // 0 | 1
    //_______
    // 2 | 3
    let currentCoord = points[0]
    canvasPoints[0]++;//First point is in 0th coordfinate
    for(let i = 0;i<beats.length;i++)
    {
    let coordinates = findNearest(currentCoord,dist[i])
    currentCoord = coordinates;
    
    }
}
function findNearest(coord,distance)
{
    //console.log(coord)
    let point;
    while(true)
        {
    const [choosen,angle] = angleFinder(coord)
    //Now we have the angle and the point!
    console.log(angle*180/3.14189)
    point = {
        x:Math.round(coord.x+distance*Math.cos(angle)),
        y:Math.round(coord.y+distance*Math.sin(angle))    
    }
    //console.log(point)
    point.location = canvasFinder(point.x,point.y);
    point.direction = choosen;
    if(checkPoint(coord,point))
    {
        points.push(point);
        canvasPoints[canvasFinder(point.x,point.y)]
        break;
    }
        }
        return point;
}
function angleFinder(coord)
{
    let list = [0,1,2,3]
    let loc = coord.location;
    let dir = coord.direction;
    let choosen
    let temp =[];
    for(let i = 0;i<4;i++)
        {
            if(i != loc)
                temp.push(i)
        }
        list = temp

    choosen = Math.min(...temp)
    //The ball will be directed to choosen
    
    return [choosen,randomAngle(edges[choosen],coord)]

}
function randomAngle(edge,coord)
{
    //First between x1y1 and xy
    let m1 = (edge.y1-coord.y)/(edge.x1-coord.x);
    let m2 = (edge.y2-coord.y)/(edge.x2-coord.x);
    let fi1 = Math.atan(m1);
    let fi2 = Math.atan(m2);
    let max = Math.max(fi1,fi2);
    let min = Math.min(fi1,fi2);
    let angle = Math.random() * (max - min + 1) + min
    angle = angle<0? angle+2*Math.PI : angle;
    return (angle);
}
function canvasFinder(x,y)
{
    if(y<=h/2)//0 or 1
    {
        if(x<=w/2)
            return 0
        return 1
    }
    else
    {
        if(x<=w/2)
            return 2
        return 3;
    }
}
function checkPoint(start,end)
{
    //We have to verify no other entity comes in its way
    //We have to perform 2 checks,
    //If distance is less than distance, just pass
    //If distance is more than any other distance, then we do the circle test
    const distance1 = Math.sqrt((start.x-end.x)**2+(start.y-end.y)**2)
    for(let i = 0;i<points.length;i++)
    {
        const distance2 = Math.sqrt((start.x-points[i].x)**2+(start.y-points[i].y)**2)
        if(distance1>distance2)
        {
            //Now we need to check if we intersect any mini circle
            //The distance between this point and out line must be greater than minrad.
            let pt = points[i]
            let slope = (end.y-start.y)/(end.x-start.x)
            let c = start.x*slope-start.y
            //equation of line is y - slope*x -c = 0
            let distance = Math.abs(pt.x-slope*start.x*pt.y-c)/(Math.sqrt(1+slope**2))
            //console.log(distance, " ", minrad)
            if(distance<minrad)
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
