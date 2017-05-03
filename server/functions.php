<?php
function load_config($file)
{
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    switch ($ext) {
        case 'php':
            return include $file;
        case 'ini':
            return parse_ini_file($file);
        case 'yaml':
            return yaml_parse_file($file);
        case 'xml':
            return (array) simplexml_load_file($file);
        case 'json':
            return json_decode(file_get_contents($file), true);
        default:
        	return [];
    }
}
function parseUrl(){
    $url = explode('?', $_SERVER['REQUEST_URI']);
    if(isset($url[0])){
        $resource = array_filter(explode('/', $url[0]));
        if(count($resource)>=3){
            //参数解析
            $param = [];
            if(isset($url[1])){
                $args = array_filter(explode('&', $url[1]));
                foreach ($args as $v) {
                    $kv = explode('=', $v);
                    if(count($kv) == 2){
                        $param[$kv[0]] = $kv[1];
                    }
                }
            }
            return ['resource'=>$resource, 'args'=>$param];
        }else{
            return -1;
        }
    }else{

    }
}