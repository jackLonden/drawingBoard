<?php
namespace Lib;
use PDO;
use PDOException;
class Db{
    protected $settings;
    protected $pdo;
    protected $tableName;
    protected $where;
    protected $param;
    /**
     * 构造函数
     *
     * @param string $host
     * @param int    $port
     * @param string $user
     * @param string $password
     * @param string $db_name
     * @param string $charset
     */
    public function __construct($host, $port, $user, $password, $db_name, $charset = 'utf8')
    {
        $this->settings = array(
            'host'     => $host,
            'port'     => $port,
            'user'     => $user,
            'password' => $password,
            'dbname'   => $db_name,
            'charset'  => $charset,
        );
        $this->connect();
    }
    
    function connect(){
        try{
            $host = $this->settings['host'].':'.$this->settings['port'];
            $dsn = 'mysql:dbname='.$this->settings['dbname'].';host='.$host;
            $this->pdo = new PDO($dsn, $this->settings['user'], $this->settings['password']);
        }catch(PDOException $e){
            echo $e->getMessage();
        }
    }
    
    function bindWhere(){
        
    }

    function qy($field='*'){
        $sql = 'select '.$field. ' from '.$this->tableName. '';
    }
}