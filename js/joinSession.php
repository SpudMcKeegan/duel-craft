<?php
	//joinSession.php
	//check to see if sessionExists
	// if exists (WITHOUT an already existing 2nd player): insert into database, assign playerId, sessionCode and player number
	// else kick back to front page with warning.

	require("db-connect.php");
	//$sessionCode = $_POST['sessionCode'];
	$sessionCode = 26314;

	$query = "SELECT * from Sessions WHERE sessionCode = $sessionCode";

	if(!$result = $mysqli->query($query)){
    	die('There was an error running the query [' . $mysqli->error . ']');
	}

	while($row = $result->fetch_assoc()){
		var_dump($row);
	}
?>