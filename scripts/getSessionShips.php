<?php
	//insertSessionShip.php
	require("db-connect.php");
	$ships = array();
	//$ships = array();
	$playerId = $_POST['playerId'];
	//$playerId = 793271;
	$query = "SELECT name, startPos, endPos FROM ships WHERE playerId = '$playerId' ORDER BY shipId";

	if(!$result = $mysqli->query($query)){
    	die('There was an error running the query [' . $mysqli->error . ']');
	}

	while($row = $result->fetch_assoc()){
	    array_push($ships, $row);
	}

	//foreach($shipsTemp as $ship){
	//	$ships[$ship['name']]['startPos'] = $ship['startPos'];
	//	$ships[$ship['name']]['endPos'] = $ship['endPos'];
	//}

	$ships = json_encode($ships);

	echo $ships;
?>