<?php
namespace Model;

use Lib\Model;

class Draw extends Model{
	protected $tableName = 'draw';
	function qy(){
		var_dump($this->pdo);die;
		$sql = 'select * from '.$this->tableName;
		return $this->query($sql);
	}

	function ins($args){
		$this->col_values = $args;
		$this->query('insert into '.$this->tableName);
	}
}