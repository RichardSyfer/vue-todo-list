<?php
require_once __DIR__ . '/../../core/init.php';

if(Input::exists()) {
  $validate = new Validation();
  $validation = $validate->check($_POST, array(
    'username' => [
      'required' => true,
      'min'	=> 4,
      'max' => 50,
      'unique' => 'users'
    ],
    'password' => [
      'required' => true,
      'min'	=> 6
    ],
    'password_again' => [
      'required' => true,
      'matches'	=> 'password'
    ]
  ));

  if($validation->passed()) {
    $user = new User();

    try {
      $user->create([
          'username' => Input::get('username'),
          'password' => password_hash(Input::get('password'), PASSWORD_DEFAULT)
      ]);
      $tkn = Token::get(['id' => $user->data()->id, 'username' => $user->data()->username]);
      // header('token: '. $tkn);
      $reply = '{ "reply" : "You have been registered '.$user->data()->username.'", "Token" : "'.$tkn.'"}';
    } catch(Exception $e) {
      $reply = '{"error" : '.json_encode($e->getMessage()).'}';
    }
  } else {
    $reply = '{"error" : '.json_encode($validation->getErrors()).'}';
  }
    echo json_encode($reply);
}