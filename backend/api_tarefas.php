<?php // Caio Figueira Machado
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $acao = $_POST['acao'] ?? 'cadastrar';

    if ($acao === 'cadastrar') {
        $usuario_id = $_POST['usuario_id'] ?? '';
        $descricao = $_POST['descricao'] ?? '';
        $setor = $_POST['setor'] ?? '';
        $prioridade = $_POST['prioridade'] ?? '';
        $data_cadastro = date('Y-m-d');
        $status = 'a fazer';

        if ($usuario_id && $descricao && $setor && $prioridade) {
            $stmt = $pdo->prepare("INSERT INTO tarefas (usuario_id, descricao, setor, prioridade, data_cadastro, status) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$usuario_id, $descricao, $setor, $prioridade, $data_cadastro, $status]);
            echo json_encode(["status" => "success", "message" => "Tarefa cadastrada com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Preencha todos os campos obrigatórios."]);
        }
    } else if ($acao === 'editar') {
        $id = $_POST['id'] ?? '';
        $usuario_id = $_POST['usuario_id'] ?? '';
        $descricao = $_POST['descricao'] ?? '';
        $setor = $_POST['setor'] ?? '';
        $prioridade = $_POST['prioridade'] ?? '';

        if ($id && $usuario_id && $descricao && $setor && $prioridade) {
            $stmt = $pdo->prepare("UPDATE tarefas SET usuario_id=?, descricao=?, setor=?, prioridade=? WHERE id=?");
            $stmt->execute([$usuario_id, $descricao, $setor, $prioridade, $id]);
            echo json_encode(["status" => "success", "message" => "Tarefa editada com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Preencha todos os campos."]);
        }
    } else if ($acao === 'alterar_status') {
        $id = $_POST['id'] ?? '';
        $novo_status = $_POST['status'] ?? '';
        
        if ($id && $novo_status) {
            $stmt = $pdo->prepare("UPDATE tarefas SET status=? WHERE id=?");
            $stmt->execute([$novo_status, $id]);
            echo json_encode(["status" => "success", "message" => "Status alterado."]);
        }
    } else if ($acao === 'excluir') {
        $id = $_POST['id'] ?? '';
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM tarefas WHERE id=?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Tarefa excluída."]);
        }
    }

} else if ($method == 'GET') {
    // Busca a tarefa específica para edição se o id for passado
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM tarefas WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $tarefa = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($tarefa);
    } else {
        $stmt = $pdo->query("SELECT t.*, u.nome as usuario_nome FROM tarefas t JOIN usuarios u ON t.usuario_id = u.id ORDER BY t.id DESC");
        $tarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($tarefas);
    }
}
