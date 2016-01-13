<?php

	require_once('core/init.php');

	$noteId = $_POST['id'];

	if(strlen($noteId)){
		
        if($result = DB::getInstance()->get("notes", array("id", "=", $noteId))){
        	if($result->count())
				echo json_encode(
					array(
						"success" => true,
						"text" => $result->first()->text,
						"title" => $result->first()->title,
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
		
	}