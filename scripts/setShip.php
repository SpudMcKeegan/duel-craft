<?php
	//setShip.php
	//Created by Kyle Keegan for use with Duel Craft on fauxgeek.com. All right reserved and junk like that.
	
	require("db-connect.php");

	$ship = $_POST;
	$count = 0;
	$blocks = "";

	foreach( $ship['blocks'] as $block ){
		$blocks .= ",'" . $block . "'";
		$count++;
	}

	while($count < 5){
		$blocks .= ",''";
		$count++;
	}

	$query = "INSERT INTO fauxgeek_duelCraft.ships" .
			 "(shipId, playerId, name, length, startPos, endPos, block1, block2, block3, block4, block5) VALUES " .
			 "(NULL, '" . $ship['playerId'] . "', '" . $ship['name'] . "', '" . $ship['length'] . "', '" . $ship['startPoint'] . "', '" . $ship['endPoint'] . "'" . $blocks . ");";

	$mysqli->query($query);
?>