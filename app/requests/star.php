<?php

	require_once('../../core/init.php');

	$noteId = $_POST['nid'];
	$starred = $_POST['starred'];

	if(strlen($noteId)){
		$data = [
            "starred" => $starred,
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