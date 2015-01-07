<?php
	//checkForHit.php
	require('db-connect.php');

	$targetSquare = $_POST['targetSquare'];
	//$targetSquare = 'A2';
	$opponentId = $_POST['opponentId'];
	//$opponentId = 989872;
	$playerId = $_POST['playerId'];
	//$playerId = 989871;

	$boatFound = queryForHit();

	if($boatFound){
		$arr['target'] = 'hit';
		decreaseOpponentsRemainingPieces();
	}else{
		$arr['target'] = 'miss';
	}
	theRestofTheStuff($arr['target']);
	giveUpTurn();
	echo json_encode($arr);

	//--------------------
	//     Functions
	//--------------------
	function queryForHit(){
		GLOBAL $targetSquare, $opponentId, $playerId, $player, $mysqli;
		$boatFound = false;
		$querySelectHit = "SELECT * FROM ships WHERE playerId = '$opponentId' 
													AND block1 = '$targetSquare'
													OR block2 = '$targetSquare' 
													OR block3 = '$targetSquare' 
													OR block4 = '$targetSquare' 
													OR block5 = '$targetSquare'";
		
		if(!$result = $mysqli->query($querySelectHit)){
	    	die('There was an error running the query [' . $mysqli->error . ']');
		}

		while($row = $result->fetch_assoc()){
			$boatFound = true;
		}

		return $boatFound;
	}

	function theRestofTheStuff($arr){
		GLOBAL $targetSquare, $opponentId, $playerId, $player, $mysqli;
		$querySelectSelf = "SELECT * FROM players WHERE playerId = '$playerId'";
		if($arr = 'hit'){
			$type = 'h.';
		}else{
			$type = 'm.';
		}

		if(!$result = $mysqli->query($querySelectSelf)){
	    	die('There was an error running the query [' . $mysqli->error . ']');
		}

		while($row = $result->fetch_assoc()){
			$player = $row;
		}

		$allShots = $player['allShots'] . "," . $type . $targetSquare;

		$queryInsertShots = "UPDATE players 
		 					 SET lastShot = '$targetSquare', allShots = '$allShots' 
		 					 WHERE playerId = '$playerId';";

		$mysqli->query($queryInsertShots);
	}

	function decreaseOpponentsRemainingPieces(){
		GLOBAL $targetSquare, $opponentId, $playerId, $player, $mysqli;			
		$queryPieces = "UPDATE players SET boatPiecesRemaining = (boatPiecesRemaining - 1) WHERE playerId = $opponentId";
		$mysqli->query($queryPieces);
	}

	function giveUpTurn(){
		GLOBAL $targetSquare, $opponentId, $playerId, $player, $mysqli;
		$query1 = "UPDATE players SET myTurn = false WHERE playerId = '$playerId'";
		$query2 = "UPDATE players SET myTurn = true WHERE playerId = '$opponentId'";
		$mysqli->query($query1);
		$mysqli->query($query2);
	}
?>