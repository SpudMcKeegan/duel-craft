<?php
	//db-connect.php
	//Created by Kyle Keegan for use with Duel Craft on fauxgeek.com. All right reserved and junk like that.
	$dbhost = "localhost";
	$dbuser = "fauxgeek_test";
	$dbpass = "test2";
	$dbname = "fauxgeek_duelCraft";
	
	//Connection to DB
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	
	if($mysqli->connect_errno){
		echo "<script>alert('Connection to DB failed, please try again shortly');</script>";
		echo "it broke";
	}
?>