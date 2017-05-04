<?php
namespace Lib;

use Lib\Db;

class Model extends Db{
	function __construct(){
        $configs = load_config('config.php');
		parent::__construct($configs['DB_HOST'], $configs['DB_PORT'], $configs['DB_USER'], $configs['DB_PASS'], $configs['DB_NAME']);
	}
}