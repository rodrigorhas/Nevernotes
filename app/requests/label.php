<?php

	require_once('../../core/init.php');

	$noteId = $_POST['nid'];
	$tags = $_POST['tags'];

	if(strlen($noteId)){
		$data = [
            "tags" => $tags,
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