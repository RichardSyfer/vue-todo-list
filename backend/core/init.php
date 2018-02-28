<?php 

//for localhost
// $GLOBALS['config'] = array(
//   'mysql' => array(
//     'db_host' => 'localhost',
//     'db_username' => 'root',
//     'db_password' => '',
//     'db_name' => 'todo_net'
//     )
// );

//for heroku
$GLOBALS['config'] = array(
  'mysql' => array(
    'db_host' => 'eu-cdbr-west-01.cleardb.com',
    'db_username' => 'bc31e41a200339',
    'db_password' => '544e8b40',
    'db_name' => 'heroku_8826824bad525e6' 
    )
  );

$patternList = '/^[\p{L}\p{N}\p{P}\p{Z}]{3,250}$/u';
$patternTask = '/^[\p{L}\p{N}\p{P}\p{Z}]{3,1000}$/u';
// $patternList = '/^[\d\w\sа-яА-ЯЁё!?@#№$%&.,:\'\'\"\"-]{3,250}$/u';
// $patternTask = '/^[\d\w\sа-яА-ЯЁё!?@#№$%&.,:\'\'\"\"-]{3,1000}$/u';

spl_autoload_register(function($class) {
    require_once __DIR__ . '/../classes/' . $class . '.php';
});
 require_once '/../functions/sanitize.php';