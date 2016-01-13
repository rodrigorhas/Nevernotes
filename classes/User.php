<?php
class User {
	private $_db,
			$_data,
			$_sessionName,
			$_cookieName,
			$_isLoggedIn = false;

	public function __construct($user = null){
		$this->_db = DB::getInstance();

		$this->_sessionName = Config::get('session/session_name');
		$this->_cookieName = Config::get('remember/cookie_name');

		if(!$user){
			if(Session::exists($this->_sessionName)){
				$user = Session::get($this->_sessionName);

				if($this->find($user)){
					$this->_isLoggedIn = true;
					if(Cookie::get($this->_cookieName))
						$this->_db->update( "user_sessions", Cookie::get($this->_cookieName), ["last_access" => date('Y-m-d h:i:s', time())], "hash");
				}else{
					//process logout
				}
			}
		}else{
			$this->find($user);
		}
	}

	public function update($fields = array(), $id = null){

		if(!$id && $this->isLoggedIn()){
			$id = $this->data()->id;
		}

		if(!$this->_db->update('users', $id, $fields)){
			throw new Exception("There was a problem updating");
			
		}
	}

	public function create($fields = array()){
		if(!$this->_db->insert('users', $fields)){
			throw new Exception('There was a problem creating an account.');
		}
	}

	public function find($user = null){
		if($user){
			$field = (is_numeric($user)) ? 'id' : 'username';
			$data = $this->_db->get('users', array($field, '=', $user));

			if($data->count()){
				$this->_data = $data->first();
				return true;
			}
		}
		return false;
	}

	public function login($username = null, $password = null, $remember = false, $geo = null){
		
		if(!$username && !$password && $this->exists()){
			Session::put($this->_sessionName, $this->data()->id);
		}else{
			$user = $this->find($username);
			if($user){
				if($this->data()->password === Hash::make($password, $this->data()->salt)){
					Session::put($this->_sessionName, $this->data()->id);

					if($remember){
						$hash = Hash::unique();
						$hashCheck = $this->_db->get('user_sessions', array('hash', '=', Cookie::get($this->_cookieName) ));

						$data = [
								'user_id' => $this->data()->id,
								'hash' => $hash
						];


						if($geo){
                			$geoJson = json_decode($geo);
                			//echo $geoJson->city;
                			$location = $geoJson->city . ", " . $geoJson->region . ", " . $geoJson->country;
							if($location)	$data["location"] = $location;
							if($geoJson->city)	$data["city"] = $geoJson->city;
						}

						$browser = getBrowser();

						//if($browser['name']) $data["browser"] = $browser['name'] . " " . $browser['version'];
						if($browser['name']) $data["browser"] = $browser['name'];
						if($browser['platform']) $data["os"] = $browser['platform'];
						$data["device"] = ($browser['mobile']) ? "smartphone-android" : "desktop-windows";
						
						$data["first_access"] = date('Y-m-d h:i:s', time());

						if(!$hashCheck->count()){
							$this->_db->insert('user_sessions', $data);
						}else{
							$hash = $hashCheck->first()->hash;
						}

						Cookie::put($this->_cookieName, $hash, Config::get('remember/cookie_expiry'));
					}

					return true;
				}
			}

		}
		return false;
	}

	public function hasPermission($key){
		$group = $this->_db->get('groups', array('id', '=', $this->data()->group));

		if($group->count()){
			$permissions = json_decode($group->first()->permissions, true);
			if($permissions[$key] == true){
				return true;
			}
		}
		return false;
	}

	public function getPermissions(){
		$group = $this->_db->get('groups', array('id', '=', $this->data()->group));

		return $group->first()->permissions;
	}

	public function getSessions(){
		$userId = $this->data()->id;
		

		$sessions = $this->_db->query('SELECT *, unix_timestamp(last_access) as last_access_unix FROM user_sessions WHERE user_id = ?', array($userId));

		foreach ($sessions->results() as $key) {
			if($key->hash == Cookie::get($this->_cookieName)) $key->active = 1; else  $key->active = 0 ;
			if($key->first_access) $key->first_access = date('d/m/Y h:i:s', strtotime($key->first_access));
		}
		
		echo json_encode($sessions->results());

		return false;
	}

	public function updateSession($fields = array(), $id = null){

		if(!$id && $this->isLoggedIn()){
			$id = $this->data()->id;
		}

		if(!$this->_db->update('user_sessions', $id, $fields)){
			throw new Exception("There was a problem updating");
			
		}
	}

	public function exists(){
		return (!empty($this->_data)) ? true : false;
	}

	public function logout(){
		

		//Session::flash('home', Cookie::get($this->_cookieName));

		$this->_db->delete('user_sessions', array('hash', '=', Cookie::get($this->_cookieName)));


		Session::delete($this->_sessionName);
		Cookie::delete($this->_cookieName);
	}

	public function data(){
		return $this->_data;
	}

	public function isLoggedIn(){
		return $this->_isLoggedIn;
	}
}