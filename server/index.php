<?php
namespace App;
require_once 'Autoloader.php';
require_once 'functions.php';
$request  = parseUrl();
var_dump($_SERVER);die;
$configs = load_config('config.php');
use Lib\Db;
Autoloader::setRootPath(__DIR__);
$db = new Db($configs['DB_HOST'], $configs['DB_PORT'], $configs['DB_USER'], $configs['DB_PASS'], $configs['DB_NAME']);
var_dump($db);