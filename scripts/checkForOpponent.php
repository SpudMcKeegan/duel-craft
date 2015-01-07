<?php
	//checkForOpponent
	require("db-connect.php");

	$playerId = $_POST['playerId'];
	//$playerId = 263141;
	$sessionCode = $_POST['sessionCode'];
	//$sessionCode = 26314;
	$ready = "";

	$query = "SELECT * FROM players WHERE sessionCode = $sessionCode AND playerId != $playerId";

	if(!$result = $mysqli->query($query)){
    	die('There was an error running the query [' . $mysqli->error . ']');
	}

	while($row = $result->fetch_assoc()){
		$ready = $row;
	}

	if($ready == ""){
		$ready['ready'] = "2";
	}
	
	echo json_encode($ready);
?>