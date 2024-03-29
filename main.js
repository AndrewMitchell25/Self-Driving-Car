const carCanvas=document.getElementById("carCanvas");
const networkCanvas=document.getElementById("networkCanvas");
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

let traffic;
let highGraphics = true;
let bestCar;
let road;
let play;
let cars;
let M = 0.1;
let N = 100;
let laneCount = 3;
let mode = "MANUAL";
let gen = 0;
let genNum = 0;

initialize();

function initialize(){
    carCanvas.width = window.innerWidth/2;

    networkCanvas.width = window.innerWidth/2;
    
    road = new Road(carCanvas.width/2, carCanvas.width*.9, laneCount);
    //const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
    cars = generateCars(N);

    //display info
    genNum += 1;
    document.getElementById("genNum").textContent = "Generation " + genNum;



    bestCar = cars[0];

    if(localStorage.getItem("bestBrain")){
        for(let i = 0; i < cars.length; i++){
            cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain, M);
            }
        }
    }

    traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY",2, getRandomColor()),
        new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY",2, getRandomColor()),
        new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY",2, getRandomColor()),
        new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY",2, getRandomColor()),
        new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY",2, getRandomColor()),
        new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY",2, getRandomColor()),
        new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY",2, getRandomColor()),
    ];
    //UI Stuff
    document.getElementById("pause").textContent = "Pause"
    if(mode == "MANUAL"){
        document.getElementById("save").style.display = "block";
        document.getElementById("discard").style.display = "block";
    } else if(mode == "AUTO"){
        document.getElementById("save").style.display = "none";
        document.getElementById("discard").style.display = "none";
    }

    play = 0;
    gen = 0;
    requestAnimationFrame(animate);
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i<=N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars;
}

function animate(time){
    for(let i = 0; i< traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }
    //find the car that's the furthest 
    if(mode == "MANUAL"){
        bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));
    } else if(mode =="AUTO"){
        bestCar = fitness(cars);
    }
    
    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    
    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);
    
    road.draw(carCtx);
    for(let i = 0; i< traffic.length; i++){
        traffic[i].draw(carCtx, highGraphics);
    }
    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(carCtx, highGraphics);
    }
    carCtx.globalAlpha = 1;
    //draw best car full opacity
    bestCar.draw(carCtx, highGraphics, true);
    
    carCtx.restore();
    
    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    if(play%2==0 && gen == 0){
        requestAnimationFrame(animate);
    }
    if(gen == 1){
        initialize();
    }
}


function fitness(cars){
    for(let i = 0; i < cars.length; i++){
        
    }
    return cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));
}


//button functions
function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    console.log(JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function pause(){
    play += 1;
    const pauseButton = document.getElementById("pause");
    if(play%2==0){
        pauseButton.textContent = "Pause";
    } else {
        pauseButton.textContent = "Play";
    }
    requestAnimationFrame(animate);
}

function graphics(){
    highGraphics = !highGraphics;
    const graphicsButton = document.getElementById("graphics");
    if(highGraphics){
        graphicsButton.textContent = "Low Graphics";
    } else {
        graphicsButton.textContent = "High Graphics";
    }
}

function nextGen(){
    gen = 1;
}

function restart(){
    
}

function setM(m){
    M = m;
}

function setN(n){
    N = n;
}

function switchMode(){
    if(mode == "MANUAL"){
        mode = "AUTO";
    } else if(mode == "AUTO"){
        mode = "MANUAL";
    }
    console.log(mode);
}