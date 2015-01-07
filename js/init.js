var playerId, sessionCode, playerNumber;

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
			joinSession( $("#joinsessionCode").val() );
		});
	});

	$("#emptyEverything").click(function(){	emptyEverything(); });
});

function createSession(){
	$.ajax({
		type: "POST",
		url: "scripts/createSession.php",
		success: function(data){
			playerId = data['playerId'];
			playerNumber = data['playerNumber'];
			sessionCode = data['sessionCode'];
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
			if(data.message === "error"){
				alert('The code you have submitted is either wrong or someone is already in this game. Please check to make sure you didn\'t fuck up or that your friend isn\'t being a dickhead.');
				$("#phase1").fadeIn(200);
			}else{
				$("#phase2").fadeIn(200);
				playerId = data['playerId'];
				playerNumber = data['playerNumber'];
				sessionCode = data['sessionCode'];
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

//------------------
// Helper Functions
//------------------
function displayInstruction(mes){
	$("#instruct").prepend("<p>" + mes + "</p>");
}