document.addEventListener('DOMContentLoaded', () => {
    // Configurações e rotas
    const API_TAREFAS = 'backend/api_tarefas.php';
    const API_USUARIOS = 'backend/api_usuarios.php';

    const formUsuario = document.getElementById('formUsuario');
    const formTarefa = document.getElementById('formTarefa');
    const kanbanBoard = document.querySelector('.kanban-board');

    // Cadastro de Usuários
    if (formUsuario) {
        formUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formUsuario);
            
            try {
                console.log("Enviando dados:", Object.fromEntries(formData));
                const response = await fetch(API_USUARIOS, {
                    method: 'POST',
                    body: formData
                });
                console.log("Resposta bruta:", response);
                const result = await response.json();
                console.log("Resultado JSON:", result);
                
                const alertDiv = document.getElementById('alertMsg');
                alertDiv.textContent = result.message;
                alertDiv.className = `alert ${result.status}`;
                
                if (result.status === 'success') {
                    formUsuario.reset();
                }
            } catch (error) {
                console.error("Erro detalhado no Fetch:", error);
            }
        });
    }

    // Carregar usuários no select do formulário de tarefas
    if (document.getElementById('usuario_id')) {
        carregarUsuarios();
    }

    async function carregarUsuarios() {
        try {
            const response = await fetch(API_USUARIOS);
            const usuarios = await response.json();
            const select = document.getElementById('usuario_id');
            
            usuarios.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.nome;
                select.appendChild(option);
            });
            
            // Se for edição, selecionar o usuário correto
            const urlParams = new URLSearchParams(window.location.search);
            const idEditar = urlParams.get('id');
            if (idEditar) {
                carregarTarefaParaEdicao(idEditar);
            }
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    }

    async function carregarTarefaParaEdicao(id) {
        try {
            const response = await fetch(`${API_TAREFAS}?id=${id}`);
            const tarefa = await response.json();
            
            if (tarefa) {
                document.getElementById('tarefa_id').value = tarefa.id;
                document.getElementById('acao').value = 'editar';
                document.getElementById('usuario_id').value = tarefa.usuario_id;
                document.getElementById('descricao').value = tarefa.descricao;
                document.getElementById('setor').value = tarefa.setor;
                document.getElementById('prioridade').value = tarefa.prioridade;
                
                document.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
            }
        } catch (error) {
            console.error("Erro ao carregar tarefa para edição:", error);
        }
    }

    // Cadastro e Edição de Tarefas
    if (formTarefa) {
        formTarefa.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formTarefa);
            
            try {
                const response = await fetch(API_TAREFAS, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                const alertDiv = document.getElementById('alertMsg');
                alertDiv.textContent = result.message;
                alertDiv.className = `alert ${result.status}`;
                
                if (result.status === 'success') {
                    if (formData.get('acao') === 'cadastrar') {
                        formTarefa.reset();
                    } else {
                        setTimeout(() => window.location.href = 'index.html', 1500);
                    }
                }
            } catch (error) {
                console.error("Erro:", error);
            }
        });
    }

    // Kanban - Gerenciamento de Tarefas
    if (kanbanBoard) {
        carregarTarefas();
    }

    async function carregarTarefas() {
        try {
            const response = await fetch(API_TAREFAS);
            const tarefas = await response.json();
            
            const colAFAZER = document.getElementById('col-afazer');
            const colFAZENDO = document.getElementById('col-fazendo');
            const colCONCLUIDO = document.getElementById('col-concluido');
            
            colAFAZER.innerHTML = '';
            colFAZENDO.innerHTML = '';
            colCONCLUIDO.innerHTML = '';
            
            let countAFAZER = 0, countFAZENDO = 0, countCONCLUIDO = 0;

            tarefas.forEach(tarefa => {
                const card = criarCardTarefa(tarefa);
                if (tarefa.status === 'a fazer') {
                    colAFAZER.appendChild(card);
                    countAFAZER++;
                } else if (tarefa.status === 'fazendo') {
                    colFAZENDO.appendChild(card);
                    countFAZENDO++;
                } else if (tarefa.status === 'concluido') {
                    colCONCLUIDO.appendChild(card);
                    countCONCLUIDO++;
                }
            });
            
            document.getElementById('badge-afazer').textContent = countAFAZER;
            document.getElementById('badge-fazendo').textContent = countFAZENDO;
            document.getElementById('badge-concluido').textContent = countCONCLUIDO;
            
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
        }
    }

    function criarCardTarefa(tarefa) {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-header">
                <span class="priority priority-${tarefa.prioridade}">${tarefa.prioridade}</span>
                <span style="font-size: 0.75rem; color: #6b7280;">${tarefa.data_cadastro}</span>
            </div>
            <div class="card-title">${tarefa.descricao}</div>
            <div class="card-details">
                <strong>Responsável:</strong> ${tarefa.usuario_nome}<br>
                <strong>Setor:</strong> ${tarefa.setor}
            </div>
            <div class="card-actions">
                ${gerarBotoesStatus(tarefa.id, tarefa.status)}
                <a href="cadastro_tarefa.html?id=${tarefa.id}" class="btn btn-sm btn-outline">✏️ Editar</a>
                <button onclick="excluirTarefa(${tarefa.id})" class="btn btn-sm btn-danger">🗑️ Excluir</button>
            </div>
        `;
        return div;
    }

    function gerarBotoesStatus(id, status) {
        let botoes = '';
        if (status === 'a fazer') {
            botoes += `<button onclick="alterarStatus(${id}, 'fazendo')" class="btn btn-sm btn-primary">Iniciar</button>`;
        } else if (status === 'fazendo') {
            botoes += `<button onclick="alterarStatus(${id}, 'a fazer')" class="btn btn-sm btn-outline">Voltar</button>`;
            botoes += `<button onclick="alterarStatus(${id}, 'concluido')" class="btn btn-sm btn-success" style="background-color: var(--success); color: white;">Concluir</button>`;
        } else if (status === 'concluido') {
            botoes += `<button onclick="alterarStatus(${id}, 'fazendo')" class="btn btn-sm btn-outline">Reabrir</button>`;
        }
        return botoes;
    }

    window.alterarStatus = async function(id, novoStatus) {
        const formData = new FormData();
        formData.append('acao', 'alterar_status');
        formData.append('id', id);
        formData.append('status', novoStatus);
        
        try {
            await fetch(API_TAREFAS, { method: 'POST', body: formData });
            carregarTarefas();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
        }
    }

    window.excluirTarefa = async function(id) {
        if(confirm("Tem certeza que deseja excluir esta tarefa?")) {
            const formData = new FormData();
            formData.append('acao', 'excluir');
            formData.append('id', id);
            
            try {
                await fetch(API_TAREFAS, { method: 'POST', body: formData });
                carregarTarefas();
            } catch (error) {
                console.error("Erro ao excluir:", error);
            }
        }
    }
});
