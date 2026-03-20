/* ================================================
   Formulário de Relatório Mensal — Cidades Inteligentes
   JavaScript puro — lógica condicional, validação e envio
   ================================================ */

// ==========================================
// CONFIGURAÇÃO — Substitua pela URL do seu Web App
// ==========================================
const APPS_SCRIPT_URL = 'COLE_AQUI_A_URL_DO_SEU_WEB_APP';

// ==========================================
// Inicialização
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  // Listener do time/projeto para renderizar campos específicos
  document.getElementById('time_projeto').addEventListener('change', renderTeamSpecificFields);

  // Listener de dificuldade para mostrar/ocultar campos
  document.getElementById('houve_dificuldade').addEventListener('change', toggleDifficultyFields);

  // Listener do tipo de atividade para campo "Outro"
  document.getElementById('tipo_atividade').addEventListener('change', function () {
    var wrapper = document.getElementById('tipo_atividade_outro_wrapper');
    if (this.value === 'Outro') {
      wrapper.classList.remove('hidden');
    } else {
      wrapper.classList.add('hidden');
      document.getElementById('tipo_atividade_outro').value = '';
    }
  });

  // Submissão do formulário
  document.getElementById('main-form').addEventListener('submit', function (e) {
    e.preventDefault();
    submitForm();
  });
});

