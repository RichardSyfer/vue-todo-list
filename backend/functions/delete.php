<?php
require_once __DIR__ . '/../core/init.php';
require_once __DIR__ . '/checkUser.php';

$dbh = DB::getInstance();

if(!empty($_POST["token"])) {
  $user_id = Token::check($_POST["token"]);
  if($user_id) {
    // delete todoList 
    if (!empty($_POST["listId"]) && empty($_POST["taskId"])) {
      $list_id = $_POST["listId"];

      $sql_del_project = "DELETE FROM projects WHERE id = :pid AND user_id = :uid";
      $sql_del_task = "DELETE FROM tasks WHERE project_id = :pid";

      $sth = $dbh->exec($sql_del_task);
      $sth->execute([':pid' => $list_id]); // delete all tasks with deleted project_id
      $sth = $dbh->exec($sql_del_project);
      $sth->execute([':pid' => $list_id, ':uid' => $user_id]);
      $reply = '{"reply" : "TODO List Successfuly DELETED from DB"}';
    }
    // delete TASK
    elseif (!empty($_POST["taskId"]) && !empty($_POST["listId"])) {
      $taskId = $_POST["taskId"];
      $list_id = $_POST["listId"];
      if(checkUser($dbh, $user_id, $list_id, $taskId)){
      $sql = "DELETE FROM tasks WHERE id = :task_id";
      $sth = $dbh->exec($sql);
      $sth->execute([':task_id' => $taskId]);
      $reply = '{"reply" : "Task Successfuly DELETED from DB"}';
      } else {
        $reply = '{ "error" : "Operation not executed. Incoming data not correct" }';
      }
    }
    else {
      $reply = '{ "error" : "Operation not executed. Incoming data not correct" }';
    }

    echo json_encode($reply);
  }
}
die;