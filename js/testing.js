function testBoard(){
	insertTargets();
}

function insertTargets(){
	//10 index row with random numbers for row and column
	for(i = 0; i < 10; i++){
		target = getTarget();
		while($(target).hasClass('target')){
			target = getTarget();
		}
		//c(target);
		$(target).addClass('target').append("#");
	}
}

function getRandomNumber(){
	return Math.ceil(Math.random()*12);
}

function getTarget(){
	var x = colAlpha[getRandomNumber()]; 
	var y = getRandomNumber();
	target = "#" + x + y;

	return target;
}

function ajaxTest(){
	c("in ajaxTest()");
	
	ship = new Ship(1);

	ship.startPoint = "D3";
	ship.endPoint = "D6";

	ship.blocks = ["D3","D4","D5","D6"];

	$.ajax({
		type: "POST",
		url: "scripts/setShip.php?test=test",
		data: {
			startPoint: ship.startPoint,
			endPoint: ship.endPoint,
			length: ship.length,
			name: ship.name,
			blocks: ship.blocks
		},
		success: function(data){
			c("AJAX SUCCESS!");
			alert(data);
		},
		dataType: "html"
	});
}