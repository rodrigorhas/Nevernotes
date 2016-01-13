<?php

	require_once('core/init.php');
		
    if($result = DB::getInstance()->query("SELECT * FROM notes")){
    	if(DB::getInstance()->count())
			echo json_encode($result->results());
		else
			echo "[]";
    }else{
    	echo "[]";
    }