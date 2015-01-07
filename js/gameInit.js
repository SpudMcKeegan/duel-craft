//------------------
// VARS
//------------------
var ships = [];
var sessionShips = [];
var colAlpha = ['#','A','B','C','D','E','F','G','H','I','J','K','L'];
var playerId, sessionCode, playerNumber, opponentId;

$(document).ready(function(){
	$('#singlePlayer').click(function(){
		$("#phase1").fadeOut(200, function(){
			$("#phase2").fadeIn(200);
			boardInit();
		});
	});

	$('#twoPlayer').click(function(){
		$("#mode").fadeOut(200, function(){
			$("#multiPlayerOptions").fadeIn(200);
		});
	});

	$("#newGame").click(function(){
		$("#phase1").fadeOut(200, function(){
			$("#phase2").fadeIn(200, function(){
				createSession();
			});
		});
	});

	$("#joinGame").click(function(){
		$("#phase1").fadeOut(200, function(){
			joinSession( $("#joinsessionCode").val().replace(/\s+/g, '') );
		});
	});

	$("#emptyEverything").click(function(){	emptyEverything(); });
});

//------------------
// Helper Functions
//------------------
function displayInstruction(mes){
	$("#instruct").prepend("<p>" + mes + "</p>");
}

//------------------
// Main Functions
//------------------

//Initiates board
// -- Adds grid locations as ids
// -- calls fightControls
function boardInit(){
	buildIDS();
	addWater();
	getSessionShips(playerId);
	setPlayerNum();
}

//------------------
// Misc Functions
//------------------
function getSessionShips(playerId){
	$.ajax({
		url: 'scripts/getSessionShips.php',
		type: 'POST',
		dataType: 'json',
		data: {playerId: playerId},
		success: function(data){
			sessionShips = data;
			buildShips();
			loadSessionShots();
		},
		fail: function(){
			alert("Something went horribly wrong and it's probably your fault.");
		}
	});
}

function loadSessionShots(){
	//
	$.ajax({
		url: 'scripts/loadSessionShots.php',
		type: 'POST',
		dataType: 'json',
		data: {
			playerId: playerId, 
			opponentId: opponentId,
			sessionCode: sessionCode
		}
	}).done(function(data){
		shots(data.mine, ".opponent");
		shots(data.opponent, ".mine");
	});
}


//Who is opposite. Who is intested to be whose board, not who took the shots.
//Who is the ID of the board you are manipulating
function shots(data, who){
	for(var shot = 0; shot < data.length; shot++){
		target = data[shot].split(".");
		if(target[0] === 'h'){
			$(who + " #" + target[1]).addClass("hit").removeClass("water ship");
		}else{
			$(who + " #" + target[1]).addClass("miss").removeClass("water");
		}
	}
}


function buildShips(){
	for(q = 0; q <= 4; q++){
		ship = new Ship(q);

		if(sessionShips.length >= (q+1)){
			ship.startPoint = sessionShips[q].startPos;
			ship.endPoint = sessionShips[q].endPos;

			//Inserts the ship onto the board
			endPointNum = ship.getNum2();
			endPointAlpha = ship.getAlpha2();
			endPoint = ship.endPoint;
			startPoint = ship.startPoint;
			unused = insertShip(ship, endPointAlpha, endPointNum, endPoint);
		}
		ships.push(ship);
	}

	positionShips();
}

function buildIDS(){
	$('table tr').each(function(){
		if($(this).index() !== 0){
			var gridLocation;
			var y = $(this).index();
			var x;

			$(this).find("td").each(function(){
				if($(this).index() !== 0){
					x = colAlpha[$(this).index()];
					gridLocation = x + y;
					$(this).attr("id", gridLocation);
				}
				gridLocation = "";
			});
		}
	});
}

//Adds water to both boards.
function addWater(){
	$('td').each(function(){ 
		if( $(this).index() !== 0 ){ 
			$(this).addClass('water field');
		} 
	});
}

