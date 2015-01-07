//This is the main game logic for the battleship game, if you steal this, I completely understand. Thanks for your time, enjoy trying to debug it. I'm not even sure how it works.
var myTurn = false;
var myLastMove, opponentsLastMove;

function startTheWar(){
	playerNumber = getPlayerNumber(playerId);
	
	console.log("playerNum: " + getPlayerNumber(playerId));
	console.log("playerId: " + playerId);
	console.log("opponentId: " + opponentId);

	myTurn = isItMyTurnYet();

	if(myTurn){
		displayInstruction("Player One, you start, please select a square on your opponents board. Choose wisely my son and/or daughter.");
	}else{
		displayInstruction("Player one is starting, you are not player one. Wait for his/her first shot to miss by a mile");
	}

	//theWar();
}

function theWar(){
	var target = "";
	if(myTurn === true){
		$('table.opponent .water').click(function(){
			target = $(this);
			$('table.opponent .field').off('click');
			$.ajax({
				url: 'scripts/checkForHit.php',
				type: 'POST',
				dataType: 'json',
				data: {
					targetSquare: target.attr('id'),
					opponentId: opponentId,
					playerId: playerId
				},
			})
			.done(function(data) {
				if(data.target === 'hit'){
					target.addClass("hit").removeClass("water");
					displayInstruction("Missles fired at " + target.attr("id") + ". It's a hit! Go you.");
				}else{
					target.removeClass("water").addClass("miss");
					displayInstruction("Missles fired at " + target.attr("id") + ". It's a miss! You suck.");
				}
				myTurn = false;
				theWar();
			}).fail(function (){
				alert("Something went wrong, please try again");
				theWar();
			});
		});
	}else{
		waitTime = setInterval(function(){
			myTurn = isItMyTurnYet();

console.log("myturn: " + myTurn);

			if(myTurn){
				clearTimeout(waitTime);
				theWar();
			}
		},	4000);
	}
}

// When a boat is hit, check to see how many targets are left
//  TO DO: Change to a db call
//    -- Queries database to see how many "parts of each ship is left"
function checkForTargets(){
	if($(".target").length === 0){
		endGame();
	}else{
		console.log("Targets Left: " + $(".target").length);
	}
}

// Alert the game has ended
// TO DO: Change to display winner and ask if a new game is wanted.
function endGame(){
	alert("Things have been completed!");
}

function getPlayerNumber( pid ){
	pid = pid.toString().split("");
	return pid[5];
}

function isItMyTurnYet(){
	$.ajax({
		url: 'scripts/isItMyTurnYet.php',
		type: 'POST',
		dataType: 'json',
		data: {
			playerId: playerId,
			opponentId: opponentId
		},
	})
	.done(function(data) {
		console.log(data);
		console.log(data.myTurn);
		console.log(data.myTurn === "1");
		console.log(typeof data.myTurn);
		if(data.myTurn === "1"){
			$('table.opponent #' + data.lastShot).addClass("hit").removeClass("water ship");
			setNextTurn(playerNumber, "opponent");
			return true;
		}else{
			return false;
		}
	});
}

function setNextTurn( pn, whosTurn ){
	if(pn === '1' && whosTurn === "mine"){
		$("#turn").text("Player Two");
	}else if(pn === '1' && whosTurn === 'opponent'){
		$("#turn").text("Player One");
	}else if(pn === '2' && whosTurn === "mine"){
		$("#turn").text("Player One");
	}else if(pn === '2' && whosTurn === "opponent"){
		$("#turn").text("Player Two");
	}
}