<?php

	require_once('core/init.php');
		
    if($result = DB::getInstance()->query("SELECT * FROM notes")){
    	if(DB::getInstance()->count())
			echo json_encode(
				array(
					"success" => true,
					"notes" => $result->results()
				)
			);
		else
			echo json_encode(
				array(
					"success" => false
				)
			);
    }else{
    	echo json_encode(
			array(
				"success" => false,
				"error" => true
			)
		);
    }