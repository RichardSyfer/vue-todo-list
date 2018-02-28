<?php
class User {
  private $_db,
          $_data,
          $_isLoggedIn;

  public function __construct($user = null) {
    $this->_db = DB::getInstance();
    $this->find($user);
  }

  public function create($fields) {
    if(!$this->_db->insert('users', $fields)) {
      throw new Exception('There was a problem creating an account.');
    } else {
      $this->find($this->_db->getLastInsertId());
      // $this->_data = $this->_db->getLastInsertId();
    }
  }

  public function find($user = null) {
    if($user) {
      $field = (is_numeric($user)) ? 'id' : 'username';
      $data = $this->_db->get('users', [$field, '=', $user]);

      if($data->count()) {
        $this->_data = $data->first();
        return true;
      }
    }
    return false;
  }

  public function login($username = null, $password = null) {
    $user = $this->find($username);
    if($user) {
      if(password_verify($password, $this->data()->password)) {
        return true;
      } 
    }
    return false;
  }

  public function data() { //make it private?
    return $this->_data;
  }
}