//Position Ships
function positionShips(){
	//in  = Starting click, first ship position
	//out = Ending Click, second ship position
	currentClick = "in";
	//Which ship in the array is the current ship
	shipNum = sessionShips.length;
	//sets current ship
	var currentShip = ships[shipNum];
	if(currentClick === "in" && shipNum === 5){
		setReady();
	}

	$('table.mine .field').click(function(){
		if(currentClick === "in"){
			//in point
			currentShip.startPoint = $(this).attr('id');
			$(this).addClass("shipStart");
			currentClick = "out";
			displayInstruction(currentShip.getDesc());
		}else if(currentClick === "out" && $(this).hasClass("shipStart")){
			$(this).removeClass("shipStart");
			currentClick = "in";
		}else{
			//out point
			//if in same number and row, finish building ship and set alpha/num to ""
			//else don't accept the click
			tempPoint = $(this).attr('id');
			tempEndPoint = $(this).attr('id').split("");
			endPointAlpha = tempEndPoint[0];
			endPointNum = parseInt(tempEndPoint[1], 10);			
			if(tempEndPoint.length === 3){ endPointNum = parseInt(endPointNum + tempEndPoint[2], 10); }
			var fit = true;

			//If the current ships start point and the new end point are in the same row or column
			if(currentShip.getAlpha1() === endPointAlpha || currentShip.getNum1() === endPointNum || (currentShip.getAlpha1() === endPointAlpha && currentShip.getNum1() === endPointNum)){
				fit = insertShip(currentShip, endPointAlpha, endPointNum, tempPoint);
			}else{
				alert("Ships can go diagonal in make-believe-land. This is not make-believe-land.");
				fit = false;
			}

			if(fit){
				currentShip.playerId = playerId;
				currentShip.setShip();	
				currentClick = "in";
				$('.shipStart').removeClass("shipStart");
				shipNum++;
				currentShip = ships[shipNum];
			}

			if(currentClick === "in" && shipNum === 5){
				setReady();
			}
		}
	});
}

function setReady(){
	displayInstruction("All ships set, starting game soon");
	$('table.mine .field').off('click');

	$.ajax({
		url: 'scripts/setReady.php',
		type: 'POST',
		data: {
			playerId: playerId,
		}
	})
	.done(function(){
		waitForOpponent();
	});
}

function waitForOpponent(){
	flag = true;
	time = setInterval(function(){
		$.ajax({
			url: 'scripts/checkForOpponent.php',
			type: 'POST',
			dataType: 'json',
			data: {
				playerId: playerId,
				sessionCode: sessionCode
			}
		})
		.done(function(data) {
			console.log(data);
			if(data.ready === '1'){
				clearTimeout(time);
				displayInstruction("All players are ready!");
				startTheWar();
			}else if(data.ready === "2" && flag){
				displayInstruction("Opponent has yet to join, make sure that you sent the correct session code! (" + sessionCode + ")");
				flag = false;
			}else if (data.ready === "0" && flag){
				displayInstruction("Opponent has joined, but he/she is taking it's sweet ass time. Text them to move their asses");
			}
		});
	},	4000);
}

function setPlayerNum(){
	$("#playerNumber").append(playerNumber);
}

function createSession(){
	$.ajax({
		type: "POST",
		url: "scripts/createSession.php",
		success: function(data){
			console.log(data);
			playerId = data['playerId'];
			playerNumber = data['playerNumber'];
			sessionCode = data['sessionCode'];
			opponentId = data['opponentId'];
			sessionCodeDisplay();
			boardInit();
		},
		dataType: "json"
	});
}

function joinSession( sc ){
	$.ajax({
		type: "POST",
		url: "scripts/joinSession.php",
		data: {sessionCode: sc},
		success: function(data){
			console.log(data);
			if(data.message === "error"){
				alert('The code you have submitted is either wrong or someone is already in this game. Please check to make sure you didn\'t fuck up or that your friend isn\'t being a dickhead.');
				$("#phase1").fadeIn(200);
			}else{
				$("#phase2").fadeIn(200);
				playerId = data['playerId'];
				playerNumber = data['playerNumber'];
				sessionCode = data['sessionCode'];
				opponentId = data['opponentId'];
				boardInit();
			}
		},
		dataType: "json"
	});
}

function sessionCodeDisplay(){
	$("#instruct").prepend("Your sessionCode: <strong>" + sessionCode + "</strong> (To have someone join your session, send them this code. They will need to put it into the joinGame text box in the multiplayer sextion of the start menu");
}

