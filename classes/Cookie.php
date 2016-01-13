<?php
class Cookie {
	public static function exists($name){
		return(isset($_COOKIE[$name])) ? true : false;
	}

	public static function get($name){
		if(isset($_COOKIE[$name]))
			return $_COOKIE[$name];
		else
			return false;
	}

	public static function put($name, $value, $expiry){
		if(setcookie($name, $value, time() + $expiry, '/', null, false, true)){
			return true;
		}
		return false;
	}

	public static function delete($name){
		self::put($name, '', time() - 1);
	}

}