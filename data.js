// ═══════════════════════════════════════════════════════════════
// LUMIN AI · data.js
// Protocolos médicos e de crise — 100% offline
// ═══════════════════════════════════════════════════════════════

export const PROTOS = [
  {
    id:'rcp', icon:'💓', titulo:'RCP — Reanimação Cardiopulmonar', sub:'Paragem cardíaca / não respira',
    passos:[
      {t:'VERIFICA E CHAMA AJUDA', d:'Toca nos ombros, pergunta em voz alta. Não responde → liga 112 em viva-voz imediatamente.'},
      {t:'30 COMPRESSÕES', d:'Mãos sobrepostas no centro do peito. Comprime 5-6cm a 100-120x/min. Cotovelos direitos.'},
      {t:'2 INSUFLAÇÕES', d:'Inclina a cabeça, levanta o queixo, aperta o nariz. 2 sopros de 1 segundo. Vê o tórax subir.'},
      {t:'REPETE 30:2', d:'Ciclo contínuo sem parar até o socorro chegar ou a vítima recuperar sinais de vida.'},
    ],
    aviso:'Crianças: 2 dedos no centro do peito. Bebés: 2 polegares. Nunca interrompas mais de 10 segundos.'
  },
  {
    id:'hemor', icon:'🩸', titulo:'Hemorragia', sub:'Controlo de sangramento',
    passos:[
      {t:'PRESSÃO DIRETA', d:'Compressa ou pano limpo sobre a ferida. Prime com força contínua 10+ minutos.'},
      {t:'NÃO LEVANTAR O MATERIAL', d:'Se encharcar, adiciona mais por cima. Nunca retiras o primeiro.'},
      {t:'ELEVA O MEMBRO', d:'Mantém a ferida acima do nível do coração para reduzir o fluxo.'},
      {t:'TORNIQUETE', d:'Sangramento arterial grave (membro): 5-7cm acima da ferida. Anota a hora exata. Não soltes.'},
    ],
    aviso:'Suspeita de hemorragia interna (abdómen rígido/distendido): deita, pernas elevadas 30cm, 112 urgente.'
  },
  {
    id:'avc', icon:'🧠', titulo:'AVC — Acidente Vascular Cerebral', sub:'FACE · BRAÇO · FALA',
    passos:[
      {t:'TESTE F.A.C.E.', d:'Face assimétrica? Braço cai sozinho? Fala arrastada ou confusa? → 112 IMEDIATO.'},
      {t:'REGISTA A HORA', d:'A hora exata dos primeiros sintomas é essencial para o tratamento hospitalar.'},
      {t:'NÃO DÊS NADA', d:'Proibido dar comida, água ou medicamentos. Risco elevado de engasgamento.'},
      {t:'POSIÇÃO CORRETA', d:'Consciente: semi-deitado a 30°. Inconsciente mas a respirar: posição lateral de segurança.'},
    ],
    aviso:'1,9 milhões de neurónios morrem por minuto. Cada segundo conta. Liga 112 agora.'
  },
  {
    id:'enfarte', icon:'❤️‍🔥', titulo:'Enfarte do Miocárdio', sub:'Ataque cardíaco',
    passos:[
      {t:'RECONHECE OS SINAIS', d:'Dor em aperto no peito, irradia para braço esquerdo ou mandíbula. Suores frios, falta de ar, náusea.'},
      {t:'LIGA 112 IMEDIATAMENTE', d:'Não conduzas a vítima. Não esperas que "passe". Liga agora.'},
      {t:'POSIÇÃO', d:'Semi-sentado, costas apoiadas, joelhos ligeiramente dobrados. Desaperta roupa apertada.'},
      {t:'ASPIRINA', d:'300mg de ácido acetilsalicílico mastigado (não triturado) — apenas se adulto e sem alergia conhecida.'},
    ],
    aviso:'Nunca conduzas a vítima de carro. Espera a ambulância — o tratamento começa em trânsito.'
  },
  {
    id:'engasgo', icon:'😮', titulo:'Engasgamento', sub:'Obstrução da via aérea',
    passos:[
      {t:'IDENTIFICA', d:'Mãos ao pescoço, não consegue falar, respirar ou tossir eficazmente. Rosto fica cianosado.'},
      {t:'5 PANCADAS NAS COSTAS', d:'Inclina a vítima para a frente. 5 pancadas firmes com a palma entre as omoplatas.'},
      {t:'HEIMLICH — 5 COMPRESSÕES', d:'Fica atrás da vítima. Punho fechado entre umbigo e esterno. Puxa para dentro e para cima 5 vezes.'},
      {t:'ALTERNA E REPETE', d:'5 pancadas + 5 Heimlich até desobstruir ou até a vítima perder consciência → iniciar RCP.'},
    ],
    aviso:'Bebés <1 ano: NUNCA Heimlich. 5 pancadas nas costas + 5 compressões no esterno com 2 dedos.'
  },
  {
    id:'queimadura', icon:'🔥', titulo:'Queimadura', sub:'Calor · Química · Elétrica',
    passos:[
      {t:'ÁGUA FRIA CORRENTE', d:'20 minutos sob água fria (15-25°C). NUNCA gelo, manteiga, pasta de dentes ou óleos.'},
      {t:'REMOVE ROUPA E ACESSÓRIOS', d:'Com cuidado, a não ser que estejam colados à pele — nesse caso não puxas.'},
      {t:'COBRE A ÁREA', d:'Película aderente, saco de plástico limpo ou compressa não aderente. Nunca algodão.'},
      {t:'NÃO REBENTES BOLHAS', d:'As bolhas protegem contra infeção. Deixa intactas.'},
    ],
    aviso:'Queimadura na face, mãos, genitais, articulações ou >10% do corpo: 112 imediato.'
  },
  {
    id:'fratura', icon:'🦴', titulo:'Fratura — Osso Partido', sub:'Suspeita de fratura',
    passos:[
      {t:'NÃO MEXES NO MEMBRO', d:'Imobiliza exatamente na posição em que está. Não tentas endireitar.'},
      {t:'FAZ UMA TALA', d:'Usa uma tábua, revista ou pau. Imobiliza a articulação acima E abaixo da fratura.'},
      {t:'FRIO LOCAL', d:'Gelo embrulhado em pano, 20 minutos. Nunca gelo diretamente na pele.'},
      {t:'FRATURA ABERTA', d:'Osso visível: cobre com pano limpo húmido. Não toques no osso. 112 urgente.'},
    ],
    aviso:'Suspeita de fratura na coluna ou pescoço: NÃO mover a vítima de forma alguma. Liga 112 e aguarda.'
  },
  {
    id:'hipotermia', icon:'🥶', titulo:'Hipotermia', sub:'Temperatura corporal baixa',
    passos:[
      {t:'MOVE PARA LOCAL QUENTE', d:'Afasta do frio e do vento com cuidado. Movimentos lentos e suaves.'},
      {t:'ROUPA SECA', d:'Remove toda a roupa húmida. Substitui por cobertores secos, de preferência de alumínio (mylar).'},
      {t:'AQUECE O NÚCLEO PRIMEIRO', d:'Fontes de calor nas axilas, virilhas e pescoço. Não aqueces os pés/mãos primeiro.'},
      {t:'ISOLA DO CHÃO', d:'Nunca deitas no chão frio sem isolamento — perde calor rapidamente.'},
    ],
    aviso:'Hipotermia grave (inconsciente, pulso muito lento): trata como potencial paragem cardíaca. Liga 112.'
  },
  {
    id:'choque', icon:'⚡', titulo:'Estado de Choque', sub:'Falência circulatória',
    passos:[
      {t:'RECONHECE OS SINAIS', d:'Pele pálida, fria, suada. Pulso rápido e fraco. Confusão mental. Sede intensa.'},
      {t:'DEITA A VÍTIMA', d:'Horizontal. Nada a comer ou beber.'},
      {t:'PERNAS ELEVADAS 30CM', d:'Exceto se houver: fratura, lesão na coluna, dificuldade respiratória, ou choque cardíaco/alérgico.'},
      {t:'MANTÉM QUENTE', d:'Cobre com cobertor. Liga 112 imediatamente. Monitoriza a respiração.'},
    ],
    aviso:'Choque anafilático (reação alérgica grave): EpiPen se disponível. 112 urgente — mesmo após EpiPen.'
  },
  {
    id:'veneno', icon:'☠️', titulo:'Envenenamento / Intoxicação', sub:'Ingestão · Inalação · Contato',
    passos:[
      {t:'NÃO PROVOCAS VÓMITO', d:'Exceto se o Centro Antivenenos indicar explicitamente.'},
      {t:'LIGA O CENTRO ANTIVENENOS', d:'Portugal: 217 946 534 (24h). Informa produto, quantidade e hora da exposição.'},
      {t:'GUARDA A EMBALAGEM', d:'Tira foto ao rótulo. Leva a embalagem para o hospital.'},
      {t:'CONTATO COM PELE OU OLHOS', d:'Lava com água abundante 15-20 minutos. Remove roupa contaminada com luvas.'},
    ],
    aviso:'Nunca dás leite, sal, azeite ou "antídotos" caseiros sem indicação médica. Podem agravar o estado.'
  },
];

