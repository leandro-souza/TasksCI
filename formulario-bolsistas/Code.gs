/**
 * ================================================
 * Google Apps Script — Backend do Formulário
 * Projeto Cidades Inteligentes — Municípios
 * ================================================
 *
 * Este script recebe dados via POST do formulário web
 * e insere uma nova linha na planilha Google Sheets.
 *
 * INSTRUÇÕES:
 * 1. Crie uma planilha no Google Sheets
 * 2. Crie uma aba chamada "respostas_bolsistas"
 * 3. Cole os cabeçalhos na primeira linha (veja a lista abaixo)
 * 4. Substitua SPREADSHEET_ID pelo ID real da sua planilha
 * 5. Publique como Web App (Implantação > Nova implantação > App da Web)
 *    - Execute como: "Eu"
 *    - Quem pode acessar: "Qualquer pessoa"
 * 6. Copie a URL gerada e cole no script.js (variável APPS_SCRIPT_URL)
 */

// ==========================================
// CONFIGURAÇÃO — Substitua pelo ID da sua planilha
// ==========================================
var SPREADSHEET_ID = 'COLE_AQUI_O_ID_DA_SUA_PLANILHA';
var SHEET_NAME = 'respostas_bolsistas';

/**
 * Lista completa de cabeçalhos da planilha.
 * Cole esta lista na linha 1 da aba "respostas_bolsistas".
 */
var HEADERS = [
  'timestamp',
  'nome_completo',
  'mes_referencia',
  'ano_referencia',
  'coordenador_tecnico',
  'municipio_vinculo',
  'atuou_mais_municipio',
  'atuou_mais_time',
  'municipio_atividade',
  'time_projeto',
  'frente_solucao',
  'titulo_atividade',
  'descricao_atividade',
  'data_periodo',
  'carga_horaria',
  'tipo_atividade',
  'tipo_atividade_outro',
  'forma_execucao',
  'ferramentas',
  'secretaria_setor_unidade',
  'meta_mes',
  // Mapeamento de processos
  'mp_onda',
  'mp_secretarias_visitadas',
  'mp_qtd_visitas',
  'mp_formato_visitas',
  'mp_processos_identificados',
  'mp_levantados',
  'mp_detalhados',
  'mp_modelados',
  'mp_uso_bpmn',
  'mp_processos_mapeados',
  'mp_estagio',
  'mp_dificuldade',
  'mp_setores_pendentes',
  'mp_proxima_acao',
  // Mapeamento de unidades/usuários SEI
  'mu_onda',
  'mu_unidades_identificadas',
  'mu_unidades_cadastradas',
  'mu_unidades_revisadas',
  'mu_usuarios_levantados',
  'mu_usuarios_cadastrados',
  'mu_usuarios_atualizados',
  'mu_usuarios_inativados',
  'mu_ajuste_perfis',
  'mu_correcao_cadastral',
  'mu_ambiente',
  'mu_secretarias_contempladas',
  'mu_pendencias',
  'mu_proximo_passo',
  // Suporte ao usuário SEI
  'su_atendimentos',
  'su_tipo_atendimento',
  'su_canal',
  'su_cidade',
  'su_secretaria',
  'su_problema_resolvido',
  'su_tempo_medio',
  'su_encaminhamento',
  'su_recorrencias',
  'su_necessidade_capacitacao',
  'su_proximo_passo',
  // Implantação do SEI
  'is_onda',
  'is_etapa',
  'is_secretarias',
  'is_reuniao_gestores',
  'is_capacitacao',
  'is_num_servidores',
  'is_parametrizacao',
  'is_producao_materiais',
  'is_situacao_atual',
  'is_entraves',
  'is_proximos_passos',
  // Implantação do E-Cidade
  'ec_modulo',
  'ec_tipo_atividade',
  'ec_setor',
  'ec_levantamento_dados',
  'ec_parametrizacao',
  'ec_treinamento',
  'ec_qtd_usuarios',
  'ec_dados_legados',
  'ec_situacao_atual',
  'ec_proximo_passo',
  // Desenvolvimento do sistema Conecta
  'dc_modulo',
  'dc_atividade_tecnica',
  'dc_card_jira',
  'dc_funcionalidade',
  'dc_entrega_ambiente',
  'dc_teste_usuario',
  'dc_bloqueio_tecnico',
  'dc_link_pr',
  'dc_proximo_passo',
  // Desenvolvimento do aplicativo Conecta Irecê
  'ci_funcionalidade',
  'ci_camada',
  'ci_atividade',
  'ci_integracao',
  'ci_impedimento',
  'ci_entrega',
  'ci_proxima_funcionalidade',
  // DocDigital.IA
  'dd_frente',
  'dd_tipo_atividade',
  'dd_teste_docs',
  'dd_qtd_docs',
  'dd_ajuste',
  'dd_implantacao_municipio',
  'dd_proximo_passo',
  // Plataforma PNAB
  'pn_frente',
  'pn_tipo_atividade',
  'pn_entrega_funcional',
  'pn_validacao_secretaria',
  'pn_ajuste_normativo',
  'pn_proximo_passo',
  // Plataforma de Processos
  'pp_frente',
  'pp_tipo_atividade',
  'pp_processo_modelo',
  'pp_homologacao',
  'pp_reuniao_setor',
  'pp_proximo_passo',
  // Bloco final comum
  'status_atividade',
  'entrega_gerada',
  'resultados_concretos',
  'produtos_gerados',
  'impacto_principal',
  'indicadores_quantitativos',
  'tipo_evidencia',
  'link_evidencia',
  'meta_relacionada',
  'situacao_meta',
  'contribuicao_meta',
  'houve_dificuldade',
  'tipo_dificuldade',
  'descricao_dificuldade',
  'destravamento_necessario',
  // Próximos passos
  'proximo_passo',
  'semana_proximo_mes',
  'objetivo_proximo_passo',
  'produto_esperado',
  'status_proximo_ciclo',
  // Síntese mensal
  'tres_principais_entregas',
  'atividade_mais_relevante',
  'resumo_contribuicoes'
];

