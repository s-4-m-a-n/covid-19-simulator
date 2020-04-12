
const startSimulationBtn = document.getElementById("startSimulation");
const stopSimulationBtn = document.getElementById("stopSimulation");
const startSpreadingBtn = document.getElementById("startSpreading");
const applyBtn = document.getElementById("apply");
const defaultBtn = document.getElementById("default");

const graphSelect = document.getElementById("graphSelect");


//---------------- report data item -----------------

const totalDaysDisplay = document.getElementById("totalDays");
const initialPopulationDisplay = document.getElementById("initialPopulation");
const totalInfectedDisplay = document.getElementById("totalInfected");
const totalRecoveredDisplay = document.getElementById("totalRecovered");
const totalDeathDisplay = document.getElementById("totalDeath");
const totalPopulationDisplay = document.getElementById("totalPopulation");

//-------------------------------------------------


const totalPeople = document.getElementById("population");
const animationDelay = document.getElementById("animationDelay");


const gridEnable =document.getElementById("gridToggle");





const canvas = document.getElementById("simDisplay");
const ctx = canvas.getContext("2d");
	const parent = document.getElementById("parent");
	canvas.width = parent.offsetWidth;
	canvas.height = parent.offsetHeight;

// ------------------  gridLayout -----------------------------
const canvas2 = document.getElementById("gridCanvas");
const ctx2 = canvas2.getContext("2d");
	canvas2.width = parent.offsetWidth;
	canvas2.height = parent.offsetHeight;


// global variables
 	var MaxPeople;
	var peopleList = [];
	var totalCured = 0;
	var totalDeath = 0;
	var totalPopulation = 0; 
	var totalInfectedCount = 0;  //total infected till now

	var avgWalk = 300; // 3000 to 4000 per day 
	var dayCount = 0;
	var delay = parseInt(animationDelay.value);
	var spreadingDistance = 3;
	var ageClasses = ['8+','7','6','5','4','3','2','1'];

	var infectedPace = 0.2;


	//-------------settings---------------------

		//-------default settings ------------
			const graphTypeDefault = graphSelect.value;
			const gridSizeDefault = 20;
			const gridColorDefault = "gray";

	//--------------------------
	let graphType  = graphTypeDefault;
	 let gridSize = gridSizeDefault;
	 let gridColor = gridColorDefault; 




// let startBtn = document.getElementById("start");
// let stopBtn = document.getElementById("stop");
// let isolate = document.getElementById("isolate");
// let totalPeople = document.getElementById("population");

// let daysDisplay = document.getElementById("noOfDays");
// let totalPopulationDisplay= document.getElementById("totalPopulation");
// let totalCuredDisplay = document.getElementById("totalCured");
// let totalDeathDisplay = document.getElementById("totalDeath");
// let totalInfectedDisplay = document.getElementById("totalInfected");


// // global variables
// 	var MaxPeople;
// 	var peopleList = [];
// 	var totalCured = 0;
// 	var totalDeath = 0;
// 	var totalPopulation = 0; 

// 	var avgWalk = 300; // 3000 to 4000 per day 
// 	var dayCount = 0;
// 	var delay = 0.1;
// 	var spreadingDistance = 3;
// 	var ageClasses = ['8+','7','6','5','4','3','2','1'];

// 	var infectedPace = 0.2;

// var canvas = document.getElementById("canvas");
// var ctx = canvas.getContext("2d");



// // var sourceX = parseInt(canvas.width/2);
// // var sourceY = parseInt(canvas.height/2);

 let sourceX = canvas.width +100;
 let sourceY = canvas.height + 100;

 let infectedList = [];


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
						totalInfectedCount++;	
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
		// totalInfectedDisplay.innerText = "Total infected : " + infectedList.length;
			totalInfectedDisplay.innerText = infectedList.length;


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
						status = (parseInt(Math.random()*1000)/10 <= 15) ? '0' : '1';
						break;
			case '7':
						status = (parseInt(Math.random()*1000)/10 <= 8) ? '0' : '1';
						break;
			case '6':
						status = (parseInt(Math.random()*1000)/10 <= 4) ? '0' : '1';
						break;
			case '5':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '0' : '1';
						break;
			case '4':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '0' : '1';
						break;
			case '3':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '0' : '1';
						break;
			case '2':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '0' : '1';
						break;
			case '1':
						status = (parseInt(Math.random()*1000)/10 <= 1) ? '0' : '1';
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
						// totalCuredDisplay.innerText =  "Total Cured : "+ (totalCured++);
							totalRecoveredDisplay.innerText = totalCured++;
						return true;
						
				case '0':
						this.dead();
						// totalDeathDisplay.innerText = "Total Death : "+ (totalDeath++);
						// totalPopulationDisplay.innerText = "Total population : "+ totalPopulation--;
							totalDeathDisplay.innerText = totalDeath++;
							totalPopulationDisplay.innerText = totalPopulation--;
							//update chart
							
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
			if (d < spreadingDistance){
					  return true;
				}
		}
		return false;
	}



	displayPeople(){
		ctx.clearRect(this.oldPosition.X,this.oldPosition.Y,this.size.x,this.size.y);


		if (this.alive){
			ctx.fillStyle = (this.isInfected==false)?'green':'purple';

			if (this.incubationPeriod < 0 ){
				 ctx.fillStyle = 'red';
				 this.pace = infectedPace; 
				}

			// ctx.fillRect(this.currentPosition.X,this.currentPosition.Y,this.size.x,this.size.y);
			ctx.beginPath();
			ctx.arc(this.currentPosition.X,this.currentPosition.Y,this.size.x/2,0,Math.PI*2);
			ctx.fill();
			
		}
	}	
		
}


