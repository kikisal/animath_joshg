const canvas = document.createElement('canvas')
const ctx    = canvas.getContext('2d');

canvas.width    = 400;
canvas.height   = 400;

ctx.fillRect( 0, 0, canvas.width, canvas.height );

document.body.appendChild(canvas);

class GmObject
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.objHandler = new ObjectHandler();
    }

    add(obj)
    {
        this.objHandler.add(obj);
        return obj;
    }

    getObjectHandler()
    {
        return this.objHandler;
    }
}

class Circle extends GmObject
{
    constructor(x, y, radius, vel)
    {
        super(x, y);
        this.radius = radius;
        this.vel = vel;
        this.initX = this.x;
        this.initY = this.y;
    }

    draw()
    {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI,  false);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    }

    update()
    {   
        this.x = (this.initX + this.radius) * 2 * Math.cos( deltaTime / (this.vel * 1000) * Math.PI * 2 );
        this.y = (this.initY + this.radius) * 2 * Math.sin( deltaTime / (this.vel * 1000) * Math.PI * 2 );   
    }

    getRadius()
    {
        return this.radius;
    }
}

class ObjectHandler
{
    constructor()
    {
        this.gmObjects = [];
    }

    update()
    {
        for ( const gmObj of this.gmObjects )
        {
            gmObj.update();
            gmObj.getObjectHandler().update();
        }
    }

    draw()
    {
        for ( const gmObj of this.gmObjects )
        {
            ctx.save();
            ctx.translate(gmObj.x, gmObj.y);
            gmObj.draw();
            
            gmObj.getObjectHandler().draw();


            ctx.restore();
        }
    }

    add(obj)
    {
        this.gmObjects.push( obj );
    }
}

class Scene extends GmObject
{
    constructor(x, y)
    {
        super(x, y);
    }

    update()
    {
        this.getObjectHandler().update();
    }

    draw()
    {
        ctx.save();
        ctx.translate( this.x, this.y );
        this.getObjectHandler().draw();
        ctx.restore();
    }
}

let deltaTime = 0;

const scene  = new Scene(canvas.width / 2, canvas.height / 2);
const circle = new Circle(0, 0, 35, 5);

scene.add(circle);
const c2 = circle.add(new Circle(22, 22, 20, 2));
c2.add( new Circle(10, 10, 10, 1) );

function loop(dt)
{
    deltaTime = dt;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    scene.update();
    scene.draw();
    
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);