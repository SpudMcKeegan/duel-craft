<?php
	//createSession.php
	//Created by Kyle Keegan for use with Duel Craft on fauxgeek.com. All right reserved and junk like that.
	require("db-connect.php");

	//get all current SessionIDs from db
	$sessionCode = createsessionCode();
	$sessionCode = checksessionCode($sessionCode);
	startSession($sessionCode);
	InsertsessionCode($sessionCode,$_SESSION['playerId']);
	InsertPlayer($sessionCode,$_SESSION['playerId']);
	$json = buildJson( $_SESSION['sessionCode'], $_SESSION['playerNumber'], $_SESSION['playerId'], $_SESSION['opponentId'] );
	echo $json;


	//------------------
	//  functionality
	//------------------
	function InsertsessionCode( $sc, $pid ){
		global $mysqli;

		$query = "INSERT INTO Sessions (id, sessionCode, player1, player2, createdDate) VALUES (null, $sc, $pid, 0, null)";

		$mysqli->query($query);
	}

	function InsertPlayer( $sc, $pid ){
		global $mysqli;		

		$query = "INSERT INTO `fauxgeek_duelCraft`.`players` (id, playerId, sessionCode, ready, lastShot, allShots, boatPiecesRemaining, myTurn) VALUES (NULL, $pid, '$sc', '0', '', '', 17, true)";

		$mysqli->query($query);
	}

	function checksessionCode( $sessionCode ){
		$query = "SELECT sessionCode FROM `Sessions`";
		$UsedsessionCodes = array();
		global $mysqli;
		
		if(!$result = $mysqli->query($query)){
	    	die('There was an error running the query [' . $mysqli->error . ']');
		}

		while($row = $result->fetch_assoc()){
		    array_push($UsedsessionCodes, $row['sessionCode']);
		}

		while(in_array($sessionCode, $UsedsessionCodes)){
			$sessionCode = createsessionCode();
		}

		return $sessionCode;
	}

	function createsessionCode(){
		return str_pad(rand(0, 99999), 5, "0", STR_PAD_LEFT);
	}

	function startSession( $sessionCode ){
		session_start();
		$_SESSION['sessionCode'] = $sessionCode;
		$_SESSION['playerNumber'] = 1;
		$_SESSION['opponentId'] = $sessionCode . '2';
		$_SESSION['playerId'] = $sessionCode . $_SESSION['playerNumber'];
	}

	function buildJson( $sc, $spn, $spi, $oid ){
		$json = array('sessionCode' => $sc, 
					  'playerId' => $spi,
					  'playerNumber' => $spn,
					  'opponentId' => $oid
				);

		return json_encode($json);
	}
?>