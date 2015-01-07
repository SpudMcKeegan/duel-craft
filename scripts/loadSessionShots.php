<?php
	require("db-connect.php");
	
	$sessionCode = $_POST['sessionCode'];
	$opponentId = $_POST['opponentId'];
	$playerId = $_POST['playerId'];
	//$sessionCode = 74465;	$opponentId = 744651; $playerId = 744652;
	$shotsTaken;
	$myShots;
	$opponentShots;

	$querySelf = "SELECT * from players WHERE playerId = $playerId";
	$queryOpponent = "SELECT * from players WHERE playerId = $opponentId";

	if(!$result = $mysqli->query($querySelf)){
    	die('There was an error running the query [' . $mysqli->error . ']');
	}

	while($row = $result->fetch_assoc()){
		$myShots = $row['allShots'];
	}

	if(!$result = $mysqli->query($queryOpponent)){
    	die('There was an error running the query [' . $mysqli->error . ']');
	}

	while($row = $result->fetch_assoc()){
		$opponentShots = $row['allShots'];
	}

	$shotsTaken['mine'] = explode(",",$myShots);
	$shotsTaken['opponent'] = explode(",",$opponentShots);

	array_shift($shotsTaken['mine']);
	array_shift($shotsTaken['opponent']);
?>
<?php echo json_encode($shotsTaken) ?>