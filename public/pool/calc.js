/*
------------------------------------------
Alt 1 - Normalen pekar uppåt
------------------------------------------
V = 0.75
N = 1.5
Diff = V - N
Diff = (0.75 - 1.5) = -0.75

Vnew = V + (2 * Diff)
Vnew = (0.75 + (2 * -0.75))
Vnew = (0.75 + -1.5) = (0.75 - 1.5) = (-0.75) = 1.25

Vnew = 1.25

------------------------------------------
Alt 2 - Normalen pekar neråt
------------------------------------------

V = 0.75
N = 0.5
Diff = V - N
Diff = 0.75 - 0.5 = 0.25

Vnew = V + (2 * Diff)
Vnew = 0.75 + (2 * 0.25) = 0.75 + 0.5 = 1.25

Vnew = 1.25

==============================================================
==============================================================

------------------------------------------
Alt 1 - Normalen pekar uppåt
------------------------------------------
V = 0.9
N = 1.5
Diff = V - N
Diff = (0.9 - 1.5) = -0.6

Vnew = V + (2 * Diff)
Vnew = (0.9 + (2 * -0.6))
Vnew = (0.9 + -1.2) = (0.9 - 1.2) = (-0.3) = 1.7

Vnew = 1.7

------------------------------------------
Alt 2 - Normalen pekar neråt
------------------------------------------

V = 0.9
N = 0.5
Diff = V - N
Diff = 0.9 - 0.5 = 0.4

Vnew = V + (2 * Diff)
Vnew = 0.9 + (2 * 0.4) = 0.9 + 0.8 = 1.7

Vnew = 1.7

------------------------------------------
Alt 1 - Normalen pekar uppåt - 90 deg
------------------------------------------
V = 0.9
N = 1.0
Diff = V - N
Diff = (0.9 - 1.0) = -0.1

Vnew = V + (2 * Diff)
Vnew = (0.9 + (2 * -0.1))
Vnew = (0.9 + -1.2) = (0.9 - 1.2) = (-0.3) = 1.7

Vnew = 1.7

------------------------------------------
Alt 2 - Normalen pekar neråt - 90 deg
------------------------------------------

V = 0.9
N = 0.5
Diff = V - N
Diff = 0.9 - 0.5 = 0.4

Vnew = V + (2 * Diff)
Vnew = 0.9 + (2 * 0.4) = 0.9 + 0.8 = 1.7

Vnew = 1.7

*/

/*
The principle behind collision resolution for pool balls is as follows. You have a situation where two balls are colliding, and you know their velocities.
You separate out each ball’s velocity into two perpendicular components: the component heading towards the other ball and the component that is perpendicular
to the other ball.
This is the same principle as we used when colliding with a wall.The difference here is that while you still leave alone the components that are parallel,
instead of reversing each ball’s component that heads towards the other ball, you swap the components between the two balls,
then finally recombine the velocities for each ball to leave the result:
*/




/*


function distAlong(x, y, xAlong, yAlong)
{
    return (x * xAlong + y * yAlong) / Math.hypot(xAlong, yAlong);

}

let newX = obj1.x;
let newY = obj1.y;
let distX = obj2.x - newX;
let distY = obj2.y - newY;
let dist = Math.sqrt(distX * distX + distY * distY);

let towardsThem = distAlong(obj1.velocity.x, obj1.velocity.y, distX, distY);
let towardsMe = distAlong(obj2.velocity.x, obj2.velocity.y, distX, distY);

let myOrtho = distAlong(obj1.velocity.x, obj1.velocity.y, distY, -distX);
let theirOrtho = distAlong(obj2.velocity.x, obj2.velocity.y, distY, -distX);

obj1.velocity.x = towardsMe * distX + myOrtho * distY;
obj1.velocity.y =  towardsMe * distY + myOrtho * -distX);
obj2.velocity.x = towardsThem * distX + theirOrtho * distY;
obj2.velocity.y =  towardsThem * distY + theirOrtho * -distX);


*/















































let dist = obj1.distanceTo(obj2) - obj1.radius - obj2.radius;

// Obj1 ----------------------------------
let normal1 = obj2.angleTo(obj1), diff1 = normal1 - obj1.getHeading(), newHeading1 = normal1 + diff1;
let normal2 = obj1.angleTo(obj2), diff2 = normal2 - obj2.getHeading(), newHeading2 = normal2 + diff2;

obj1.x += Math.cos(normal2) * dist;
obj1.y += Math.sin(normal2) * dist;

// Obj2 ----------------------------------
obj2.x += Math.cos(normal1) * dist;
obj2.y += Math.sin(normal1) * dist;

let tempSpeed = obj1.getSpeed();
obj1.setSpeed(obj2.getSpeed());
obj2.setSpeed(tempSpeed);
obj1.setHeading(newHeading2);
obj2.setHeading(newHeading1);
