// ============================================================
// PetSaúde REC — db.js
// Banco de dados local (localStorage) — simula SQLite
// Tabelas: users, pets, triagens, fila_hvr, clinicas, petpoints
// ============================================================

const DB_VERSION = '2.0';

const PetDB = (() => {

    function seed() {
        if (localStorage.getItem('petsaude_db_version') === DB_VERSION) return;

        const hoje = new Date();
        const fmt  = (d) => d.toISOString();
        const dias = (n) => { const d = new Date(hoje); d.setDate(d.getDate() - n); return fmt(d); };

        const users = [
            { id: 'u1', perfil: 'cidadao', nome: 'Maria Silva',        email: 'tutor@pet.com',   senha: '123', avatar: 'MS', bairro: 'Boa Viagem' },
            { id: 'u2', perfil: 'cidadao', nome: 'João Souza',         email: 'joao@pet.com',    senha: '123', avatar: 'JS', bairro: 'Afogados' },
            { id: 'u3', perfil: 'clinica', nome: 'VetCare Boa Viagem', email: 'clinica@pet.com', senha: '123', avatar: 'VC', bairro: 'Boa Viagem', clinica_id: 'c1' },
            { id: 'u4', perfil: 'adm',     nome: 'Admin HVR',           email: 'adm@pet.com',     senha: '123', avatar: 'AD', bairro: 'Iputinga' },
        ];

        const pets = [
            { id: 'p1', tutor_id: 'u1', nome: 'Bolinha', especie: 'Cao',  raca: 'SRD',      idade: 3, foto_emoji: 'dog' },
            { id: 'p2', tutor_id: 'u1', nome: 'Gaia',    especie: 'Gata', raca: 'Persa',    idade: 5, foto_emoji: 'cat' },
            { id: 'p3', tutor_id: 'u2', nome: 'Rex',     especie: 'Cao',  raca: 'Labrador', idade: 2, foto_emoji: 'dog' },
            { id: 'p4', tutor_id: 'u2', nome: 'Mel',     especie: 'Gata', raca: 'Siamesa',  idade: 4, foto_emoji: 'cat' },
        ];

        const triagens = [
            { id: 't1', pet_id: 'p1', tutor_id: 'u1', data: fmt(hoje), sintomas: 'Vomito repetido e apatia intensa',    classificacao: 'amarela',  resumo: 'Urgencia moderada - possivel gastroenterite',   pontos_ganhos: 10 },
            { id: 't2', pet_id: 'p1', tutor_id: 'u1', data: dias(16),  sintomas: 'Check-up anual e vacina V10',          classificacao: 'verde',    resumo: 'Rotina - vacina e vermifugacao em dia',          pontos_ganhos: 10 },
            { id: 't3', pet_id: 'p1', tutor_id: 'u1', data: dias(115), sintomas: 'Atropelamento leve, sangrou na pata',  classificacao: 'vermelha', resumo: 'Emergencia - trauma, necessitou sutura',         pontos_ganhos: 10 },
            { id: 't4', pet_id: 'p2', tutor_id: 'u1', data: dias(5),   sintomas: 'Coceira constante nas orelhas',         classificacao: 'verde',    resumo: 'Otite leve - orientado clinica parceira',        pontos_ganhos: 10 },
            { id: 't5', pet_id: 'p3', tutor_id: 'u2', data: fmt(hoje), sintomas: 'Diarreia forte ha 2 dias, febre',       classificacao: 'amarela',  resumo: 'Urgencia - desidratacao inicial suspeita',       pontos_ganhos: 10 },
        ];

        const fila = [
            { id: 'f1', pet_id: 'p1', tutor_id: 'u1', posicao: 7,  status: 'aguardando',     eta_min: 21, entrada: fmt(hoje), classificacao: 'amarela',  nome_pet: 'Bolinha', especie: 'Cao',  sintoma_resumo: 'Vomito e apatia',        tutor_nome: 'Maria Silva' },
            { id: 'f2', pet_id: 'p3', tutor_id: 'u2', posicao: 12, status: 'aguardando',     eta_min: 36, entrada: fmt(hoje), classificacao: 'amarela',  nome_pet: 'Rex',     especie: 'Cao',  sintoma_resumo: 'Diarreia e febre',       tutor_nome: 'Joao Souza' },
            { id: 'f3', pet_id: null, tutor_id: null,  posicao: 1,  status: 'sendo_atendido', eta_min: 0,  entrada: fmt(hoje), classificacao: 'vermelha', nome_pet: 'Toninho',  especie: 'Gata', sintoma_resumo: 'Convulsao grave',        tutor_nome: 'Ana Lima' },
            { id: 'f4', pet_id: null, tutor_id: null,  posicao: 2,  status: 'aguardando',     eta_min: 4,  entrada: fmt(hoje), classificacao: 'vermelha', nome_pet: 'Spike',   especie: 'Cao',  sintoma_resumo: 'Sangramento intenso',    tutor_nome: 'Roberto Alves' },
            { id: 'f5', pet_id: null, tutor_id: null,  posicao: 3,  status: 'aguardando',     eta_min: 8,  entrada: fmt(hoje), classificacao: 'vermelha', nome_pet: 'Mimi',    especie: 'Gata', sintoma_resumo: 'Envenenamento suspeito', tutor_nome: 'Lucia Ramos' },
            { id: 'f6', pet_id: null, tutor_id: null,  posicao: 4,  status: 'aguardando',     eta_min: 12, entrada: fmt(hoje), classificacao: 'amarela',  nome_pet: 'Chico',   especie: 'Cao',  sintoma_resumo: 'Vomito e febre',         tutor_nome: 'Paulo Melo' },
            { id: 'f7', pet_id: null, tutor_id: null,  posicao: 5,  status: 'aguardando',     eta_min: 15, entrada: fmt(hoje), classificacao: 'amarela',  nome_pet: 'Nala',    especie: 'Gata', sintoma_resumo: 'Diarreia intensa',       tutor_nome: 'Camila Torres' },
            { id: 'f8', pet_id: null, tutor_id: null,  posicao: 6,  status: 'aguardando',     eta_min: 18, entrada: fmt(hoje), classificacao: 'verde',    nome_pet: 'Pipoca',  especie: 'Cao',  sintoma_resumo: 'Pulgas e coceira',       tutor_nome: 'Sandra Lima' },
        ];

        const clinicas = [
            { id: 'c1', nome: 'VetCare Boa Viagem',   bairro: 'Boa Viagem', telefone: '(81) 3344-1122', vagas: 4, pets_a_caminho: 2, status: 'disponivel',   lat: -8.1130, lng: -34.8969, avaliacao: 4.8 },
            { id: 'c2', nome: 'PetHosp Madalena',      bairro: 'Madalena',   telefone: '(81) 3355-2233', vagas: 1, pets_a_caminho: 1, status: 'quase_lotada', lat: -8.0700, lng: -34.9210, avaliacao: 4.5 },
            { id: 'c3', nome: 'ClínicaPet Casa Forte', bairro: 'Casa Forte', telefone: '(81) 3366-3344', vagas: 6, pets_a_caminho: 0, status: 'disponivel',   lat: -8.0400, lng: -34.9050, avaliacao: 4.9 },
            { id: 'c4', nome: 'VetPlus Afogados',      bairro: 'Afogados',   telefone: '(81) 3377-4455', vagas: 0, pets_a_caminho: 3, status: 'lotada',       lat: -8.0950, lng: -34.9350, avaliacao: 4.3 },
            { id: 'c5', nome: 'AnimalClin Derby',      bairro: 'Derby',      telefone: '(81) 3388-5566', vagas: 3, pets_a_caminho: 1, status: 'disponivel',   lat: -8.0600, lng: -34.8980, avaliacao: 4.7 },
        ];

        const petpoints = [
            { id: 'pp1', user_id: 'u1', tipo: 'ganho', descricao: 'Triagem concluida - Bolinha',     pontos: 10,  data: fmt(hoje) },
            { id: 'pp2', user_id: 'u1', tipo: 'ganho', descricao: 'Triagem concluida - Gaia',        pontos: 10,  data: dias(5) },
            { id: 'pp3', user_id: 'u1', tipo: 'ganho', descricao: 'Doacao de sangue no HVR',         pontos: 100, data: dias(30) },
            { id: 'pp4', user_id: 'u1', tipo: 'ganho', descricao: 'Check-up em dia - Bolinha',       pontos: 10,  data: dias(16) },
            { id: 'pp5', user_id: 'u1', tipo: 'ganho', descricao: 'Triagem de emergencia - Bolinha', pontos: 10,  data: dias(115) },
            { id: 'pp6', user_id: 'u1', tipo: 'uso',   descricao: 'Desconto 15% na VetCare',         pontos: -50, data: dias(60) },
            { id: 'pp7', user_id: 'u2', tipo: 'ganho', descricao: 'Triagem concluida - Rex',         pontos: 10,  data: fmt(hoje) },
        ];

        set('users',     users);
        set('pets',      pets);
        set('triagens',  triagens);
        set('fila_hvr',  fila);
        set('clinicas',  clinicas);
        set('petpoints', petpoints);
        localStorage.setItem('petsaude_db_version', DB_VERSION);
    }

    function set(table, data)      { localStorage.setItem('petsaude_' + table, JSON.stringify(data)); }
    function getAll(table)         { return JSON.parse(localStorage.getItem('petsaude_' + table) || '[]'); }
    function findById(table, id)   { return getAll(table).find(r => r.id === id) || null; }
    function findWhere(table, fn)  { return getAll(table).filter(fn); }
    function insert(table, record) { const rows = getAll(table); rows.push(record); set(table, rows); return record; }
    function update(table, id, ch) { set(table, getAll(table).map(r => r.id === id ? {...r, ...ch} : r)); }
    function remove(table, id)     { set(table, getAll(table).filter(r => r.id !== id)); }

    function login(email, senha) {
        const user = findWhere('users', u => u.email === email && u.senha === senha)[0];
        if (user) { localStorage.setItem('petsaude_session', JSON.stringify(user)); return user; }
        return null;
    }
    function logout()  { localStorage.removeItem('petsaude_session'); }
    function session() { return JSON.parse(localStorage.getItem('petsaude_session') || 'null'); }

    function petsDoTutor(id)      { return findWhere('pets', p => p.tutor_id === id); }
    function triagensDoTutor(id)  { return findWhere('triagens', t => t.tutor_id === id).sort((a,b) => new Date(b.data) - new Date(a.data)); }
    function filaDoTutor(id)      { return findWhere('fila_hvr', f => f.tutor_id === id && f.status === 'aguardando'); }
    function filaCompleta()       { return getAll('fila_hvr').sort((a,b) => a.posicao - b.posicao); }
    function todasClinicas()      { return getAll('clinicas'); }
    function saldoPetPoints(id)   { return findWhere('petpoints', p => p.user_id === id).reduce((acc,p) => acc + p.pontos, 0); }
    function extratoPetPoints(id) { return findWhere('petpoints', p => p.user_id === id).sort((a,b) => new Date(b.data) - new Date(a.data)); }

    function registrarTriagem(pet_id, tutor_id, sintomas, classificacao, resumo) {
        const id = 't' + Date.now();
        const triagem = { id, pet_id, tutor_id, data: new Date().toISOString(), sintomas, classificacao, resumo, pontos_ganhos: 10 };
        insert('triagens', triagem);
        insert('petpoints', { id: 'pp' + Date.now(), user_id: tutor_id, tipo: 'ganho', descricao: 'Triagem concluida via Toby', pontos: 10, data: new Date().toISOString() });
        return triagem;
    }

    function statsAdm() {
        const fila = getAll('fila_hvr');
        const triagens = getAll('triagens');
        const hoje = new Date().toDateString();
        return {
            total_fila:     fila.filter(f => f.status === 'aguardando').length,
            emergencias:    fila.filter(f => f.classificacao === 'vermelha' && f.status === 'aguardando').length,
            sendo_atendido: fila.filter(f => f.status === 'sendo_atendido').length,
            triagens_hoje:  triagens.filter(t => new Date(t.data).toDateString() === hoje).length,
            redirecionados: 18,
            atendidos_hoje: 63,
        };
    }

    seed();
    return { getAll, findById, findWhere, insert, update, remove, login, logout, session, petsDoTutor, triagensDoTutor, filaDoTutor, filaCompleta, todasClinicas, saldoPetPoints, extratoPetPoints, registrarTriagem, statsAdm };
})();