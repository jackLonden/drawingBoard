<?php
namespace App;
require_once 'Autoloader.php';
require_once 'functions.php';
Autoloader::setRootPath(__DIR__);
//url解析
$request  = parseUrl();
if(!is_array($request)){
	echo '资源找不到';
}else{
	list($crtl, $action) = $request['resource'];
	$crtl = "Crtl\\".ucfirst($crtl);
	$action = ucwords($action);
	if(method_exists($crtl, $action)){
		(new $crtl)->$action();
	}else{
		echo '操作不存在';
	}
}