export const CRISES = [
  {
    icon:'🛡️', titulo:'Ataque Armado / Segurança',
    passos:[
      {t:'FUGIR', d:'Abandona tudo. Corre em ziguezague. Afasta-te do perigo sem hesitar.'},
      {t:'ESCONDER', d:'Local sólido, porta trancada e barricada, silêncio total. Desliga o telemóvel.'},
      {t:'EXPLOSÃO', d:'Deita no chão imediatamente. Cobre a cabeça. Boca aberta para equalizar pressão.'},
    ]
  },
  {
    icon:'🌍', titulo:'Sismo / Terramoto',
    passos:[
      {t:'DURANTE', d:'Debaixo de mesa resistente ou vão de porta interior. Cobre a nuca com os braços.'},
      {t:'AFASTA DE VIDROS', d:'Janelas, espelhos e estantes são perigosos. Fica longe das paredes externas.'},
      {t:'APÓS', d:'Sai com calma. Verifica fugas de gás (cheiro). Afasta-te de edifícios. Aguarda réplicas.'},
    ]
  },
  {
    icon:'🔥', titulo:'Incêndio Florestal',
    passos:[
      {t:'EVACUA IMEDIATAMENTE', d:'Segue as instruções das autoridades. Não esperas a última hora.'},
      {t:'DIREÇÃO DE FUGA', d:'Perpendicular ao avanço do fogo. Nunca no sentido do vento.'},
      {t:'FUMO', d:'Pano húmido no nariz e boca. Mantém-te baixo onde o ar é mais limpo.'},
    ]
  },
  {
    icon:'🌊', titulo:'Inundação / Cheias',
    passos:[
      {t:'SOBE IMEDIATAMENTE', d:'Vai para o andar superior. NUNCA para a cave ou garagem.'},
      {t:'NÃO ATRAVESSES ÁGUA', d:'30cm de água em movimento derruba um adulto. 60cm levanta um carro.'},
      {t:'ELETRICIDADE', d:'Desliga o quadro geral se conseguires sem te mojares.'},
    ]
  },
];

