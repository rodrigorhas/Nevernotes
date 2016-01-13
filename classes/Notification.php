<?php
	class Notification {

		public static function add($title, $content, $target, $usersIds = array()) {
			if(!sizeof($usersIds)){
				$user = new User();
				if(!DB::getInstance()->insert('notifications', array(
					"title" => $title,
					"content" => $content,
					"target" => $target,
					"user" => $user->data()->id,
					"read" => 0

				))){
					throw new Exception('There was a problem creating an account.');
				}
			}else{
				for ($i=0; $i < sizeof($usersIds); $i++) { 
					if(!DB::getInstance()->insert('notifications', array(
						"title" => $title,
						"content" => $content,
						"target" => $target,
						"user" => $usersIds[$i],
						"read" => 0

					))){
						throw new Exception('There was a problem creating an account.');
					}	

				}
			}
		}

		public static function markAsRead( $id ) {
			if(!DB::getInstance()->update('notifications', $id, array(
				"title" => "Teste",
				"content" => "Teste",
				"target" => "Teste",
				"user" => 1,
				"read" => 0

			))){
				throw new Exception('There was a problem creating an account.');
			}
		}

		public static function get($limit = null) {
			$user = new User();

			if($user->isLoggedIn()){
				$notifications = DB::getInstance()->query('SELECT * FROM notifications WHERE user = ? ORDER BY id DESC LIMIT ' . (($limit) ? $limit : 5), array(
					$user->data()->id
				));
				echo json_encode($notifications->results());
			}else{
				echo json_encode();
			}

		}
	}