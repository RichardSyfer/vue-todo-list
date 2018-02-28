<?php
require_once __DIR__ . '/../../core/init.php';

if(Input::exists()) {
  $validate = new Validation();
  $validation = $validate->check($_POST, [
    'username' => ['required' => true, 'min' => 4],
    'password' => ['required' => true]
  ]);
  if($validation->passed()) {
    $user = new User();
    $login = $user->login(Input::get('username'), Input::get('password'));
    if($login) {
      $tkn = Token::get(['id' => $user->data()->id, 'username' => $user->data()->username]);
      // header('token: '. $tkn);
      $reply = '{ "reply" : "TODO List. Hello '.Input::get('username').'", "Token" : "'.$tkn.'"}';
    } else {
      $reply = '{ "error" : "Sorry logging is failed."}';
    }
  } else {
    $reply = '{"error" : '.json_encode($validation->getErrors()).'}';
  }
  echo json_encode($reply);
}
