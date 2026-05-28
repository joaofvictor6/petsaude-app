// =========================================
// 1. DICIONÁRIO E TRADUÇÃO (BILINGUISMO)
// =========================================
let currentLang = 'pt';

const dictionary = {
    pt: {
        "nav-feat": "Cidadania Pet",
        "nav-plans": "Atendimento",
        "nav-login": "Acesso Cidadão",
        "hero-badge": "Desafios Recife: Saúde Animal",
        "hero-title": "Zero Filas no <span>HVR Recife.</span> Triagem Inteligente.",
        "hero-desc": "Desafogue o Hospital Veterinário do Recife. Faça a pré-triagem com nossa IA e, em caso de urgência, encontre a rota mais rápida para salvar seu pet.",
        "btn-chat": "<img src='assets/mascote.png' alt='Mascote Toby' class='mascote-icon' /> Triagem com Toby IA",
        "btn-location": "<i class='fa-solid fa-location-dot'></i> Rota de Emergência",
        "gamif-title": "Cidadania Pet e Recompensas",
        "gamif-subtitle": "Ajude a cidade e ganhe benefícios na Rede Parceira",
        "card1-title": "Doador Herói",
        "card1-desc": "Doe sangue no HVR e acumule PetPoints para trocar por descontos em consultas particulares.",
        "card2-title": "Fila Digital",
        "card2-desc": "Aguarde sua vez no conforto de casa. O Toby avisa quando você deve se deslocar ao hospital.",
        "card3-title": "Rede Parceira",
        "card3-desc": "HVR lotado? Use seus pontos para ser atendido rapidamente em clínicas privadas conveniadas.",
        "planos-title": "Opções de Atendimento",
        "plan1-name": "HVR (Público)",
        "btn-plan1": "Entrar na Fila SUS",
        "badge-popular": "Sem Fila",
        "plan2-name": "Rede Parceira (Privado)",
        "btn-plan2": "Ver Clínicas Vizinhas",
        "footer-text": "© 2026 PetSaúde REC. Solução para o Banco de Oportunidades do Recife.",
        "chat-title-text": "Mascote Toby (Triagem)",
        "chat-welcome": "Olá cidadão! Sou o Toby 🐾 Descreva os sintomas do seu pet para fazermos a pré-triagem do HVR Recife.",
        "placeholder": "Digite os sintomas..."
    },
    en: {
        "nav-feat": "Pet Citizenship",
        "nav-plans": "Service Options",
        "nav-login": "Citizen Access",
        "hero-badge": "Recife Challenges: Animal Health",
        "hero-title": "Zero Queues at <span>HVR Recife.</span> Smart Triage.",
        "hero-desc": "Relieve the Recife Veterinary Hospital. Do a pre-triage with our AI and, in emergencies, find the fastest route to save your pet.",
        "btn-chat": "<img src='assets/mascote.png' alt='Mascot Toby' class='mascote-icon' /> Triage with Toby AI",
        "btn-location": "<i class='fa-solid fa-location-dot'></i> Emergency Route",
        "gamif-title": "Pet Citizenship & Rewards",
        "gamif-subtitle": "Help the city and earn benefits in our Partner Network",
        "card1-title": "Hero Donor",
        "card1-desc": "Donate blood at HVR and earn PetPoints for discounts on private consultations.",
        "card2-title": "Digital Queue",
        "card2-desc": "Wait from home. Toby will notify you when to head to the hospital.",
        "card3-title": "Partner Network",
        "card3-desc": "HVR full? Use points for fast service at affiliated private clinics.",
        "planos-title": "Service Options",
        "plan1-name": "HVR (Public)",
        "btn-plan1": "Join Public Queue",
        "badge-popular": "No Queue",
        "plan2-name": "Partner Network (Private)",
        "btn-plan2": "See Nearby Clinics",
        "footer-text": "© 2026 PetSaúde REC. Solution for the Recife Opportunity Bank.",
        "chat-title-text": "Mascot Toby (Triage)",
        "chat-welcome": "Hello citizen! I'm Toby 🐾 Describe your pet's symptoms for HVR Recife pre-triage.",
        "placeholder": "Type symptoms..."
    }
};

function changeLang(lang) {
    currentLang = lang;
    document.getElementById('btn-pt').classList.remove('active');
    document.getElementById('btn-en').classList.remove('active');
    document.getElementById(`btn-${lang}`).classList.add('active');

    for (let id in dictionary[lang]) {
        let el = document.getElementById(id);
        if (el) el.innerHTML = dictionary[lang][id];
    }
    document.getElementById('user-input').placeholder = dictionary[lang]["placeholder"];
}

