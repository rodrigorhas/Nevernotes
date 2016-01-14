<?php

	require_once('../../core/init.php');

	$noteId = $_POST['nid'];
	$trash = $_POST['trash'];

	if(strlen($noteId)){
		$data = [
            "deleted" => $trash,
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