<?php
require_once __DIR__ . '/../core/init.php';

$dbh = DB::getInstance();

if(!empty($_POST["token"])) {
  $user_id = Token::check($_POST["token"]);
  if($user_id) {

    // insert new todoList
    if (!empty($_POST["listName"])) {
      $projectName = trim($_POST["listName"]);
      if (preg_match($patternList, $projectName) === 1) {
        $dbh->insert('projects', ['name' => $projectName, 'user_id' => $user_id]);
        $lastInsertId = $dbh->getLastInsertId();
        $reply = '{ "lastInsertId": "' . $lastInsertId . '", "reply" : "New TODO List Successfuly Added to DB"}';
      } else {
        $reply = '{ "error" : "New TODO list NOT Added. Incoming data not correct" }';
      }
    }

    // insert TASK
    elseif (!empty($_POST["listId"]) && !empty($_POST["taskDesc"])) {
      $project_id = $_POST["listId"];
      $taskName = trim($_POST["taskDesc"]);

      if (preg_match($patternTask, $taskName) === 1) {
        $sql_select = "SELECT MAX(priority) as maxPriority FROM tasks WHERE project_id = :project_id";
        $sth = $dbh->exec($sql_select);
        $sth->execute([':project_id' => $project_id]);
        $res = $sth->fetch(PDO::FETCH_ASSOC);
        $priority = $res['maxPriority'] + 1;

        $dbh->insert('tasks', ['name' => $taskName,
          'status' => 0,
          'deadline' => date('Y-m-d H:i:s'),
          'priority' => $priority,
          'project_id' => $project_id]);
        $lastInsertId = $dbh->getLastInsertId();
        $reply = '{ "lastInsertId": "' . $lastInsertId . '", "reply" : "New Task Successfuly Added to DB"}';
      } else {
        $reply = '{ "error" : "New Task NOT Added. Incoming data not correct" }';
      }
    } else {
      $reply = '{ "error" : "New TODO List / Task NOT Added. Incoming data not correct" }';
    }

    echo json_encode($reply);
  }
}
die;