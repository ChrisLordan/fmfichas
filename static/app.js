const app = {
    selectionMode: false,
    selectedChars: new Set(),
    characters: [],
    activeIdx: null,
    deleteCharIdx: null,
    pixListeners: {},
    userUid: null,
    userNome: null,
    loggedIn: false,
    skillsRef: [
        { n: "Acrobacia", a: "DEX" }, { n: "Atletismo", a: "FOR" }, { n: "Furtividade", a: "DEX" }, { n: "Prestidigitação", a: "DEX" },
        { n: "Feitiçaria", a: "INT" }, { n: "História", a: "INT" }, { n: "Investigação", a: "INT" },
        { n: "Ofício", a: "INT" }, { n: "Tecnologia", a: "INT" }, { n: "Teologia", a: "SAB" },
        { n: "Direção", a: "SAB" }, { n: "Intuição", a: "SAB" }, { n: "Medicina", a: "SAB" },
        { n: "Ocultismo", a: "SAB" }, { n: "Percepção", a: "SAB" }, { n: "Sobrevivência", a: "SAB" },
        { n: "Enganação", a: "PRE" }, { n: "Intimidação", a: "PRE" }, { n: "Performance", a: "PRE" },
        { n: "Persuasão", a: "PRE" }
    ],
    aptitudesRef: [
        { id: "apt-au", n: "Aura", desc: "Conhecimento e compreensão sobre a própria energia amaldiçoada, refinando a aura." },
        { id: "apt-cl", n: "Controle e Leitura", desc: "Capacidade de liberar energia e ler fluxos e auras diferentes." },
        { id: "apt-bar", n: "Barreira", desc: "Proficiência no uso de técnicas de barreira, criando barreiras resistentes." },
        { id: "apt-dom", n: "Domínio", desc: "Domínio de técnicas que envolvem domínio, incluindo expansão de domínio." },
        { id: "apt-er", n: "Energia Reversa", desc: "Proficiência no uso da energia reversa para curar e regenerar o corpo." }
    ],

    habilidadesRef: {
        "Lutador": [
            { n: "Aparar Ataque", lvl: 2, desc: "Você rebate um ataque com outro ataque. Quando for alvo de um ataque corpo a corpo, pode gastar 1 PE e sua reação para realizar uma jogada de ataque contra o atacante.", efeitos: [] },
            { n: "Aparar Projéteis", lvl: 2, desc: "Você consegue tentar aparar projéteis. Quando receber um ataque à distância, pode gastar 1 PE e sua reação para reduzir o dano em 2d6 + modificador de atributo-chave + bônus de treinamento.", efeitos: [] },
            { n: "Ataque Inconsequente", lvl: 2, desc: "Uma vez por rodada, ao realizar um ataque, pode receber vantagem na jogada de ataque e +5 na rolagem de dano, mas fica Desprevenido por 1 rodada.", efeitos: [] },
            { n: "Caminho da Mão Vazia", lvl: 2, desc: "Todo ataque desarmado causa dano adicional igual ao seu bônus de treinamento e você soma metade do bônus em jogadas de ataque desarmados.", efeitos: [{ tipo: "dano", valor: "BT", cond: "ataque-desarmado" }, { tipo: "ataque", valor: "floor(BT/2)", cond: "ataque-desarmado" }] },
            { n: "Complementação Marcial", lvl: 2, desc: "Enquanto estiver desarmado ou empunhando uma arma marcial, recebe +2 em testes para Desarmar, Derrubar ou Empurrar.", efeitos: [] },
            { n: "Deboche Desconcertante", lvl: 2, desc: "Como Ação Bônus, escolha uma criatura e realize um teste de Intimidação contra Vontade dela. Em caso de sucesso, ela recebe uma penalidade igual ao seu bônus de treinamento.", efeitos: [] },
            { n: "Dedicação em Arma", lvl: 2, desc: "Escolha três armas para serem suas Armas Dedicadas. Enquanto empunhar uma Arma Dedicada, o dano dela aumenta em 1 nível.", efeitos: [{ tipo: "dano-nivel", valor: "1", cond: "arma-dedicada" }] },
            { n: "Esquiva Rápida", lvl: 2, desc: "Como Ação Bônus, realize um teste de Acrobacia contra a Atenção de um inimigo dentro do seu alcance corpo a corpo.", efeitos: [] },
            { n: "Finta Melhorada", lvl: 2, desc: "Você pode opting por utilizar Destreza ao invés de Presença em testes de Enganação para fintar. Acerto em alvo desprevenido causa um dado de dano adicional.", efeitos: [] },
            { n: "Quebrando Tudo", lvl: 2, desc: "Como parte de um ataque, pode agarrar um objeto pequeno ou menor adjacente. Objetos usados como arma improvisada recebem +1d no dano.", efeitos: [] },
            { n: "Resistir", lvl: 2, desc: "Quando realizar um teste de resistência de Fortitude ou Reflexos, pode gastar até 2PE para receber +2 para cada PE gasto.", efeitos: [] },
            { n: "Impacto Misto", lvl: 2, desc: "Quando acertar uma criatura com um ataque com arma marcial, recebe +2 em jogadas de ataque e dano desarmados até o começo do seu próximo turno.", efeitos: [] },
            { n: "Kiai Intimidador", lvl: 2, desc: "Uma vez por rodada, quando conseguir um crítico em um ataque corpo a corpo, pode realizar um teste de Intimidação contra Vontade do alvo.", efeitos: [] },
            { n: "Mãos Amaldiçoadas", lvl: 2, desc: "Quando utilizar um Feitiço ofensivo com alcance de Toque, pode substituir a jogada de ataque de técnica por uma jogada de ataque corpo a corpo.", efeitos: [] },
            { n: "Puxar um Ar", lvl: 2, desc: "Como Ação Bônus, realize uma rolagem do seu dano desarmado e se curar nesse valor. Pode ser usado uma quantidade de vezes igual ao seu bônus de treinamento.", efeitos: [] },
            { n: "Ação Ágil", lvl: 4, desc: "Uma vez por rodada, pode gastar 2PE para receber uma Ação Ágil, utilizada para Andar, Desengajar ou Esconder.", efeitos: [] },
            { n: "Acrobata", lvl: 4, desc: "Você passa a utilizar Destreza como atributo para calcular sua distância de pulo, e pode utilizar Acrobacia no lugar de Atletismo.", efeitos: [] },
            { n: "Atacar e Recuar", lvl: 4, desc: "Uma vez por turno, quando acertar uma criatura com um ataque, pode gastar 1 PE para se mover até 4,5 metros para longe.", efeitos: [] },
            { n: "Brutalidade", lvl: 4, desc: "Como Ação Livre, pode gastar 2PE para adentrar no estado de Brutalidade: recebe +2 em jogadas de ataque e dano.", efeitos: [] },
            { n: "Defesa Marcial", lvl: 4, desc: "Enquanto estiver desarmado ou empunhando uma arma marcial, soma 1 + metade do seu Bônus de Treinamento à sua Defesa.", efeitos: [{ tipo: "defesa", valor: "1+floor(BT/2)", cond: "arma-ou-desarmado" }] },
            { n: "Devolver Projéteis", lvl: 4, desc: "O dado de Aparar Projéteis se torna 3d10 e soma também o seu Nível de Lutador. Pode devolver o projétil em caso de dano nulo.", efeitos: [] },
            { n: "Fluxo", lvl: 4, desc: "A cada nível de empolgação que você subir, recebe +1 em rolagens de dano e 4 PV temporários para cada nível acima do primeiro.", efeitos: [] },
            { n: "Fúria da Vingança", lvl: 4, desc: "Ao ver um aliado chegar a 0 PV, recebe +4 de dano adicional, +2 em Defesa e +2 em TRs de Fortitude e Vontade contra o inimigo.", efeitos: [] },
            { n: "Imprudência Motivadora", lvl: 4, desc: "Ao iniciar uma cena de combate, pode escolher lutar com uma restrição. Se vencer o combate, recupera uma quantidade de PE igual ao seu nível.", efeitos: [] },
            { n: "Sobrevivente", lvl: 4, desc: "Enquanto estiver com menos da metade dos seus PV máximos, sempre que começar seu turno, recupera 1d6 + seu modificador de Constituição em PV.", efeitos: [] },
            { n: "Voadora", lvl: 4, desc: "Quando realizar uma Investida estando desarmado, pode gastar 3PE para realizar uma Voadora causando 1d8 de dano adicional para cada 3 metros.", efeitos: [] },
            { n: "Músculos Desenvolvidos", lvl: 4, desc: "Pode opting por somar seu Modificador de Força ao invés de Destreza em sua Defesa.", efeitos: [] },
            { n: "Redirecionar Força", lvl: 4, desc: "Quando um inimigo errar um ataque corpo a corpo contra você, pode gastar 2PE e sua reação para tentar redirecionar o ataque.", efeitos: [] },
            { n: "Segura pra Mim", lvl: 4, desc: "Uma criatura agarrada pode ser utilizada como escudo. Pode gastar 3 PE para tentar colocar a criatura na frente.", efeitos: [] },
            { n: "Aprimoramento Marcial", lvl: 6, desc: "Você passa a somar metade do seu Bônus de Treinamento em sua CD de Especialização.", efeitos: [{ tipo: "cd", valor: "floor(BT/2)" }] },
            { n: "Ataque Extra", lvl: 6, desc: "Ao realizar a ação Atacar, pode gastar 2 PE para atacar duas vezes ao invés de uma.", efeitos: [] },
            { n: "Brutalidade Sanguinária", lvl: 6, desc: "Enquanto no estado de Brutalidade, sempre que tiver um crítico ou reduzir vida de uma criatura a 0, aumenta o nível de dano dos seus ataques em 1.", efeitos: [] },
            { n: "Corpo Calejado", lvl: 6, desc: "Você passa a adicionar metade do seu Modificador de Constituição na sua Defesa e recebe PV adicionais igual ao seu nível de Lutador.", efeitos: [{ tipo: "defesa", valor: "floor(CON/2)" }, { tipo: "pv-bonus", valor: "nivel-lutador" }] },
            { n: "Eliminar e Continuar", lvl: 6, desc: "Sempre que um inimigo ao qual você causou dano cair ou morrer dentro de 9 metros, recebe 2d6 + nível de personagem + modificador de atributo em PV temporários.", efeitos: [] },
            { n: "Golpe da Mão Aberta", lvl: 6, desc: "Como ação comum, pode gastar 4 PE para realizar um golpe de mão aberta. Em caso de acerto, o alvo deve fazer TR de Fortitude ou fica Desorientado, Enjoado e Exposto.", efeitos: [] },
            { n: "Ignorar Dor", lvl: 6, desc: "Você recebe redução de danos contra todos os tipos, menos alma, igual ao seu nível de empolgação atual. Contra danos físicos, a redução é dobrada.", efeitos: [] }
        ],
        "Especialista em Combate": [
            { n: "Estilo de Combate", lvl: 1, desc: "Escolha um estilo de combate: Arma Longa, Arco, Espadas, ou Mãos Levadas. Você recebe bônus específicos do estilo escolhido.", efeitos: [] },
            { n: "Arsenal do Guerreiro", lvl: 1, desc: "Você recebe proficiência com todas as armas e pode escolher três armas para serem suas Especializadas.", efeitos: [] },
            { n: "Tiro Certo", lvl: 2, desc: "Uma vez por rodada, pode gastar 1 PE para receber +3 na rolagem de ataque com armas à distância.", efeitos: [] },
            { n: "Disparada", lvl: 2, desc: "Como uma Ação de Movimento, pode se mover até seu deslocamento e fazer um ataque à distância durante o movimento.", efeitos: [] },
            { n: "Mira Aprimorada", lvl: 2, desc: "Como uma ação completa, pode gastar 2 PE para mirar em um alvo por uma rodada. Seu próximo ataque contra ele tem +5.", efeitos: [] },
            { n: "Recarga Rápida", lvl: 2, desc: "Você pode recarregar armas como uma ação livre uma vez por rodada.", efeitos: [] },
            { n: "Flecha Explosiva", lvl: 4, desc: "Gaste 2 PE para adicionar 1d6 de dano de área ao seu próximo ataque à distância.", efeitos: [] },
            { n: "Tiro Múltiplo", lvl: 4, desc: "Gaste 3 PE para fazer um ataque à distância contra até 3 alvos diferentes.", efeitos: [] },
            { n: "Contra-ataque", lvl: 4, desc: "Quando um inimigo errar um ataque contra você, pode fazer um ataque à distância contra ele como reação.", efeitos: [] },
            { n: "Flecha Perfurante", lvl: 6, desc: "Gaste 4 PE para que sua flecha perfure até 3 inimigos em linha.", efeitos: [] }
        ],
        "Especialista em Técnica": [
            { n: "Domínio dos Fundamentos", lvl: 1, desc: "Você aprende duas Mudanças de Fundamento (Feitiço Cruel, Distante, Duplicado, Expansivo, Potente, Preciso ou Rápido).", efeitos: [] },
            { n: "Conjuração Aprimorada", lvl: 1, desc: "Sempre que utilizar um Feitiço que cause dano, soma um bônus ao total baseado no nível do Feitiço.", efeitos: [{ tipo: "dano", valor: "nivel-feitico", cond: "feitiço-dano" }] },
            { n: "Adiantar a Evolução", lvl: 4, desc: "Você recebe acesso a Feitiços de nível superior mais cedo: nível 2 no nível 4, nível 3 no nível 7, nível 4 no nível 11, nível 5 no nível 15.", efeitos: [] },
            { n: "Foco Amaldiçoado", lvl: 10, desc: "Escolha entre Destruição (dano +1 por dado), Economia (custo -2) ou Refino (Aptidão adicional).", efeitos: [] }
        ],
        "Controlador": [
            { n: "Invocação Primordial", lvl: 1, desc: "Você pode invocar uma invocação que o auxilia. A invocação tem seu próprio atributos e habilidades.", efeitos: [] },
            { n: "Conexão Espiritual", lvl: 1, desc: "Você possui uma conexão profunda com sua invocação, compartilhando parte de suas capacidades.", efeitos: [] },
            { n: "Comando de Invocação", lvl: 2, desc: "Sua invocação recebe +2 em testes e pode realizar uma ação adicional por turno.", efeitos: [] },
            { n: "Invocação Expandida", lvl: 4, desc: "Você pode manter mais invocações ativas simultaneamente.", efeitos: [] }
        ],
        "Suporte": [
            { n: "Toque Curativo", lvl: 1, desc: "Como uma ação completa, pode gastar 2 PE para curar 1d8 + modificador de Sabedoria em PV de um aliado.", efeitos: [] },
            { n: "Presença Reconfortante", lvl: 1, desc: "Aliados dentro de 9 metros recebem +2 em testes de resistência contra efeitos de medo.", efeitos: [] },
            { n: "Benção Protetora", lvl: 2, desc: "Gaste 3 PE para conceder +2 em Defesa a um aliado por uma rodada.", efeitos: [] },
            { n: "Restaurar Energia", lvl: 4, desc: "Pode restaurar PE a aliados, transferindo sua energia.", efeitos: [] }
        ],
        "Restringido": [
            { n: "Punhos de Aço", lvl: 1, desc: "Seus ataques desarmados causam 1d8 de dano e você pode usar Força em todos os ataques.", efeitos: [] },
            { n: "Resistência do Voto", lvl: 1, desc: "Você recebe redução de dano igual à sua Restrição e é imune a efeitos que manipulem suas emoções.", efeitos: [] },
            { n: "Foco Absoluto", lvl: 2, desc: "Sua Restrição fornece bônus adicionais em situações específicas.", efeitos: [] },
            { n: "Corpo de Ferro", lvl: 4, desc: "Sua resistência física aumenta significativamente, recebendo +2 em Fortitude e PV adicionais.", efeitos: [] }
        ]
    },

    feiticosRef: [
        { n: "Chicotada", lvl: 0, desc: "Costela amaldiçoada surge do seu corpo atingindo um alvo within 4.5m. Ataque: d20 + INT + BT. Dano: d4 + INT.", tipo: "Dano", dano: "d4", attr: "INT", alcance: "4.5m", efectos: [] },
        { n: "Palma Flamejante", lvl: 0, desc: "Suas mãos liberam chamas. Dano: d6 + INT. Pode incendiar objetos.", tipo: "Dano", dano: "d6", attr: "INT", alcance: "Toque", tipoDano: "Fogo", efectos: [] },
        { n: "Toque Gélido", lvl: 0, desc: "Toque congelante causa d6 + INT de dano de Frio.", tipo: "Dano", dano: "d6", attr: "INT", alcance: "Toque", tipoDano: "Frio", efectos: [] },
        { n: "Raios", lvl: 0, desc: "Dois raiosSaltam de você para dois alvos. Cada um causa d4 + INT.", tipo: "Dano", dano: "d4", attr: "INT", alcance: "18m", tipoDano: "Energy", efectos: [] },
        { n: "Visão no Escuro", lvl: 0, desc: "Você pode ver no escuro por 1 hora.", tipo: "Buff", efectos: [] },
        { n: "Mãos Ilusórias", lvl: 0, desc: "Cria mãos espectrais que podem manipular objetos.", tipo: "Utilidade", efectos: [] },
        { n: "Bola de Fogo", lvl: 1, desc: "Cria uma bola de fogo que explode. Área: 4.5m. Dano: 3d6 + INT. TR: Reflexos Reduce pela metade.", tipo: "Dano", dano: "3d6", attr: "INT", alcance: "45m", area: "4.5m", tipoDano: "Fogo", tr: "Reflexos", efectos: [] },
        { n: "Escudo de Fogo", lvl: 1, desc: "Cria uma barreira flamejante. Inimigos que atacarem corpo a corpo recebem d6 + INT de dano.", tipo: "Defesa", dano: "d6", attr: "INT", alcance: "Pessoal", tipoDano: "Fogo", efectos: [] },
        { n: "Seta Urlhante", lvl: 1, desc: "Dispara setas de energia. Ataque: d20 + INT + BT. Dano: 2d4 + INT.", tipo: "Dano", dano: "2d4", attr: "INT", alcance: "27m", tipoDano: "Energy", efectos: [] },
        { n: "Arma Encantada", lvl: 1, desc: "Arma recebe +1d4 de dano por 1 minuto.", tipo: "Buff", efeitos: [{ tipo: "dano", valor: "1d4", cond: "arma-equip" }] },
        { n: "Passo Etérico", lvl: 1, desc: "Pode se mover através de objetos sólidos por 1 rodada.", tipo: "Mobilidade", efectos: [] },
        { n: "Névoa Obscurecente", lvl: 1, desc: "Cria uma névoa em área de 6m. Inimigos dentro têm desvantagem em ataques.", tipo: "Controle", area: "6m", efectos: [] },
        { n: "Raio Congelante", lvl: 1, desc: "Dispara um raio de frio. Dano: 2d8 + INT. Alvo fica Lentificado por 1 rodada.", tipo: "Dano", dano: "2d8", attr: "INT", alcance: "18m", tipoDano: "Frio", efeito: "Lentificado", duracao: "1 rodada", efectos: [] },
        { n: "Toque do Vampiro", lvl: 1, desc: "Toque drena vida. Dano: 1d6 + INT. Cura metade do dano causado.", tipo: "Dano", dano: "d6", attr: "INT", alcance: "Toque", tipoDano: "Necrotic", cura: true, efectos: [] },
        { n: "Lâmina de Vento", lvl: 2, desc: "Cortantes de ar. Ataque: d20 + INT + BT. Dano: 2d8 + INT. Pode atingir múltiplos alvos.", tipo: "Dano", dano: "2d8", attr: "INT", alcance: "18m", tipoDano: "Slash", multAlvo: true, efectos: [] },
        { n: "Agarrão Espiritual", lvl: 2, desc: "Cria tentáculos de energia que agarram o alvo. Dano: 2d6 + INT e limita movimento.", tipo: "Controle", dano: "2d6", attr: "INT", alcance: "9m", tipoDano: "Force", effetc: "Imobilizado", tr: "Fortitude", efectos: [] },
        { n: "Tempestade de Gelo", lvl: 2, desc: "Tempestade de gelo e granizo. Área: 6m. Dano: 3d8 + INT. TR: Reflexos.", tipo: "Dano", dano: "3d8", attr: "INT", alcance: "45m", area: "6m", tipoDano: "Frio", tr: "Reflexos", efectos: [] },
        { n: "Invisibilidade", lvl: 2, desc: "Você fica invisível por 10 minutos ou até atacar.", tipo: "Buff", duracao: "10 min", efectos: [] },
        { n: "Fogo do Dragão", lvl: 3, desc: "Cone de fogo. Área: 9m. Dano: 4d8 + INT. TR: Reflexos Reduce pela metade.", tipo: "Dano", dano: "4d8", attr: "INT", alcance: "Pessoal", area: "9m cone", tipoDano: "Fogo", tr: "Reflexos", efectos: [] },
        { n: "Muro de Gelo", lvl: 3, desc: "Cria um muro de gelo com 18m de comprimento e 3m de altura. CD: 20 para atravessar.", tipo: "Controle", area: "18m x 3m", cd: 20, efeitos: [] },
        { n: "Invocar Instrumento", lvl: 0, desc: "Invoca um instrumento musical que辅助 em testes de Artes.", tipo: "Utilidade", efectos: [] },
        { n: "Luz", lvl: 0, desc: "Cria luz em um objeto ou ponto por 1 hora.", tipo: "Utilidade", duracao: "1 hora", efectos: [] },
        { n: "Mensagem", lvl: 0, desc: "Pode enviar uma mensagem curta a até 36m.", tipo: "Utilidade", efectos: [] },
        { n: "Prestidigitação", lvl: 0, desc: "Realiza pequenos truques mágicos.", tipo: "Utilidade", efectos: [] },
        { n: "Energia Residual", lvl: 1, desc: "Armazena energia para mais tarde. Pode armazenar até 2 PE + nível.", tipo: "Buff", efectos: [] },
        { n: "Ritmo Amaldiçoado", lvl: 1, desc: "Toque ritmo輔助 aliados. Aliados ganham +1 em testes de perícia por 1 minuto.", tipo: "Buff", duracao: "1 min", efectos: [{ tipo: "pericia", valor: "1" }] },
        { n: "Ondas Troo", lvl: 2, desc: "Ondas de energia curativas. Restaura 3d8 + INT em PV.", tipo: "Cura", dano: "3d8", attr: "INT", alcance: "Toque", efectos: [] },
        { n: "Restrição Espiritual", lvl: 2, desc: "Cria uma área onde movimento é dificultado. CD: 16 ou movimentos são reduzidos pela metade.", tipo: "Controle", area: "6m", cd: 16, efeitos: [] },
        { n: "Banimento", lvl: 3, desc: "Força uma criatura a retornar para seu plano de origem. TR: Vontade.", tipo: "Controle", alcance: "18m", tr: "Vontade", efeitos: [] },
        { n: "Dissipar Magia", lvl: 2, desc: "Remove efeitos mágicos de um alvo ou área.", tipo: "Utilidade", alcance: "36m", efectos: [] },
        { n: "Armadilha de Energia", lvl: 2, desc: "Cria uma armadilha que ativa quando alguém se aproxima.", tipo: "Controle", alcance: "18m", cd: 16, efectos: [] },
        { n: "Explosão de Energia", lvl: 3, desc: "Explosão de energia em área. Dano: 5d6 + INT.", tipo: "Dano", dano: "5d6", attr: "INT", alcance: "45m", area: "6m", tipoDano: "Force", tr: "Reflexos", efectos: [] },
        { n: "Corrente de Gelo", lvl: 3, desc: "Correntes de gelo prendem os alvos. Dano: 4d8 + INT e Imobilizado por 1 rodada.", tipo: "Controle", dano: "4d8", attr: "INT", alcance: "27m", tipoDano: "Frio", effetc: "Imobilizado", duracao: "1 rodada", tr: "Reflexos", efectos: [] },
        { n: "Rajada Vulcânica", lvl: 4, desc: "Erupção vulcânica. Área: 12m. Dano: 6d8 + INT. TR: Reflexos.", tipo: "Dano", dano: "6d8", attr: "INT", alcance: "60m", area: "12m", tipoDano: "Fogo", tr: "Reflexos", efectos: [] },
        { n: "Punhal de Gelo", lvl: 0, desc: "Cria uma estaca de gelo que atinge o alvo. Dano: d4 + INT.", tipo: "Dano", dano: "d4", attr: "INT", alcance: "9m", tipoDano: "Frio", efectos: [] },
        { n: "Garras de Energia", lvl: 1, desc: "Garras de energia surgem das mãos. Dano: 2d6 + INT. +1d6 por nível acima do 1.", tipo: "Dano", dano: "2d6", attr: "INT", alcance: "Pessoal", tipoDano: "Slash", efectos: [] },
        { n: "Explosão de Fogo", lvl: 1, desc: "Explosão flamejante ao redor. Dano: 2d6 + INT. TR: Reflexos.", tipo: "Dano", dano: "2d6", attr: "INT", alcance: "Pessoal", area: "3m", tipoDano: "Fogo", tr: "Reflexos", efectos: [] },
        { n: "Sopro de Veneno", lvl: 1, desc: "Nuvem de gás venenoso. Dano: d8 + INT. TR: Fortitude.", tipo: "Dano", dano: "d8", attr: "INT", alcance: "6m", area: "3m", tipoDano: "Poison", tr: "Fortitude", efectos: [] },
        { n: "Toque Paralizante", lvl: 1, desc: "Toque paralisa o alvo por 1 rodada. TR: Vontade.", tipo: "Controle", attr: "INT", alcance: "Toque", effetc: "Paralizado", duracao: "1 rodada", tr: "Vontade", efectos: [] },
        { n: "Barreira Simples", lvl: 1, desc: "Cria uma barreira protetora. +2 na Defesa por nível.", tipo: "Defesa", effets: [{ tipo: "defesa", valor: "nivel" }], duracao: "1 min", alcance: "Pessoal", efectos: [] },
        { n: "Domínio Simples", lvl: 4, desc: "Expansão de domínio básica. Todos dentro têm desvantagem em testes. CD: seu CD de Especialização.", tipo: "Domínio", area: "18m", cd: "CD Esp", efeitos: [] },
        { n: "Rajadas Afiadas", lvl: 2, desc: "Múltiplas lâminas de vento. Ataque contra até 3 alvos. Dano: d8 + INT cada.", tipo: "Dano", dano: "d8", attr: "INT", alcance: "27m", multAlvo: 3, tipoDano: "Slash", efectos: [] },
        { n: "Implosão de Energia", lvl: 3, desc: "Energia implode no alvo. Dano: 5d8 + INT. TR: Fortitude ou metade.", tipo: "Dano", dano: "5d8", attr: "INT", alcance: "36m", tipoDano: "Force", tr: "Fortitude", efectos: [] },
        { n: "Invocar Familiar", lvl: 0, desc: "Invoca um espírito menor que輔助 em tarefas simples.", tipo: "Invocação", efectos: [] },
        { n: "Manto de Sombras", lvl: 1, desc: "Cobertura de escuridão. Você e aliados recebem +2 em Furtividade.", tipo: "Buff", duracao: "1 min", efectos: [{ tipo: "pericia", valor: "2", cond: "Furtividade" }] }
    ],

    talentosRef: [
        { n: "Afinidade com Técnica", desc: "Ao obter este talento, você recebe um Feitiço adicional. Nos níveis 5, 10, 15 e 20 você recebe mais um Feitiço adicional.", efeitos: [] },
        { n: "Artesão Amaldiçoado", desc: "Você se torna capaz de criar Ferramentas Amaldiçoadas. Se torna treinado em Ofício (Ferreiro) ou Ofício (Canalizador).", efeitos: [] },
        { n: "Ataque Infalível", desc: "Uma vez por rodada, após a rolagem de dano de um ataque armado ou desarmado, pode escolher repetir. Você não pode ter os níveis de dano da sua arma reduzidos.", efeitos: [] },
        { n: "Atenção Infalível", desc: "Você recebe um bônus de +5 em sua Atenção e não pode ser surpreendido caso consciente.", efeitos: [{ tipo: "pericia", valor: "5", cond: "Atenção" }] },
        { n: "Dedicação Recompensada", desc: "Você recebe melhores recompensas. No quarto grau, dois itens de custo 1 a mais, e assim sucessivamente.", efeitos: [] },
        { n: "Favorecido pela Sorte", desc: "Você tem 3 pontos de sorte. Pode gastar um ponto para rolar outro d20 e escolher o melhor resultado.", efeitos: [] },
        { n: "Guarda Infalível", desc: "Em caso de desastre em um teste de ataque, você não causa um ataque como reação. Tem +3 para resistir a redução de Defesa.", efeitos: [{ tipo: "defesa", valor: "3" }] },
        { n: "Perceber Oportunidade", desc: "Você ignora a regra de repetição de reação para Golpes de Oportunidade, podendo repeti-lo duas vezes por rodada.", efeitos: [] },
        { n: "Incremento de Atributo", desc: "Aumenta um de seus atributos através do treino e esforço em 2. Você pode pegar este talento várias vezes, mas apenas uma vez para cada atributo.", efeitos: [] },
        { n: "Investida Aprimorada", desc: "Você domina a arte de realizar uma investida, otimizando-a para extrair o máximo de poder.", efeitos: [] }
    ],

    levelRewards: {
        "Lutador": {
            1: "Habilidades Base: Corpo Treinado e Empolgação",
            2: "Reflexo Evasivo (RD = nível/2)",
            3: "Habilidade de Lutador",
            4: "2 Pontos de Atributo, Habilidade de Lutador",
            5: "Gosto pela Luta (+2 ataque, +1 Fortitude/dano), Bônus de Treinamento +3",
            6: "Habilidade de Lutador",
            7: "Habilidade de Lutador",
            8: "2 Pontos de Atributo (+2 CD), Habilidade de Lutador",
            9: "Teste de Resistência Mestre, Bônus de Treinamento +4",
            10: "Habilidade de Lutador, Mestre em uma Perícia",
            11: "Empolgação Máxima (dados aumentados)",
            12: "2 Pontos de Atributo, Habilidade de Lutador",
            13: "Habilidade de Lutador, Bônus de Treinamento +5",
            14: "Habilidade de Lutador",
            15: "Habilidade de Lutador",
            16: "2 Pontos de Atributo (+3 CD), Habilidade de Lutador",
            17: "Habilidade de Lutador, Bônus de Treinamento +6",
            18: "Habilidade de Lutador",
            19: "Habilidade de Lutador",
            20: "Lutador Superior (+1 dado dano, +1 nível empolgação), 2 Pontos de Atributo"
        },
        "Especialista em Combate": {
            1: "Habilidades Base: Estilo de Combate e Arsenal do Guerreiro",
            2: "Habilidade de Especialista em Combate",
            3: "Habilidade de Especialista em Combate",
            4: "2 Pontos de Atributo, Habilidade de Especialista em Combate",
            5: "Gosto pela Luta, Bônus de Treinamento +3",
            6: "Habilidade de Especialista em Combate",
            7: "Habilidade de Especialista em Combate",
            8: "2 Pontos de Atributo (+2 CD), Habilidade de Especialista em Combate",
            9: "Teste de Resistência Mestre, Bônus de Treinamento +4",
            10: "Habilidade de Especialista em Combate, Mestre em uma Perícia",
            11: "Habilidade de Especialista em Combate",
            12: "2 Pontos de Atributo, Habilidade de Especialista em Combate",
            13: "Habilidade de Especialista em Combate, Bônus de Treinamento +5",
            14: "Habilidade de Especialista em Combate",
            15: "Habilidade de Especialista em Combate",
            16: "2 Pontos de Atributo (+3 CD), Habilidade de Especialista em Combate",
            17: "Habilidade de Especialista em Combate, Bônus de Treinamento +6",
            18: "Habilidade de Especialista em Combate",
            19: "Habilidade de Especialista em Combate",
            20: "Guerreiro Supremo, 2 Pontos de Atributo"
        },
        "Especialista em Técnica": {
            1: "Habilidades Base: Domínio dos Fundamentos e Conjuração Aprimorada",
            2: "Habilidade de Especialista em Técnica",
            3: "Habilidade de Especialista em Técnica",
            4: "2 Pontos de Atributo, Adiantar Evolução (Feitiços nível 2), Habilidade de Esp. Técnica",
            5: "Habilidade de Especialista em Técnica, Bônus de Treinamento +3",
            6: "Habilidade de Especialista em Técnica",
            7: "Habilidade de Especialista em Técnica (Feitiços nível 3)",
            8: "2 Pontos de Atributo (+2 CD), Habilidade de Esp. Técnica",
            9: "Teste de Resistência Mestre, Bônus de Treinamento +4",
            10: "Foco Amaldiçoado, Habilidade de Esp. Técnica, Mestre em uma Perícia",
            11: "Habilidade de Especialista em Técnica (Feitiços nível 4)",
            12: "2 Pontos de Atributo, Habilidade de Esp. Técnica",
            13: "Habilidade de Especialista em Técnica, Bônus de Treinamento +5",
            14: "Habilidade de Especialista em Técnica",
            15: "Habilidade de Especialista em Técnica (Feitiços nível 5), Bônus de Treinamento +6",
            16: "2 Pontos de Atributo (+3 CD), Habilidade de Esp. Técnica",
            17: "Habilidade de Especialista em Técnica",
            18: "Habilidade de Especialista em Técnica",
            19: "Habilidade de Especialista em Técnica",
            20: "O Honrado (+5 CD, +5 ataque), 2 Pontos de Atributo"
        },
        "Controlador": {
            1: "Habilidades Base: Invocação Primordial e Conexão Espiritual",
            2: "Habilidade de Controlador",
            3: "Habilidade de Controlador",
            4: "2 Pontos de Atributo, Habilidade de Controlador",
            5: "Habilidade de Controlador, Bônus de Treinamento +3",
            6: "Habilidade de Controlador",
            7: "Habilidade de Controlador",
            8: "2 Pontos de Atributo (+2 CD), Habilidade de Controlador",
            9: "Teste de Resistência Mestre, Bônus de Treinamento +4",
            10: "Habilidade de Controlador, Mestre em uma Perícia",
            11: "Habilidade de Controlador",
            12: "2 Pontos de Atributo, Habilidade de Controlador",
            13: "Habilidade de Controlador, Bônus de Treinamento +5",
            14: "Habilidade de Controlador",
            15: "Habilidade de Controlador",
            16: "2 Pontos de Atributo (+3 CD), Habilidade de Controlador",
            17: "Habilidade de Controlador, Bônus de Treinamento +6",
            18: "Habilidade de Controlador",
            19: "Habilidade de Controlador",
            20: "Mestre Invocador, 2 Pontos de Atributo"
        },
        "Suporte": {
            1: "Habilidades Base: Toque Curativo e Presença Reconfortante",
            2: "Habilidade de Suporte",
            3: "Habilidade de Suporte",
            4: "2 Pontos de Atributo, Habilidade de Suporte",
            5: "Habilidade de Suporte, Bônus de Treinamento +3",
            6: "Habilidade de Suporte",
            7: "Habilidade de Suporte",
            8: "2 Pontos de Atributo (+2 CD), Habilidade de Suporte",
            9: "Teste de Resistência Mestre, Bônus de Treinamento +4",
            10: "Habilidade de Suporte, Mestre em uma Perícia",
            11: "Habilidade de Suporte",
            12: "2 Pontos de Atributo, Habilidade de Suporte",
            13: "Habilidade de Suporte, Bônus de Treinamento +5",
            14: "Habilidade de Suporte",
            15: "Habilidade de Suporte",
            16: "2 Pontos de Atributo (+3 CD), Habilidade de Suporte",
            17: "Habilidade de Suporte, Bônus de Treinamento +6",
            18: "Habilidade de Suporte",
            19: "Habilidade de Suporte",
            20: "Anjo Guardião, 2 Pontos de Atributo"
        },
        "Restringido": {
            1: "Habilidades Base: Punhos de Aço e Resistência do Voto",
            2: "Habilidade de Restringido",
            3: "Habilidade de Restringido",
            4: "2 Pontos de Atributo, Habilidade de Restringido",
            5: "Habilidade de Restringido, Bônus de Treinamento +3",
            6: "Habilidade de Restringido",
            7: "Habilidade de Restringido",
            8: "2 Pontos de Atributo (+2 CD), Habilidade de Restringido",
            9: "Teste de Resistência Mestre, Bônus de Treinamento +4",
            10: "Habilidade de Restringido, Mestre em uma Perícia",
            11: "Habilidade de Restringido",
            12: "2 Pontos de Atributo, Habilidade de Restringido",
            13: "Habilidade de Restringido, Bônus de Treinamento +5",
            14: "Habilidade de Restringido",
            15: "Habilidade de Restringido",
            16: "2 Pontos de Atributo (+3 CD), Habilidade de Restringido",
            17: "Habilidade de Restringido, Bônus de Treinamento +6",
            18: "Habilidade de Restringido",
            19: "Habilidade de Restringido",
            20: "Punho Divino, 2 Pontos de Atributo"
        }
    },

    specStats: {
        "Lutador": { hp: 12, pe: 4, dv: "d10", hpOpcao: 6 },
        "Especialista em Combate": { hp: 12, pe: 4, dv: "d10", hpOpcao: 6 },
        "Especialista em Técnica": { hp: 10, pe: 6, dv: "d8", hpOpcao: 5, peAttr: "INT" },
        "Controlador": { hp: 10, pe: 5, dv: "d8", hpOpcao: 5, peAttr: "SAB" },
        "Suporte": { hp: 10, pe: 5, dv: "d8", hpOpcao: 5, peAttr: "SAB" },
        "Restringido": { hp: 16, pe: 0, dv: "d12", hpOpcao: 8 }
    },

    editingResource: '',

    generateUID() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    atualizarAvatarConta(avatar) {
        if (avatar) {
            const avatars = document.querySelectorAll('#conta-avatar, #modal-conta-avatar');
            avatars.forEach(img => {
                if (img) img.src = avatar;
            });
        }
    },

    atualizarCorNivel(lvl) {
        const select = document.getElementById('char-lvl');
        if (!select) return;
        
        // Remover classes anteriores
        select.classList.remove('lvl-iniciante', 'lvl-intermediario', 'lvl-avancado', 'lvl-mestre');
        
        const nivel = parseInt(lvl) || 1;
        
        // Adicionar classe conforme a faixa de nível
        if (nivel >= 1 && nivel <= 4) {
            select.classList.add('lvl-iniciante');
        } else if (nivel >= 5 && nivel <= 9) {
            select.classList.add('lvl-intermediario');
        } else if (nivel >= 10 && nivel <= 14) {
            select.classList.add('lvl-avancado');
        } else if (nivel >= 15) {
            select.classList.add('lvl-mestre');
        }
    },

    checkPixBalance() {
        if (this.activeIdx === null) return 0;
        return this.characters[this.activeIdx].pix?.saldo || 0;
    },

    formatMoney(amount) {
        return 'R$ ' + (amount / 100).toFixed(2).replace('.', ',');
    },

    openEditSaldo() {
        const char = this.characters[this.activeIdx];
        const currentSaldo = char.pix?.saldo || 0;
        document.getElementById('edit-saldo-value').value = currentSaldo / 100;
        document.getElementById('edit-current-saldo').innerText = this.formatMoney(currentSaldo);
        ui.openModal('modal-edit-saldo');
    },

    saveEditSaldo() {
        const btn = document.querySelector('#modal-edit-saldo .btn-main.primary');
        if (btn.disabled) return;
        
        const newSaldo = parseFloat(document.getElementById('edit-saldo-value').value) || 0;
        constconfirm = confirm('Definir saldo para R$ ' + newSaldo.toFixed(2) + '?');
        if (!confirm) return;
        
        btn.disabled = true;
        btn.innerText = 'Salvando...';
        
        const novoSaldoInt = Math.round(newSaldo * 100);
        this.characters[this.activeIdx].pix.saldo = novoSaldoInt;
        
        this.syncPixFirebase(this.characters[this.activeIdx].pix.uid, novoSaldoInt);
        this.saveData();
        this.updateSaldoDisplay();
        ui.closeModal('modal-edit-saldo');
        ui.showToast('Saldo atualizado!', 'success');
        btn.disabled = false;
        btn.innerText = 'Salvar';
    },

    syncPixFirebase(uid, saldo) {
        db.ref('saldos/' + uid).set(saldo).catch(() => {});
    },

    listenPixChanges() {
        this.characters.forEach(c => {
            if (c.pix?.uid && !this.pixListeners[c.pix.uid]) {
                this.pixListeners[c.pix.uid] = true;
                db.ref('saldos/' + c.pix.uid).on('value', snapshot => {
                    const saldoServidor = snapshot.val() || 0;
                    const idx = this.characters.findIndex(ch => ch.pix?.uid === c.pix.uid);
                    if (idx !== -1) {
                        const saldoAnterior = this.characters[idx].pix.saldo || 0;
                        this.characters[idx].pix.saldo = saldoServidor;
                        if (this.activeIdx === idx && saldoServidor !== saldoAnterior) {
                            this.updateSaldoDisplay();
                            if (saldoServidor > saldoAnterior) {
                                ui.showToast(`Recebido: ${this.formatMoney(saldoServidor - saldoAnterior)}`, 'pix');
                            }
                        }
                        this.saveData();
                    }
                });
            }
        });
    },

    startPixSyncInterval() {
        setInterval(() => {
            if (this.activeIdx === null) return;
            const char = this.characters[this.activeIdx];
            if (!char?.pix?.uid) return;
            
            db.ref('saldos/' + char.pix.uid).once('value').then(snapshot => {
                const saldoServidor = snapshot.val() || 0;
                const saldoLocal = char.pix.saldo || 0;
                if (saldoServidor !== saldoLocal) {
                    char.pix.saldo = saldoServidor;
                    this.updateSaldoDisplay();
                    if (saldoServidor > saldoLocal) {
                        ui.showToast(`Recebido: ${this.formatMoney(saldoServidor - saldoLocal)}`, 'pix');
                    }
                    this.saveData();
                }
            }).catch(() => {});
        }, 2000);
    },

    updateSaldoDisplay() {
        const char = this.characters[this.activeIdx];
        if (char?.pix?.saldo !== undefined) {
            document.getElementById('pix-saldo-display').innerText = this.formatMoney(char.pix.saldo);
        }
    },

    generateNewUID() {
        this.characters[this.activeIdx].pix.uid = this.generateUID();
        document.getElementById('pix-uid-display').innerText = this.characters[this.activeIdx].pix.uid;
        this.saveData();
        this.syncPixFirebase(this.characters[this.activeIdx].pix.uid, this.characters[this.activeIdx].pix.saldo);
        ui.showToast('UID atualizado!', 'success');
    },

    openTransferModal() {
        document.getElementById('transfer-uid').value = '';
        document.getElementById('transfer-valor').value = '';
        ui.openModal('modal-transfer');
    },

    processTransfer() {
        const btn = document.querySelector('#modal-transfer .btn-main.primary');
        if (btn.disabled) return;
        
        const uidDestino = document.getElementById('transfer-uid').value.trim();
        const valor = parseFloat(document.getElementById('transfer-valor').value) || 0;
        const charRemetente = this.characters[this.activeIdx];

        if (!uidDestino || uidDestino.length !== 6) {
            return ui.showToast('UID inválido. Use 6 dígitos.', 'error');
        }
        if (valor <= 0) {
            return ui.showToast('Valor deve ser maior que zero.', 'error');
        }
        if (charRemetente.pix.uid === uidDestino) {
            return ui.showToast('Não pode transferir para si mesmo.', 'error');
        }

        const confirmEnvio = confirm('Transferir R$ ' + valor.toFixed(2) + ' para ' + uidDestino + '?');
        if (!confirmEnvio) return;

        const valorInt = Math.round(valor * 100);
        btn.disabled = true;
        btn.innerText = 'Enviando...';
        
        const refRemetente = db.ref('saldos/' + charRemetente.pix.uid);
        const refDestino = db.ref('saldos/' + uidDestino);
        
        refRemetente.once('value').then(snap => {
            const saldoRemetente = snap.val() || 0;
            if (saldoRemetente < valorInt) {
                throw { message: 'Saldo insuficiente!' };
            }
            return refDestino.once('value').then(snapDest => {
                const saldoDestino = snapDest.val() || 0;
                return Promise.all([
                    refRemetente.set(saldoRemetente - valorInt),
                    refDestino.set(saldoDestino + valorInt)
                ]);
            });
        })
        .then(() => {
            charRemetente.pix.saldo -= valorInt;
            this.updateSaldoDisplay();
            this.saveData();
            ui.closeModal('modal-transfer');
            document.getElementById('transfer-uid').value = '';
            document.getElementById('transfer-valor').value = '';
            ui.showToast('Enviado: R$ ' + valor.toFixed(2), 'success');
        })
        .catch(err => {
            ui.showToast(err.message || 'Erro na transferência', 'error');
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = 'Transferir';
        });
    },

    checkNotifications() {
        // Notificações em tempo real via listener
    },

    showNotifications() {
        ui.showToast('Veja o saldo em tempo real!', 'info');
    },

    login(uid) {
        if (!uid || uid.length !== 6) {
            return ui.showToast('UID inválido', 'error');
        }
        
        const existingIdx = this.characters.findIndex(c => c.pix?.uid === uid);
        if (existingIdx !== -1) {
            this.localLoggedIn = existingIdx;
            localStorage.setItem('jjk_logged_uid', uid);
            this.openSheet(existingIdx);
            return ui.showToast('Login realizado!', 'success');
        }
        
        if (this.characters.length >= 15) {
            return ui.showToast('Limite de 15 fichas', 'error');
        }
        
        this.createNewCharWithUID(uid);
    },

    createNewCharWithUID(uid) {
        const skData = {};
        this.skillsRef.forEach(s => skData[s.n] = { trained: false, master: false, bonus: 0 });
        
        const newChar = {
            name: '',
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E",
            lvl: 1, origin: 'Inato', spec: 'Lutador',
            attrs: { FOR: 10, DEX: 10, CON: 10, INT: 10, SAB: 10, PRE: 10 },
            hp: { curr: 12, max: 12 }, pe: { curr: 4, max: 4 }, integridade: { curr: 12, max: 12 },
            skills: skData, aptitudes: {},
            habilidades: [], feiticos: [], talentos: [], inventario: [],
            invocacoes: [],
            iniciativa: 0, desloc: "9m",
            defesaExtras: { eqp: 0, var: 0 },
            combat: { cc: { trained: false, attr: 'FOR', bonus: 0, total: 0 }, dist: { trained: false, attr: 'DEX', bonus: 0, total: 0 }, amal: { trained: false, attr: 'INT', bonus: 0, total: 0 } },
            cdEspec: { attr: 'INT', trained: false, var: 0 },
            perfilAmaldicado: { aptidoes: [], tecnicas: [], expansao: { nome: '', tipo: '', desc: '' }, tecnicaMax: { nome: '', desc: '' } },
            pix: { saldo: 0, uid: uid, transferencias: [] }
        };
        
        this.characters.push(newChar);
        this.localLoggedIn = this.characters.length - 1;
        localStorage.setItem('jjk_logged_uid', uid);
        this.openSheet(this.characters.length - 1);
        this.saveData();
        ui.showToast('Conta criada automaticamente!', 'success');
    },

    gerarUid() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    criarConta() {
        const nome = document.getElementById('cadastro-nome').value.trim();
        const senha = document.getElementById('cadastro-senha').value.trim();
        const manter = document.getElementById('cadastro-manter').checked;
        
        if (!nome || !senha) {
            ui.showToast('Preencha todos os campos!', 'error');
            return;
        }
        
        const uid = this.gerarUid();
        
        db.ref('usuarios/' + uid).set({
            nome: nome,
            senha: senha,
            uid: uid,
            createdAt: Date.now()
        }).then(() => {
            if (manter) {
                localStorage.setItem('jjk_uid', uid);
                localStorage.setItem('jjk_nome', nome);
                localStorage.setItem('jjk_manter', 'true');
            } else {
                localStorage.setItem('jjk_uid_temp', uid);
                localStorage.setItem('jjk_nome_temp', nome);
            }
            
            this.userUid = uid;
            this.userNome = nome;
            this.loggedIn = true;
            
            document.getElementById('modal-login').style.display = 'none';
            ui.showToast('Conta criada! UID: ' + uid, 'success');
            this.mostrarTelaPrincipal();
            this.carregarDadosUsuario();
        }).catch(err => {
            ui.showToast('Erro ao criar conta', 'error');
            console.error(err);
        });
    },

    fazerLogin() {
        const nome = document.getElementById('login-nome').value.trim();
        const senha = document.getElementById('login-senha').value.trim();
        const uidInput = document.getElementById('login-uid').value.trim();
        const manter = document.getElementById('login-manter').checked;
        
        if (!nome || !senha) {
            ui.showToast('Preencha nome e senha!', 'error');
            return;
        }
        
        if (uidInput) {
            db.ref('usuarios/' + uidInput).once('value').then(snapshot => {
                const usuario = snapshot.val();
                if (usuario && usuario.nome === nome && usuario.senha === senha) {
                    this.fazerLoginSuccess(usuario, manter);
                } else {
                    ui.showToast('UID, nome ou senha incorretos', 'error');
                }
            }).catch(() => {
                ui.showToast('Erro ao fazer login', 'error');
            });
        } else {
            db.ref('usuarios').orderByChild('nome').equalTo(nome).once('value').then(snapshot => {
                let usuario = null;
                snapshot.forEach(child => {
                    if (child.val().senha === senha) {
                        usuario = child.val();
                    }
                });
                
                if (usuario) {
                    this.fazerLoginSuccess(usuario, manter);
                } else {
                    ui.showToast('Nome ou senha incorretos', 'error');
                }
            }).catch(() => {
                ui.showToast('Erro ao fazer login', 'error');
            });
        }
    },

    fazerLoginSuccess(usuario, manter = false) {
        if (manter) {
            localStorage.setItem('jjk_uid', usuario.uid);
            localStorage.setItem('jjk_nome', usuario.nome);
            localStorage.setItem('jjk_manter', 'true');
        } else {
            localStorage.setItem('jjk_uid_temp', usuario.uid);
            localStorage.setItem('jjk_nome_temp', usuario.nome);
        }
        
        this.userUid = usuario.uid;
        this.userNome = usuario.nome;
        this.loggedIn = true;
        
        document.getElementById('modal-login').style.display = 'none';
        
        // Forçar atualização do DOM
        setTimeout(() => {
            this.mostrarTelaPrincipal();
            this.carregarDadosUsuario();
            this.showToast('Bem-vindo, ' + usuario.nome + '!', 'success');
        }, 100);
    },

    mostrarLogin() {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('criar-conta-form').style.display = 'none';
    },

    mostrarCriarConta() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('criar-conta-form').style.display = 'block';
    },

    logout() {
        localStorage.removeItem('jjk_uid');
        localStorage.removeItem('jjk_nome');
        localStorage.removeItem('jjk_manter');
        localStorage.removeItem('jjk_uid_temp');
        localStorage.removeItem('jjk_nome_temp');
        this.userUid = null;
        this.userNome = null;
        this.loggedIn = false;
        this.characters = [];
        
        document.getElementById('modal-login').style.display = 'flex';
        document.getElementById('login-nome').value = '';
        document.getElementById('login-senha').value = '';
        document.getElementById('login-uid').value = '';
        this.mostrarLogin();
        
        this.atualizarAvatarConta(null);
    },

    init() {
        this.loadTheme();
        this.initLevelDropdown();
        
        console.log('=== APP INIT ===');
        
        const manter = localStorage.getItem('jjk_manter') === 'true';
        let savedUid = localStorage.getItem('jjk_uid');
        let savedNome = localStorage.getItem('jjk_nome');
        
        if (!savedUid || !savedNome) {
            savedUid = localStorage.getItem('jjk_uid_temp');
            savedNome = localStorage.getItem('jjk_nome_temp');
        }
        
        if (savedUid && savedNome) {
            this.userUid = savedUid;
            this.userNome = savedNome;
            this.loggedIn = true;
            console.log('>> Usuário logado:', savedUid, savedNome);
            this.mostrarTelaPrincipal();
            this.carregarDadosUsuario();
        } else {
            document.getElementById('modal-login').style.display = 'flex';
            this.mostrarLogin();
        }
    },

    mostrarTelaPrincipal() {
        ui.showScreen('home-screen');
    },

    carregarDadosUsuario() {
        this.mostrarTelaPrincipal();
        
        const uid = this.userUid || 'local';
        
        console.log('>> Carregando fichas com UID:', uid);
        
        this.carregarFichasDoFirebase(uid);
        
        this.listenPixChanges();
        this.startPixSyncInterval();
        
        this.carregarAvatarConta();
    },
    
    carregarAvatarConta() {
        if (!this.userUid) return;
        
        console.log('>> Carregando avatar para UID:', this.userUid);
        
        const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
        
        const avatars = document.querySelectorAll('#conta-avatar, #modal-conta-avatar');
        avatars.forEach(img => {
            if (img) img.src = defaultAvatar;
        });
        
        // Primeiro busca uma vez
        db.ref('usuarios/' + this.userUid + '/avatar').once('value').then(snapshot => {
            const avatar = snapshot.val();
            console.log('>> Avatar encontrado:', avatar ? 'sim' : 'não');
            if (avatar) {
                avatars.forEach(img => {
                    if (img) img.src = avatar;
                });
            }
        }).catch(err => {
            console.error('>> Erro ao carregar avatar:', err);
        });
        
        // Depois ouve mudanças em tempo real
        db.ref('usuarios/' + this.userUid + '/avatar').on('value', snapshot => {
            const avatar = snapshot.val();
            if (avatar) {
                const avatars = document.querySelectorAll('#conta-avatar, #modal-conta-avatar');
                avatars.forEach(img => {
                    if (img) img.src = avatar;
                });
            }
        });
    },

    mostrarTelaPrincipal() {
        ui.showScreen('home-screen');
    },

    mostrarTelaLogin() {
        this.googleId = null;
        this.userUid = null;
        this.userNome = null;
        this.userAvatar = null;
        this.userEmail = null;
        this.loggedIn = false;
        this.characters = [];
        
        const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
        const avatars = document.querySelectorAll('#conta-avatar, #modal-conta-avatar');
        avatars.forEach(img => {
            if (img) img.src = defaultAvatar;
        });
        
        // Mostrar tela de login removendo a classe hidden
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById('login-screen').classList.remove('hidden');
    },

    carregarDadosUsuario() {
        return new Promise((resolve) => {
            document.getElementById('login-nome').value = '';
            document.getElementById('login-senha').value = '';
            
            // Mostrar tela principal PRIMEIRO - we already have localStorage data
            this.mostrarTelaPrincipal();
            
            // Agora carregar as fichas em background
            const uid = this.userUid || this.googleId;
            
            if (!uid) {
                console.log('>> ERRO: Sem UID para carregar fichas');
                this.listenPixChanges();
                this.startPixSyncInterval();
                resolve();
                return;
            }
            
            console.log('>> Carregando fichas com UID:', uid);
            
            // Carregar fichas do Firebase usando o UID do usuário
            this.carregarFichasDoFirebase(uid);
            
            this.listenPixChanges();
            this.startPixSyncInterval();
            resolve();
        });
    },

    carregarFichasDoFirebase(uid) {
        return new Promise((resolve, reject) => {
            console.log('>> Carregando fichas do Firebase com UID:', uid);
            
            db.ref('usuarios/' + uid + '/fichas').once('value').then(snapshot => {
                console.log('>> Snapshot exists:', snapshot.exists());
                if (snapshot.exists()) {
                    const fichasData = snapshot.val();
                    this.characters = [];
                    
                    if (fichasData && typeof fichasData === 'object') {
                        Object.values(fichasData).forEach(ficha => {
                            if (!ficha) return;
                            if (!ficha.pix) {
                                ficha.pix = { saldo: 0, uid: uid, transferencias: [] };
                            }
                            if (!ficha.pix.uid) {
                                ficha.pix.uid = uid;
                            }
                            if (!ficha.pix.transferencias) {
                                ficha.pix.transferencias = [];
                            }
                            this.characters.push(ficha);
                        });
                    }
                    console.log('>> Fichas carregadas:', this.characters.length);
                } else {
                    console.log('>> Nenhuma ficha encontrada');
                    this.characters = [];
                }
                
                this.renderCharList();
                
                if (this.characters && this.characters.length > 0) {
                    document.getElementById('btn-acessar').disabled = false;
                    console.log('>> Botão habilitado!');
                }
                
                resolve(this.characters || []);
            }).catch(err => {
                console.error('>> Erro ao carregar fichas:', err);
                this.characters = [];
                this.renderCharList();
                reject(err);
            });
        });
    },

    abrirConfiguracoesConta() {
        if (!this.loggedIn || !this.userUid) return this.showToast('É preciso estar logado', 'error');
        
        document.getElementById('conta-nome').value = this.userNome || '';
        
        const emailInput = document.getElementById('conta-email');
        emailInput.value = this.userUid;
        
        const avatarImg = document.getElementById('conta-avatar');
        const modalAvatar = document.getElementById('modal-conta-avatar');
        const defaultAvatar = this.userAvatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
        
        avatarImg.src = defaultAvatar;
        modalAvatar.src = defaultAvatar;
        
        if (this.userUid) {
            db.ref('usuarios/' + this.userUid + '/avatar').on('value', snapshot => {
                const avatar = snapshot.val();
                if (avatar) {
                    avatarImg.src = avatar;
                    modalAvatar.src = avatar;
                }
            });
        }
        
        ui.openModal('modal-conta');
    },

    editarFotoConta(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = ev => {
            const avatarData = ev.target.result;
            
            document.getElementById('conta-avatar').src = avatarData;
            document.getElementById('modal-conta-avatar').src = avatarData;
            
            db.ref('usuarios/' + this.userUid + '/avatar').set(avatarData).then(() => {
                this.showToast('Foto atualizada!', 'success');
            }).catch(() => {
                this.showToast('Erro ao salvar foto', 'error');
            });
        };
        reader.readAsDataURL(file);
    },

    salvarConfiguracoesConta() {
        const novoNome = document.getElementById('conta-nome').value.trim();
        const novaSenha = document.getElementById('conta-senha').value.trim();
        
        if (!novoNome || novoNome.length < 3) return this.showToast('Nome deve ter pelo menos 3 caracteres', 'error');
        
        const updates = {};
        updates['usuarios/' + this.userUid + '/nome'] = novoNome;
        updates['usuarios_por_nome/' + novoNome.toLowerCase()] = this.userUid;
        
        if (novaSenha && novaSenha.length >= 4) {
            updates['usuarios/' + this.userUid + '/senha'] = novaSenha;
        }
        
        db.ref().update(updates).then(() => {
            this.userNome = novoNome;
            this.showToast('Configurações salvas!', 'success');
            ui.closeModal('modal-conta');
        }).catch(() => {
            this.showToast('Erro ao salvar', 'error');
        });
    },

    salvarFichasFirebase() {
        if (!this.userUid) {
            console.error('ERRO: Usuário não logado para salvar fichas');
            return;
        }
        
        const fichasObj = {};
        this.characters.forEach((char, idx) => {
            if (!char.pix) {
                char.pix = { saldo: 0, uid: this.userUid, transferencias: [] };
            }
            char.pix.uid = this.userUid;
            fichasObj[idx] = char;
        });
        
        console.log('>> Salvando fichas com UID:', this.userUid);
        db.ref('usuarios/' + this.userUid + '/fichas').set(fichasObj).then(() => {
            console.log('>> Fichas salvas com sucesso!');
        }).catch(err => {
            console.error('>> Erro ao salvar fichas:', err);
        });
    },

    renderCharList() {
        const customOrigins = JSON.parse(localStorage.getItem('jjk_custom_origins') || '[]');
        const customSpecs = JSON.parse(localStorage.getItem('jjk_custom_specs') || '[]');
        
        const originSelect = document.getElementById('char-origin');
        const specSelect = document.getElementById('char-spec');
        
        const origDropdown = document.getElementById('custom-origin-dropdown');
        const specDropdown = document.getElementById('custom-spec-dropdown');
        
        const existingOriginCustoms = Array.from(origDropdown.querySelectorAll('.custom-select-option')).filter(el => el.textContent.includes('(Custom)'));
        existingOriginCustoms.forEach(el => el.remove());
        
        const existingSpecCustoms = Array.from(specDropdown.querySelectorAll('.custom-select-option')).filter(el => el.textContent.includes('(Custom)'));
        existingSpecCustoms.forEach(el => el.remove());
        
        const existingOriginOptions = Array.from(originSelect.querySelectorAll('option')).filter(opt => opt.textContent.includes('(Custom)'));
        existingOriginOptions.forEach(opt => opt.remove());
        
        const existingSpecOptions = Array.from(specSelect.querySelectorAll('option')).filter(opt => opt.textContent.includes('(Custom)'));
        existingSpecOptions.forEach(opt => opt.remove());
        
        customOrigins.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.n;
            opt.textContent = o.n + ' (Custom)';
            originSelect.appendChild(opt);
            
            const divOpt = document.createElement('div');
            divOpt.className = 'custom-select-option';
            divOpt.onclick = () => app.selectCustomOption('origin', o.n);
            divOpt.textContent = o.n + ' (Custom)';
            origDropdown.appendChild(divOpt);
        });
        
        customSpecs.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.n;
            opt.textContent = s.n + ' (Custom)';
            specSelect.appendChild(opt);
            
            const divOpt = document.createElement('div');
            divOpt.className = 'custom-select-option';
            divOpt.onclick = () => app.selectCustomOption('spec', s.n);
            divOpt.textContent = s.n + ' (Custom)';
            specDropdown.appendChild(divOpt);
        });
    },

    toggleTheme() {
        const btn = document.getElementById('theme-btn');
        btn.classList.add('animating');
        
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('jjk-theme', isLight ? 'light' : 'dark');
        
        const icon = btn.querySelector('.theme-icon');
        icon.textContent = isLight ? '☀️' : '🌙';
        
        setTimeout(() => btn.classList.remove('animating'), 500);
    },

    toggleAdSidebar(side) {
        const sidebar = side === 'left' 
            ? document.querySelector('.ad-sidebar-left') 
            : document.querySelector('.ad-sidebar-right');
        const btn = sidebar.querySelector('.ad-toggle-btn');
        
        sidebar.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            btn.textContent = side === 'left' ? '›' : '‹';
            document.body.classList.add('ad-' + side + '-collapsed');
        } else {
            btn.textContent = side === 'left' ? '‹' : '›';
            document.body.classList.remove('ad-' + side + '-collapsed');
        }
        
        localStorage.setItem('jjk-ad-' + side + '-collapsed', sidebar.classList.contains('collapsed'));
    },

    toggleAdBanner(position) {
        const banner = position === 'top' 
            ? document.getElementById('ad-banner-top') 
            : document.getElementById('ad-banner-bottom');
        
        banner.classList.toggle('closed');
        
        if (position === 'top') {
            document.body.classList.toggle('ad-top-closed', banner.classList.contains('closed'));
        } else {
            document.body.classList.toggle('ad-bottom-closed', banner.classList.contains('closed'));
        }
        
        console.log('Ad toggled:', position, 'Body classes:', document.body.classList);
        
        localStorage.setItem('jjk-ad-' + position + '-closed', banner.classList.contains('closed'));
    },

    loadAdState() {
        const leftCollapsed = localStorage.getItem('jjk-ad-left-collapsed') === 'true';
        const rightCollapsed = localStorage.getItem('jjk-ad-right-collapsed') === 'true';
        
        if (leftCollapsed) {
            const sidebar = document.querySelector('.ad-sidebar-left');
            if (sidebar) {
                sidebar.classList.add('collapsed');
                sidebar.querySelector('.ad-toggle-btn').textContent = '›';
                document.body.classList.add('ad-left-collapsed');
            }
        }
        
        if (rightCollapsed) {
            const sidebar = document.querySelector('.ad-sidebar-right');
            if (sidebar) {
                sidebar.classList.add('collapsed');
                sidebar.querySelector('.ad-toggle-btn').textContent = '‹';
                document.body.classList.add('ad-right-collapsed');
            }
        }
    },

    loadTheme() {
        const isLight = localStorage.getItem('jjk-theme') === 'light';
        if (isLight) {
            document.body.classList.add('light-theme');
            const themeIcon = document.querySelector('.theme-icon');
            if (themeIcon) themeIcon.textContent = '☀️';
        }
        
        const themeColor = localStorage.getItem('jjk_theme_color');
        if (themeColor) {
            document.documentElement.style.setProperty('--accent', themeColor);
            document.documentElement.style.setProperty('--energy', themeColor);
        }
        
        const manterConectadoEl = document.getElementById('config-manter-conectado');
        if (manterConectadoEl) {
            const manterConectado = localStorage.getItem('jjk_manter_conectado_default') === 'true';
            manterConectadoEl.checked = manterConectado;
            
            manterConectadoEl.onchange = function() {
                localStorage.setItem('jjk_manter_conectado_default', this.checked ? 'true' : 'false');
            };
        }
    },

    initLevelDropdown() {
        const dropdown = document.querySelector('.lvl-dropdown');
        if (!dropdown) return;
        
        let html = '';
        for (let i = 1; i <= 20; i++) {
            html += `<div class="custom-select-option" onclick="app.selectLevel(${i})">${i}</div>`;
        }
        dropdown.innerHTML = html;
    },

    selectLevel(lvl) {
        document.getElementById('char-lvl').value = lvl;
        document.getElementById('lvl-current').innerText = lvl;
        
        document.querySelectorAll('.lvl-dropdown .custom-select-option').forEach(el => {
            el.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        document.getElementById('lvl-dropdown').classList.remove('open');
        
        if (this.activeIdx !== null) {
            this.autoCalculate();
        }
    },

    setThemeColor(color) {
        document.documentElement.style.setProperty('--accent', color);
        document.documentElement.style.setProperty('--energy', color);
        
        // Calcular versões mais claras e escuras
        const lighterColor = this.adjustColorBrightness(color, 30);
        const glowColor = color + '80';
        
        document.documentElement.style.setProperty('--accent-light', lighterColor);
        document.documentElement.style.setProperty('--accent-glow', glowColor);
        
        localStorage.setItem('jjk_theme_color', color);
        document.getElementById('custom-theme-color').value = color;
        
        this.showToast('Cor do tema alterada!', 'success');
    },

    adjustColorBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    },

    resetCores() {
        document.documentElement.style.setProperty('--accent', '#9d4edd');
        document.documentElement.style.setProperty('--energy', '#9d4edd');
        document.documentElement.style.setProperty('--accent-light', '#b366e6');
        document.documentElement.style.setProperty('--accent-glow', 'rgba(157, 78, 221, 0.5)');
        localStorage.removeItem('jjk_theme_color');
        document.getElementById('custom-theme-color').value = '#9d4edd';
        this.showToast('Cores restauradas!', 'success');
    },

    createNewChar() {
        if (this.characters.length >= 15) return alert("Limite de 15 fichas alcançado!");
        if (!this.loggedIn || !this.userUid) return alert("É preciso estar logado para criar uma ficha!");
        
        const skData = {};
        this.skillsRef.forEach(s => skData[s.n] = { trained: false, master: false, bonus: 0 });
        const aptData = {};
        this.aptitudesRef.forEach(a => aptData[a.id] = 0);

        const newChar = {
            name: '',
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E",
            lvl: 1, origin: 'Inato', spec: 'Lutador',
            attrs: { FOR: 10, DEX: 10, CON: 10, INT: 10, SAB: 10, PRE: 10 },
            hp: { curr: 12, max: 12 }, pe: { curr: 4, max: 4 }, integridade: { curr: 12, max: 12 },
            skills: skData, aptitudes: aptData,
            habilidades: [], feiticos: [], talentos: [], inventario: [],
            invocacoes: [],
            iniciativa: 0, desloc: "9m",
            defesaExtras: { eqp: 0, var: 0 },
            combat: {
                cc: { trained: false, attr: 'FOR', bonus: 0, total: 0 },
                dist: { trained: false, attr: 'DEX', bonus: 0, total: 0 },
                amal: { trained: false, attr: 'INT', bonus: 0, total: 0 }
            },
            cdEspec: { attr: 'INT', trained: false, var: 0 },
            perfilAmaldicado: {
                aptidoes: [],
                tecnicas: [],
                expansao: { nome: '', tipo: '', desc: '' },
                tecnicaMax: { nome: '', desc: '' }
            },
            pix: { saldo: 0, uid: this.userUid, transferencias: [] }
        };
        this.characters.push(newChar);
        this.openSheet(this.characters.length - 1);
        this.saveData();
    },

    renderCharList() {
        const cont = document.getElementById('slots-container');
        document.getElementById('char-count').innerText = this.characters.length;
        
        if (this.characters.length === 0) {
            cont.innerHTML = `<div class="char-slot empty" onclick="app.createNewChar()">+ Criar Novo Personagem</div>`;
            document.getElementById('btn-acessar').disabled = true;
            return;
        }

        let html = '';
        this.characters.forEach((c, i) => {
            const isRestr = c.spec === 'Restringido' || c.origin === 'Restringido';
            const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
            const avatarSrc = (c.avatar && c.avatar.startsWith('data:image')) ? c.avatar : defaultAvatar;
            html += `
            <div class="char-slot" onclick="app.openSheet(${i})">
                <img src="${avatarSrc}" class="slot-avatar">
                <div style="flex-grow: 1;">
                    <div style="font-weight: bold; font-size: 1.1rem;">${c.name || 'Feiticeiro Desconhecido'}</div>
                    <div style="font-size: 0.75rem; color: #888;">Nvl ${c.lvl} | ${c.origin} | ${c.spec}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 0.8rem; font-weight: bold;">
                        <span style="color: var(--hp);">❤ ${c.hp.curr}/${c.hp.max}</span>
                        <span style="color: var(--energy);">${isRestr ? '☠ Rest.' : '⚡ ' + c.pe.curr + '/' + c.pe.max}</span>
                    </div>
                    <button class="char-delete-btn" onclick="event.stopPropagation(); app.showDeleteCharModal(${i})" title="Excluir">✕</button>
                </div>
            </div>
            `;
        });

        if (this.characters.length < 15) {
            html += `<div class="char-slot empty" onclick="app.createNewChar()" style="padding:10px;">+ Novo</div>`;
        }

        cont.innerHTML = html;
        document.getElementById('btn-acessar').disabled = false;
        this.saveData();
    },

    showDeleteCharModal(idx) {
        this.deleteCharIdx = idx;
        ui.openModal('modal-delete-char');
    },

    confirmDeleteChar() {
        if (this.deleteCharIdx !== null) {
            this.characters.splice(this.deleteCharIdx, 1);
            this.deleteCharIdx = null;
            this.renderCharList();
            ui.closeModal('modal-delete-char');
            this.saveData();
        }
    },

    openSheet(idx) {
        try {
            if (!this.userUid) {
                this.showToast('Faça login primeiro', 'error');
                return;
            }
            
            if (!this.characters || this.characters.length === 0) {
                this.showToast('Carregando fichas...', 'info');
                this.carregarFichasDoFirebase(this.userUid).then(() => {
                    if (this.characters && this.characters[idx]) {
                        this.openSheet(idx);
                    } else {
                        this.showToast('Nenhuma ficha encontrada', 'error');
                    }
                }).catch(err => {
                    console.error('Erro ao carregar fichas:', err);
                    this.showToast('Erro ao carregar fichas', 'error');
                });
                return;
            }
            
            if (!this.characters[idx]) {
                this.showToast('Índice de ficha inválido', 'error');
                return;
            }
            
            this.activeIdx = idx;
            const char = this.characters[idx];

            if (!char.combat) char.combat = { cc: { trained: false, attr: 'FOR', bonus: 0, total: 0 }, dist: { trained: false, attr: 'DEX', bonus: 0, total: 0 }, amal: { trained: false, attr: 'INT', bonus: 0, total: 0 } };
            if (!char.cdEspec) char.cdEspec = { attr: 'INT', trained: false, var: 0 };
            if (!char.desloc) char.desloc = '9m';
            if (!char.defesaExtras) char.defesaExtras = { eqp: 0, var: 0 };
            if (!char.inventario) char.inventario = [];
            if (!char.talentos) char.talentos = [];
            if (!char.invocacoes) char.invocacoes = [];
            if (!char.pix) char.pix = { saldo: 0, uid: this.userUid, transferencias: [] };
            if (!char.pix.uid) char.pix.uid = this.userUid;
            if (!char.pix.transferencias) char.pix.transferencias = [];
            if (!char.habilidades) char.habilidades = [];
            if (!char.feiticos) char.feiticos = [];
            if (!char.perfilAmaldicado) char.perfilAmaldicado = { aptidoes: [], tecnicas: [], expansao: null, tecnicaMax: null };
            if (!char.perfilAmaldicado.aptidoes) char.perfilAmaldicado.aptidoes = [];
            if (!char.perfilAmaldicado.tecnicas) char.perfilAmaldicado.tecnicas = [];
            
            document.getElementById('char-name').value = char.name;
        document.getElementById('char-name').oninput = function() {
            if (app.activeIdx !== null) {
                app.characters[app.activeIdx].name = this.value;
                app.saveData();
            }
        };
        document.getElementById('char-lvl').value = char.lvl;
        if (document.getElementById('lvl-current')) {
            document.getElementById('lvl-current').innerText = char.lvl;
        }
        document.getElementById('char-lvl').oninput = function() {
            if (app.activeIdx !== null) {
                app.autoCalculate();
                app.atualizarCorNivel(this.value);
            }
        };
        
        // Aplicar cor inicial do nível
        app.atualizarCorNivel(char.lvl);
        document.getElementById('char-origin').value = char.origin;
        document.getElementById('char-origin').onchange = function() { app.autoCalculate(); };
        document.getElementById('char-spec').value = char.spec;
        document.getElementById('char-spec').onchange = function() { app.autoCalculate(); };
        document.getElementById('origin-display').innerText = char.origin;
        document.getElementById('spec-display').innerText = char.spec;
        
        const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
        document.getElementById('char-avatar').src = (char.avatar && char.avatar.startsWith('data:image')) ? char.avatar : defaultAvatar;
        document.getElementById('iniciativa-val').value = char.iniciativa || 0;
        
        ['FOR', 'DEX', 'CON', 'INT', 'SAB', 'PRE'].forEach(a => {
            const el = document.getElementById('attr-' + a);
            el.value = char.attrs[a];
            el.oninput = function() { app.autoCalculate(); };
        });

        document.getElementById('char-desloc').value = char.desloc;
        document.getElementById('def-eqp').value = char.defesaExtras.eqp;
        document.getElementById('def-var').value = char.defesaExtras.var;
        document.getElementById('cd-attr').value = char.cdEspec.attr;
        document.getElementById('cd-var').value = char.cdEspec.var;

        document.getElementById('cc-trained').checked = char.combat.cc.trained;
        document.getElementById('cc-attr').value = char.combat.cc.attr;
        document.getElementById('cc-bonus').value = char.combat.cc.bonus;
        document.getElementById('dist-trained').checked = char.combat.dist.trained;
        document.getElementById('dist-bonus').value = char.combat.dist.bonus;
        document.getElementById('amal-trained').checked = char.combat.amal.trained;
        document.getElementById('amal-attr').value = char.combat.amal.attr;
        document.getElementById('amal-bonus').value = char.combat.amal.bonus;

        this.autoCalculate();
        this.renderLists();
        this.renderAptitudes();
        this.renderInventario();
        this.generateRewards();
        this.updateInfoBoxes();
        this.renderTalentos();
        
        if (!char.perfilAmaldicado) {
            char.perfilAmaldicado = { aptidoes: [], tecnicas: [], expansao: { nome: '', tipo: '', desc: '' }, tecnicaMax: { nome: '', desc: '' } };
        }
        
        document.getElementById('expansao-nome').value = char.perfilAmaldicado.expansao?.nome || '';
        document.getElementById('expansao-tipo').value = char.perfilAmaldicado.expansao?.tipo || '';
        document.getElementById('expansao-desc').value = char.perfilAmaldicado.expansao?.desc || '';
        document.getElementById('tecnica-max-nome').value = char.perfilAmaldicado.tecnicaMax?.nome || '';
        document.getElementById('tecnica-max-desc').value = char.perfilAmaldicado.tecnicaMax?.desc || '';
        
        this.renderAptPerfil();
        this.renderTecnicasPersonalizadas();
        
        if (!char.invocacoes) char.invocacoes = [];
        this.renderInvocacoes();
        
        this.updateSaldoDisplay();
        if (char.pix?.uid) {
            document.getElementById('pix-uid-display').innerText = char.pix.uid;
        }
        
        ui.showScreen('dashboard-screen');
    } catch (e) {
        console.error('Error opening sheet:', e);
        console.error('ActiveIdx:', this.activeIdx);
        console.error('Characters:', this.characters);
        this.showToast('Erro ao carregar ficha: ' + e.message, 'error');
    }
},

    getModifier(val) {
        return Math.floor((val - 10) / 2);
    },

    calcularEfeitos(char) {
        const efeitos = {
            ataque: 0,
            dano: 0,
            danoDice: "",
            defesa: 0,
            cd: 0,
            pericia: {},
            pvBonus: 0,
            details: []
        };
        
        const lvl = char.lvl || 1;
        const spec = char.spec;
        const treino = Math.floor((lvl - 1) / 4) + 2;
        const mods = {};
        ['FOR', 'DEX', 'CON', 'INT', 'SAB', 'PRE'].forEach(a => {
            mods[a] = this.getModifier(char.attrs[a] || 10);
        });
        const BT = treino;
        const CONmod = mods.CON;
        
        const processarEfeitos = (efeitosList, sourceName) => {
            if (!efeitosList || !Array.isArray(efeitosList)) return;
            efeitosList.forEach(efeito => {
                if (!efeito.tipo || !efeito.valor) return;
                
                let valorCalc = 0;
                let diceAdd = "";
                
                const cond = efeito.cond || "";
                
                switch (efeito.tipo) {
                    case "ataque":
                        valorCalc = this.evalExpressao(efeito.valor, { BT, CON: CONmod, lvl, ...mods });
                        if (valorCalc !== 0) {
                            efeitos.ataque += valorCalc;
                            efeitos.details.push({ source: sourceName, type: "ataque", value: valorCalc, cond: cond });
                        }
                        break;
                    case "dano":
                        if (String(efeito.valor).includes("d")) {
                            diceAdd = efeito.valor;
                        } else {
                            valorCalc = this.evalExpressao(efeito.valor, { BT, CON: CONmod, lvl, ...mods });
                            if (valorCalc !== 0) {
                                efeitos.dano += valorCalc;
                                efeitos.details.push({ source: sourceName, type: "dano", value: valorCalc, cond: cond });
                            }
                        }
                        break;
                    case "dano-nivel":
                        if (cond.includes("arma-dedicada")) {
                            valorCalc = parseInt(efeito.valor) || 0;
                            efeitos.dano += valorCalc;
                            efeitos.details.push({ source: sourceName, type: "dano-nivel", value: valorCalc, cond: "arma dedicada" });
                        }
                        break;
                    case "defesa":
                        valorCalc = this.evalExpressao(efeito.valor, { BT, CON: CONmod, lvl, ...mods });
                        if (valorCalc !== 0) {
                            efeitos.defesa += valorCalc;
                            efeitos.details.push({ source: sourceName, type: "defesa", value: valorCalc, cond: cond });
                        }
                        break;
                    case "cd":
                        valorCalc = this.evalExpressao(efeito.valor, { BT, CON: CONmod, lvl, ...mods });
                        if (valorCalc !== 0) {
                            efeitos.cd += valorCalc;
                            efeitos.details.push({ source: sourceName, type: "cd", value: valorCalc });
                        }
                        break;
                    case "pericia":
                        if (efeito.cond && !efeitos.pericia[efeito.cond]) {
                            valorCalc = parseInt(efeito.valor) || 0;
                            efeitos.pericia[efeito.cond] = valorCalc;
                            efeitos.details.push({ source: sourceName, type: "pericia", skill: efeito.cond, value: valorCalc });
                        }
                        break;
                    case "pv-bonus":
                        if (efeito.valor === "nivel-lutador" && spec === "Lutador") {
                            efeitos.pvBonus += lvl;
                            efeitos.details.push({ source: sourceName, type: "pv", value: lvl });
                        }
                        break;
                }
            });
        };
        
        if (char.habilidades && Array.isArray(char.habilidades)) {
            char.habilidades.forEach(hStr => {
                const hNome = hStr.split('|')[0];
                const hData = this.findHabilidade(hNome, spec);
                if (hData && hData.efeitos) {
                    processarEfeitos(hData.efeitos, hNome);
                }
            });
        }
        
        if (char.feiticos && Array.isArray(char.feiticos)) {
            char.feiticos.forEach(fStr => {
                const fNome = fStr.split('|')[0];
                const fData = this.findFeitico(fNome);
                if (fData && fData.efeitos) {
                    processarEfeitos(fData.efeitos, fNome);
                }
            });
        }
        
        if (char.talentos && Array.isArray(char.talentos)) {
            char.talentos.forEach(tStr => {
                const tNome = tStr.split('|')[0];
                const tData = this.findTalento(tNome);
                if (tData && tData.efeitos) {
                    processarEfeitos(tData.efeitos, tNome);
                }
            });
        }
        
        return efeitos;
    },

    evalExpressao(expr, vars) {
        if (typeof expr === 'number') return expr;
        if (typeof expr !== 'string') return 0;
        
        expr = expr.toUpperCase().replace(/BT/g, vars.BT)
                           .replace(/CON/g, vars.CON)
                           .replace(/LVL/g, vars.lvl)
                           .replace(/NIVEL/g, vars.lvl)
                           .replace(/FOR/g, vars.FOR || 0)
                           .replace(/DEX/g, vars.DEX || 0)
                           .replace(/INT/g, vars.INT || 0)
                           .replace(/SAB/g, vars.SAB || 0)
                           .replace(/PRE/g, vars.PRE || 0)
                           .replace(/FLOOR\(([^)]+)\)/g, (_, x) => 'Math.floor(' + x + ')');
        
        try {
            return eval(expr);
        } catch {
            return 0;
        }
    },

    findHabilidade(nome, spec) {
        const habs = this.habilidadesRef[spec] || [];
        return habs.find(h => h.n === nome);
    },

    findFeitico(nome) {
        return this.feiticosRef.find(f => f.n === nome);
    },

    findTalento(nome) {
        return this.talentosRef.find(t => t.n === nome);
    },

    toggleTR(name, checked, type) {
        const char = this.characters[this.activeIdx];
        if (!char.trData) char.trData = { astucia: {}, fortitude: {}, reflexos: {}, vontade: {}, integridade: {} };
        
        if (type === 'trained') {
            char.trData[name].trained = checked;
            if (checked) char.trData[name].master = false;
        } else if (type === 'master') {
            char.trData[name].master = checked;
            if (checked) char.trData[name].trained = false;
        }
        
        this.autoCalculate();
    },

    autoCalculate() {
        if (this.activeIdx === null) return;
        const char = this.characters[this.activeIdx];
        
        if (!char.skills) char.skills = {};
        if (!char.combat) char.combat = { cc: { trained: false, attr: 'FOR', bonus: 0, total: 0 }, dist: { trained: false, attr: 'DEX', bonus: 0, total: 0 }, amal: { trained: false, attr: 'INT', bonus: 0, total: 0 } };
        if (!char.trData) char.trData = { astucia: {}, fortitude: {}, reflexos: {}, vontade: {}, integridade: {} };

        char.name = document.getElementById('char-name').value;
        const newLvl = parseInt(document.getElementById('char-lvl').value) || 1;
        
        const oldLvl = char.lvl;
        char.lvl = newLvl > 20 ? 20 : newLvl;
        char.origin = document.getElementById('char-origin').value;
        char.spec = document.getElementById('char-spec').value;

        const mods = {};
        ['FOR', 'DEX', 'CON', 'INT', 'SAB', 'PRE'].forEach(a => {
            const val = parseInt(document.getElementById('attr-' + a).value) || 0;
            char.attrs[a] = val;
            mods[a] = this.getModifier(val);
            document.getElementById('mod-' + a).innerText = mods[a] >= 0 ? '+' + mods[a] : mods[a];
        });

        char.defesaExtras.eqp = parseInt(document.getElementById('def-eqp').value) || 0;
        char.defesaExtras.var = parseInt(document.getElementById('def-var').value) || 0;

        char.combat.cc.trained = document.getElementById('cc-trained').checked;
        char.combat.cc.attr = document.getElementById('cc-attr').value;
        char.combat.cc.bonus = parseInt(document.getElementById('cc-bonus').value) || 0;

        char.combat.dist.trained = document.getElementById('dist-trained').checked;
        char.combat.dist.bonus = parseInt(document.getElementById('dist-bonus').value) || 0;

        char.combat.amal.trained = document.getElementById('amal-trained').checked;
        char.combat.amal.attr = document.getElementById('amal-attr').value;
        char.combat.amal.bonus = parseInt(document.getElementById('amal-bonus').value) || 0;

        const metNivel = Math.floor(char.lvl / 2);
        const treino = this.getTreinoBonus(char.lvl);

        const efeitos = this.calcularEfeitos(char);
        const defBonus = efeitos.defesa || 0;
        
        const valDef = 10 + char.defesaExtras.eqp + mods.DEX + metNivel + char.defesaExtras.var + defBonus;
        document.getElementById('def-val').innerText = valDef;
        document.getElementById('treino-val').innerText = "+" + treino;

        const valCd = 10 + mods[char.cdEspec.attr] + metNivel + char.cdEspec.var;
        document.getElementById('cd-espec-val').innerText = valCd;

        const perData = char.skills["Percepção"] || { trained: false, bonus: 0 };
        const valAten = 10 + mods.SAB + metNivel + (perData?.trained ? treino : 0) + (perData?.bonus || 0);
        document.getElementById('atencao-val').innerText = valAten;

        // Testes de Resistência
        if (!char.tr) char.tr = { astucia: 0, fortitude: 0, reflexos: 0, vontade: 0, integridade: 0 };
        if (!char.trData) char.trData = { astucia: {}, fortitude: {}, reflexos: {}, vontade: {}, integridade: {} };
        
        const baseTR = { astucia: mods.INT, fortitude: mods.CON, reflexos: mods.DEX, vontade: mods.SAB, integridade: mods.CON };
        const trainedBonus = treino;
        const masterBonus = Math.floor(treino * 1.5);
        
        ['astucia', 'fortitude', 'reflexos', 'vontade', 'integridade'].forEach(tr => {
            const trData = char.trData[tr];
            const bonus = trData.trained ? trainedBonus : (trData.master ? masterBonus : 0);
            char.tr[tr] = baseTR[tr] + metNivel + bonus + (trData.var || 0);
            
            const el = document.getElementById(tr + '-val');
            const elTrained = document.getElementById(tr + '-trained');
            const elMaster = document.getElementById(tr + '-master');
            const elVar = document.getElementById(tr + '-var');
            
            if (el) el.value = char.tr[tr];
            if (elTrained) elTrained.checked = trData.trained || false;
            if (elMaster) elMaster.checked = trData.master || false;
            if (elVar) elVar.value = trData.var || 0;
        });

        const ccTot = mods[char.combat.cc.attr] + metNivel + (char.combat.cc.trained ? treino : 0) + char.combat.cc.bonus;
        document.getElementById('cc-total').innerText = ccTot >= 0 ? '+' + ccTot : ccTot;
        char.combat.cc.total = ccTot;

        const distTot = mods.DEX + metNivel + (char.combat.dist.trained ? treino : 0) + char.combat.dist.bonus;
        document.getElementById('dist-total').innerText = distTot >= 0 ? '+' + distTot : distTot;
        char.combat.dist.total = distTot;

        const AmalTot = mods[char.combat.amal.attr] + metNivel + (char.combat.amal.trained ? treino : 0) + char.combat.amal.bonus;
        document.getElementById('amal-total').innerText = AmalTot >= 0 ? '+' + AmalTot : AmalTot;
        char.combat.amal.total = AmalTot;
        
        if (defBonus !== 0) {
            document.getElementById('def-val').innerText = valDef + " (+" + defBonus + ")";
        }
        
        char.defesaBonus = defBonus;
        
        // HP cálculo - base + hpOpcao por nível + CON mod por nível
        let isRestr = char.spec === 'Restringido' || char.origin === 'Restringido';
        const stats = this.specStats[char.spec];
        const baseHp = stats.hp;
        const hpOpcao = stats.hpOpcao || 6;
        const conMod = this.getModifier(char.attrs.CON) || 0;
        
        // HP = base + ((nível - 1) * hpOpcao) + (CON mod * nível)
        char.hp.max = baseHp + ((char.lvl - 1) * hpOpcao) + (char.lvl * conMod);
        
        // Integridade sincronizada com HP (sempre acompanha o HP máximo)
        if (!char.integridade) {
            char.integridade = { curr: char.hp.max, max: char.hp.max };
        } else {
            char.integridade.max = char.hp.max;
            if (!char.integridade.curr || char.integridade.curr < char.integridade.max) {
                char.integridade.curr = char.hp.max;
            }
        }
        
        // PE cálculo
        const basePe = stats.pe;
        let peBonusAttr = 0;
        if (stats.peAttr) {
            peBonusAttr = this.getModifier(char.attrs[stats.peAttr]) || 0;
        }
        char.pe.max = basePe + ((char.lvl - 1) * basePe) + (char.lvl * peBonusAttr);

        document.getElementById('label-energy').innerText = isRestr ? "RESTRIÇÃO CELESTIAL" : "PONTOS DE ENERGIA";
        document.getElementById('btn-feiticos').style.display = isRestr ? 'none' : 'block';
        document.getElementById('energy-color-config').style.display = isRestr ? 'none' : 'flex';
        
        const peBar = document.getElementById('pe-fill');
        if (peBar) peBar.classList.toggle('restringido', isRestr);
        
        if (!isRestr && char.pix?.energyColor) {
            document.getElementById('energy-color-picker').value = char.pix.energyColor;
            document.documentElement.style.setProperty('--energy', char.pix.energyColor);
            peBar.style.background = char.pix.energyColor;
            peBar.style.boxShadow = '0 0 8px ' + char.pix.energyColor;
            document.getElementById('label-energy').style.color = char.pix.energyColor;
        }

        if (char.hp.curr > char.hp.max) char.hp.curr = char.hp.max;
        if (char.pe.curr > char.pe.max) char.pe.curr = char.pe.max;

        this.updateResourceUI();
        this.renderSkillsUI(mods, metNivel, treino);
        this.generateRewards();
        this.updateInfoBoxes();
        this.saveData();
    },

    updateInfoBoxes() {
        if (this.activeIdx === null) return;
        const lvl = parseInt(document.getElementById('char-lvl').value) || 1;
        const treino = this.getTreinoBonus(lvl);
        
        document.getElementById('info-treino').innerText = '+' + treino;
        
        const grau = this.getGrau(lvl);
        document.getElementById('info-grau').innerText = grau;
    },

    getGrau(lvl) {
        if (lvl >= 17) return '1° Grau';
        if (lvl >= 13) return '2° Grau';
        if (lvl >= 9) return '3° Grau';
        if (lvl >= 5) return '4° Grau';
        return '4° Grau';
    },

    saveDesloc(val) {
        if (this.activeIdx !== null) {
            this.characters[this.activeIdx].desloc = val;
            this.saveData();
        }
    },

    updateCdEspecUI() {
        if (this.activeIdx !== null) {
            const char = this.characters[this.activeIdx];
            char.cdEspec.attr = document.getElementById('cd-attr').value;
            char.cdEspec.var = parseInt(document.getElementById('cd-var').value) || 0;
            this.autoCalculate();
            
            const metNivel = Math.floor(char.lvl / 2);
            const treino = this.getTreinoBonus(char.lvl);
            const mods = {};
            ['FOR', 'DEX', 'CON', 'INT', 'SAB', 'PRE'].forEach(a => {
                mods[a] = this.getModifier(char.attrs[a] || 10);
            });
            const valCd = 10 + mods[char.cdEspec.attr] + metNivel + char.cdEspec.var;
            document.getElementById('cd-espec-val-perfil').innerText = valCd;
        }
    },

    applyLevelUp(oldLvl, newLvl) {
        const char = this.characters[this.activeIdx];
        const stats = this.specStats[char.spec];
        const baseHp = stats.hp;
        const hpOpcao = stats.hpOpcao || 6;
        
        // HP = baseHp + (hpOpcao * (nível - 1)) + (CON mod * nível)
        // Para nível 1: baseHp apenas
        // Para cada nível acima: baseHp + hpOpcao + CON mod
        char.hp.max = baseHp + ((newLvl - 1) * hpOpcao) + (newLvl * this.getModifier(char.attrs.CON || 10));
        
        // PE
        let basePe = stats.pe;
        let peBonusAttr = 0;
        if (stats.peAttr) {
            peBonusAttr = this.getModifier(char.attrs[stats.peAttr]) || 0;
        }
        char.pe.max = (newLvl * basePe) + (newLvl * peBonusAttr);
        
        if (char.hp.curr > char.hp.max) char.hp.curr = char.hp.max;
        if (char.pe.curr > char.pe.max) char.pe.curr = char.pe.max;
        
        this.updateResourceUI();
        this.saveData();
        this.showToast('Subiu para nível ' + newLvl + '!', 'success');
    },

    scrollAtencao(e) {
        e.preventDefault();
        const el = document.getElementById('atencao-val');
        const current = parseInt(el.value) || 10;
        const dir = e.deltaY > 0 ? -1 : 1;
        el.value = current + dir;
        this.autoCalculate();
    },

    saveAtencao() {
        const char = this.characters[this.activeIdx];
        char.percepcao = parseInt(document.getElementById('atencao-val').value) || 10;
        this.saveData();
    },

    saveInitiative(val) {
        if (this.activeIdx !== null) {
            this.characters[this.activeIdx].iniciativa = parseInt(val) || 0;
            this.saveData();
        }
    },

    saveTR(type, val) {
        if (this.activeIdx !== null) {
            this.characters[this.activeIdx].tr = this.characters[this.activeIdx].tr || {};
            this.characters[this.activeIdx].tr[type] = parseInt(val) || 0;
            this.saveData();
        }
    },

    rollTR(type) {
        if (this.activeIdx === null) return;
        const char = this.characters[this.activeIdx];
        const lvl = char.lvl || 1;
        const tr = char.tr || {};
        
        const trKey = type.toLowerCase()
            .replace('ú', 'u').replace('Ú', 'U')
            .replace('ô', 'o').replace('Ô', 'O')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const bonusExtra = parseInt(document.getElementById(trKey + '-val').value) || 0;
        
        let attrVal = 0;
        if (type === 'Astúcia') attrVal = char.attrs.INT || 10;
        else if (type === 'Fortitude') attrVal = char.attrs.CON || 10;
        else if (type === 'Reflexos') attrVal = char.attrs.DEX || 10;
        else if (type === 'Vontade') attrVal = char.attrs.SAB || 10;
        
        const attrMod = this.getModifier(attrVal);
        const halfLvl = Math.floor(lvl / 2);
        const baseTR = attrMod + halfLvl;
        const totalMod = baseTR + bonusExtra;
        
        this.rollDice(type, totalMod);
    },

    adjustResource(type, amount) {
        const char = this.characters[this.activeIdx];
        char[type].curr += amount;
        if (char[type].curr > char[type].max) char[type].curr = char[type].max;
        if (char[type].curr < 0) char[type].curr = 0;
        this.updateResourceUI();
        this.saveData();
    },

    setEnergyColor(hexColor) {
        const char = this.characters[this.activeIdx];
        if (!char.pix) char.pix = {};
        char.pix.energyColor = hexColor;
        this.saveData();
        
        document.documentElement.style.setProperty('--energy', hexColor);
        document.getElementById('pe-fill').style.background = hexColor;
        document.getElementById('pe-fill').style.boxShadow = '0 0 8px ' + hexColor;
        document.getElementById('label-energy').style.color = hexColor;
    },

    openResourceEdit(type) {
        this.editingResource = type;
        const char = this.characters[this.activeIdx];
        document.getElementById('edit-resource-title').innerText = `Editar ${type.toUpperCase()}`;
        document.getElementById('edit-resource-curr').value = char[type].curr;
        document.getElementById('edit-resource-max').value = char[type].max;
        ui.openModal('modal-edit-resource');
    },

    saveResourceEdit() {
        const char = this.characters[this.activeIdx];
        const t = this.editingResource;
        let curr = parseInt(document.getElementById('edit-resource-curr').value) || 0;
        let max = parseInt(document.getElementById('edit-resource-max').value) || 1;
        if (curr < 0) curr = 0;
        if (max < 1) max = 1;
        char[t].curr = curr;
        char[t].max = max;
        ui.closeModal('modal-edit-resource');
        this.updateResourceUI();
        this.saveData();
    },

    updateResourceUI() {
        const char = this.characters[this.activeIdx];
        document.getElementById('curr-hp').innerText = char.hp.curr;
        document.getElementById('max-hp').innerText = char.hp.max;
        document.getElementById('curr-pe').innerText = char.pe.curr;
        document.getElementById('max-pe').innerText = char.pe.max;
        document.getElementById('curr-integridade').innerText = char.integridade.curr;
        document.getElementById('max-integridade').innerText = char.integridade.max;

        const pctHp = char.hp.max > 0 ? (char.hp.curr / char.hp.max * 100) : 0;
        const pctPe = char.pe.max > 0 ? (char.pe.curr / char.pe.max * 100) : 0;
        const pctInt = char.integridade.max > 0 ? (char.integridade.curr / char.integridade.max * 100) : 0;

        document.getElementById('hp-fill').style.width = pctHp + '%';
        document.getElementById('pe-fill').style.width = pctPe + '%';
        document.getElementById('integridade-fill').style.width = pctInt + '%';

        this.updateIntegridadeBadge(pctHp);
    },

    updateIntegridadeBadge(pctHp) {
        const badge = document.getElementById('integridade-badge');
        badge.className = 'integridade-badge';
        
        if (pctHp <= 0) {
            badge.innerText = 'Morto';
            badge.classList.add('morto');
        } else if (pctHp <= 25) {
            badge.innerText = 'Crítico';
            badge.classList.add('critico');
        } else if (pctHp <= 50) {
            badge.innerText = 'Instável';
            badge.classList.add('instavel');
        } else if (pctHp <= 75) {
            badge.innerText = 'Danificado';
            badge.classList.add('danificado');
        } else {
            badge.innerText = 'Estável';
            badge.classList.add('estavel');
        }
    },

    renderSkillsUI(mods, halfLvl, treino) {
        const char = this.characters[this.activeIdx];
        
        if (!char.skills) char.skills = {};
        this.skillsRef.forEach(s => {
            if (!char.skills[s.n]) char.skills[s.n] = { trained: false, master: false, bonus: 0 };
        });
        
        const bt = this.getTreinoBonus(char.lvl);
        const trainedBonus = bt;
        const masterBonus = Math.floor(bt * 1.5);
        const container = document.getElementById('skill-container');
        
        container.innerHTML = this.skillsRef.map(s => {
            const data = char.skills[s.n];
            const isTrained = data?.trained || false;
            const isMaster = data?.master || false;
            const bonus = isTrained ? trainedBonus : (isMaster ? masterBonus : 0);
            const finalMod = mods[s.a] + bonus + (data?.bonus || 0);
            return `
            <div class="skill-item">
                <label style="display:flex; align-items:center; gap:5px;">
                    <input type="checkbox" class="custom-checkbox" ${isTrained ? 'checked' : ''} onchange="app.toggleSkill('${s.n}', this.checked, 'trained')" title="Treinado">
                    <span style="font-size:0.65rem; ${isTrained ? 'color:var(--accent);' : 'color:#555;'}">T</span>
                    <input type="checkbox" class="custom-checkbox" ${isMaster ? 'checked' : ''} onchange="app.toggleSkill('${s.n}', this.checked, 'master')" title="Mestre">
                    <span style="font-size:0.65rem; ${isMaster ? 'color:var(--hp);' : 'color:#555;'}">M</span>
                    ${s.n} <span style="color:#666; font-size:0.7rem;">(${s.a})</span>
                </label>
                <input type="number" class="skill-bonus-input" value="${data.bonus}" onchange="app.saveSkillBonus('${s.n}', this.value)" title="Bônus Extra">
                <div style="font-weight: bold; width: 30px; text-align: center; color: var(--accent);">${finalMod >= 0 ? '+' + finalMod : finalMod}</div>
                <button class="btn-roll" onclick="app.rollDice('${s.n}', ${finalMod})">Rolar</button>
            </div>
            `;
        }).join('');
    },

    toggleSkill(name, state, type) {
        const char = this.characters[this.activeIdx];
        
        if (!char.skills) char.skills = {};
        if (!char.skills[name]) char.skills[name] = { trained: false, master: false, bonus: 0 };
        
        if (type === 'trained') {
            if (state) {
                char.skills[name].trained = true;
                char.skills[name].master = false;
            } else {
                char.skills[name].trained = false;
            }
        } else if (type === 'master') {
            if (state) {
                char.skills[name].master = true;
                char.skills[name].trained = false;
            } else {
                char.skills[name].master = false;
            }
        }
        this.autoCalculate();
    },

    saveSkillBonus(name, val) {
        this.characters[this.activeIdx].skills[name].bonus = parseInt(val) || 0;
        this.autoCalculate();
    },

    rollCombat(type) {
        const char = this.characters[this.activeIdx];
        const efeitos = this.calcularEfeitos(char);
        
        let total = 0;
        if (type === 'Corpo a corpo') total = char.combat.cc.total;
        if (type === 'A Distância') total = char.combat.dist.total;
        if (type === 'Amaldiçoado') total = char.combat.amal.total;
        
        const bonusAtk = efeitos.ataque;
        const finalTotal = total + bonusAtk;
        
        let bonusMsg = "";
        if (bonusAtk !== 0) {
            const atkDetails = efeitos.details.filter(d => d.type === 'ataque');
            if (atkDetails.length > 0) {
                bonusMsg = `<br><small style="color:var(--accent)">Bônus: ${atkDetails.map(d => d.source + '+' + d.value).join(', ')}</small>`;
            }
        }
        
        this.rollDice(type, finalTotal, bonusMsg);
    },

    rollDice(name, mod, bonusMsg = "") {
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + mod;
        const signMod = mod >= 0 ? `+${mod}` : mod;

        const toast = document.createElement('div');
        toast.className = 'dice-toast fade-in';
        let color = "var(--text)";
        let totalColor = "var(--text)";
        if (d20 === 20) {
            color = "var(--accent)";
            totalColor = "#22c55e";
        }
        if (d20 === 1) {
            color = "var(--hp)";
            totalColor = "var(--hp)";
        }

        toast.style.borderColor = d20 === 1 ? "var(--hp)" : (d20 === 20 ? "var(--accent)" : "var(--border)");
        if (d20 === 1) toast.style.borderLeftColor = "var(--hp)";

        toast.innerHTML = `
            <div class="toast-title">${name}</div>
            <div class="toast-value" style="color: ${totalColor};">${total}</div>
            <div class="toast-math">D20 (${d20}) ${signMod}${bonusMsg}</div>
        `;
        document.getElementById('toast-container').appendChild(toast);
        document.getElementById('fab-menu').classList.remove('show');
        
        this.enviarRolagemCampanha(name, total, 20, mod);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4500);
    },

    updateArmaFields() {
        const cat = document.getElementById('arma-cat').value;
        const combatFields = document.getElementById('arma-combat-fields');
        const geralFields = document.getElementById('arma-geral-fields');
        
        if (cat === 'Geral') {
            combatFields.style.display = 'none';
            geralFields.style.display = 'block';
        } else {
            combatFields.style.display = 'block';
            geralFields.style.display = 'none';
        }
    },

    addArma() {
        const nome = document.getElementById('arma-nome').value || "Nova Arma";
        const desc = document.getElementById('arma-desc').value || "";
        const tipo = document.getElementById('arma-tipo').value;
        const cat = document.getElementById('arma-cat').value;
        const char = this.characters[this.activeIdx];

        if (cat === 'Geral') {
            const tipoItem = document.getElementById('arma-tipo-item').value;
            const qtd = parseInt(document.getElementById('arma-qtd').value) || 1;
            const efeitos = document.getElementById('arma-efeitos').value || "";
            char.inventario.push({ nome, desc, cat, tipoItem, qtd, efeitos });
        } else {
            const dano = document.getElementById('arma-dano').value || "1d6";
            const attr = document.getElementById('arma-attr').value;
            const varAtk = parseInt(document.getElementById('arma-var-atk').value) || 0;
            const varDano = parseInt(document.getElementById('arma-var-dano').value) || 0;
            char.inventario.push({ nome, desc, tipo, cat, dano, attr, varAtk, varDano });
        }

        this.saveData();
        this.renderInventario();
        ui.closeModal('modal-arma');

        document.getElementById('arma-nome').value = "";
        document.getElementById('arma-desc').value = "";
        document.getElementById('arma-dano').value = "";
        document.getElementById('arma-var-atk').value = "0";
        document.getElementById('arma-var-dano').value = "0";
        document.getElementById('arma-qtd').value = "1";
        document.getElementById('arma-efeitos').value = "";
    },

    removeArma(idx) {
        const char = this.characters[this.activeIdx];
        char.inventario.splice(idx, 1);
        this.saveData();
        this.renderInventario();
    },

    renderInventario() {
        if (this.activeIdx === null) return;
        const char = this.characters[this.activeIdx];
        const html = char.inventario.map((item, i) => {
            const isGeral = item.cat === 'Geral';
            if (isGeral) {
                return `
                    <div class="list-item-box">
                        <div class="list-item-title" style="align-items: center;">
                            <span>${item.nome} <small style="color:var(--accent); font-weight:normal; font-size:0.7rem; display:block;">${item.tipoItem} (x${item.qtd})</small></span>
                            <div style="display:flex; align-items:center; gap: 10px;">
                                <button class="delete-btn" onclick="app.removeArma(${i})">✕</button>
                            </div>
                        </div>
                        <div class="list-item-desc" style="margin-top: 8px;">
                            ${item.desc ? `<i>"${item.desc}"</i><br>` : ''}
                            ${item.efeitos ? `<strong>Efeitos:</strong> ${item.efeitos}<br>` : ''}
                        </div>
                    </div>
                `;
            }
            return `
                <div class="list-item-box">
                    <div class="list-item-title" style="align-items: center;">
                        <span>${item.nome} <small style="color:#888; font-weight:normal; font-size:0.7rem; display:block;">${item.tipo} - ${item.cat}</small></span>
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <button class="btn-roll" onclick="app.rollArma(${i})">Rolar</button>
                            <button class="delete-btn" onclick="app.removeArma(${i})">✕</button>
                        </div>
                    </div>
                    <div class="list-item-desc" style="margin-top: 8px;">
                        ${item.desc ? `<i>"${item.desc}"</i><br>` : ''}
                        <strong>Dano:</strong> ${item.dano} | <strong>Atributo:</strong> ${item.cat === 'Corpo a corpo' ? item.attr : 'N/A'} <br>
                        <strong style="color:var(--accent)">Variáveis:</strong> Ataque ${item.varAtk >= 0 ? '+' + item.varAtk : item.varAtk} / Dano ${item.varDano >= 0 ? '+' + item.varDano : item.varDano}
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('inventario-list').innerHTML = html || '<p style="text-align:center; color:#888; margin-top:30px;">Inventário vazio.</p>';
    },

    rollArma(idx) {
        const char = this.characters[this.activeIdx];
        const arma = char.inventario[idx];
        
        if (arma.cat === 'Geral') {
            this.showToast('Este item não pode ser usado em combate', 'info');
            return;
        }
        
        const efeitos = this.calcularEfeitos(char);

        let baseAtkMod = char.combat.cc.total;
        if (arma.cat === 'A distância') baseAtkMod = char.combat.dist.total;
        
        const bonusAtk = efeitos.ataque;
        const finalAtkMod = baseAtkMod + arma.varAtk + bonusAtk;
        const d20 = Math.floor(Math.random() * 20) + 1;
        const resultAtk = d20 + finalAtkMod;

        const parts = arma.dano.toLowerCase().split('d');
        const numDice = parseInt(parts[0]) || 1;
        const faces = parseInt(parts[1]) || 0;
        let rollDano = 0;
        for (let i = 0; i < numDice; i++) rollDano += Math.floor(Math.random() * faces) + 1;
        
        let baseDanoMod = 0;
        if (arma.cat === 'Corpo a corpo') {
            baseDanoMod = this.getModifier(char.attrs[arma.attr]);
        }
        
        let bonusDano = efeitos.dano;
        let extraDice = "";
        
        if (efeitos.danoDice) extraDice = efeitos.danoDice;
        
        if (arma.cat === 'Corpo a corpo' && char.habilidades) {
            const isDedicada = false;
            const hasDedica = char.habilidades.some(h => h.includes('Dedicação em Arma'));
            if (hasDedica) {
                bonusDano += 1;
                extraDice = extraDice ? extraDice + "+1d6" : "1d6";
            }
        }
        
        const finalDanoMod = baseDanoMod + arma.varDano + bonusDano;
        const resultDano = rollDano + finalDanoMod;
        
        let detalhesMsg = "";
        if (efeitos.details.length > 0) {
            const atkDetails = efeitos.details.filter(d => d.type === 'ataque' || d.type === 'dano');
            if (atkDetails.length > 0) {
                detalhesMsg = `<br><small style="color:var(--accent)">Bônus: ${atkDetails.map(d => d.source + (d.value > 0 ? '+' + d.value : d.value)).join(', ')}</small>`;
            }
        }

        const toast = document.createElement('div');
        toast.className = 'dice-toast fade-in';
        toast.style.borderColor = 'var(--hp)';
        toast.style.borderLeftColor = 'var(--accent)';
        toast.innerHTML = `
            <div class="toast-title">${arma.nome}</div>
            <div class="toast-value" style="font-size: 1.6rem; color: var(--text); display:flex; gap: 8px;">
                <div style="background:var(--input); padding: 5px 10px; border-radius: 4px; border:1px solid var(--border);">
                    <span style="color: var(--accent); font-size:1.8rem;">${resultAtk}</span> <span style="font-size:0.7rem; font-weight:normal;">ATK</span>
                </div>
                <div style="background:var(--input); padding: 5px 10px; border-radius: 4px; border:1px solid var(--border);">
                    <span style="color: var(--hp); font-size:1.8rem;">${resultDano}</span> <span style="font-size:0.7rem; font-weight:normal;">DANO</span>
                </div>
            </div>
            <div class="toast-math" style="margin-top:8px;">ATK: D20(${d20}) + Total(${finalAtkMod}) <br> DANO: ${arma.dano}(${rollDano}) + Mods(${finalDanoMod})${extraDice ? ' + ' + extraDice : ''}${detalhesMsg}</div>
        `;
        document.getElementById('toast-container').appendChild(toast);

        this.enviarRolagemCampanha(arma.nome + ' (Ataque)', resultAtk, 20, finalAtkMod);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 6000);
    },

    renderHabEspec() {
        const char = this.characters[this.activeIdx];
        if (!char.habEspec) char.habEspec = [];
        const container = document.getElementById('hab-espec-list');
        if (!container) return;
        
        container.innerHTML = char.habEspec.map((h, i) => `
            <div class="list-item-box">
                <div class="list-item-title" style="color:var(--accent); display:flex; justify-content:space-between;">
                    <span>${h.nome}</span>
                    <button class="delete-btn" onclick="app.removeHabEspec(${i})">✕</button>
                </div>
                <div class="list-item-desc">${h.desc || ''}</div>
            </div>
        `).join('') || '<p style="text-align:center; color:#888; margin-top:20px;">Nenhuma habilidade adicionada.</p>';
    },

    addHabEspec() {
        const nome = document.getElementById('hab-espec-nome').value;
        const desc = document.getElementById('hab-espec-desc').value;
        if (!nome) return;
        const char = this.characters[this.activeIdx];
        if (!char.habEspec) char.habEspec = [];
        char.habEspec.push({ nome, desc });
        this.saveData();
        this.renderHabEspec();
        ui.closeModal('modal-hab-espec');
        document.getElementById('hab-espec-nome').value = '';
        document.getElementById('hab-espec-desc').value = '';
    },

    removeHabEspec(idx) {
        const char = this.characters[this.activeIdx];
        char.habEspec.splice(idx, 1);
        this.saveData();
        this.renderHabEspec();
    },

    renderLists() {
        const char = this.characters[this.activeIdx];
        document.getElementById('hab-list').innerHTML = char.habilidades.map((h, i) =>
            `<div class="list-item-box"><div class="list-item-title">${h.split('|')[0]} <button class="delete-btn" onclick="app.removeEntry('hab', ${i})">✕</button></div><div class="list-item-desc">${h.split('|')[1]}</div></div>`
        ).join('');
        
        this.renderHabEspec();
        
        if (!char.feiticos) char.feiticos = [];
        
        document.getElementById('feiticos-list').innerHTML = char.feiticos.map((f, i) => {
            const parts = f.split('|');
            const nome = parts[0];
            const desc = parts[1] || '';
            const dano = parts[2] || '';
            const hasDano = dano && dano.length > 0;
            
            return `<div class="list-item-box">
                <div class="list-item-title" style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${nome}</span>
                    <button class="delete-btn" onclick="app.removeEntry('feitico', ${i})">✕</button>
                </div>
                ${hasDano ? `<div style="display:flex; gap:8px; margin:5px 0;">
                    <button class="btn-roll" onclick="app.rollFeitico('${f.replace(/'/g, "\\'")}')">🎲 Rolar ${dano}</button>
                </div>` : ''}
                <div class="list-item-desc">${desc}</div>
            </div>`;
        }).join('') || '<p style="text-align:center; color:#888; margin-top:20px;">Nenhum feitiço adicionado.</p>';
    },

    addEntry(type, selectId) {
        const val = document.getElementById(selectId).value;
        const arr = type === 'hab' ? this.characters[this.activeIdx].habilidades : this.characters[this.activeIdx].feiticos;
        if (!arr.includes(val)) {
            arr.push(val);
            this.renderLists();
            this.saveData();
        }
        ui.closeModal(type === 'hab' ? 'modal-hab' : 'modal-feitico');
    },

    addCustomHabilidade() {
        const nome = document.getElementById('hab-nome').value.trim();
        const desc = document.getElementById('hab-desc').value.trim();
        
        if (!nome) {
            return ui.showToast('Digite o nome da habilidade', 'error');
        }
        
        const char = this.characters[this.activeIdx];
        if (!char.habilidades) char.habilidades = [];
        
        char.habilidades.push(nome + '|' + desc);
        
        document.getElementById('hab-nome').value = '';
        document.getElementById('hab-desc').value = '';
        
        this.renderLists();
        this.saveData();
        ui.closeModal('modal-hab');
        ui.showToast('Habilidade criada!', 'success');
    },

    addCustomFeitico() {
        const nome = document.getElementById('feitico-nome').value.trim();
        const desc = document.getElementById('feitico-desc').value.trim();
        const dano = document.getElementById('feitico-dano').value.trim();
        
        if (!nome) {
            return ui.showToast('Digite o nome do feitiço', 'error');
        }
        
        const char = this.characters[this.activeIdx];
        if (!char.feiticos) char.feiticos = [];
        
        const danoAttr = dano.match(/\+(\w+)/i)?.[1] || '';
        const feiticoData = nome + '|' + desc + '|' + dano + '|' + danoAttr;
        char.feiticos.push(feiticoData);
        
        document.getElementById('feitico-nome').value = '';
        document.getElementById('feitico-desc').value = '';
        document.getElementById('feitico-dano').value = '';
        
        this.renderLists();
        this.saveData();
        ui.closeModal('modal-feitico');
        ui.showToast('Feitiço criado!', 'success');
    },

    rollFeitico(feat) {
        const parts = feat.split('|');
        const nome = parts[0];
        const desc = parts[1] || '';
        const dano = parts[2] || '';
        const attr = parts[3]?.toUpperCase() || 'INT';
        
        if (!dano) return;
        
        const char = this.characters[this.activeIdx];
        const isEspTecnica = char.spec === 'Especialista em Técnica';
        
        let total = 0;
        const rolls = [];
        const bonusMatch = dano.match(/(\d+)d(\d+)(?:([+-])(\d+))?/i);
        
        if (bonusMatch) {
            const numDice = parseInt(bonusMatch[1]);
            const diceSize = parseInt(bonusMatch[2]);
            for (let i = 0; i < numDice; i++) {
                const r = Math.floor(Math.random() * diceSize) + 1;
                rolls.push(r);
                total += r;
            }
            if (bonusMatch[4]) {
                total += (bonusMatch[3] === '+' ? 1 : -1) * parseInt(bonusMatch[4]);
            }
        }
        
        // Apenas Esp. Técnica soma o modificador de atributo no dano
        const attrVal = isEspTecnica ? (char.attrs[attr] || 10) : 10;
        const mod = isEspTecnica ? Math.floor((attrVal - 10) / 2) : 0;
        total += mod;
        
        const toast = document.createElement('div');
        toast.className = 'dice-toast fade-in';
        
        toast.innerHTML = `
            <div class="toast-title">${nome}</div>
            <div class="toast-value" style="color: var(--hp);">${total}</div>
            <div class="toast-math">${dano} (${rolls.join(' + ')}) + ${attr} ${mod >= 0 ? '+' : ''}${mod}</div>
            <div class="toast-math" style="font-size: 0.75rem; color: #888;">${desc}</div>
        `;
        document.getElementById('toast-container').appendChild(toast);
        
        const diceSize = parseInt(dano.split('d')[1]) || 6;
        this.enviarRolagemCampanha(nome, total, diceSize, mod);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4500);
    },

    removeEntry(type, idx) {
        if (type === 'talentos') {
            this.characters[this.activeIdx].talentos.splice(idx, 1);
            this.renderTalentos();
        } else {
            const arr = type === 'hab' ? this.characters[this.activeIdx].habilidades : this.characters[this.activeIdx].feiticos;
            arr.splice(idx, 1);
            this.renderLists();
        }
        this.saveData();
    },

    addTalent() {
        const select = document.getElementById('talento-db');
        const val = select.value;
        if (val && !this.characters[this.activeIdx].talentos.includes(val)) {
            this.characters[this.activeIdx].talentos.push(val);
            this.renderTalentos();
            this.saveData();
        }
        select.value = '';
    },

    renderTalentos() {
        const char = this.characters[this.activeIdx];
        document.getElementById('talentos-list').innerHTML = char.talentos.map((t, i) => {
            const parts = t.split('|');
            return `<div class="list-item-box"><div class="list-item-title">${parts[0]} <button class="delete-btn" onclick="app.removeEntry('talentos', ${i})">✕</button></div><div class="list-item-desc">${parts[1]}</div></div>`;
        }).join('') || '<p style="text-align:center; color:#888; margin-top:20px;">Nenhum talento.</p>';
    },

    addCustomTalento() {
        const nome = document.getElementById('talento-nome').value.trim();
        const desc = document.getElementById('talento-desc').value.trim();
        
        if (!nome) {
            return ui.showToast('Digite o nome do talento', 'error');
        }
        
        const char = this.characters[this.activeIdx];
        if (!char.talentos) char.talentos = [];
        
        char.talentos.push(nome + '|' + desc);
        
        document.getElementById('talento-nome').value = '';
        document.getElementById('talento-desc').value = '';
        
        this.renderTalentos();
        this.saveData();
        ui.closeModal('modal-talento');
        ui.showToast('Talento criado!', 'success');
    },

    renderAptitudes() {
        const char = this.characters[this.activeIdx];
        document.getElementById('apt-list').innerHTML = this.aptitudesRef.map(a => `
            <div class="apt-item">
                <div class="apt-info">
                    <span style="font-weight:bold; font-size:0.9rem; color:var(--accent);">${a.n}</span>
                    <span style="font-size:0.7rem; color:#888;">${a.desc}</span>
                </div>
                <div class="apt-lvl-control">
                    <span style="font-size:0.75rem;">Nv.</span>
                    <input type="number" min="0" max="5" value="${char.aptitudes[a.id]}" onchange="app.saveAptitude('${a.id}', this.value)">
                </div>
            </div>
        `).join('');
    },

    saveAptitude(id, val) {
        this.characters[this.activeIdx].aptitudes[id] = parseInt(val) || 0;
        this.saveData();
    },

    addAptPerfil() {
        const select = document.getElementById('apt-perfil');
        const val = select.value;
        if (!val) return;
        
        const parts = val.split('|');
        const char = this.characters[this.activeIdx];
        
        if (!char.perfilAmaldicado) {
            char.perfilAmaldicado = { aptidoes: [], tecnicas: [], expansao: { nome: '', tipo: '', desc: '' }, tecnicaMax: { nome: '', desc: '' } };
        }
        
        if (!char.perfilAmaldicado.aptidoes.find(a => a.nome === parts[0])) {
            char.perfilAmaldicado.aptidoes.push({ nome: parts[1], nivel: 0, tecnicas: [] });
            this.renderAptPerfil();
            this.saveData();
        }
        select.value = '';
    },

    renderAptPerfil() {
        const char = this.characters[this.activeIdx];
        if (!char.perfilAmaldicado || !char.perfilAmaldicado.aptidoes) {
            document.getElementById('apt-perfil-list').innerHTML = '';
            return;
        }
        
        document.getElementById('apt-perfil-list').innerHTML = char.perfilAmaldicado.aptidoes.map((apt, i) => `
            <div style="background:var(--input); padding:10px; border-radius:4px; margin-bottom:10px; border:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--accent); font-weight:bold;">${apt.nome}</span>
                    <button class="delete-btn" onclick="app.removeAptPerfil(${i})">✕</button>
                </div>
            </div>
        `).join('');
        
        this.renderTecnicasPorApt();
    },

    removeAptPerfil(idx) {
        const char = this.characters[this.activeIdx];
        char.perfilAmaldicado.aptidoes.splice(idx, 1);
        this.renderAptPerfil();
        this.saveData();
    },

    updateAptNivel(idx, nivel) {
        const char = this.characters[this.activeIdx];
        char.perfilAmaldicado.aptidoes[idx].nivel = parseInt(nivel) || 0;
        this.saveData();
    },

    renderTecnicasPorApt() {
        const char = this.characters[this.activeIdx];
        if (!char.perfilAmaldicado || !char.perfilAmaldicado.aptidoes) return;
        
        const container = document.getElementById('tecnicas-apt-container');
        container.innerHTML = '';
        
        char.perfilAmaldicado.aptidoes.forEach((apt, aptIdx) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="section-title"><span>Técnicas - ${apt.nome}</span></div>
                <div class="card" style="padding:15px; margin-bottom:20px;">
                    <button class="btn-main" style="margin-bottom:15px; font-size:0.8rem;" onclick="ui.openModal('modal-tecnica-apt')">+ Adicionar Técnica</button>
                    <div id="tecnicas-apt-${aptIdx}">
                        ${(apt.tecnicas || []).map((tec, i) => `
                            <div style="background:var(--input); padding:10px; border-radius:4px; margin-bottom:8px; border:1px solid var(--border);">
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:var(--text); font-weight:bold;">${tec.nome}</span>
                                    <button class="delete-btn" onclick="app.removeTecnicaApt(${aptIdx}, ${i})">✕</button>
                                </div>
                                <span style="font-size:0.7rem; color:var(--accent);">Nível ${tec.nivel}</span>
                                <p style="font-size:0.8rem; color:#888; margin-top:5px;">${tec.desc || ''}</p>
                            </div>
                        `).join('') || '<p style="color:#666; font-size:0.8rem;">Nenhuma técnica adicionada.</p>'}
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    },

    addTecnicaApt(aptIdx, nome, nivel, desc) {
        const char = this.characters[this.activeIdx];
        if (!char.perfilAmaldicado.aptidoes[aptIdx].tecnicas) {
            char.perfilAmaldicado.aptidoes[aptIdx].tecnicas = [];
        }
        char.perfilAmaldicado.aptidoes[aptIdx].tecnicas.push({ nome, nivel: parseInt(nivel), desc });
        this.renderTecnicasPorApt();
        this.saveData();
        ui.closeModal('modal-tecnica-apt');
    },

    addTecnicaAptFromModal() {
        const nome = document.getElementById('tecnica-apt-nome').value;
        const nivel = document.getElementById('tecnica-apt-nivel').value;
        const desc = document.getElementById('tecnica-apt-desc').value;
        
        if (!nome) return alert('Nome obrigatório!');
        
        const char = this.characters[this.activeIdx];
        const aptIdx = char.perfilAmaldicado.aptidoes.length - 1;
        
        this.addTecnicaApt(aptIdx, nome, nivel, desc);
        
        document.getElementById('tecnica-apt-nome').value = '';
        document.getElementById('tecnica-apt-desc').value = '';
    },

    removeTecnicaApt(aptIdx, tecIdx) {
        const char = this.characters[this.activeIdx];
        char.perfilAmaldicado.aptidoes[aptIdx].tecnicas.splice(tecIdx, 1);
        this.renderTecnicasPorApt();
        this.saveData();
    },

    saveExpansao() {
        const char = this.characters[this.activeIdx];
        if (!char.perfilAmaldicado) {
            char.perfilAmaldicado = { aptidoes: [], tecnicas: [], expansao: { nome: '', tipo: '', desc: '' }, tecnicaMax: { nome: '', desc: '' } };
        }
        char.perfilAmaldicado.expansao = {
            nome: document.getElementById('expansao-nome').value,
            tipo: document.getElementById('expansao-tipo').value,
            desc: document.getElementById('expansao-desc').value
        };
        this.saveData();
        this.showToast('Expansão de Domínio salva!');
    },

    saveTecnicaMax() {
        const char = this.characters[this.activeIdx];
        if (!char.perfilAmaldicado) {
            char.perfilAmaldicado = { aptidoes: [], tecnicas: [], expansao: { nome: '', tipo: '', desc: '' }, tecnicaMax: { nome: '', desc: '' } };
        }
        char.perfilAmaldicado.tecnicaMax = {
            nome: document.getElementById('tecnica-max-nome').value,
            desc: document.getElementById('tecnica-max-desc').value
        };
        this.saveData();
        this.showToast('Técnica Máxima salva!');
    },

    exportCharJSON() {
        const char = this.characters[this.activeIdx];
        const json = JSON.stringify(char, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (char.name || 'ficha') + '.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Ficha exportada!', 'success');
    },

    importCharJSON(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const char = JSON.parse(e.target.result);
                if (!char.name) {
                    return this.showToast('JSON inválido', 'error');
                }
                
                this.characters[this.activeIdx] = char;
                this.saveData();
                this.openSheet(this.activeIdx);
                this.showToast('Ficha importada!', 'success');
            } catch(err) {
                this.showToast('Erro ao importar', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    },

    criarOrigem() {
        ui.openModal('modal-criar-origin');
    },

    criarEspecializacao() {
        ui.openModal('modal-criar-spec');
    },

    salvarNovaOrigem() {
        const nome = document.getElementById('criar-origin-nome').value.trim();
        const desc = document.getElementById('criar-origin-desc').value.trim();
        
        if (!nome) return this.showToast('Digite o nome', 'error');
        
        const originList = JSON.parse(localStorage.getItem('jjk_custom_origins') || '[]');
        originList.push({ n: nome, d: desc, c: [] });
        localStorage.setItem('jjk_custom_origins', JSON.stringify(originList));
        
        document.getElementById('criar-origin-nome').value = '';
        document.getElementById('criar-origin-desc').value = '';
        
        ui.closeModal('modal-criar-origin');
        this.loadCustomClasses();
        this.showToast('Origem criada!', 'success');
    },

    salvarNovaEspecializacao() {
        const nome = document.getElementById('criar-spec-nome').value.trim();
        const desc = document.getElementById('criar-spec-desc').value.trim();
        const tipo = document.getElementById('criar-spec-tipo').value;
        
        if (!nome) return this.showToast('Digite o nome', 'error');
        
        const specList = JSON.parse(localStorage.getItem('jjk_custom_specs') || '[]');
        specList.push({ n: nome, d: desc, t: tipo });
        localStorage.setItem('jjk_custom_specs', JSON.stringify(specList));
        
        document.getElementById('criar-spec-nome').value = '';
        document.getElementById('criar-spec-desc').value = '';
        
        ui.closeModal('modal-criar-spec');
        this.loadCustomClasses();
        this.showToast('Especialização criada!', 'success');
    },

    addTecnicaPersonalizada() {
        const char = this.characters[this.activeIdx];
        if (!char.perfilAmaldicado) {
            char.perfilAmaldicado = { aptidoes: [], tecnicas: [], expansao: { nome: '', tipo: '', desc: '' }, tecnicaMax: { nome: '', desc: '' } };
        }
        
        const nome = document.getElementById('tecnica-personalizada-nome').value;
        const nivel = document.getElementById('tecnica-personalizada-nivel').value;
        const desc = document.getElementById('tecnica-personalizada-desc').value;
        
        if (!nome) return alert('Nome obrigatório!');
        
        char.perfilAmaldicado.tecnicas.push({ nome, nivel: parseInt(nivel), desc });
        this.renderTecnicasPersonalizadas();
        this.saveData();
        
        document.getElementById('tecnica-personalizada-nome').value = '';
        document.getElementById('tecnica-personalizada-desc').value = '';
        ui.closeModal('modal-tecnica-personalizada');
    },

    renderTecnicasPersonalizadas() {
        const char = this.characters[this.activeIdx];
        const container = document.getElementById('tecnicas-personalizadas-list');
        
        if (!char.perfilAmaldicado || !char.perfilAmaldicado.tecnicas || char.perfilAmaldicado.tecnicas.length === 0) {
            container.innerHTML = '<p style="color:#666; font-size:0.8rem; text-align:center;">Nenhuma técnica personalizada.</p>';
            return;
        }
        
        container.innerHTML = char.perfilAmaldicado.tecnicas.map((tec, i) => `
            <div style="background:var(--input); padding:10px; border-radius:4px; margin-bottom:8px; border:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:var(--text); font-weight:bold;">${tec.nome}</span>
                    <button class="delete-btn" onclick="app.removeTecnicaPersonalizada(${i})">✕</button>
                </div>
                <span style="font-size:0.7rem; color:var(--accent);">Nível ${tec.nivel}</span>
                <p style="font-size:0.8rem; color:#888; margin-top:5px;">${tec.desc || ''}</p>
            </div>
        `).join('');
    },

    removeTecnicaPersonalizada(idx) {
        const char = this.characters[this.activeIdx];
        char.perfilAmaldicado.tecnicas.splice(idx, 1);
        this.renderTecnicasPersonalizadas();
        this.saveData();
    },

    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'dice-toast fade-in';
        const colors = { success: '#22c55e', error: '#ef4444', info: 'var(--accent)', pix: '#22c55e' };
        toast.style.borderColor = colors[type] || 'var(--accent)';
        toast.style.background = type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg)';
        toast.innerHTML = `<div class="toast-title" style="color: ${colors[type] || 'var(--text)'}">${msg}</div>`;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    },

    addInvocacao() {
        const char = this.characters[this.activeIdx];
        
        // Ensure array exists
        if (!char.invocacoes || !Array.isArray(char.invocacoes)) {
            char.invocacoes = [];
        }
        
        if (char.invocacoes.length >= 15) {
            return alert('Limite de 15 invocações!');
        }
        
        const checkboxes = document.querySelectorAll('#invoca-skill-list .invoca-pericia-checkbox:checked');
        const periciasSelecionadas = Array.from(checkboxes).map(c => c.value);
        
        const invoca = {
            nome: document.getElementById('invoca-nome').value || 'Invocação',
            desc: document.getElementById('invoca-desc').value || '',
            attrs: {
                FOR: parseInt(document.getElementById('invoca-for').value) || 10,
                DEX: parseInt(document.getElementById('invoca-dex').value) || 10,
                CON: parseInt(document.getElementById('invoca-con').value) || 10,
                INT: parseInt(document.getElementById('invoca-int').value) || 10,
                SAB: parseInt(document.getElementById('invoca-sab').value) || 10,
                PRE: parseInt(document.getElementById('invoca-pre').value) || 10
            },
            pv: parseInt(document.getElementById('invoca-pv').value) || 10,
            pvMax: parseInt(document.getElementById('invoca-pv').value) || 10,
            defesa: parseInt(document.getElementById('invoca-def').value) || 10,
            desloc: document.getElementById('invoca-desloc').value || '9m',
            pericias: periciasSelecionadas
        };
        
        char.invocacoes.push(invoca);
        this.renderInvocacoes();
        this.saveData();
        
        // Reset form
        document.getElementById('invoca-nome').value = '';
        document.getElementById('invoca-desc').value = '';
        document.getElementById('invoca-pv').value = '10';
        document.getElementById('invoca-def').value = '10';
        document.getElementById('invoca-desloc').value = '9m';
        
        // Reset attribute fields
        ['for', 'dex', 'con', 'int', 'sab', 'pre'].forEach(attr => {
            document.getElementById('invoca-' + attr).value = '10';
        });
        
        // Uncheck all skill checkboxes
        document.querySelectorAll('#invoca-skill-list .invoca-pericia-checkbox').forEach(cb => cb.checked = false);
        
        ui.closeModal('modal-add-invocacao');
        this.showToast('Invocação criada!');
    },

    renderInvocacoes() {
        const char = this.characters[this.activeIdx];
        const container = document.getElementById('invocacoes-list');
        
        if (!char.invocacoes || char.invocacoes.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Nenhuma invocação. Clique em + Nova para criar.</p>';
            return;
        }
        
        container.innerHTML = char.invocacoes.map((inv, i) => {
            const mods = {
                FOR: Math.floor((inv.attrs.FOR - 10) / 2),
                DEX: Math.floor((inv.attrs.DEX - 10) / 2),
                CON: Math.floor((inv.attrs.CON - 10) / 2),
                INT: Math.floor((inv.attrs.INT - 10) / 2),
                SAB: Math.floor((inv.attrs.SAB - 10) / 2),
                PRE: Math.floor((inv.attrs.PRE - 10) / 2)
            };
            
            return `<div class="card" style="margin-bottom:15px; padding:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span style="color:var(--accent); font-weight:bold; font-size:1.1rem;">${inv.nome}</span>
                    <button class="delete-btn" onclick="app.removeInvocacao(${i})">✕</button>
                </div>
                ${inv.desc ? `<p style="color:#888; font-size:0.8rem; margin-bottom:10px;">${inv.desc}</p>` : ''}
                
                <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:5px; margin-bottom:10px;">
                    ${Object.keys(inv.attrs).map(a => `<div style="text-align:center; background:var(--input); padding:5px; border-radius:4px;">
                        <div style="font-size:0.6rem; color:#888;">${a}</div>
                        <div style="font-weight:bold; color:var(--accent);">${inv.attrs[a]}</div>
                        <div style="font-size:0.7rem; color:#666;">${mods[a] >= 0 ? '+' : ''}${mods[a]}</div>
                    </div>`).join('')}
                </div>
                
                <div style="display:flex; gap:15px; margin-bottom:10px; flex-wrap:wrap;">
                    <div style="background:var(--hp); color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem;">
                        PV: ${inv.pv}/${inv.pvMax}
                    </div>
                    <div style="background:var(--energy); color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem;">
                        DEF: ${inv.defesa}
                    </div>
                    <div style="background:#444; color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem;">
                        Desloc: ${inv.desloc}
                    </div>
                </div>
                
                ${inv.pericias && inv.pericias.length > 0 ? `
                <div class="section-title" style="font-size:0.7rem; margin-bottom:8px;"><span>Perícias Treinadas</span></div>
                <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;">
                    ${inv.pericias.map(p => {
                        const skillRef = this.skillsRef.find(s => s.n === p);
                        const attr = skillRef ? skillRef.a : 'INT';
                        const mod = Math.floor((inv.attrs[attr] - 10) / 2);
                        return `<button class="btn-roll" style="font-size:0.7rem; padding:4px 8px;" onclick="app.rollInvocaPericia(${i}, '${p}')">${p}</button>`;
                    }).join('')}
                </div>
                ` : ''}
                
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn-roll" onclick="app.rollInvocaAtk(${i}, 'FOR')">FOR</button>
                    <button class="btn-roll" onclick="app.rollInvocaAtk(${i}, 'DEX')">DEX</button>
                    <button class="btn-roll" onclick="app.rollInvocaAtk(${i}, 'CON')">CON</button>
                    <button class="btn-roll" onclick="app.rollInvocaAtk(${i}, 'INT')">INT</button>
                    <button class="btn-roll" onclick="app.rollInvocaAtk(${i}, 'SAB')">SAB</button>
                    <button class="btn-roll" onclick="app.rollInvocaAtk(${i}, 'PRE')">PRE</button>
                    <button class="btn-roll" style="background:var(--hp);" onclick="app.rollInvocaDano(${i})">Dano</button>
                </div>
            </div>`;
        }).join('');
    },

    rollInvocaAtk(idx, attr) {
        const char = this.characters[this.activeIdx];
        const invoca = char.invocacoes[idx];
        const mod = Math.floor((invoca.attrs[attr] - 10) / 2);
        this.rollDice(attr + ' ' + invoca.nome, mod);
    },

    rollInvocaPericia(idx, periciaNome) {
        const char = this.characters[this.activeIdx];
        const invoca = char.invocacoes[idx];
        const skillRef = this.skillsRef.find(s => s.n === periciaNome);
        const attr = skillRef ? skillRef.a : 'INT';
        const mod = Math.floor((invoca.attrs[attr] - 10) / 2);
        this.rollDice(periciaNome + ' (' + invoca.nome + ')', mod);
    },

    rollInvocaDano(idx) {
        const char = this.characters[this.activeIdx];
        const invoca = char.invocacoes[idx];
        const modCON = Math.floor((invoca.attrs.CON - 10) / 2);
        const dmg = Math.floor(Math.random() * 6) + 1 + modCON;
        const toast = document.createElement('div');
        toast.className = 'dice-toast fade-in';
        toast.style.borderColor = 'var(--hp)';
        toast.innerHTML = `<div class="toast-title">Dano ${invoca.nome}</div><div class="toast-value" style="color:var(--hp); font-size:2rem;">${dmg}</div><div class="toast-math">d6 + CON (${modCON})</div>`;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 4000);
    },

    removeInvocacao(idx) {
        const char = this.characters[this.activeIdx];
        char.invocacoes.splice(idx, 1);
        this.renderInvocacoes();
        this.saveData();
    },

    toggleInvocaPericia(periciaNome) {
        const container = document.getElementById('invoca-pericias');
        const existing = Array.from(container.querySelectorAll('.pericia-toggle')).map(b => b.textContent);
        
        if (existing.includes(periciaNome)) {
            const btn = Array.from(container.querySelectorAll('.pericia-toggle')).find(b => b.textContent === periciaNome);
            if (btn) btn.remove();
        } else {
            if (existing.length >= 4) return alert('Máximo 4 perícias!');
            const pericia = document.createElement('button');
            pericia.className = 'pericia-toggle';
            pericia.style.cssText = 'background:var(--accent); color:white; border:none; padding:5px 10px; border-radius:4px; font-size:0.7rem; cursor:pointer;';
            pericia.textContent = periciaNome;
            pericia.onclick = function() { this.remove(); };
            container.appendChild(pericia);
        }
    },

    openAddInvocacaoModal() {
        const container = document.getElementById('invoca-skill-list');
        container.innerHTML = '';
        
        this.skillsRef.forEach(s => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            div.style.cssText = 'padding: 5px 8px; font-size: 0.75rem;';
            div.innerHTML = `
                <label style="display:flex; align-items:center; gap:5px; font-size:0.7rem;">
                    <input type="checkbox" class="custom-checkbox invoca-pericia-checkbox" value="${s.n}">
                    ${s.n} <span style="color:#666; font-size:0.6rem;">(${s.a})</span>
                </label>
            `;
            container.appendChild(div);
        });
        
        ui.openModal('modal-add-invocacao');
    },

    saveData() {
        localStorage.setItem('jjk_chars', JSON.stringify(this.characters));
        this.salvarFichasFirebase();
    },

    generateRewards() {
        const char = this.characters[this.activeIdx];
        const specRewards = this.levelRewards[char.spec];
        
        let html = `<div style="margin-bottom: 15px; padding: 10px; background: var(--input); border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #888; margin-bottom: 5px;">ESPECIALIZAÇÃO</div>
            <div style="font-weight: bold; color: var(--accent);">${char.spec}</div>
        </div>`;
        
        html += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
        
        for (let lvl = 1; lvl <= char.lvl; lvl++) {
            const reward = specRewards[lvl];
            if (reward) {
                html += `<div style="padding: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 6px;">
                    <div style="font-weight: bold; color: var(--accent); font-size: 0.9rem;">Nível ${lvl}</div>
                    <div style="font-size: 0.85rem; color: var(--text); margin-top: 4px;">${reward}</div>
                </div>`;
            }
        }
        
        html += `</div>`;
        
        html += `<div style="margin-top: 20px; padding: 10px; background: var(--input); border-radius: 6px; border-left: 3px solid var(--energy);">
            <div style="font-size: 0.75rem; color: #888;">BÔNUS DE TREINAMENTO</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--energy);">+${this.getTreinoBonus(char.lvl)}</div>
        </div>`;
        
        html += `<div style="margin-top: 10px; padding: 10px; background: var(--input); border-radius: 6px; border-left: 3px solid var(--hp);">
            <div style="font-size: 0.75rem; color: #888;">DADOS DE VIDA ACUMULADOS</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--hp);">${char.lvl}${this.specStats[char.spec].dv}</div>
        </div>`;
        
        document.getElementById('reward-content').innerHTML = html;
    },

    getTreinoBonus(lvl) {
        if (lvl >= 17) return 6;
        if (lvl >= 13) return 5;
        if (lvl >= 9) return 4;
        if (lvl >= 5) return 3;
        return 2;
    },

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && this.activeIdx !== null) {
            const reader = new FileReader();
            reader.onload = ev => {
                document.getElementById('char-avatar').src = ev.target.result;
                this.characters[this.activeIdx].avatar = ev.target.result;
                this.renderCharList();
                this.saveData();
            }
            reader.readAsDataURL(file);
        }
    }
};

const ui = {
    showScreen(id) {
        if (id !== 'login-screen') {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) loginScreen.classList.add('hidden');
        }
        
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if (id === 'char-list-screen') app.renderCharList();
        
        const fabMenu = document.getElementById('fab-menu');
        if (fabMenu) fabMenu.classList.remove('show');
        
        document.querySelectorAll('.custom-select.open').forEach(el => {
            el.classList.remove('open');
        });
        window.scrollTo(0, 0);
    },
    showSubScreen(id) { 
        this.showScreen(id); 
        const fabMenu = document.getElementById('fab-menu');
        if (fabMenu) fabMenu.classList.remove('show');
    },
    showHome() { this.showScreen('home-screen'); },
    openModal(id) { 
        document.getElementById(id).style.display = 'flex'; 
        const fabMenu = document.getElementById('fab-menu');
        if (fabMenu) fabMenu.classList.remove('show');
    },
    closeModal(id) { document.getElementById(id).style.display = 'none'; }
};

window.onload = () => app.init();

app.toggleCustomSelect = function(type) {
    const container = document.getElementById('custom-' + type + '-container');
    container.classList.toggle('open');
};

app.selectCustomOption = function(type, value, event) {
    const container = document.getElementById('custom-' + type + '-container');
    const dropdown = document.getElementById('custom-' + type + '-dropdown');
    const display = document.getElementById(type + '-display');
    const select = document.getElementById('char-' + type);
    
    select.value = value;
    display.innerText = (value === 'Restringido') ? 'Restrição Celestial' : value;
    display.style.color = (value === 'Restringido') ? '#ef4444' : '';
    display.style.fontWeight = (value === 'Restringido') ? 'bold' : '';
    
    dropdown.querySelectorAll('.custom-select-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    const evt = event || window.event;
    if (evt && evt.target) {
        evt.target.classList.add('selected');
    }
    
    container.classList.remove('open');
    
    app.autoCalculate();
};

app.gerarCodigoCampanha = function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

app.campanhaAtiva = null;
app.campanhaRolagensListener = null;

app.criarCampanha = function() {
    const nome = document.getElementById('campanha-nome').value.trim();
    const senha = document.getElementById('campanha-senha').value.trim();
    
    if (!nome) return this.showToast('Digite o nome da campanha', 'error');
    if (!senha || senha.length !== 5 || !/^\d+$/.test(senha)) return this.showToast('Senha deve ter 5 dígitos', 'error');
    
    db.ref('campanhas').orderByChild('nome').equalTo(nome).once('value').then(snapshot => {
        if (snapshot.exists()) return this.showToast('Já existe uma campanha com este nome', 'error');
        
        const newCampanhaRef = db.ref('campanhas').push();
        const campanhaId = newCampanhaRef.key;
        
        newCampanhaRef.set({
            nome: nome,
            senha: senha,
            mestre: this.userUid || 'local',
            membros: [this.userUid || 'local'],
            fichas: {},
            createdAt: Date.now()
        }).then(() => {
            document.getElementById('campanha-nome').value = '';
            document.getElementById('campanha-senha').value = '';
            ui.closeModal('modal-criar-campanha');
            this.showToast('Campanha criada: ' + nome, 'success');
            this.carregarMinhasCampanhas();
        }).catch(err => this.showToast('Erro ao criar campanha', 'error'));
    });
};

app.abrirTelaCampanhas = function() {
    ui.showScreen('campaigns-screen');
    this.carregarMinhasCampanhas();
};

app.entrarCampanha = function() {
    const nome = document.getElementById('campanha-nome-entrar').value.trim();
    const senha = document.getElementById('campanha-senha-entrar').value.trim();
    
    if (!nome) return this.showToast('Digite o nome da campanha', 'error');
    if (!senha) return this.showToast('Digite a senha', 'error');
    
    db.ref('campanhas').orderByChild('nome').equalTo(nome).once('value').then(snapshot => {
        if (!snapshot.exists()) return this.showToast('Campanha não encontrada', 'error');
        
        let campanhaId = null;
        let campanhaData = null;
        
        snapshot.forEach(child => {
            campanhaId = child.key;
            campanhaData = child.val();
        });
        
        if (campanhaData.senha !== senha) return this.showToast('Senha incorreta', 'error');
        
        const uid = this.userUid || 'local';
        if (campanhaData.membros && campanhaData.membros.includes(uid)) {
            return this.showToast('Você já está nesta campanha', 'error');
        }
        
        const novosMembros = [...(campanhaData.membros || []), uid];
        db.ref('campanhas/' + campanhaId + '/membros').set(novosMembros).then(() => {
            document.getElementById('campanha-nome-entrar').value = '';
            document.getElementById('campanha-senha-entrar').value = '';
            ui.closeModal('modal-entrar-campanha');
            this.showToast('Você entrou na campanha: ' + nome, 'success');
            this.carregarMinhasCampanhas();
        });
    });
};

app.carregarMinhasCampanhas = function() {
    const uid = this.userUid || 'local';
    const container = document.getElementById('minhas-campanhas-container');
    
    db.ref('campanhas').once('value').then(snapshot => {
        let html = '';
        
        if (!snapshot.exists()) {
            html = '<div style="text-align: center; color: #888; padding: 20px;">Nenhuma campanha encontrada</div>';
        } else {
            snapshot.forEach(child => {
                const c = child.val();
                const isMembro = c.membros && c.membros.includes(uid);
                if (!isMembro) return;
                
                const isMestre = c.mestre === uid;
                html += `
                    <div class="char-slot" onclick="app.acessarCampanha('${child.key}')">
                        <div class="slot-info">
                            <div class="slot-name">${c.nome}</div>
                            <div class="slot-details" style="font-size: 0.7rem; color: #888;">${isMestre ? 'Mestre' : 'Membro'}</div>
                        </div>
                        <button class="btn-roll" onclick="event.stopPropagation(); app.acessarCampanha('${child.key}')">Acessar</button>
                    </div>
                `;
            });
        }
        
        if (html === '') {
            html = '<div style="text-align: center; color: #888; padding: 20px;">Nenhuma campanha encontrada</div>';
        }
        
        container.innerHTML = html;
    }).catch(() => {
        container.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">Erro ao carregar campanhas</div>';
    });
};

app.acessarCampanha = function(campanhaId) {
    this.campanhaAtiva = { id: campanhaId };
    
    db.ref('campanhas/' + campanhaId).once('value').then(snapshot => {
        const c = snapshot.val();
        if (!c) return this.showToast('Campanha não encontrada', 'error');
        
        document.getElementById('campanha-interna-nome').innerText = c.nome;
        document.getElementById('campanha-nome-editar').value = c.nome;
        
        const uid = this.userUid || 'local';
        const isMestre = c.mestre === uid;
        
        document.getElementById('campanha-mestre-actions').style.display = isMestre ? 'block' : 'none';
        document.getElementById('btn-escudo-mestre').style.display = isMestre ? 'block' : 'none';
        
        // Renderiza as fichas e ouve mudanças em tempo real
        this.escucharFichasCampanha(campanhaId);
        
        if (isMestre) {
            this.escucharRolagensCampanha(campanhaId);
            this.escucharPlayersCampanha(campanhaId);
        }
        
        ui.showScreen('campanha-interna-screen');
    });
};

app.escucharFichasCampanha = function(campanhaId) {
    // Listener em tempo real para as fichas
    db.ref('campanhas/' + campanhaId + '/fichas').on('value', snapshot => {
        this.renderizarFichasCampanha(campanhaId);
    });
};

app.escucharPlayersCampanha = function(campanhaId) {
    // Listener em tempo real para os membros
    db.ref('campanhas/' + campanhaId + '/membros').on('value', snapshot => {
        if (document.getElementById('players-campanha-panel').style.display === 'block') {
            this.mostrarPlayersCampanha();
        }
    });
};

app.escucharStatusJogadoresCampanha = function(campanhaId) {
    const uid = this.userUid || 'local';
    
    db.ref('campanhas/' + campanhaId + '/fichas').on('value', snapshot => {
        const fichasData = snapshot.val() || {};
        
        for (const [memberUid, charIndices] of Object.entries(fichasData)) {
            if (!Array.isArray(charIndices)) continue;
            
            charIndices.forEach(charIdx => {
                const char = this.characters[charIdx];
                if (!char) return;
                
                db.ref('campanhas/' + campanhaId + '/fichas/' + memberUid + '/' + charIdx).on('value', charSnapshot => {
                    const charData = charSnapshot.val();
                    if (charData && this.activeIdx === charIdx) {
                        if (charData.hp) this.characters[charIdx].hp = charData.hp;
                        if (charData.pe) this.characters[charIdx].pe = charData.pe;
                        if (charData.pvTemporario !== undefined) this.characters[charIdx].pvTemporario = charData.pvTemporario;
                        
                        this.updateCharDisplay();
                        
                        if (this.campanhaAtiva && this.campanhaAtiva.id === campanhaId) {
                            const statusPanel = document.getElementById('status-jogadores-panel');
                            if (statusPanel && statusPanel.style.display === 'block') {
                                this.renderizarStatusJogadores(campanhaId);
                            }
                        }
                    }
                });
            });
        }
    });
};

app.renderizarFichasCampanha = function(campanhaId) {
    db.ref('campanhas/' + campanhaId).once('value').then(campSnapshot => {
        const campData = campSnapshot.val();
        const currentUid = this.userUid || 'local';
        const isMestre = campData?.mestre === currentUid;
        
        db.ref('campanhas/' + campanhaId + '/fichas').once('value').then(snapshot => {
            const fichasData = snapshot.val() || {};
            let html = '';
            
            if (Object.keys(fichasData).length === 0) {
                html = '<div style="text-align: center; color: #888; padding: 20px;">Nenhum feiticeiro adicionado ainda</div>';
            } else {
                // Primeiro collect todas as promises de busca de fichas dos membros
                const memberPromises = [];
                const memberFichasData = {};
                
                for (const [memberUid, charIndices] of Object.entries(fichasData)) {
                    if (!Array.isArray(charIndices)) continue;
                    
                    // Buscar fichas do membro no Firebase
                    const p = db.ref('usuarios/' + memberUid + '/fichas').once('value').then(fichasSnap => {
                        memberFichasData[memberUid] = fichasSnap.val() || {};
                    });
                    memberPromises.push(p);
                }
                
                Promise.all(memberPromises).then(() => {
                    // Agora renderizar com os dados completos
                    for (const [memberUid, charIndices] of Object.entries(fichasData)) {
                        if (!Array.isArray(charIndices)) continue;
                        
                        charIndices.forEach(charIdx => {
                            // Buscar a ficha dos dados locais ou do membro
                            let char = this.characters[charIdx];
                            if (!char && memberFichasData[memberUid]) {
                                char = memberFichasData[memberUid][charIdx];
                            }
                            if (!char) return;
                            
                            const isMyChar = memberUid === currentUid;
                            const podeRemover = isMestre || isMyChar;
                            const removeBtn = podeRemover ? `<button class="btn-roll" onclick="app.removerFeiticeiroCampanha('${memberUid}', ${charIdx})" style="margin-left: 10px; padding: 5px 10px; font-size: 0.7rem; background: var(--hp);">✕</button>` : '';
                            
                            const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
                            const avatarSrc = (char.avatar && char.avatar.startsWith('data:image')) ? char.avatar : defaultAvatar;
                            
                            html += `
                                <div class="card" style="margin-bottom: 10px; padding: 15px; display: flex; align-items: center; gap: 10px;">
                                    <img src="${avatarSrc}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                                    <div style="flex: 1;">
                                        <div style="font-weight: bold; color: var(--accent);">${char.name || 'Sem nome'}</div>
                                        <div style="font-size: 0.8rem; color: #888;">${char.origin || '?'} - ${char.spec || '?'} | Nível ${char.lvl || 1}</div>
                                    </div>
                                    ${removeBtn}
                                </div>
                            `;
                        });
                    }
                    
                    document.getElementById('fichas-campanha-container').innerHTML = html || '<div style="text-align: center; color: #888; padding: 20px;">Nenhum feiticeiro encontrado</div>';
                });
            }
        });
    });
};

app.removerFeiticeiroCampanha = function(memberUid, charIdx) {
    if (!this.campanhaAtiva) return this.showToast('Nenhuma campanha ativa', 'error');
    
    const currentUid = this.userUid || 'local';
    const campanhaId = this.campanhaAtiva.id;
    
    db.ref('campanhas/' + campanhaId + '/fichas/' + memberUid).once('value').then(snapshot => {
        let fichas = snapshot.val() || [];
        const index = fichas.indexOf(charIdx);
        if (index > -1) {
            fichas.splice(index, 1);
        }
        
        if (fichas.length === 0) {
            db.ref('campanhas/' + campanhaId + '/fichas/' + memberUid).remove();
        } else {
            db.ref('campanhas/' + campanhaId + '/fichas/' + memberUid).set(fichas);
        }
        
        this.showToast('Feiticeiro removido!', 'success');
        
        setTimeout(() => {
            this.renderizarFichasCampanha(campanhaId);
        }, 500);
    }).catch(err => {
        console.error('Erro ao remover:', err);
        this.showToast('Erro ao remover', 'error');
    });
};

app.sairDaCampanha = function() {
    if (!this.campanhaAtiva) return this.showToast('Nenhuma campanha ativa', 'error');
    
    const uid = this.userUid || 'local';
    const campanhaId = this.campanhaAtiva.id;
    
    if (!confirm('Tem certeza que deseja sair desta campanha?')) return;
    
    db.ref('campanhas/' + campanhaId + '/membros').once('value').then(snapshot => {
        let membros = snapshot.val() || [];
        membros = membros.filter(m => m !== uid);
        
        if (membros.length === 0) {
            db.ref('campanhas/' + campanhaId).remove().then(() => {
                this.showToast('Você saiu da campanha e ela foi excluída', 'success');
                this.campanhaAtiva = null;
                ui.showScreen('campaigns-screen');
                this.carregarMinhasCampanhas();
            });
        } else {
            db.ref('campanhas/' + campanhaId + '/membros').set(membros).then(() => {
                this.showToast('Você saiu da campanha', 'success');
                this.campanhaAtiva = null;
                ui.showScreen('campaigns-screen');
                this.carregarMinhasCampanhas();
            });
        }
    });
};

app.adicionarFeiticeiroCampanha = function() {
    const charIdx = document.getElementById('feiticeiro-selecionar').value;
    if (!charIdx) return this.showToast('Selecione uma ficha', 'error');
    
    if (!this.campanhaAtiva) return this.showToast('Nenhuma campanha ativa', 'error');
    
    const uid = this.userUid || 'local';
    const campanhaId = this.campanhaAtiva.id;
    
    db.ref('campanhas/' + campanhaId + '/fichas/' + uid).once('value').then(snapshot => {
        const existingFichas = snapshot.val() || [];
        
        if (existingFichas.includes(parseInt(charIdx))) {
            return this.showToast('Esta ficha já foi adicionada', 'error');
        }
        
        const newFichas = [...existingFichas, parseInt(charIdx)];
        
        db.ref('campanhas/' + campanhaId + '/fichas/' + uid).set(newFichas).then(() => {
            ui.closeModal('modal-adicionar-feiticeiro');
            this.showToast('Feiticeiro adicionado à campanha!', 'success');
            this.renderizarFichasCampanha(campanhaId);
        });
    });
};

app.prepararModalAdicionarFeiticeiro = function() {
    const dropdown = document.getElementById('ficha-list-dropdown');
    
    let html = '';
    this.characters.forEach((char, idx) => {
        const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
        const avatarSrc = (char.avatar && char.avatar.startsWith('data:image')) ? char.avatar : defaultAvatar;
        
        html += `
            <div class="custom-select-option" onclick="app.selecionarFeiticeiro(${idx}, '${(char.name || 'Sem nome').replace(/'/g, "\\'")}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${avatarSrc}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">
                    <div>
                        <div style="font-weight: bold; color: var(--accent);">${char.name || 'Sem nome'}</div>
                        <div style="font-size: 0.75rem; color: #888;">${char.origin || '?'} - ${char.spec || '?'} | Nível ${char.lvl || 1}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    dropdown.innerHTML = html || '<div style="padding: 20px; text-align: center; color: #888;">Nenhuma ficha encontrada</div>';
    
    document.getElementById('ficha-current').innerText = 'Escolha uma ficha...';
    document.getElementById('feiticeiro-preview').style.display = 'none';
    document.getElementById('ficha-dropdown').classList.remove('open');
    
    ui.openModal('modal-adicionar-feiticeiro');
};

