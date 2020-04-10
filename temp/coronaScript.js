let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");
let isolate = document.getElementById("isolate");
let populationField = document.getElementById("population");

let daysDisplay = document.getElementById("noOfDays");
let totalPopulationDisplay= document.getElementById("totalPopulation");
let totalCuredDisplay = document.getElementById("totalCured");
let totalDeathDisplay = document.getElementById("totalDeath");
let totalInfectedDisplay = document.getElementById("totalInfected");


// global variables
	var MaxPeople;
	var peopleList = [];
	var totalCured = 0;
	var totalDeath = 0;
	var totalPopulation = 0; 

	var avgWalk = 300; // 3000 to 4000 per day 
	var dayCount = 0;
	var delay = 0.1;
	var spreadingDistance = 3;
	var ageClasses = ['8+','7','6','5','4','3','2','1'];

	var infectedPace = 0.2;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


// var requestAnimationFrame = window.requestAnimationFrame|| window.mozRequestAnimationFrame|| window.webkitRequestAnimationFrame|| window.msRequestAnimationFrame ;
// var sourceX = parseInt(canvas.width/2);
// var sourceY = parseInt(canvas.height/2);

var sourceX = canvas.width +100;
var sourceY = canvas.height + 100;

var infectedList = [];


class People{
	constructor(id,x,y){
		this.id = id;
		this.currentPosition = {'X':x , 'Y':y};
		this.oldPosition = {'X':this.currentPosition.X,'Y':this.currentPosition.Y};
		this.size = {'x':2,'y':2};
		this.pace = this.size.x;
		this.isInfected  = false;
		this.alive = true; 
		this.incubationPeriod = parseInt(Math.random()*2)+12; //12 to 14 days
		this.countDown = this.incubationPeriod + parseInt(Math.random()*2 + 8); // value 0 determines whether the infected one will be cured or dead 
		this.gender = (Math.random() < 0.7) ? 'm':'f';
		
		this.ageGroup = ageClasses[parseInt(Math.random()*ageClasses.length)] //['8+','7','6','5','4','3','2','1']; // 7 -> 70-79 , 1 -> 10-19

		this.displayPeople();
		
	}
	
	move(){
		var possibleMove = ['f','d','b','u'];
		var index = parseInt(Math.random()*possibleMove.length);
		var walk = possibleMove[index];
		switch(walk){
			case 'f':   this.oldPosition.X = this.currentPosition.X;
						this.oldPosition.Y = this.currentPosition.Y;
						if (this.currentPosition.X < (canvas.width-this.size.x)){
							this.currentPosition.X += this.pace;
						}

						break;
		
			case 'd':   
						this.oldPosition.X = this.currentPosition.X;
						this.oldPosition.Y = this.currentPosition.Y;
						if (this.currentPosition.Y < (canvas.height-this.size.y)){
							this.currentPosition.Y += this.pace;
						}
						break;
			case 'b': //backward
						this.oldPosition.X = this.currentPosition.X;
						this.oldPosition.Y = this.currentPosition.Y;
						if (this.currentPosition.X > 0 ){
							this.currentPosition.X -= this.pace;
						}
						break;
			case 'u':
						this.oldPosition.X = this.currentPosition.X;
						this.oldPosition.Y = this.currentPosition.Y;
						if (this.currentPosition.Y > 0 ){
							this.currentPosition.Y -= this.pace;
						}
						break;
			default :
						console.log("exception");
		}


		
		if (this.isInfected == false ){

			var result = this.areInContact();
			
		
		var  dis = (infectedList.length == 0 )? Math.sqrt(Math.pow((this.currentPosition.X-sourceX),2)+Math.pow((this.currentPosition.Y-sourceY),2)) : 10 //greater than 5 always;
		
				if (result || dis < 5){
						this.isInfected = true;	
						infectedList.push({'X':this.currentPosition.X,'Y':this.currentPosition.Y,'id':this.id});		
				}
			}

		else{
			this.trackInfected();
			if (this.countDown == 0){
				this.alive = this.willLive();
				this.removePersonFromInfectedList(); // since either death or cured

			}
		}


		this.displayPeople();
		totalInfectedDisplay.innerText = "Total infected : " + infectedList.length;


	}

	removePersonFromInfectedList(){
		var index = 0 ;
		while(this.id != infectedList[index].id && index < infectedList.length)
			index++;

		if (index < infectedList.length){
			infectedList.splice(index,1);
		}
	}


