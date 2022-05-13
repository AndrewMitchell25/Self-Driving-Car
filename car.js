class Car{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.controls = new Controls();
    }

    update(){
        //use acceleration 
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        //cap the speed
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        //add friction
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        //set speed to 0 if very small
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        //left and right controls
        if(this.controls.left){
            this.angle += 0.03;
        }
        if(this.controls.right){
            this.angle -= 0.03;
        }
        //use unit circle to implement movement
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        ctx.save();
        //move the context to the x and y positions
        ctx.translate(this.x, this.y);
        //rotate the context
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.fill();

        ctx.restore();
    }
}