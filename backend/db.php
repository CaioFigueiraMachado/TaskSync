<?php
$host = 'localhost';
$dbname = 'tasksync';
$user = 'root'; // Padrão XAMPP
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Erro na conexão com o banco de dados: " . $e->getMessage()]));
}
