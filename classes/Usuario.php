<?php
class Usuario {
	private $_db,
			$_data;

	public function __construct($usuario = null){
		$this->_db = DB::getInstance();

		if($usuario){
			$this->find($usuario);
		}
	}

	public function update($fields = array(), $id = null){

		if(!$this->_db->update('users', $id, $fields)){
			throw new Exception("There was a problem updating");
			
		}else{
			return $this;
		}
	}

	public function create($fields = array()){
		if(!$this->_db->insert('users', $fields)){
			throw new Exception('There was a problem creating product.');
		}else{
			return true;
		}
		return false;
	}

	public function delete($id){
		if(!$this->_db->delete('users', array("id", '=', $id))){
			throw new Exception('There was a problem deleting product.');
		}else{
			return true;
		}
		return false;
	}

	public function find($usuario = null){
		if($usuario){
			$field = (is_numeric($usuario)) ? 'id' : 'username';
			$data = $this->_db->get('produtos', array($field, '=', $usuario));

			if($data->count()){
				$this->_data = $data->first();
				return true;
			}
		}
		return false;
	}

	public function exists(){
		return (!empty($this->_data)) ? true : false;
	}

	public function data(){
		return $this->_data;
	}
}