<?php
class Validate {
	private $_passed = false,
			$_errors = array(),
			$_db = null;

	public function __construct(){
		$this->_db = DB::getInstance();
	}
	public function check($source, $items = array()){

		foreach($items as $item => $rules) {
			foreach($rules as $rule => $rule_value){
	
				$value = trim($source[$item]);
				//echo gettype($rules);
				//print_r($rules);
				$alias = (isset($rules['alias'])) ? $rules['alias'] : escape($item);

				
				//$item = (isset($alias)) ? $alias : escape($item);
				//$item = $alias;

				if($rule === 'required' && empty($value)) {
					$this->addError("Campo {$alias} obrigatorio");
				}else if(!empty($value)){
					switch($rule){
						case 'min':
							if(strlen($value) < $rule_value){
								$this->addError("Campo {$alias} deve conter no minimo {$rule_value} caracteres.");
							}
						break;
						case 'max':
							if(strlen($value) > $rule_value){
								$this->addError("Campo {$alias} deve conter no maximo {$rule_value} caracteres.");
							}

						break;
						case 'matches':
							if($value != $source[$rule_value]){
								$this->addError("Campo {$rule_value} deve ser igual {$alias}");
							}
						break;
						case 'unique':
							$check = $this->_db->get($rule_value, array($item, '=', $value));
							if($check->count()){
								$this->addError("{$item} ja existe");
							}
						break;
					}
				}

			}
		}

		if(empty($this->_errors)){
			$this->_passed = true;
		}

		return $this;
	}

	private function addError($error){
		$this->_errors[] = $error;
	}

	public function errors(){
		return $this->_errors;
	}

	public function passed(){
		return $this->_passed;
	}
}