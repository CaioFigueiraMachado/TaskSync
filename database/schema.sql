CREATE DATABASE IF NOT EXISTS tasksync;
USE tasksync;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    descricao TEXT NOT NULL,
    setor VARCHAR(100) NOT NULL,
    prioridade ENUM('baixa', 'media', 'alta') NOT NULL,
    data_cadastro DATE NOT NULL,
    status ENUM('a fazer', 'fazendo', 'concluido') DEFAULT 'a fazer',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
