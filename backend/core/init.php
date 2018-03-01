<?php 

//for localhost
$GLOBALS['config'] = array(
  'mysql' => array(
    'db_host' => 'localhost',
    'db_username' => 'root',
    'db_password' => '',
    'db_name' => 'todo_net'
    )
);


$patternList = '/^[\p{L}\p{N}\p{P}\p{Z}]{3,250}$/u';
$patternTask = '/^[\p{L}\p{N}\p{P}\p{Z}]{3,1000}$/u';

spl_autoload_register(function($class) {
    require_once __DIR__ . '/../classes/' . $class . '.php';
});
