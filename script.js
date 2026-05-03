// ===== APP DATA =====
const timesData = [
    {
        id: 'vila-das-gracas',
        name: 'Vila das Graças',
        icon: '🟢',
        apostas: 45,
        vitórias: 28,
        derrotas: 12,
        empates: 5,
        taxaAcerto: '75%',
        moedas: 4250
    },
    {
        id: 'jardim-maria',
        name: 'Jardim Maria',
        icon: '🔴',
        apostas: 38,
        vitórias: 22,
        derrotas: 10,
        empates: 6,
        taxaAcerto: '68%',
        moedas: 3850
    },
    {
        id: 'ec-belem',
        name: 'E.C. Belém',
        icon: '🟡',
        apostas: 42,
        vitórias: 25,
        derrotas: 14,
        empates: 3,
        taxaAcerto: '70%',
        moedas: 4120
    },
    {
        id: 'independencia',
        name: 'Independência FC',
        icon: '🟣',
        apostas: 35,
        vitórias: 20,
        derrotas: 11,
        empates: 4,
        taxaAcerto: '65%',
        moedas: 3600
    }
];

const boloesData = [
    {
        id: 1,
        time1: 'vila-das-gracas',
        time2: 'jardim-maria',
        data: '2026-05-25',
        hora: '15:30',
        entrada: 200,
        status: 'aberto',
        apostas: 12,
        premiacao: 2400
    },
    {
        id: 2,
        time1: 'ec-belem',
        time2: 'independencia',
        data: '2026-05-26',
        hora: '18:00',
        entrada: 150,
        status: 'aberto',
        apostas: 8,
        premiacao: 1200
    },
    {
        id: 3,
        time1: 'vila-das-gracas',
        time2: 'ec-belem',
        data: '2026-05-27',
        hora: '19:00',
        entrada: 100,
        status: 'aberto',
        apostas: 15,
        premiacao: 1500
    },
    {
        id: 4,
        time1: 'jardim-maria',
        time2: 'independencia',
        data: '2026-05-28',
        hora: '16:30',
        entrada: 120,
        status: 'finalizado',
        apostas: 10,
        premiacao: 1200
    }
];

const rankingData = [
    { posicao: 1, nome: 'JoãoVitor', moedas: 4250 },
    { posicao: 2, nome: 'MariaSlva', moedas: 3850 },
    { posicao: 3, nome: 'PedroBoy', moedas: 3600 },
    { posicao: 4, nome: 'AnaLuiza', moedas: 3200 },
    { posicao: 5, nome: 'CarlosKing', moedas: 2950 },
    { posicao: 6, nome: 'FabioReis', moedas: 2850 }
];

// ===== USER DATA =====
let userBalance = 1250;
const userApostasAtivas = 3;
const userVitorias = 12;
let currentBolaoSelected = null;

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    loadHome();
    setupNavigation();
    updateUserCoins();
});

// ===== NAVIGATION =====
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            showSection(section);
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.classList.add('active');
        
        // Load section content
        switch(sectionName) {
            case 'home':
                loadHome();
                break;
            case 'times':
                loadTimes();
                break;
            case 'boloes':
                loadBoloes();
                break;
            case 'ranking':
                loadRanking();
                break;
            case 'perfil':
                loadPerfil();
                break;
        }
    }
}

// ===== HOME SECTION =====
function loadHome() {
    loadMatches();
    updateHomeStats();
}

