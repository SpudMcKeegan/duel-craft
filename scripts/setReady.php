<?php
	require("db-connect.php");

	$playerId = $_POST['playerId'];

	$query = "UPDATE players SET ready = '1' WHERE playerId = $playerId";

	$mysqli->query($query);
?>