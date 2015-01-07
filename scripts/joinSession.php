<?php
	//joinSession.php
	//check to see if sessionExists
	// if exists (WITHOUT an already existing 2nd player): insert into database, assign playerId, sessionCode and player number
	// else kick back to front page with warning.

	require("db-connect.php");
	$sessionCode = $_POST['sessionCode'];
	//$sessionCode = 10172;
	$joinSession = false;

	$query = "SELECT * from Sessions WHERE sessionCode = $sessionCode AND player2 = 0";

	if(!$result = $mysqli->query($query)){
    	die('There was an error running the query [' . $mysqli->error . ']');
	}

	while($row = $result->fetch_assoc()){
		$joinSession = true;
	}

	if($joinSession){
		joinSession($sessionCode);
	}else{
		sendToHomePage($sessionCode);
	}

	function joinSession( $sc ){
		GLOBAL $mysqli;
		$playerNumber = "2";
		$playerId = trim($sc) . $playerNumber;
		$opponentId = $sc . '1';

		session_start();
		
		$_SESSION['playerId'] = $playerId;
		$_SESSION['sessionCode'] = $sc;
		$_SESSION['playerNumber'] = $playerNumber;
		$_SESSION['opponentId'] = $sc . '1';

		$arr['playerId'] = $playerId;
		$arr['sessionCode'] = $sc;
		$arr['playerNumber'] = $playerNumber;
		$arr['opponentId'] = $opponentId;

		$query = "UPDATE Sessions SET player2 = $playerId WHERE sessionCode = $sc;";
		$query2 = "INSERT INTO players (id, playerId, sessionCode, ready, lastShot, allShots, boatPiecesRemaining, myTurn) VALUES (NULL, $playerId, $sc, '0', '', '', 17, false);";

		$mysqli->query($query);
		$mysqli->query($query2);

		$arr['message'] = "success";
		echo json_encode($arr);
	}

	function sendToHomePage( $sc ){
		$arr['message'] = "error";
		echo json_encode($arr);
	}
?>