function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';

    const openMatches = boloesData.filter(b => b.status === 'aberto');
    
    openMatches.forEach(match => {
        const time1 = getTimeById(match.time1);
        const time2 = getTimeById(match.time2);
        
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <div class="match-teams">
                <span>${time1.icon} ${time1.name}</span>
                <span class="match-vs">vs</span>
                <span>${time2.icon} ${time2.name}</span>
            </div>
            <div class="match-datetime">
                📅 ${formatDate(match.data)} • 🕐 ${match.hora}
            </div>
            <div class="match-entrada">
                🪙 Entrada: ${match.entrada}
            </div>
            <button class="match-btn" onclick="openApostarModal(${match.id})">
                🎯 Apostar Agora
            </button>
        `;
        matchesList.appendChild(matchCard);
    });
}

function updateHomeStats() {
    document.getElementById('meuSaldo').textContent = userBalance + ' 🪙';
    document.getElementById('apostasAtivas').textContent = userApostasAtivas;
    document.getElementById('minhasVitorias').textContent = userVitorias;
}

// ===== TIMES SECTION =====
function loadTimes() {
    const timesList = document.getElementById('timesList');
    timesList.innerHTML = '';

    timesData.forEach(time => {
        const timeCard = document.createElement('div');
        timeCard.className = 'time-card';
        timeCard.innerHTML = `
            <div class="time-icon">${time.icon}</div>
            <div class="time-name">${time.name}</div>
            <div class="time-stats">
                <div class="time-stat">
                    <label>Apostas</label>
                    <value>${time.apostas}</value>
                </div>
                <div class="time-stat">
                    <label>Vitórias</label>
                    <value>${time.vitórias}</value>
                </div>
                <div class="time-stat">
                    <label>Taxa Acerto</label>
                    <value>${time.taxaAcerto}</value>
                </div>
                <div class="time-stat">
                    <label>Moedas Ganhas</label>
                    <value>${time.moedas}</value>
                </div>
            </div>
        `;
        timesList.appendChild(timeCard);
    });
}

// ===== BOLÕES SECTION =====
function loadBoloes() {
    const boloesList = document.getElementById('boloesList');
    boloesList.innerHTML = '';

    boloesData.forEach(bolao => {
        const time1 = getTimeById(bolao.time1);
        const time2 = getTimeById(bolao.time2);
        
        const bolaCard = document.createElement('div');
        bolaCard.className = 'bolao-card';
        bolaCard.innerHTML = `
            <div class="bolao-titulo">
                ${time1.icon} ${time1.name} vs ${time2.icon} ${time2.name}
            </div>
            <div class="bolao-info">
                📅 ${formatDate(bolao.data)}<br>
                🕐 ${bolao.hora}<br>
                🪙 Entrada: ${bolao.entrada}
            </div>
            <span class="bolao-status ${bolao.status}">
                ${bolao.status === 'aberto' ? '🟢 Aberto' : '🔴 Finalizado'}
            </span>
            <div class="bolao-apostas">
                👥 ${bolao.apostas} apostas<br>
                🏆 Prêmio: ${bolao.premiacao} 🪙
            </div>
            <div class="bolao-actions">
                <button class="btn btn-primary btn-small" onclick="openApostarModal(${bolao.id})">
                    💰 Apostar
                </button>
                <button class="btn btn-secondary btn-small" onclick="alert('Ver detalhes em breve!')">
                    📊 Detalhes
                </button>
            </div>
        `;
        boloesList.appendChild(bolaCard);
    });
}

// ===== RANKING SECTION =====
function loadRanking() {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = `
        <div class="ranking-header">
            <div>Pos</div>
            <div>Jogador</div>
            <div>Moedas</div>
            <div>Apostas</div>
            <div>Acertos</div>
        </div>
    `;

    rankingData.forEach((player, index) => {
        const row = document.createElement('div');
        row.className = 'ranking-row';
        
        let positionClass = '';
        let medal = '';
        if (index === 0) {
            positionClass = 'top1';
            medal = '🥇';
        } else if (index === 1) {
            positionClass = 'top2';
            medal = '🥈';
        } else if (index === 2) {
            positionClass = 'top3';
            medal = '🥉';
        }

        row.innerHTML = `
            <div class="ranking-position ${positionClass}">${medal} ${player.posicao}</div>
            <div class="ranking-name">${player.nome}</div>
            <div class="ranking-moedas">${player.moedas} 🪙</div>
            <div>${Math.floor(Math.random() * 30) + 10}</div>
            <div>${Math.floor(Math.random() * 20) + 5}</div>
        `;
        rankingList.appendChild(row);
    });
}

// ===== PERFIL SECTION =====
function loadPerfil() {
    document.getElementById('nomeUsuario').textContent = 'JoãoVitor';
    document.getElementById('dataMembro').textContent = '25/01/2026';
    document.getElementById('saldoPerfil').textContent = userBalance + ' 🪙';
    document.getElementById('apostasPerfil').textContent = userApostasAtivas + 15;
    document.getElementById('vitóriasPerfil').textContent = userVitorias;
    document.getElementById('taxaPerfil').textContent = '80%';
}

// ===== MODALS =====
function openCreateBolao() {
    document.getElementById('createBolaoModal').classList.add('active');
}

function closeModal() {
    document.getElementById('createBolaoModal').classList.remove('active');
}

function openApostarModal(bolaoId) {
    const bolao = boloesData.find(b => b.id === bolaoId);
    if (!bolao || bolao.status !== 'aberto') {
        alert('Este bolão não está disponível para apostas!');
        return;
    }

    currentBolaoSelected = bolao;
    const time1 = getTimeById(bolao.time1);
    const time2 = getTimeById(bolao.time2);

    const content = document.getElementById('apostarContent');
    content.innerHTML = `
        <div class="aposta-match">
            <div class="aposta-teams">
                <span>${time1.icon} ${time1.name}</span>
                <span>vs</span>
                <span>${time2.icon} ${time2.name}</span>
            </div>
            <div style="font-size: 12px; color: var(--text-secondary);">
                📅 ${formatDate(bolao.data)} • 🕐 ${bolao.hora}
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <label style="display: block; color: var(--text-secondary); font-size: 12px; margin-bottom: 10px;">
                Escolha seu palpite:
            </label>
            <div class="aposta-options">
                <button class="option-btn" onclick="selectOption(1, this)">
                    ✅ ${time1.name}
                </button>
                <button class="option-btn" onclick="selectOption(2, this)">
                    ⚖️ EMPATE
                </button>
                <button class="option-btn" onclick="selectOption(3, this)">
                    ✅ ${time2.name}
                </button>
            </div>
        </div>

        <div class="form-group">
            <label>Valor da Aposta (mínimo: ${bolao.entrada} 🪙):</label>
            <input type="number" id="apostaValue" value="${bolao.entrada}" min="${bolao.entrada}" step="50">
        </div>

        <div class="form-group">
            <label>Seu Saldo: <strong style="color: var(--primary-color);">${userBalance} 🪙</strong></label>
        </div>

        <div class="form-actions">
            <button class="btn btn-primary" onclick="confirmarAposta()">
                ✅ Confirmar Aposta
            </button>
            <button class="btn btn-secondary" onclick="closeApostarModal()">
                ❌ Cancelar
            </button>
        </div>
    `;

    document.getElementById('apostarModal').classList.add('active');
}

function closeApostarModal() {
    document.getElementById('apostarModal').classList.remove('active');
    currentBolaoSelected = null;
}

function selectOption(option, element) {
    const options = element.parentElement.querySelectorAll('.option-btn');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

function confirmarAposta() {
    const selectedOption = document.querySelector('.option-btn.selected');
    const apostaValue = parseInt(document.getElementById('apostaValue').value);

    if (!selectedOption) {
        alert('Por favor, selecione um palpite!');
        return;
    }

    if (apostaValue < currentBolaoSelected.entrada) {
        alert(`Valor mínimo é ${currentBolaoSelected.entrada} 🪙`);
        return;
    }

    if (apostaValue > userBalance) {
        alert('Você não tem moedas suficientes!');
        return;
    }

    // Deduct from balance
    userBalance -= apostaValue;
    updateUserCoins();

    alert(`🎉 Aposta confirmada!\n\nVocê apostou ${apostaValue} 🪙\nSaldo restante: ${userBalance} 🪙`);

    closeApostarModal();
    loadBoloes();
}

function createBolao(event) {
    event.preventDefault();

    const nomeJogo = document.getElementById('nomeJogo').value;
    const time1 = document.getElementById('time1').value;
    const time2 = document.getElementById('time2').value;
    const dataBolao = document.getElementById('dataBolao').value;
    const horaBolao = document.getElementById('horaBolao').value;
    const entrada = parseInt(document.getElementById('entrada').value);

    if (time1 === time2) {
        alert('Selecione times diferentes!');
        return;
    }

    if (entrada > userBalance) {
        alert('Você não tem moedas suficientes para criar este bolão!');
        return;
    }

    // Deduct from balance
    userBalance -= entrada;
    updateUserCoins();

    // Create new bolao
    const newBolao = {
        id: boloesData.length + 1,
        time1: time1,
        time2: time2,
        data: dataBolao,
        hora: horaBolao,
        entrada: entrada,
        status: 'aberto',
        apostas: 0,
        premiacao: 0
    };

    boloesData.push(newBolao);

    alert('✅ Bolão criado com sucesso!');
    closeModal();
    document.getElementById('createBolaoForm').reset();
    loadBoloes();
}

// ===== UTILITY FUNCTIONS =====
function getTimeById(id) {
    return timesData.find(t => t.id === id);
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

function updateUserCoins() {
    document.getElementById('userCoins').textContent = `🪙 ${userBalance}`;
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const createModal = document.getElementById('createBolaoModal');
    const apostarModal = document.getElementById('apostarModal');

    if (event.target === createModal) {
        closeModal();
    }
    if (event.target === apostarModal) {
        closeApostarModal();
    }
});

// Prevent form submission on Enter
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.target.matches('input[type="submit"]')) {
        event.preventDefault();
    }
});