	willLive(){
		// var chancesOfLiving;
		let status; // '1' for alive , '0' for dead
	switch(this.ageGroup){
			case '8+': 
						status = (parseInt(Math.random()*1000)/10 <= 15) ? '1' : '0';
						break;
			case '7':
						status = (paseInt(Math.random()*1000)/10 <= 8) ? '1' : '0';
						break;
			case '6':
						status = (parseInt(Math.random()*1000)/10 <= 4) ? '1' : '0';
						break;
			case '5':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '1' : '0';
						break;
			case '4':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '1' : '0';
						break;
			case '3':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '1' : '0';
						break;
			case '2':
						status = (paraseInt(Math.random()*1000)/10 <= 1) ? '1' : '0';
						break;
			case '1':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '1' : '0';
						break;
			default:
					console.log("exception");

	}	
		// var chancesOfLiving = [1,1,1,1,1,1,1,1,0,0]; // dies two out of 10
		 // var index = parseInt(Math.random()*chancesOfLiving.length);

			// switch(chancesOfLiving[index]){
				switch(status){
				case '1':
						this.cured();
						totalCuredDisplay.innerText =  "Total Cured : "+ (totalCured++);
						return true;
						
				case '0':
						this.dead();
						totalDeathDisplay.innerText = "Total Death : "+ (totalDeath++);
						totalPopulationDisplay.innerText = "Total population : "+ totalPopulation--;
						return false;
						
				default:
						alert("exception");
			}


	}

	cured(){

		this.isInfected = false;
		this.pace = this.size.x;
		this.incubationPeriod = parseInt(Math.random()*2)+12 ; //reset incubationPeriod
		this.countDown = this.incubationPeriod + parseInt(Math.random()*2+8);
	
	}


	dead(){
	
		peopleList[this.id] = 0;
	}

	trackInfected(){

			// infectedList[this.id] = {'X':this.currentPosition.X,'Y':this.currentPosition.Y};
		var index = 0; 
		while(this.id != infectedList[index].id && index < infectedList.length)
			index++;

		if (index < infectedList.length){
			infectedList[index].X = this.currentPosition.X;
			infectedList[index].Y = this.currentPosition.Y;
		}

	
		
	}


	areInContact(){
		var d;
		for (var j = 0 ; j < infectedList.length; j++){
			 d = Math.sqrt(Math.pow((this.currentPosition.X-infectedList[j].X),2)+Math.pow((this.currentPosition.Y-infectedList[j].Y),2));
				// if (((this.currentPosition.X >= (infectedList[j].X - 15) ) && (this.currentPosition.X <= (infectedList[j].X  + 15) )) && ((this.currentPosition.Y >= (infectedList[j].Y - 15) )&&(this.currentPosition.Y <= (infectedList[j].y  + 15) ))){
			if (d < spreadingDistance){
					  return true;
				}
		}
		return false;
	}



	displayPeople(){
		ctx.clearRect(this.oldPosition.X,this.oldPosition.Y,this.size.x,this.size.y);
	
		if (this.alive){
			ctx.fillStyle = (this.isInfected==false)?'green':'yellow';

			if (this.incubationPeriod < 0 ){
				 ctx.fillStyle = 'red';
				 this.pace = infectedPace; 
				}

			ctx.fillRect(this.currentPosition.X,this.currentPosition.Y,this.size.x,this.size.y);
			
		}
	}	
		
}




let simulation;
var totalWalk;
function startSimulation(){


MaxPeople = populationField.value;
totalWalk = avgWalk;

clearScreen();

//display total initial population
totalPopulation =MaxPeople;
totalPopulationDisplay.innerText = "Total population : "+ totalPopulation;


for(i=0 ; i < MaxPeople;i++){
	var x = parseInt(Math.random()*Math.random()*canvas.width);
	var y = parseInt(Math.random()*Math.random()*canvas.height);

	//exponential distribution 

		// var x = (parseInt(Math.log(Math.random())/2*canvas.width));
		// var y =(parseInt(Math.log(Math.random())/2*canvas.height));

	// var x =Math.abs(parseInt(randn_bm()*canvas.width));
	// var y = Math.abs(parseInt(randn_bm()*canvas.height));	

	peopleList[i] = new People(i,x,y);
}



 simulation = setInterval(function(){
 	ctx.clearRect(0,0,canvas.width,canvas.height);
//----------------------
	for (i=0;i < MaxPeople;i++){
		if(peopleList[i] != 0) //determine person is dead
			peopleList[i].move();
	}

//display days
	totalWalk--;


	if (totalWalk < 0){ // represent one day 
		daysDisplay.innerText = "Day : "+ dayCount++;
		totalWalk = avgWalk ;

		//--- decrement countdown and incubation period // per day
				for (i=0;i < MaxPeople;i++){
					if(peopleList[i] != 0 && peopleList[i].isInfected ) {//determine person is dead
								peopleList[i].incubationPeriod--;
								peopleList[i].countDown--;
					}
	}			


	}

if (infectedList.length != 0){ //after first infection removing source
	sourceX = canvas.width +100;
	sourceY = canvas.height + 100;
}


},delay);


}



function startCorona(){
	  sourceX = parseInt(canvas.width/3);
 	  sourceY = parseInt(canvas.height/3);
 	  alert("started");
 //-----------display origin -------
 	ctx.fillStyle = "red";
 	ctx.beginPath();
	ctx.arc(sourceX,sourceY,1,0,2*Math.PI);
	ctx.fill();
 //---------------------------------
}

function stopSimulation(){
	 setTimeout(() => { clearInterval(simulation)},0); //6sec
}
function isolatePeople(){

}

function clearScreen(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}