// ==========================================
// Renderização dinâmica de campos por time
// ==========================================
function renderTeamSpecificFields() {
  var team = document.getElementById('time_projeto').value;
  var block = document.getElementById('team-specific-block');
  var container = document.getElementById('team-specific-fields');
  var legend = document.getElementById('team-specific-legend');

  if (!team) {
    block.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  block.style.display = '';
  legend.textContent = 'Bloco 3 — Detalhamento: ' + team;

  var fields = getTeamFields(team);
  container.innerHTML = fields;
}

/**
 * Retorna o HTML dos campos específicos de cada time/projeto.
 */
function getTeamFields(team) {
  var html = '';

  switch (team) {

    // ----- Mapeamento de processos -----
    case 'Mapeamento de processos':
      html = buildFields([
        { id: 'mp_onda', label: 'Onda de implantação', type: 'text', placeholder: 'Ex.: 1ª onda' },
        { id: 'mp_secretarias_visitadas', label: 'Secretarias/setores/unidades visitadas', type: 'textarea', placeholder: 'Liste as secretarias visitadas' },
        { id: 'mp_qtd_visitas', label: 'Quantidade de visitas/reuniões', type: 'text', placeholder: 'Ex.: 5' },
        { id: 'mp_formato_visitas', label: 'Formato das visitas', type: 'select', options: ['', 'Presencial', 'Remoto', 'Híbrido'] },
        { id: 'mp_processos_identificados', label: 'Quantidade de processos identificados', type: 'text', placeholder: 'Ex.: 12' },
        { id: 'mp_levantados', label: 'Levantados', type: 'text', placeholder: 'Quantidade' },
        { id: 'mp_detalhados', label: 'Detalhados', type: 'text', placeholder: 'Quantidade' },
        { id: 'mp_modelados', label: 'Modelados', type: 'text', placeholder: 'Quantidade' },
        { id: 'mp_uso_bpmn', label: 'Uso de BPMN', type: 'select', options: ['', 'Sim', 'Não', 'Parcialmente'] },
        { id: 'mp_processos_mapeados', label: 'Processos mapeados', type: 'textarea', placeholder: 'Liste os processos' },
        { id: 'mp_estagio', label: 'Estágio do mapeamento', type: 'select', options: ['', 'Inicial', 'Em andamento', 'Avançado', 'Concluído'] },
        { id: 'mp_dificuldade', label: 'Dificuldade no levantamento', type: 'textarea', placeholder: 'Descreva' },
        { id: 'mp_setores_pendentes', label: 'Setores pendentes', type: 'textarea', placeholder: 'Liste os setores' },
        { id: 'mp_proxima_acao', label: 'Próxima ação', type: 'textarea', placeholder: 'Qual a próxima ação?' }
      ]);
      break;

    // ----- Mapeamento de unidades/usuários SEI -----
    case 'Mapeamento de unidades/usuários SEI':
      html = buildFields([
        { id: 'mu_onda', label: 'Onda', type: 'text', placeholder: 'Ex.: 2ª onda' },
        { id: 'mu_unidades_identificadas', label: 'Unidades identificadas', type: 'text', placeholder: 'Quantidade' },
        { id: 'mu_unidades_cadastradas', label: 'Unidades cadastradas', type: 'text', placeholder: 'Quantidade' },
        { id: 'mu_unidades_revisadas', label: 'Unidades revisadas', type: 'text', placeholder: 'Quantidade' },
        { id: 'mu_usuarios_levantados', label: 'Usuários levantados', type: 'text', placeholder: 'Quantidade' },
        { id: 'mu_usuarios_cadastrados', label: 'Usuários cadastrados', type: 'text', placeholder: 'Quantidade' },
        { id: 'mu_usuarios_atualizados', label: 'Usuários atualizados', type: 'text', placeholder: 'Quantidade' },
        { id: 'mu_usuarios_inativados', label: 'Usuários inativados', type: 'text', placeholder: 'Quantidade' },
        { id: 'mu_ajuste_perfis', label: 'Ajuste de perfis', type: 'textarea', placeholder: 'Descreva os ajustes' },
        { id: 'mu_correcao_cadastral', label: 'Correção cadastral', type: 'textarea', placeholder: 'Descreva' },
        { id: 'mu_ambiente', label: 'Ambiente', type: 'select', options: ['', 'Teste', 'Produção', 'Ambos'] },
        { id: 'mu_secretarias_contempladas', label: 'Secretarias contempladas', type: 'textarea', placeholder: 'Liste' },
        { id: 'mu_pendencias', label: 'Pendências', type: 'textarea', placeholder: 'Descreva' },
        { id: 'mu_proximo_passo', label: 'Próximo passo', type: 'textarea', placeholder: 'Qual o próximo passo?' }
      ]);
      break;

    // ----- Suporte ao usuário SEI -----
    case 'Suporte ao usuário SEI':
      html = buildFields([
        { id: 'su_atendimentos', label: 'Atendimentos realizados', type: 'text', placeholder: 'Quantidade' },
        { id: 'su_tipo_atendimento', label: 'Tipo principal de atendimento', type: 'select', options: ['', 'Dúvida operacional', 'Erro de sistema', 'Cadastro', 'Configuração', 'Treinamento', 'Outro'] },
        { id: 'su_canal', label: 'Canal de atendimento', type: 'select', options: ['', 'Presencial', 'WhatsApp', 'E-mail', 'Telefone', 'Remoto (videoconferência)', 'Outro'] },
        { id: 'su_cidade', label: 'Cidade atendida', type: 'text', placeholder: 'Cidade' },
        { id: 'su_secretaria', label: 'Secretaria/setor do usuário', type: 'text', placeholder: 'Secretaria ou setor' },
        { id: 'su_problema_resolvido', label: 'Problema resolvido?', type: 'select', options: ['', 'Sim', 'Não', 'Parcialmente'] },
        { id: 'su_tempo_medio', label: 'Tempo médio de atendimento', type: 'text', placeholder: 'Ex.: 30 min' },
        { id: 'su_encaminhamento', label: 'Encaminhamento para outro time?', type: 'select', options: ['', 'Sim', 'Não'] },
        { id: 'su_recorrencias', label: 'Recorrências', type: 'textarea', placeholder: 'Problemas recorrentes identificados' },
        { id: 'su_necessidade_capacitacao', label: 'Necessidade de capacitação?', type: 'select', options: ['', 'Sim', 'Não'] },
        { id: 'su_proximo_passo', label: 'Próximo passo', type: 'textarea', placeholder: 'Qual o próximo passo?' }
      ]);
      break;

    // ----- Implantação do SEI -----
    case 'Implantação do SEI':
      html = buildFields([
        { id: 'is_onda', label: 'Onda', type: 'text', placeholder: 'Ex.: 1ª onda' },
        { id: 'is_etapa', label: 'Etapa da implantação', type: 'select', options: ['', 'Planejamento', 'Preparação', 'Parametrização', 'Capacitação', 'Go-live', 'Pós-implantação'] },
        { id: 'is_secretarias', label: 'Secretarias envolvidas', type: 'textarea', placeholder: 'Liste as secretarias' },
        { id: 'is_reuniao_gestores', label: 'Reunião com gestores?', type: 'select', options: ['', 'Sim', 'Não'] },
        { id: 'is_capacitacao', label: 'Capacitação realizada?', type: 'select', options: ['', 'Sim', 'Não', 'Em planejamento'] },
        { id: 'is_num_servidores', label: 'Número de servidores capacitados', type: 'text', placeholder: 'Quantidade' },
        { id: 'is_parametrizacao', label: 'Parametrização', type: 'textarea', placeholder: 'Descreva as parametrizações realizadas' },
        { id: 'is_producao_materiais', label: 'Produção de materiais', type: 'textarea', placeholder: 'Materiais produzidos' },
        { id: 'is_situacao_atual', label: 'Situação atual', type: 'textarea', placeholder: 'Descreva a situação' },
        { id: 'is_entraves', label: 'Entraves', type: 'textarea', placeholder: 'Descreva os entraves' },
        { id: 'is_proximos_passos', label: 'Próximos passos', type: 'textarea', placeholder: 'Quais os próximos passos?' }
      ]);
      break;

    // ----- Implantação do E-Cidade -----
    case 'Implantação do E-Cidade':
      html = buildFields([
        { id: 'ec_modulo', label: 'Módulo trabalhado', type: 'text', placeholder: 'Ex.: Contabilidade, RH' },
        { id: 'ec_tipo_atividade', label: 'Tipo de atividade do módulo', type: 'select', options: ['', 'Levantamento', 'Parametrização', 'Treinamento', 'Suporte', 'Correção', 'Outro'] },
        { id: 'ec_setor', label: 'Setor/secretaria', type: 'text', placeholder: 'Setor atendido' },
        { id: 'ec_levantamento_dados', label: 'Levantamento de dados', type: 'textarea', placeholder: 'Descreva' },
        { id: 'ec_parametrizacao', label: 'Parametrização', type: 'textarea', placeholder: 'Descreva' },
        { id: 'ec_treinamento', label: 'Treinamento realizado?', type: 'select', options: ['', 'Sim', 'Não', 'Em planejamento'] },
        { id: 'ec_qtd_usuarios', label: 'Quantidade de usuários/servidores', type: 'text', placeholder: 'Quantidade' },
        { id: 'ec_dados_legados', label: 'Dificuldade com dados legados?', type: 'select', options: ['', 'Sim', 'Não'] },
        { id: 'ec_situacao_atual', label: 'Situação atual', type: 'textarea', placeholder: 'Descreva' },
        { id: 'ec_proximo_passo', label: 'Próximo passo', type: 'textarea', placeholder: 'Qual o próximo passo?' }
      ]);
      break;

    // ----- Desenvolvimento do sistema Conecta -----
    case 'Desenvolvimento do sistema Conecta':
      html = buildFields([
        { id: 'dc_modulo', label: 'Módulo trabalhado', type: 'text', placeholder: 'Ex.: Módulo de cadastro' },
        { id: 'dc_atividade_tecnica', label: 'Atividade técnica principal', type: 'select', options: ['', 'Frontend', 'Backend', 'Banco de dados', 'Integração', 'DevOps', 'Teste', 'Documentação', 'Outro'] },
        { id: 'dc_card_jira', label: 'Card/Jira/Trello', type: 'text', placeholder: 'Identificador da tarefa' },
        { id: 'dc_funcionalidade', label: 'Funcionalidade implementada', type: 'textarea', placeholder: 'Descreva a funcionalidade' },
        { id: 'dc_entrega_ambiente', label: 'Entrega em ambiente', type: 'select', options: ['', 'Desenvolvimento', 'Homologação', 'Produção', 'Nenhum'] },
        { id: 'dc_teste_usuario', label: 'Teste com usuário?', type: 'select', options: ['', 'Sim', 'Não', 'Pendente'] },
        { id: 'dc_bloqueio_tecnico', label: 'Bloqueio técnico', type: 'textarea', placeholder: 'Descreva, se houver' },
        { id: 'dc_link_pr', label: 'Link de PR/commit/repositório', type: 'text', placeholder: 'Cole o link' },
        { id: 'dc_proximo_passo', label: 'Próximo passo do módulo', type: 'textarea', placeholder: 'Qual o próximo passo?' }
      ]);
      break;

    // ----- Desenvolvimento do aplicativo Conecta Irecê -----
    case 'Desenvolvimento do aplicativo Conecta Irecê':
      html = buildFields([
        { id: 'ci_funcionalidade', label: 'Funcionalidade ou tela', type: 'text', placeholder: 'Ex.: Tela de login' },
        { id: 'ci_camada', label: 'Camada trabalhada', type: 'select', options: ['', 'UI/Frontend', 'Lógica/Backend', 'Banco de dados', 'API/Integração', 'Outra'] },
        { id: 'ci_atividade', label: 'Atividade realizada', type: 'textarea', placeholder: 'Descreva a atividade' },
        { id: 'ci_integracao', label: 'Integração com sistema existente?', type: 'select', options: ['', 'Sim', 'Não'] },
        { id: 'ci_impedimento', label: 'Impedimento técnico', type: 'textarea', placeholder: 'Descreva, se houver' },
        { id: 'ci_entrega', label: 'Entrega realizada', type: 'textarea', placeholder: 'O que foi entregue?' },
        { id: 'ci_proxima_funcionalidade', label: 'Próxima funcionalidade', type: 'textarea', placeholder: 'Qual a próxima funcionalidade?' }
      ]);
      break;

    // ----- DocDigital.IA -----
    case 'DocDigital.IA':
      html = buildFields([
        { id: 'dd_frente', label: 'Frente trabalhada', type: 'text', placeholder: 'Ex.: Classificação de documentos' },
        { id: 'dd_tipo_atividade', label: 'Tipo de atividade', type: 'select', options: ['', 'Desenvolvimento', 'Teste', 'Configuração', 'Pesquisa', 'Implantação', 'Outro'] },
        { id: 'dd_teste_docs', label: 'Teste com documentos reais?', type: 'select', options: ['', 'Sim', 'Não'] },
        { id: 'dd_qtd_docs', label: 'Quantidade de documentos/processos usados em teste', type: 'text', placeholder: 'Quantidade' },
        { id: 'dd_ajuste', label: 'Ajuste de leitura/classificação/busca', type: 'textarea', placeholder: 'Descreva os ajustes' },
        { id: 'dd_implantacao_municipio', label: 'Implantação/configuração em município', type: 'text', placeholder: 'Qual município?' },
        { id: 'dd_proximo_passo', label: 'Próximo passo', type: 'textarea', placeholder: 'Qual o próximo passo?' }
      ]);
      break;

    // ----- Plataforma PNAB -----
    case 'Plataforma PNAB':
      html = buildFields([
        { id: 'pn_frente', label: 'Frente trabalhada', type: 'text', placeholder: 'Ex.: Cadastro de editais' },
        { id: 'pn_tipo_atividade', label: 'Tipo de atividade', type: 'select', options: ['', 'Desenvolvimento', 'Teste', 'Validação', 'Configuração', 'Documentação', 'Outro'] },
        { id: 'pn_entrega_funcional', label: 'Entrega funcional', type: 'textarea', placeholder: 'Descreva a entrega' },
        { id: 'pn_validacao_secretaria', label: 'Validação com secretaria?', type: 'select', options: ['', 'Sim', 'Não', 'Pendente'] },
        { id: 'pn_ajuste_normativo', label: 'Ajuste normativo/edital', type: 'textarea', placeholder: 'Descreva, se aplicável' },
        { id: 'pn_proximo_passo', label: 'Próximo passo', type: 'textarea', placeholder: 'Qual o próximo passo?' }
      ]);
      break;

    // ----- Plataforma de Processos -----
    case 'Plataforma de Processos':
      html = buildFields([
        { id: 'pp_frente', label: 'Frente trabalhada', type: 'text', placeholder: 'Ex.: Modelagem de fluxo' },
        { id: 'pp_tipo_atividade', label: 'Tipo de atividade', type: 'select', options: ['', 'Desenvolvimento', 'Modelagem', 'Teste', 'Homologação', 'Configuração', 'Outro'] },
        { id: 'pp_processo_modelo', label: 'Processo/modelo trabalhado', type: 'text', placeholder: 'Qual processo?' },
        { id: 'pp_homologacao', label: 'Homologação?', type: 'select', options: ['', 'Sim', 'Não', 'Em andamento'] },
        { id: 'pp_reuniao_setor', label: 'Reunião com setor demandante?', type: 'select', options: ['', 'Sim', 'Não'] },
        { id: 'pp_proximo_passo', label: 'Próximo passo', type: 'textarea', placeholder: 'Qual o próximo passo?' }
      ]);
      break;

    default:
      html = '<p style="color:#999;">Selecione um time/projeto para ver os campos específicos.</p>';
  }

  return html;
}

/**
 * Constrói HTML de campos a partir de uma lista de definições.
 * Cada item: { id, label, type, placeholder?, options? }
 */
function buildFields(fieldDefs) {
  var html = '';
  for (var i = 0; i < fieldDefs.length; i++) {
    var f = fieldDefs[i];
    html += '<div class="field">';
    html += '<label for="' + f.id + '">' + f.label + '</label>';

    if (f.type === 'text') {
      html += '<input type="text" id="' + f.id + '" name="' + f.id + '" placeholder="' + (f.placeholder || '') + '">';
    } else if (f.type === 'textarea') {
      html += '<textarea id="' + f.id + '" name="' + f.id + '" rows="2" placeholder="' + (f.placeholder || '') + '"></textarea>';
    } else if (f.type === 'select' && f.options) {
      html += '<select id="' + f.id + '" name="' + f.id + '">';
      for (var j = 0; j < f.options.length; j++) {
        var val = f.options[j];
        html += '<option value="' + val + '">' + (val || 'Selecione') + '</option>';
      }
      html += '</select>';
    }

    html += '</div>';
  }
  return html;
}

// ==========================================
// Exibição condicional: campos de dificuldade
// ==========================================
function toggleDifficultyFields() {
  var val = document.getElementById('houve_dificuldade').value;
  var block = document.getElementById('difficulty-fields');
  if (val === 'Sim') {
    block.classList.remove('hidden');
  } else {
    block.classList.add('hidden');
    // Limpa campos de dificuldade
    document.getElementById('tipo_dificuldade').value = '';
    document.getElementById('descricao_dificuldade').value = '';
    document.getElementById('destravamento_necessario').value = '';
  }
}

// ==========================================
// Validação do formulário
// ==========================================
function validateForm() {
  var valid = true;
  var firstError = null;

  // Limpa erros anteriores
  var errorFields = document.querySelectorAll('.field.has-error');
  for (var i = 0; i < errorFields.length; i++) {
    errorFields[i].classList.remove('has-error');
    var errText = errorFields[i].querySelector('.error-text');
    if (errText) errText.textContent = '';
  }

  // Valida campos obrigatórios visíveis
  var required = document.querySelectorAll('#main-form [required]');
  for (var i = 0; i < required.length; i++) {
    var el = required[i];
    // Ignora campos ocultos
    if (el.offsetParent === null) continue;

    var value = el.value.trim();
    if (!value) {
      valid = false;
      var field = el.closest('.field');
      if (field) {
        field.classList.add('has-error');
        var errText = field.querySelector('.error-text');
        if (errText) errText.textContent = 'Este campo é obrigatório.';
      }
      if (!firstError) firstError = el;
    }
  }

  // Scrolla para o primeiro erro
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError.focus();
  }

  return valid;
}