/**
 * Trata requisições POST vindas do formulário web.
 */
function doPost(e) {
  try {
    // Lê o payload JSON
    var payload = JSON.parse(e.postData.contents);

    // Validação básica: nome é obrigatório
    if (!payload.nome_completo || payload.nome_completo.trim() === '') {
      return buildResponse(400, 'Campo nome_completo é obrigatório.');
    }

    // Abre a planilha e a aba
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return buildResponse(500, 'Aba "' + SHEET_NAME + '" não encontrada na planilha.');
    }

    // Monta a linha de dados na ordem dos cabeçalhos
    var row = [];
    for (var i = 0; i < HEADERS.length; i++) {
      var key = HEADERS[i];
      if (key === 'timestamp') {
        // Timestamp automático
        row.push(new Date().toLocaleString('pt-BR', { timeZone: 'America/Bahia' }));
      } else {
        row.push(payload[key] || '');
      }
    }

    // Insere a nova linha na planilha
    sheet.appendRow(row);

    return buildResponse(200, 'Dados registrados com sucesso.');

  } catch (err) {
    return buildResponse(500, 'Erro interno: ' + err.message);
  }
}

/**
 * Trata requisições GET (para teste — acessar a URL no navegador).
 */
function doGet(e) {
  return buildResponse(200, 'O Web App está funcionando. Envie dados via POST.');
}

/**
 * Monta a resposta JSON padronizada.
 */
function buildResponse(status, message) {
  var output = JSON.stringify({ status: status, message: message });
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função auxiliar para criar a aba com cabeçalhos automaticamente.
 * Execute manualmente uma vez para configurar a planilha.
 *
 * Como usar:
 * 1. Abra o editor do Apps Script
 * 2. Selecione esta função no menu de execução
 * 3. Clique em "Executar"
 */
function setupSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  // Cria a aba se não existir
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Insere os cabeçalhos na primeira linha
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  // Congela a primeira linha
  sheet.setFrozenRows(1);

  // Formata cabeçalho
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a5276');
  headerRange.setFontColor('#ffffff');

  Logger.log('Aba "' + SHEET_NAME + '" configurada com ' + HEADERS.length + ' colunas.');
}