export const KIT_ITENS = [
  {
    cat:'💧 Água & Alimentação',
    itens:['Água: 3L/pessoa/dia (mínimo 3 dias)','Alimentos não perecíveis (3 dias)','Abridor de latas manual','Talheres e copos descartáveis']
  },
  {
    cat:'🩺 Primeiros Socorros',
    itens:['Kit de primeiros socorros completo','Medicação habitual (7 dias)','Aspirina 300mg','Torniquete CAT ou similar','Luvas de látex (2 pares)','Cobertor de emergência (mylar)']
  },
  {
    cat:'📱 Comunicação',
    itens:['Rádio a pilhas ou manivela','Powerbank (10.000mAh+) carregado','Lista de contactos impressa','Apito de sinalização']
  },
  {
    cat:'💡 Iluminação & Energia',
    itens:['Lanterna LED com pilhas extra','Velas + isqueiro + fósforos impermeáveis','Bateria portátil solar']
  },
  {
    cat:'📄 Documentos & Dinheiro',
    itens:['Cópia do CC / Passaporte','Cartão de saúde SNS','Dinheiro em notas pequenas','Seguro de saúde e apólices']
  },
  {
    cat:'🏠 Abrigo & Higiene',
    itens:['Saco-cama ou sleeping bag','Tenda ou lona impermeável','Máscaras FFP2 (4+)','Gel desinfetante e sabão','Papel higiénico e sacos de lixo']
  },
];