// ==========================================
// Coleta de dados do formulário
// ==========================================
function collectFormData() {
  var data = {};

  // Coleta todos os inputs, selects e textareas do formulário
  var elements = document.querySelectorAll('#main-form input, #main-form select, #main-form textarea');
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    var name = el.name;
    if (!name) continue;

    // Ignora campos ocultos (exceto se tiverem valor)
    if (el.type === 'checkbox') {
      data[name] = el.checked ? 'Sim' : 'Não';
    } else {
      data[name] = el.value.trim();
    }
  }

  return data;
}

// ==========================================
// Envio do formulário
// ==========================================
function submitForm() {
  // Validação
  if (!validateForm()) return;

  // Coleta dados
  var formData = collectFormData();

  // Mostra loading
  showLoading();

  // Envia via fetch
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(function () {
    // Como usamos no-cors, a resposta é opaque.
    // Consideramos sucesso se não houve exceção no fetch.
    hideLoading();
    showSuccess();
    resetForm();
  })
  .catch(function (err) {
    hideLoading();
    showError('Erro ao enviar: ' + err.message + '. Verifique sua conexão e tente novamente.');
  });
}

// ==========================================
// Reset do formulário
// ==========================================
function resetForm() {
  document.getElementById('main-form').reset();

  // Oculta seção específica do time
  document.getElementById('team-specific-block').style.display = 'none';
  document.getElementById('team-specific-fields').innerHTML = '';

  // Oculta campos de dificuldade
  document.getElementById('difficulty-fields').classList.add('hidden');

  // Oculta campo "outro" do tipo de atividade
  document.getElementById('tipo_atividade_outro_wrapper').classList.add('hidden');

  // Limpa erros
  var errorFields = document.querySelectorAll('.field.has-error');
  for (var i = 0; i < errorFields.length; i++) {
    errorFields[i].classList.remove('has-error');
  }

  // Volta ao topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// UI helpers — loading, sucesso, erro
// ==========================================
function showLoading() {
  document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

function showSuccess() {
  document.getElementById('success-message').classList.remove('hidden');
}

function dismissSuccess() {
  document.getElementById('success-message').classList.add('hidden');
}

function showError(msg) {
  document.getElementById('error-detail').textContent = msg || 'Ocorreu um problema. Tente novamente.';
  document.getElementById('error-message').classList.remove('hidden');
}

function dismissError() {
  document.getElementById('error-message').classList.add('hidden');
}