app.selecionarFeiticeiro = function(idx, nome) {
    document.getElementById('ficha-current').innerText = nome;
    document.getElementById('ficha-dropdown').classList.remove('open');
    document.getElementById('feiticeiro-selecionar').value = idx;
    
    const char = this.characters[idx];
    if (char) {
        document.getElementById('preview-nome').textContent = char.name || 'Sem nome';
        document.getElementById('preview-info').textContent = (char.origin || '?') + ' - ' + (char.spec || '?') + ' | Nível ' + (char.lvl || 1);
        
        const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
        const avatarSrc = (char.avatar && char.avatar.startsWith('data:image')) ? char.avatar : defaultAvatar;
        document.getElementById('preview-avatar').src = avatarSrc;
        
        document.getElementById('feiticeiro-preview').style.display = 'block';
    }
};

app.editarCampanha = function() {
    if (!this.campanhaAtiva) return this.showToast('Nenhuma campanha ativa', 'error');
    
    const nome = document.getElementById('campanha-nome-editar').value.trim();
    if (!nome) return this.showToast('Digite o nome da campanha', 'error');
    
    db.ref('campanhas/' + this.campanhaAtiva.id + '/nome').set(nome).then(() => {
        document.getElementById('campanha-interna-nome').innerText = nome;
        ui.closeModal('modal-editar-campanha');
        this.showToast('Campanha atualizada!', 'success');
    });
};

