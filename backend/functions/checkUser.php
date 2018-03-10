<?php
  function checkUser($dbh = null, $user_id = '', $list_id = '', $task_id = ''){
    if($task_id){
      $sql = "SELECT p.user_id 
        FROM projects AS p 
        JOIN tasks AS t 
        ON p.id = t.project_id 
        WHERE p.user_id = $user_id
        AND p.id = $list_id 
        AND  t.id = $task_id";
      $sth = $dbh->exec($sql);
      $sth->execute();
      $checkUser = $sth->fetch(PDO::FETCH_ASSOC);
    } else {
      $sql = "SELECT user_id FROM projects WHERE user_id = $user_id AND id = $list_id";
      $sth = $dbh->exec($sql);
      $sth->execute();
      $checkUser = $sth->fetch(PDO::FETCH_ASSOC);
    }
    return $checkUser;
  }