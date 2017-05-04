<?php
namespace Crtl;

use Model\Draw;

class Poll{
    private $db;
    function __construct(){
        $db1 = new  Draw();
        // $db1->ins(['desc'=>'dsadsad', 'revoke_time'=>microtime(true), 'draw_width'=>'1232032','draw_time'=>microtime(true)]);
        $res = $db1->qy();
    }

    function index(){
        echo 'index';
    }
}