function emptyEverything(){
	$.ajax({
		type: "POST",
		url: "scripts/emptyEverything.php"
	})
	.done(function(){
		location = "index.php";
	});	
}

//---------------------
// Placement Functions
//---------------------
function insertShip(currentShip, endPointAlpha, endPointNum, tempPoint){
	fit = true;
	if(currentShip.getNum1() < endPointNum && testDown(currentShip)){
		//if click is below, insert ship on the field
		insertShipDown(currentShip);
	}else if(currentShip.getNum1() > endPointNum && testUp(currentShip)){
		//if click is above, insert ship onto field
		insertShipUp(currentShip);
	}else if($('#' + currentShip.getAlpha1() + currentShip.getNum1()).index() < $("#" + tempPoint).index() && testRight(currentShip)){
		//if click is to the right
		insertShipRight(currentShip);
	}
	else if($('#' + currentShip.getAlpha1() + currentShip.getNum1()).index() > $("#" + tempPoint).index() && testLeft(currentShip)){
		//if click is to the left
		insertShipLeft(currentShip);
	}
	else{
		//else fails
		alert("Ships need to float on all blue tiles, (aka: water). Places they cannot float: 1. outside the game board 2. on other ships. Choose another location. (TIP: Stop trying to cheat!)");
		fit = false;
	}

	return fit;
}

function testDown(currentShip){
	fits = true;

	for(i = currentShip.getNum1(); i < (currentShip.length + currentShip.getNum1()); i++){
		block = ".mine #" + currentShip.getAlpha1() + i;
		if(i > 12 || $(block).hasClass('ship')){ fits = false; }
	}
	
	return fits;
}

function insertShipDown(currentShip){
	var block = "";
	for(i = 0; i < currentShip.length; i++){
		block = currentShip.getAlpha1() + (currentShip.getNum1() + parseInt(i, 10));
		$(".mine #" + block).addClass('ship');
		currentShip.addBlock(block);
	}

	currentShip.endPoint = block;
}

function testUp(currentShip){
	fits = true;

	for(i = currentShip.getNum1(); i > currentShip.getNum1()-currentShip.length; i--){
		block = ".mine #" + currentShip.getAlpha1() + i;
		if(i === 0 || $(block).hasClass('ship')){ fits = false; }
	}

	return fits;
}

function insertShipUp(currentShip){
	for(i = currentShip.getNum1(); i > currentShip.getNum1()-currentShip.length; i--){
		block = currentShip.getAlpha1() + i;
		$(".mine #" + block).addClass('ship');
		currentShip.addBlock(block);
	}

	currentShip.endPoint = block;
}

function insertShipRight(currentShip){
	index = $('#' + currentShip.getAlpha1() + currentShip.getNum1()).index();
	for(i = index; i < (index + currentShip.length); i++){
		block = colAlpha[i] + currentShip.getNum1();
		$(".mine #" + block).addClass("ship");
		currentShip.addBlock(block);
	}

	currentShip.endPoint = block;
}

function testRight(currentShip){
	fits = true;

	index = $('#' + currentShip.getAlpha1() + currentShip.getNum1()).index();
	for(i = index; i < (index + currentShip.length); i++){
		block = ".mine #" + colAlpha[i] + currentShip.getNum1();
		if(i > 12 || $(block).hasClass('ship')){ fits = false; }
	}
	return fits;
}

function insertShipLeft(currentShip){
	index = $('.mine #' + currentShip.getAlpha1() + currentShip.getNum1()).index();
	for(i = index; i > (index - currentShip.length); i--){
		block = colAlpha[i] + currentShip.getNum1();
		$(".mine #" + block).addClass("ship");
		currentShip.addBlock(block);
	}

	currentShip.endPoint = block;
}

function testLeft(currentShip){
	fits = true;
	index = $('#' + currentShip.getAlpha1() + currentShip.getNum1()).index();
	for(i = index; i > (index - currentShip.length); i--){
		block = ".mine #" + colAlpha[i] + currentShip.getNum1();
		if(i === 0 || $(block).hasClass('ship')){ fits = false; }
	}

	return fits;
}