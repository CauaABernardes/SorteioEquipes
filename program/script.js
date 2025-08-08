// script.js

// Elementos do DOM
const addNameForm = document.getElementById('add-name-form');
const nameInput = document.getElementById('name-input');
const namesList = document.getElementById('names-list');
const memberCount = document.getElementById('member-count');
const drawButton = document.getElementById('draw-button');
const teamSizeInput = document.getElementById('team-size-input');
const teamsOutput = document.getElementById('teams-output');

// --- Funções do localStorage ---

// Busca os nomes do localStorage. Retorna um array vazio se não houver nada.
const getNamesFromStorage = () => {
    const namesJSON = localStorage.getItem('raffle_names');
    try {
        return namesJSON ? JSON.parse(namesJSON) : [];
    } catch (e) {
        return [];
    }
};

// Salva o array de nomes no localStorage
const saveNamesToStorage = (names) => {
    localStorage.setItem('raffle_names', JSON.stringify(names));
};

// --- Funções Principais ---

let participants = [];

// Função para renderizar os nomes na tela
const renderNames = () => {
    namesList.innerHTML = ''; // Limpa a lista visual
    
    participants.sort((a, b) => a.name.localeCompare(b.name)); // Ordena por nome

    participants.forEach(person => {
        const li = document.createElement('li');
        li.textContent = person.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.className = 'remove-btn';
        // Passa o ID da pessoa para a função de remover
        removeBtn.onclick = () => removeName(person.id);
        
        li.appendChild(removeBtn);
        namesList.appendChild(li);
    });
    
    memberCount.textContent = participants.length;
};

// Função para adicionar um nome
const addName = (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;

    // Verifica se o nome já existe
    if (participants.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert('Este nome já está na lista!');
        return;
    }

    // Adiciona o novo participante ao array
    participants.push({
        id: Date.now(), // Usa o timestamp como um ID único simples
        name: name
    });

    saveNamesToStorage(participants); // Salva a lista atualizada no storage
    renderNames(); // Re-renderiza a lista na tela
    nameInput.value = ''; // Limpa o campo de input
    nameInput.focus();
};

// Função para remover um nome
const removeName = (id) => {
    if (!confirm('Tem certeza que deseja remover este participante?')) {
        return;
    }
    // Filtra o array, mantendo todos exceto o que tem o ID para remover
    participants = participants.filter(person => person.id !== id);
    
    saveNamesToStorage(participants); // Salva a nova lista
    renderNames(); // Re-renderiza na tela
};

// Função para sortear as equipes
const drawTeams = () => {
    const teamSize = parseInt(teamSizeInput.value, 10);
    if (participants.length < 2 || teamSize < 2) {
        alert('É necessário ter pelo menos 2 participantes e o tamanho da equipe deve ser 2 ou mais.');
        return;
    }
    if (participants.length < teamSize) {
        alert('O número de participantes é menor que o tamanho da equipe!');
        return;
    }

    // Embaralha os participantes
    const shuffled = [...participants].sort(() => 0.5 - Math.random());

    const total = shuffled.length;
    const baseTeamCount = Math.floor(total / teamSize);
    let remainder = total % teamSize;

    // Se sobrar menos que o tamanho da equipe, aumentamos algumas equipes em +1
    const teamCount = baseTeamCount;
    const teams = [];
    let index = 0;

    for (let i = 0; i < teamCount; i++) {
        // Se ainda houver "sobras", adiciona +1 membro a esta equipe
        const currentTeamSize = teamSize + (remainder > 0 ? 1 : 0);
        const team = shuffled.slice(index, index + currentTeamSize);
        teams.push(team);
        index += currentTeamSize;
        if (remainder > 0) remainder--;
    }

    // Renderiza as equipes
    teamsOutput.innerHTML = '';
    teams.forEach((team, i) => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';

        const teamTitle = document.createElement('h3');
        teamTitle.textContent = `Equipe ${i + 1}`;
        teamCard.appendChild(teamTitle);

        const memberList = document.createElement('ul');
        team.forEach(member => {
            const li = document.createElement('li');
            li.textContent = member.name;
            memberList.appendChild(li);
        });
        teamCard.appendChild(memberList);
        teamsOutput.appendChild(teamCard);
    });
};


// --- Inicialização ---

// Função para carregar tudo quando a página abre
const initialize = () => {
    addNameForm.addEventListener('submit', addName);
    drawButton.addEventListener('click', drawTeams);

    // Carrega os nomes salvos do localStorage
    participants = getNamesFromStorage();
    renderNames(); // Exibe os nomes na tela
};

// Inicia a aplicação
initialize();