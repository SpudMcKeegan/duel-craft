 <?php
 	session_start();
 	unset($_SESSION);
 	session_destroy();

 	require("db-connect.php");

 	$query1 = "TRUNCATE TABLE `Sessions`";
 	$query2 = "TRUNCATE TABLE `players`";
 	$query3 = "TRUNCATE TABLE `ships`";

 	$mysqli->query($query1);
 	$mysqli->query($query2);
 	$mysqli->query($query3); 	
 ?>