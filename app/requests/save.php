<?php

	require_once('../../core/init.php');

	$noteId = $_POST['id'];
	$text = $_POST['text'];
	$title = $_POST['title'];

	if(!strlen($noteId)){
		$id = uniqid("n", true);
		$now = new DateTime();

		 $data = [
            "id" => $id,
            "title" => $title,
            "text" => $text,
            "deleted" => 0,
            "type" => "T",
            "starred" => 0,
            "color" => "white",
            "created_at" => $now->getTimestamp()
        ];
        if(DB::getInstance()->insert("notes", $data)){
			echo json_encode(
				array(
					"success" => true,
					"id" => $id
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
		
		//insert
	}else{
		$now = new DateTime();

		 $data = [
            "title" => $title,
            "text" => $text,
            "color" => "amethyst",
            "updated_at" => $now->getTimestamp()
        ];
        if(DB::getInstance()->update("notes", $noteId, $data)){
        	echo json_encode(
				array(
					"success" => true
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