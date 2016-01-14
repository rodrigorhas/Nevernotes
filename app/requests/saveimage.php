<?php

    $url = "http://localhost/nevernotes";

    $allowed = array('png', 'jpg', 'jpeg');

    if(isset($_FILES['file']) && $_FILES['file']['error'] == 0){
        $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        if(!in_array(strtolower($extension), $allowed)){
            echo '{"status":"error"}';
            exit;
        }
        if(move_uploaded_file($_FILES['file']['tmp_name'], '../../assets/images/uploads/'.$_FILES['file']['name'])){
            $tmp= '../../assets/images/uploads/'.$_FILES['file']['name'];
            echo 'assets/images/uploads/'.$_FILES['file']['name'];
            
        }
    }