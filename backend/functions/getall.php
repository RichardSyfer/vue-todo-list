<?php
require_once __DIR__ . '/../core/init.php';

if(!empty($_GET["token"])) {
  $user_id = Token::check($_GET["token"]);
  if($user_id) {
    $sql = "SELECT p.id as projId, 
                  p.name as projName, 
                  t.name as taskName, 
                  t.id as taskId, 
                  t.status as taskDone,
                  t.deadline as taskDl,
                  t.priority as taskPriority
            FROM tasks as t RIGHT JOIN projects as p ON t.project_id=p.id
            WHERE p.user_id = $user_id
            ORDER BY p.id, t.priority";
    try{
      $dbh = DB::getInstance();
      $stmt = $dbh->exec($sql);
      $stmt->execute();
      $todoLists = $stmt->fetchAll(PDO::FETCH_OBJ | PDO::FETCH_GROUP);
      
      $reply = $todoLists;

    } catch (PDOException $e) {
      $reply = '{"error" : "'. (string)$e->getMessage() .'"}';
    }
    echo json_encode($reply);
  }
  
}
die;