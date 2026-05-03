/**
 * BURRÃO DA CIDADE - Game Engine
 * Lógica principal do jogo de futsal mobile
 */

// ================================
// Elementos do DOM
// ================================

const canvas = document.getElementById("campo");
const ctx = canvas.getContext("2d");

// ================================
// Configuração do Canvas
// ================================

canvas.width = 600;
canvas.height = 400;

// ================================
// Estado do Jogo
// ================================

let gols1 = 0;           // Gols do jogador
let gols2 = 0;           // Gols do rival
let jogoAtivo = false;   // Status do jogo

// ================================
// Objetos do Jogo
// ================================

// Bola
const bola = { 
    x: 300, 
    y: 200, 
    r: 8,    // raio
    dx: 0,   // velocidade x
    dy: 0    // velocidade y
};

// Jogador 1 (Você)
const p1 = { 
    x: 40, 
    y: 175, 
    w: 18,      // largura
    h: 55,      // altura
    cor: 'white',
    velocidade: 5
};

// Jogador 2 (IA/Rival)
const p2 = { 
    x: 542, 
    y: 175, 
    w: 18,
    h: 55,
    cor: '#ff5252',
    velocidade: 3.2
};

// ================================
// Entrada de Usuário
// ================================

const inputs = { 
    cima: false, 
    baixo: false, 
    esq: false, 
    dir: false, 
    chute: false 
};

/**
 * Configura um botão para input touch/mouse
 * @param {string} id - ID do elemento
 * @param {string} acao - Ação associada ao botão
 */
const configurarBotao = (id, acao) => {
    const el = document.getElementById(id);
    
    const ativar = (e) => { 
        e.preventDefault(); 
        inputs[acao] = true; 
    };
    
    const desativar = () => inputs[acao] = false;
    
    el.addEventListener('touchstart', ativar, { passive: false });
    el.addEventListener('touchend', desativar);
    el.addEventListener('mousedown', ativar);
    el.addEventListener('mouseup', desativar);
    el.addEventListener('mouseleave', desativar);
};

// Configurar botões
configurarBotao('cima', 'cima');
configurarBotao('baixo', 'baixo');
configurarBotao('esq', 'esq');
configurarBotao('dir', 'dir');
configurarBotao('chute', 'chute');

// ================================
// Funções de Inicialização
// ================================

/**
 * Inicia o jogo com o time selecionado
 */
function configurarEJogar() {
    const timeEscolhido = document.getElementById("timeUsuario").value;
    document.getElementById("label-time").innerText = timeEscolhido;
    document.getElementById("menu-inicial").style.display = "none";
    jogoAtivo = true;
    loop();
}

/**
 * Reseta a posição da bola ao centro
 */
function resetBola() {
    bola.x = 300;
    bola.y = 200;
    bola.dx = 0;
    bola.dy = 0;
}

// ================================
// Lógica de Atualização
// ================================

/**
 * Atualiza a posição de todos os objetos do jogo
 */
function atualizar() {
    // ========== Movimento do Jogador 1 ==========
    if (inputs.cima && p1.y > 0) 
        p1.y -= p1.velocidade;
    
    if (inputs.baixo && p1.y < canvas.height - p1.h) 
        p1.y += p1.velocidade;
    
    if (inputs.esq && p1.x > 0) 
        p1.x -= p1.velocidade;
    
    if (inputs.dir && p1.x < 280) 
        p1.x += p1.velocidade;

    // ========== Inteligência Artificial do Rival ==========
    const centroP2 = p2.y + p2.h / 2;
    
    if (bola.y > centroP2 + 10) 
        p2.y += p2.velocidade;
    else if (bola.y < centroP2 - 10) 
        p2.y -= p2.velocidade;
    
    // Manter IA dentro dos limites
    p2.y = Math.max(0, Math.min(p2.y, canvas.height - p2.h));

    // ========== Movimento da Bola ==========
    bola.x += bola.dx;
    bola.y += bola.dy;
    
    // Atrito (reduz velocidade)
    bola.dx *= 0.985;
    bola.dy *= 0.985;

    // ========== Colisões com Bordas ==========
    if (bola.y - bola.r < 0 || bola.y + bola.r > canvas.height) 
        bola.dy *= -1;

    // ========== Colisão com Jogador 1 ==========
    if (bola.x - bola.r < p1.x + p1.w && 
        bola.y > p1.y && 
        bola.y < p1.y + p1.h) {
        
        // Força diferente se tiver chutando
        bola.dx = inputs.chute ? 13 : 7;
        
        // Ângulo baseado na posição de contato
        bola.dy = (bola.y - (p1.y + p1.h / 2)) * 0.25;
    }

    // ========== Colisão com Jogador 2 ==========
    if (bola.x + bola.r > p2.x && 
        bola.y > p2.y && 
        bola.y < p2.y + p2.h) {
        
        bola.dx = -7;
        bola.dy = (bola.y - (p2.y + p2.h / 2)) * 0.25;
    }

    // ========== Sistema de Golo ==========
    // Golo para o Rival (p1 marca)
    if (bola.x < 0) {
        if (bola.y > 120 && bola.y < 280) { 
            gols1++;
            resetBola(); 
        } else {
            bola.dx *= -1;
        }
    }
    
    // Golo para o Jogador (p2 marca)
    if (bola.x > canvas.width) {
        if (bola.y > 120 && bola.y < 280) { 
            gols2++;
            resetBola(); 
        } else {
            bola.dx *= -1;
        }
    }

    // Atualizar placar
    document.getElementById("pts1").innerText = gols1;
    document.getElementById("pts2").innerText = gols2;
}

// ================================
// Renderização (Desenho)
// ================================

/**
 * Desenha todos os elementos do jogo no canvas
 */
function desenhar() {
    // ========== Limpar e Desenhar Campo ==========
    ctx.fillStyle = "#388e3c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ========== Linhas do Campo ==========
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 3;
    
    // Balizas
    ctx.strokeRect(0, 120, 40, 160);
    ctx.strokeRect(560, 120, 40, 160);
    
    // Linha do meio
    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, canvas.height);
    ctx.stroke();

    // ========== Desenhar Jogadores ==========
    
    // Jogador 1
    ctx.fillStyle = p1.cor;
    ctx.fillRect(p1.x, p1.y, p1.w, p1.h);
    
    // Jogador 2
    ctx.fillStyle = p2.cor;
    ctx.fillRect(p2.x, p2.y, p2.w, p2.h);

    // ========== Desenhar Bola ==========
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(bola.x, bola.y, bola.r, 0, Math.PI * 2);
    ctx.fill();
}

// ================================
// Loop Principal do Jogo
// ================================

/**
 * Loop principal que atualiza e desenha o jogo
 */
function loop() {
    if (!jogoAtivo) return;
    
    atualizar();
    desenhar();
    
    requestAnimationFrame(loop);
}

// ================================
// Exportar para uso global
// ================================

window.configurarEJogar = configurarEJogar;
