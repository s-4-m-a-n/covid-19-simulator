var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var requestAnimationFrame = window.requestAnimationFrame|| window.mozRequestAnimationFrame|| window.webkitRequestAnimationFrame|| window.msRequestAnimationFrame ;
var sourceX = parseInt(canvas.width/2);
var sourceY = parseInt(canvas.height/2);

var infectedList = [];


class People{
	constructor(id,x,y){
		this.id = id;
		this.currentPosition = {'X':x , 'Y':y};
		this.oldPosition = {'X':this.currentPosition.X,'Y':this.currentPosition.Y};
		this.size = {'x':3,'y':3};
		this.isInfected  = false;
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
							this.currentPosition.X += this.size.x;
						}

						break;
		
			case 'd':   
						this.oldPosition.X = this.currentPosition.X;
						this.oldPosition.Y = this.currentPosition.Y;
						if (this.currentPosition.Y < (canvas.height-this.size.y)){
							this.currentPosition.Y += this.size.y;
						}
						break;
			case 'b': //backward
						this.oldPosition.X = this.currentPosition.X;
						this.oldPosition.Y = this.currentPosition.Y;
						if (this.currentPosition.X > 0 ){
							this.currentPosition.X -= this.size.x;
						}
						break;
			case 'u':
						this.oldPosition.X = this.currentPosition.X;
						this.oldPosition.Y = this.currentPosition.Y;
						if (this.currentPosition.Y > 0 ){
							this.currentPosition.Y -= this.size.y;
						}
						break;
			default :
						console.log("exception");
		}


		
		if (this.isInfected == false ){

			var result = this.areContacted();
			var dis = Math.sqrt(Math.pow((this.currentPosition.X-sourceX),2)+Math.pow((this.currentPosition.Y-sourceY),2));
				// if ( result || (((this.currentPosition.X >= sourceX-5) && (this.currentPosition.X <= sourceX+5))&& ((this.currentPosition.Y >= sourceY-5)&&(this.currentPosition.Y <= sourceY+5) )) ){
				if (result || dis < 5){
						this.isInfected = true;	
						infectedList.push({'X':this.currentPosition.X,'Y':this.currentPosition.Y,'id':this.id});		
				}
			}
		else{

		this.trackInfected();

		}


		this.displayPeople();



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


	areContacted(){
		var d;
		for (var j = 0 ; j < infectedList.length; j++){
			 d = Math.sqrt(Math.pow((this.currentPosition.X-infectedList[j].X),2)+Math.pow((this.currentPosition.Y-infectedList[j].Y),2));
				// if (((this.currentPosition.X >= (infectedList[j].X - 15) ) && (this.currentPosition.X <= (infectedList[j].X  + 15) )) && ((this.currentPosition.Y >= (infectedList[j].Y - 15) )&&(this.currentPosition.Y <= (infectedList[j].y  + 15) ))){
			if (d < 15){
					  return true;
				}
		}
		return false;
	}



	displayPeople(){
		ctx.clearRect(this.oldPosition.X,this.oldPosition.Y,this.size.x,this.size.y);
		
		ctx.fillStyle = (this.isInfected==false)?'green':'red';
		ctx.fillRect(this.currentPosition.X,this.currentPosition.Y,this.size.x,this.size.y);


	}
		
		

}


var MaxPeople = 400;

var peopleList = [];

for(i=0 ; i < MaxPeople;i++){
	var x = parseInt(Math.random()*canvas.width);
	var y = parseInt(Math.random()*canvas.height);
	peopleList[i] = new People(i,x,y);
}

let simulation = setInterval(function(){
 //-----------display origin -------
 	ctx.fillStyle = "red";
 	ctx.beginPath();
	ctx.arc(sourceX,sourceY,5,0,2*Math.PI);
	ctx.fill();
 //---------------------------------
	for (i=0;i<MaxPeople;i++){
		peopleList[i].move();
	}
	
},70);

 setTimeout(() => { clearInterval(simulation)},60000); //6sec


console.log(infectedList.length);