//--------------------------------------------------  for canvas2 to display grid ------------------------------

function displayGrid(){
		//---- draw row --
			ctx2.lineWidth = 1;
			ctx2.strokeStyle = gridColor;
			
			for(i = 0 ; i <= parseInt(canvas2.width/gridSize);i++){
					ctx2.beginPath();
					ctx2.moveTo(i*gridSize, 0);
					ctx2.lineTo(i*gridSize, canvas2.height);
					ctx2.stroke();
			}
			for(i = 0 ; i <= parseInt(canvas2.height/gridSize);i++){
					ctx2.beginPath();
					ctx2.moveTo(0,i*gridSize);
					ctx2.lineTo(canvas2.width,i*gridSize);
					ctx2.stroke();
			}
	}



//---------------------  event listener -----------------------------------------
gridEnable.addEventListener("change",(e)=>{
  			if( e.target.checked){
  				 displayGrid();
  				}
  			else{
  				clearScreen(ctx2);
  			}
  			
  		});


//------------------------------ main ---------------------------------------------------------------
let simulation;
var totalWalk;




function startSimulation(){


		MaxPeople = totalPeople.value;
				
		totalWalk = avgWalk;

		clearScreen(ctx);

		startSimulationBtn.disabled = true;
		startSpreadingBtn.disabled = false;
		stopSimulationBtn.disabled = false;
		applyBtn.disabled = true;
		defaultBtn.disabled = true;

		//display total initial population
		totalPopulation =MaxPeople;
				initialPopulationDisplay.innerText  = MaxPeople;
				totalPopulationDisplay.innerText = totalPopulation; 


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
				// daysDisplay.innerText = "Day : "+ dayCount++;
					totalDaysDisplay.innerText = dayCount++;
					updateChart(dayCount,totalDeath,totalInfectedCount,totalCured);             // update chart 
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



function startSpreading(){

	startSpreadingBtn.disabled = true;

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

	 startSimulationBtn.disabled = false;
	 stopSimulationBtn.disabled = true;
	 applyBtn.disabled = false;
	 defaultBtn.disabled = false;
}

function isolatePeople(){

}

function clearScreen(ctx){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}





//----------------------------------------------- for chart . js ----------------------------------------------------------

var ctx3 = document.getElementById('myChart').getContext('2d');
		let dataDeath = [];
		let dataInfected = [];
		let dataRecovered = []; 
		let labelset = [];

let chart;

function displayChart(){
		 chart = new Chart(ctx3,{

			type : graphType,
			data:{
				labels:labelset,
				datasets:[{
					label:'totalDeath',
					data:dataDeath,
					borderColor:'red',
					backgroundColor:"#e8b5b8",
				},
				{
					label:'total infected',
					data: dataInfected,
					borderColor:'purple',
					backgroundColor:"#dab5e8"

					
				},
				{
					label:'total Recovered',
					data: dataRecovered,
					borderColor:'green',
					backgroundColor:'#bcedb9'

				}]
			},

			options:{
				title:{
					text:" covid-19 simulation chart ",
					display:true
				},
				maintainAspectRatio:false
			}
		});


}

displayChart();

function updateChart(dayCount,death,infected,recovered){
	
	  	chart.data.labels.push('day-'+(dayCount));
   		chart.data.datasets[0].data.push(death);
   		chart.data.datasets[1].data.push(infected);
   		chart.data.datasets[2].data.push(recovered);
		chart.update();	
}

// let update = setInterval(function(){
	
	 // chart.data.datasets.forEach((dataset) => {
  //       dataset.data.push(parseInt(Math.random()*100));
  //   });
	 // chart.data.datasets.forEach((dataset) => {
  //       dataset.data.push(parseInt(Math.random()*100));
  //   });

  
 //  chart.data.labels.push('day-'+(++day));
 //   chart.data.datasets[0].data.push(parseInt(Math.random()*100));

	// count++;

	// chart.update();

// },200);

// setTimeout(() => { clearInterval(update)},10000); 

// chart.canvas.parentNode.style.height = '500px';
// chart.canvas.parentNode.style.width = '500px';

//-------------------------------------- graph control -------------------------------------------------
	function applyGraphType(){
		graphType = graphSelect.value;
		chart.type = graphType;
		console.log(chart.type);
		chart.destroy();
		displayChart();
	}

function setGraphDefault(){
	graphType = graphTypeDefault;
	chart.type = graphType;
	graphSelect.value = graphTypeDefault;
	console.log(chart.type);
	chart.destroy();
	displayChart();


}


//-----------------------------------------------------------------------------------------------------