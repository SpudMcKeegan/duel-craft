<?php 
	//is it my turn yet?

	require('db-connect.php');
	$opponentId = $_POST['opponentId'];
	//$opponentId = "005881";
	$playerId = $_POST['playerId'];
	//$playerId = "005882";
	$return = array();

	$query = "SELECT myTurn FROM players WHERE playerId = '$playerId'";
	$result = $mysqli->query($query);
	while($row = $result->fetch_assoc()){
		$myTurn = $row;
	}

	$query2 = "SELECT lastShot FROM players WHERE playerId = '$opponentId'";
	$result = $mysqli->query($query2);
	while($row = $result->fetch_assoc()){
		$lastShot = $row;
	}

	$return['myTurn'] = $myTurn['myTurn'];
	$return['lastShot']= $lastShot['lastShot'];

	echo json_encode($return);
?>