// =========================================
// 2. GEOLOCALIZAÇÃO E ROTEAMENTO
// =========================================
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert(currentLang === 'pt'
            ? "Geolocalização não suportada por este navegador."
            : "Geolocation not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude.toFixed(4);
    const lon = position.coords.longitude.toFixed(4);
    const mapsUrl = `https://www.google.com/maps/dir/${lat},${lon}/-8.0522,-34.9286`;
    alert(currentLang === 'pt'
        ? `📍 Localização detectada!\n\n🚑 Abrindo rota para o HVR Recife no Google Maps...`
        : `📍 Location detected!\n\n🚑 Opening route to HVR Recife on Google Maps...`);
    window.open(mapsUrl, '_blank');
}

function showError(error) {
    const msgs = {
        [error.PERMISSION_DENIED]:    currentLang === 'pt' ? "Permissão negada." : "Permission denied.",
        [error.POSITION_UNAVAILABLE]: currentLang === 'pt' ? "Localização indisponível." : "Location unavailable.",
        [error.TIMEOUT]:              currentLang === 'pt' ? "Tempo esgotado." : "Request timed out."
    };
    alert((currentLang === 'pt' ? "Erro: " : "Error: ") + (msgs[error.code] || "Desconhecido."));
}

// =========================================
// 3. CHATBOT TOBY — OpenRouter (fallback automático)
// =========================================

// Cole aqui sua chave do OpenRouter (openrouter.ai → Keys → Create Key, sem cartão)
const OPENROUTER_API_KEY = '???';

// IDs verificados em 28/05/2026 na página openrouter.ai/collections/free-models
// O sistema tenta cada um em ordem — se receber 429 ou 404, passa pro próximo.
const FREE_MODELS_FALLBACK = [
    'openai/gpt-oss-20b:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
    'deepseek/deepseek-v4-flash:free',
    'minimax/minimax-m2.5:free',
    'openai/gpt-oss-120b:free',
];

let chatHistory = [];

function openChat()  { document.getElementById('chat-container').classList.remove('chat-hidden'); }
function closeChat() { document.getElementById('chat-container').classList.add('chat-hidden'); }
function handleKeyPress(event) { if (event.key === 'Enter') sendMessage(); }

async function sendMessage() {
    const inputEl = document.getElementById('user-input');
    const messageText = inputEl.value.trim();
    if (!messageText) return;

    addMessageToChat(messageText, 'user-message');
    inputEl.value = '';

    const typingId = 'typing-' + Date.now();
    addMessageToChat(
        currentLang === 'pt' ? '🐾 Toby está analisando...' : '🐾 Toby is analyzing...',
        'bot-message', typingId
    );

    chatHistory.push({ role: 'user', content: messageText });
    const botResponse = await getTobyChatResponse();

    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    addMessageToChat(botResponse, 'bot-message');
}

function addMessageToChat(text, className, id = null) {
    const chatMessages = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    if (id) msgDiv.id = id;
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getTobyChatResponse() {
    const systemPrompt = `Você é o Toby, mascote e assistente de triagem do Hospital Veterinário do Recife (HVR).
Faça pré-triagem rápida e empática, classificando o risco pelos sintomas.

CLASSIFICAÇÃO:
- VERMELHA (Emergência): atropelamento, sangramento intenso, envenenamento, convulsão, dificuldade severa de respirar. Instrua ir IMEDIATAMENTE ao HVR.
- AMARELA (Urgência Moderada): vômito repetido, diarreia forte, febre, dor aparente. Avise que a fila pode demorar; sugira a Rede Parceira.
- VERDE (Rotina): coceira leve, vacina, pulgas, check-up. Oriente a NÃO ir ao HVR emergencialmente; sugira agendamento.

COMPORTAMENTO:
- Tom caloroso. Respostas curtas (máx 4 linhas).
- Responda no idioma do usuário (PT ou EN).
- Formate com HTML simples: <b>negrito</b> e <br> para quebras.
- Se VERMELHA, inclua EXATAMENTE este HTML no final:
<br><button onclick="getLocation()" style="margin-top:8px;padding:8px 14px;background:#ef4444;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">Rota Rapida HVR</button>`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory
    ];

    for (const model of FREE_MODELS_FALLBACK) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'PetSaude REC - Toby'
                },
                body: JSON.stringify({ model, messages })
            });

            // 429 = lotado, 404 = modelo removido — tenta próximo
            if (response.status === 429 || response.status === 404) {
                console.warn(`[Toby] ${model} → ${response.status}, tentando próximo...`);
                continue;
            }

            const data = await response.json();

            if (data.choices && data.choices[0]?.message?.content) {
                const reply = data.choices[0].message.content;
                chatHistory.push({ role: 'assistant', content: reply });
                return reply;
            }

            console.warn(`[Toby] ${model} respondeu sem conteúdo:`, data);

        } catch (err) {
            console.warn(`[Toby] Erro de rede com ${model}:`, err);
        }
    }

    // Nenhum modelo funcionou
    return currentLang === 'pt'
        ? '⚠️ Servidores sobrecarregados. Aguarde 1 minuto e tente novamente.'
        : '⚠️ Servers overloaded. Wait 1 minute and try again.';
}