<?php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';

    if ($nome && $email) {
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email) VALUES (?, ?)");
        try {
            $stmt->execute([$nome, $email]);
            echo json_encode(["status" => "success", "message" => "Usuário cadastrado com sucesso!"]);
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Erro ao cadastrar. Talvez e-mail já exista."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Preencha todos os campos."]);
    }
} else if ($method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM usuarios ORDER BY nome ASC");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($usuarios);
}
