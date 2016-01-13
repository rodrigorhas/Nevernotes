<?php
class Produto {
	private $_db,
			$_data;

	public function __construct($produto = null){
		$this->_db = DB::getInstance();

		if(!$produto){
			$this->find($produto);
		}else{
			$this->find($produto);
		}
	}

	public function update($fields = array(), $id = null){

		if(!$id && $this->isLoggedIn()){
			$id = $this->data()->id;
		}

		if(!$this->_db->update('produtos', $id, $fields)){
			throw new Exception("There was a problem updating");
			
		}else{
			return $this;
		}
	}

	public function create($fields = array()){
		if(!$this->_db->insert('produtos', $fields)){
			throw new Exception('There was a problem creating product.');
		}else{
			return true;
		}
		return false;
	}

	public function delete($id){
		if(!$this->_db->delete('produtos', array("id", '=', $id))){
			throw new Exception('There was a problem deleting product.');
		}else{
			return true;
		}
		return false;
	}

	public function find($produto = null){
		if($produto){
			$field = (is_numeric($produto)) ? 'id' : 'nome';
			$data = $this->_db->get('produtos', array($field, '=', $produto));

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