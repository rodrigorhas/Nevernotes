<?php

	require_once('core/init.php');

	$noteId = $_POST['nid'];
	$color = $_POST['color'];

	if(strlen($noteId)){
		$data = [
            "color" => $color,
        ];
        if(DB::getInstance()->update("notes", $noteId, $data)){
			echo json_encode(
				array(
					"success" => true,
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