app.excluirCampanha = function() {
    if (!this.campanhaAtiva) return this.showToast('Nenhuma campanha ativa', 'error');
    
    ui.openModal('modal-confirmar-excluir');
};

app.confirmarExcluirCampanha = function() {
    const campanhaId = this.campanhaAtiva.id;
    
    db.ref('campanhas/' + campanhaId).remove().then(() => {
        this.campanhaAtiva = null;
        ui.closeModal('modal-confirmar-excluir');
        ui.closeModal('modal-editar-campanha');
        ui.showScreen('campaigns-screen');
        this.showToast('Campanha excluída!', 'success');
        this.carregarMinhasCampanhas();
    }).catch(err => {
        console.error('Erro ao excluir campanhas:', err);
        this.showToast('Erro ao excluir campanha', 'error');
    });
};

app.toggleEscudoMestre = function() {
    const panel = document.getElementById('escudo-mestre-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    
    if (panel.style.display === 'block') {
        this.mostrarRolagensCampanha();
    }
};

app.mostrarRolagensCampanha = function() {
    document.getElementById('rolagens-campanha-list').style.display = 'block';
    document.getElementById('players-campanha-panel').style.display = 'none';
    document.getElementById('btn-rolagens-campanha').classList.add('active');
    document.getElementById('btn-players-campanha').classList.remove('active');
};

app.mostrarPlayersCampanha = function() {
    if (!this.campanhaAtiva || !this.campanhaAtiva.id) {
        this.showToast('Nenhuma campanha ativa', 'error');
        return;
    }
    
    document.getElementById('rolagens-campanha-list').style.display = 'none';
    document.getElementById('players-campanha-panel').style.display = 'block';
    document.getElementById('btn-rolagens-campanha').classList.remove('active');
    document.getElementById('btn-players-campanha').classList.add('active');
    
    const listContainer = document.getElementById('players-campanha-list');
    listContainer.innerHTML = '<div style="text-align:center; color:#888; padding: 20px;">Carregando players...</div>';
    
    const currentUid = this.userUid || 'local';
    const currentNome = this.userNome || 'Você';
    
    db.ref('campanhas/' + this.campanhaAtiva.id + '/membros').once('value').then(snapshot => {
        const membros = snapshot.val() || [];
        
        if (!membros || membros.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; color:#888; padding: 20px;">Nenhum player na campanha</div>';
            return;
        }
        
        let playersData = [{ uid: currentUid, nome: currentNome }];
        
        // Busca nomes dos outros players no Firebase
        const otherMembers = membros.filter(m => m !== currentUid);
        
        if (otherMembers.length === 0) {
            renderizarPlayers(playersData);
            return;
        }
        
        const promises = otherMembers.map(uid => {
            return db.ref('usuarios/' + uid).once('value').then(userSnap => {
                const user = userSnap.val();
                return { uid: uid, nome: user?.nome || 'Player' };
            });
        });
        
        Promise.all(promises).then(otherPlayers => {
            playersData = playersData.concat(otherPlayers.filter(p => p.nome));
            renderizarPlayers(playersData);
        }).catch(() => {
            renderizarPlayers(playersData);
        });
        
        function renderizarPlayers(players) {
            if (players.length === 0) {
                listContainer.innerHTML = '<div style="text-align:center; color:#888; padding: 20px;">Nenhum player encontrado</div>';
                return;
            }
            
            let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
            players.forEach(p => {
                html += `
                    <div style="padding: 12px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 35px; height: 35px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: bold; color: white;">${(p.nome || 'J').charAt(0).toUpperCase()}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: var(--text);">${p.nome || 'Player'}</div>
                            <div style="font-size: 0.75rem; color: #888;">UID: ${p.uid}</div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            listContainer.innerHTML = html;
        }
    }).catch(err => {
        console.error('Erro ao buscar players:', err);
        listContainer.innerHTML = '<div style="text-align:center; color: var(--hp); padding: 20px;">Erro ao carregar players</div>';
    });
};

app.mostrarStatusJogadores = function() {
    document.getElementById('rolagens-campanha-list').style.display = 'none';
    document.getElementById('players-campanha-panel').style.display = 'block';
    this.renderizarStatusJogadores(this.campanhaAtiva.id);
};

app.renderizarStatusJogadores = function(campanhaId) {
    db.ref('campanhas/' + campanhaId + '/fichas').once('value').then(snapshot => {
        const fichasData = snapshot.val() || {};
        let html = `
            <div style="display: flex; flex-direction: column; gap: 10px;">
        `;
        
        for (const [memberUid, charIndices] of Object.entries(fichasData)) {
            if (!Array.isArray(charIndices)) continue;
            
            charIndices.forEach(charIdx => {
                const char = this.characters[charIdx];
                if (!char) return;
                
                const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z'/%3E%3C/svg%3E";
                const avatarSrc = (char.avatar && char.avatar.startsWith('data:image')) ? char.avatar : defaultAvatar;
                
                html += `
                    <div class="card" style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <img src="${avatarSrc}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
                            <div style="flex: 1;">
                                <div style="font-weight: bold; color: var(--accent);">${char.name || 'Sem nome'}</div>
                                <div style="font-size: 0.7rem; color: #888;">Nível ${char.lvl || 1} • ${char.origin || '-'} • ${char.spec || '-'}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <div style="flex: 1;">
                                <div style="font-size: 0.7rem; color: #888; margin-bottom: 3px;">VIDA (${char.hp?.curr || 0}/${char.hp?.max || 0})</div>
                                <div style="display: flex; gap: 5px; align-items: center;">
                                    <button class="btn-roll" onclick="app.editarStatusJogador('${memberUid}', ${charIdx}, 'hp', -1)" style="padding: 3px 8px;">-</button>
                                    <span style="color: var(--hp); font-weight: bold;">${char.hp?.curr || 0}</span>
                                    <button class="btn-roll" onclick="app.editarStatusJogador('${memberUid}', ${charIdx}, 'hp', 1)" style="padding: 3px 8px;">+</button>
                                </div>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 0.7rem; color: #888; margin-bottom: 3px;">ENERGIA (${char.pe?.curr || 0}/${char.pe?.max || 0})</div>
                                <div style="display: flex; gap: 5px; align-items: center;">
                                    <button class="btn-roll" onclick="app.editarStatusJogador('${memberUid}', ${charIdx}, 'pe', -1)" style="padding: 3px 8px;">-</button>
                                    <span style="color: var(--energy); font-weight: bold;">${char.pe?.curr || 0}</span>
                                    <button class="btn-roll" onclick="app.editarStatusJogador('${memberUid}', ${charIdx}, 'pe', 1)" style="padding: 3px 8px;">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        document.getElementById('status-jogadores-list').innerHTML = html;
    });
};

app.editarStatusJogador = function(memberUid, charIdx, tipo, valor) {
    const char = this.characters[charIdx];
    if (!char) return;
    
    if (tipo === 'hp') {
        char.hp.curr = Math.max(0, Math.min(char.hp.max, (char.hp.curr || 0) + valor));
    } else if (tipo === 'pe') {
        char.pe.curr = Math.max(0, Math.min(char.pe.max, (char.pe.curr || 0) + valor));
    }
    
    this.saveData();
    
    if (this.campanhaAtiva && this.campanhaAtiva.id) {
        const updates = {};
        updates['campanhas/' + this.campanhaAtiva.id + '/fichas/' + memberUid + '/' + charIdx + '/hp'] = char.hp;
        updates['campanhas/' + this.campanhaAtiva.id + '/fichas/' + memberUid + '/' + charIdx + '/pe'] = char.pe;
        
        db.ref().update(updates).then(() => {
            console.log('Status do jogador atualizado no Firebase da campanha');
        }).catch(err => {
            console.error('Erro ao atualizar status no Firebase:', err);
        });
    }
    
    this.renderizarStatusJogadores(this.campanhaAtiva.id);
};

app.mostrarRolagensCampanha = function(campanhaId) {
    this.escucharRolagensCampanha(campanhaId);
};

app.escucharRolagensCampanha = function(campanhaId) {
    if (this.campanhaRolagensListener) {
        db.ref('campanhas/' + campanhaId + '/rolagens').off('child_added', this.campanhaRolagensListener);
    }
    
    const listContainer = document.getElementById('rolagens-campanha-list');
    listContainer.innerHTML = '';
    
    this.campanhaRolagensListener = db.ref('campanhas/' + campanhaId + '/rolagens').limitToLast(50).on('child_added', snapshot => {
        const r = snapshot.val();
        
        // Mostrar nome da ficha e avatar da ficha
        const nomeExib = r.nomeJogador || 'Jogador';
        const avatarHtml = (r.avatar && r.avatar.length > 0) 
            ? `<img src="${r.avatar}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent);">`
            : `<div style="width: 35px; height: 35px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: bold; color: white;">${nomeExib.charAt(0).toUpperCase()}</div>`;
        
        const html = `
            <div style="padding: 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px;">
                ${avatarHtml}
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: var(--accent); font-size: 0.95rem;">${nomeExib}</div>
                    <div style="color: #888; font-size: 0.75rem;">${r.tipoRolagem || 'Rolagem'}</div>
                    <div style="font-size: 1.3rem; margin-top: 4px; font-weight: bold; color: var(--text);">
                        ${r.resultado} 
                        <span style="color: #666; font-size: 0.85rem;">(d${r.dado || 20}${r.mod >= 0 ? '+' + r.mod : r.mod})</span>
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += html;
    });
};

app.enviarRolagemCampanha = function(tipo, resultado, dado, mod) {
    if (!this.campanhaAtiva || !this.campanhaAtiva.id) {
        console.log('>> ERRO: Campanha não ativa ou sem ID');
        return;
    }
    
    console.log('>> Enviando rolagem para campanha:', this.campanhaAtiva.id);
    
    const uid = this.userUid || 'local';
    const char = this.characters[this.activeIdx];
    const charName = char?.name || 'Jogador';
    // Pegar avatar da ficha, se não tiver, usar null
    const charAvatar = (char?.avatar && char.avatar.startsWith('data:image')) ? char.avatar : null;
    
    db.ref('campanhas/' + this.campanhaAtiva.id + '/rolagens').push({
        uid: uid,
        nomeJogador: charName,
        avatar: charAvatar,
        tipoRolagem: tipo,
        resultado: resultado,
        dado: dado,
        mod: mod,
        timestamp: Date.now()
    });
};

document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select.open').forEach(el => {
            el.classList.remove('open');
            el.querySelector('.custom-select-dropdown').style.display = 'none';
        });
    }
});

window.app = app;