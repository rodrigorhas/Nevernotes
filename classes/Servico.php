<?php
class Servico {
	private $_db,
			$_data;

	public function __construct($servico = null){
		$this->_db = DB::getInstance();

		if(!$servico){
			$this->find($servico);
		}else{
			$this->find($servico);
		}
	}

	public function update($fields = array(), $id = null){

		if(!$id && $this->isLoggedIn()){
			$id = $this->data()->id;
		}

		if(!$this->_db->update('servicos', $id, $fields)){
			throw new Exception("There was a problem updating");
			
		}else{
			return $this;
		}
	}

	public function create($fields = array()){
		if(!$this->_db->insert('servicos', $fields)){
			throw new Exception('There was a problem creating service.');
		}else{
			return true;
		}
		return false;
	}

	public function delete($id){
		if(!$this->_db->delete('servicos', array("id", '=', $id))){
			throw new Exception('There was a problem deleting service.');
		}else{
			return true;
		}
		return false;
	}

	public function find($servico = null){
		if($servico){
			$field = (is_numeric($servico)) ? 'id' : 'nome';
			$data = $this->_db->get('servicos', array($field, '=', $servico));

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