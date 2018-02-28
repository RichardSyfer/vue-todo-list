<?php
use \Firebase\JWT\JWT;
require_once __DIR__ . '/jwt/JWT.php';

class Token {
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

  public static function get($payload = []){
    return JWT::encode($payload, self::KEY);
  }

  public static function check($jwt){
    try{
      $decoded = (array) JWT::decode($jwt, self::KEY, array('HS256'));
      return $decoded['id'];
    } catch (Exception $e ) { 
      return false;
    }
  }

}