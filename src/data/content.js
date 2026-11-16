export const PHONE = '(85) 3474-4718';
export const PHONE_TEL = '+558534744718';
export const WHATSAPP = '(85) 98689-9938';
export const WHATSAPP_NUMBER = '5585986899938';
export const HOURS = 'Seg à Sex, 8h às 18h';
// O mesmo horário de HOURS, no formato dos dados estruturados do Google
export const OPENING_HOURS = { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' };
// Perfil informado na ficha da marca (empresa/SAIBA MAIS.png)
export const INSTAGRAM = '@grbassessoriacontabil';
export const INSTAGRAM_URL = 'https://instagram.com/grbassessoriacontabil';

// Domínio do site, SEM barra no final. Ex.: 'https://www.grbcontabilidade.com.br'
// Enquanto estiver vazio, o build não gera canonical/sitemap (evita apontar o Google para o endereço errado).
export const SITE_URL = '';

// Endereço — ajuste conforme necessário (as partes alimentam o endereço do site e os dados para o Google)
export const ADDRESS_STREET = 'R. Coronel Nunes Freire, 1591';
export const ADDRESS_DISTRICT = 'Siqueira';
export const ADDRESS_CITY = 'Fortaleza';
export const ADDRESS_STATE = 'CE';
export const ADDRESS_CEP = '60732-330';
export const ADDRESS = `${ADDRESS_STREET} - ${ADDRESS_DISTRICT}, ${ADDRESS_CITY} - ${ADDRESS_STATE}, ${ADDRESS_CEP}`;
// Ponto do escritório no mapa: latitude e longitude do número 1591 da rua do CEP 60732-330.
// O mapa usa as coordenadas, e não o texto do endereço, porque o Google Maps não reconhece o nome
// "R. Coronel Nunes Freire": ele e os Correios chamam a rua desse CEP de "Rua Pereira Silva", e a busca
// pelo texto mostrava só a região, sem marcador. Para mudar o ponto: no Google Maps, clique com o botão
// direito no lugar certo, copie os dois números e cole aqui.
export const MAPS_PONTO = '-3.8152872,-38.6281619';
// Link "Abrir no Google Maps": abre o mesmo ponto do mapa embutido
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_PONTO}`;
// Mapa embutido (não precisa de chave de API): marcador no ponto, com o nome da empresa na etiqueta
export const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(`${MAPS_PONTO} (GRB Assessoria Contábil)`)}&z=17&output=embed`;

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá. Encontrei a GRB Assessoria Contábil pelo site e gostaria de mais informações.')}`;
export const WHATSAPP_QUOTE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá. Gostaria de solicitar uma proposta para a minha empresa.')}`;
export const WHATSAPP_DIAG_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá. Gostaria de solicitar um diagnóstico gratuito do cenário fiscal e tributário da minha empresa.')}`;
export const WHATSAPP_OPEN_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá. Gostaria de abrir uma empresa com a GRB Assessoria Contábil.')}`;
export const WHATSAPP_LOCATION_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá. Gostaria de informações sobre a localização e o horário de atendimento.')}`;
// Link do WhatsApp com uma mensagem já escrita (usado no link "Solicitar este serviço" de cada quadro)
export const whatsappLink = (mensagem) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;


export const NAV_ITEMS = [
    { id: 'inicio', label: 'Início' },
    { id: 'empresa', label: 'Empresa' },
    { id: 'servicos', label: 'Serviços' },
    // { id: 'diferenciais', label: 'Diferenciais' },   // seção guardada: ver README
    { id: 'faq', label: 'FAQ' },
    { id: 'contato', label: 'Contato' },
];

export const REGIMES = [
    'Simples Nacional',
    'Lucro Presumido',
    'Lucro Real',
    'MEI',
    'Produtor Rural',
    'Terceiro Setor',
];

// Os 7 serviços e os nomes são os do folder "Serviços Contábeis" (referencia/).
// A descrição e os itens de cada um não estão no folder: são redação do site.
export const SERVICES = [
    {
        icon: 'document',
        title: 'Abertura, alteração e encerramento de empresas',
        text: 'Constituição, alteração contratual e encerramento de empresas, com orientação sobre o enquadramento tributário adequado e acompanhamento de todos os registros.',
        items: [
            'Consultoria de enquadramento',
            'Registro na Junta Comercial',
            'CNPJ, inscrições e alvarás',
            'Alterações contratuais e baixa de empresas',
        ],
    },
    {
        icon: 'calendar',
        title: 'Escrituração contábil e fiscal',
        text: 'Registro das operações comerciais e financeiras da empresa, com demonstrações contábeis e relatórios que refletem a situação real do negócio.',
        items: [
            'Escrituração Contábil Digital (ECD)',
            'Escrituração Fiscal Digital (EFD)',
            'Balanço patrimonial e DRE',
            'Relatórios gerenciais',
        ],
    },
    {
        icon: 'dollar',
        title: 'Apuração de impostos e obrigações tributárias',
        text: 'Apuração dos tributos e cumprimento das obrigações acessórias dentro dos prazos, com planejamento para que a empresa recolha apenas o devido, em conformidade com a legislação.',
        items: [
            'Apuração de ICMS, ISS, PIS e COFINS',
            'Obrigações acessórias',
            'Planejamento tributário',
            'Acompanhamento de fiscalizações',
        ],
    },
    {
        icon: 'users',
        title: 'Departamento pessoal e folha de pagamento',
        text: 'Da admissão ao desligamento, da folha de pagamento ao eSocial: rotinas trabalhistas e encargos cumpridos com regularidade.',
        items: [
            'Admissões e rescisões',
            'Folha de pagamento, férias e 13º salário',
            'FGTS, INSS, IRRF e eSocial',
            'Orientação trabalhista',
        ],
    },
    {
        icon: 'fileCheck',
        title: 'Declarações fiscais e Imposto de Renda',
        text: 'Elaboração e entrega, dentro do prazo, das declarações fiscais da empresa e do Imposto de Renda, com conferência para evitar multas e pendências.',
        items: [
            'Imposto de Renda Pessoa Física (IRPF)',
            'Declarações fiscais da empresa',
            'Declaração anual do MEI',
            'Retificação de declarações',
        ],
    },
    {
        icon: 'shield',
        title: 'Regularização de empresas e pendências fiscais',
        text: 'Regularização de empresas com pendências fiscais ou cadastrais, para a retomada das atividades com segurança.',
        items: [
            'Levantamento de pendências fiscais',
            'Declarações em atraso',
            'Parcelamento de débitos',
            'Regularização de CNPJ e cadastros',
        ],
    },
    {
        icon: 'chart',
        title: 'Consultoria contábil e orientação empresarial',
        text: 'Análise do negócio e orientação para decisões mais seguras, com identificação de oportunidades lícitas de economia e de melhoria da gestão.',
        items: [
            'Diagnóstico contábil e tributário',
            'Análise de indicadores',
            'Orientação para a tomada de decisão',
            'Pareceres técnicos',
        ],
    },
];

// Etapas da seção "Como funciona". Não trazem promessa nova: repetem o que o site já afirma
// nas perguntas frequentes (proposta, transição) e na chamada do diagnóstico gratuito.
export const PROCESS_STEPS = [
    { title: 'Contato inicial', text: 'Você fala com a nossa equipe pelo WhatsApp e apresenta a sua empresa e a sua necessidade.' },
    { title: 'Diagnóstico gratuito', text: 'Analisamos o cenário fiscal e tributário da sua empresa, sem custo e sem compromisso.' },
    { title: 'Proposta detalhada', text: 'Apresentamos os serviços e os honorários com clareza, sem custos não previstos.' },
    { title: 'Transição e acompanhamento', text: 'Conduzimos a transição da contabilidade atual, quando houver, e passamos a cuidar das obrigações da sua empresa.' },
];

// Missão, visão e valores: texto do folder da empresa (referencia/Infográfico Corporativo GRB)
export const PRINCIPLES = {
    mission: 'Oferecer serviços contábeis com ética, transparência e excelência, ajudando nossos clientes a cumprir suas obrigações e tomar decisões seguras para o crescimento sustentável de seus negócios.',
    vision: 'Ser referência em assessoria contábil pela confiança, qualidade no atendimento e compromisso com os resultados, contribuindo para o desenvolvimento de nossos clientes.',
    values: [
        'Ética e transparência',
        'Responsabilidade e compromisso',
        'Confiança e respeito',
        'Qualidade e organização',
        'Atendimento próximo e humanizado',
        'Atualização constante e inovação',
    ],
};

// Fotos do escritório (arquivos em public/fotos/, preparados com scripts/preparar_fotos.py).
// tall: foto em pé, ocupa a altura de duas fotos deitadas no mosaico.
export const OFFICE_PHOTOS = [
    { src: 'fotos/predio.webp', alt: 'Fachada do prédio onde fica o escritório da GRB', width: 940, height: 1674, tall: true },
    { src: 'fotos/equipe-no-escritorio.webp', alt: 'Equipe da GRB na mesa de trabalho', width: 1200, height: 799 },
    { src: 'fotos/escritorio.webp', alt: 'Estações de trabalho no escritório da GRB', width: 900, height: 1351, tall: true },
    { src: 'fotos/atendimento.webp', alt: 'Sala de atendimento da GRB', width: 1200, height: 799 },
];

// Textos da seção "Diferenciais". A seção está guardada, fora do site (ver README); os textos ficam aqui para a volta.
export const FEATURES = [
    { n: '01', title: 'Tecnologia', text: 'Automação de rotinas, integração com o sistema de gestão da empresa e painéis de acompanhamento em tempo real, acessíveis de qualquer lugar.' },
    { n: '02', title: 'Eficiência tributária', text: 'Monitoramento contínuo de oportunidades para reduzir a carga tributária da empresa, em conformidade com a legislação.' },
    { n: '03', title: 'Atendimento personalizado', text: 'Cada cliente conta com um contador dedicado, que conhece a operação da empresa e acompanha de perto as suas demandas.' },
    { n: '04', title: 'Segurança jurídica', text: 'Processos auditados, cópias de segurança em nuvem e conformidade com a LGPD, para a proteção dos dados da sua empresa.' },
    { n: '05', title: 'Proatividade', text: 'Acompanhamento de prazos, alertas sobre mudanças na legislação e orientações para apoiar decisões estratégicas.' },
    { n: '06', title: 'Transparência', text: 'Honorários e serviços definidos com clareza: o cliente sabe exatamente o que contrata e o que recebe.' },
];

export const TESTIMONIALS = [
    {
        // featured: card de destaque na largura toda (bom para depoimentos longos)
        featured: true,
        quote: 'Minha experiência com a GRB Assessoria Contábil tem sido extremamente positiva. Destaco o profissionalismo, a competência, a seriedade e a dedicação de toda a equipe. É uma empresa que transmite confiança, oferece um atendimento atencioso e demonstra compromisso em buscar sempre as melhores soluções para seus clientes.\nTer uma assessoria contábil que trabalha com responsabilidade, transparência e excelência faz toda a diferença. Recomendo a GRB Assessoria Contábil pela qualidade dos serviços e pela segurança que proporciona.',
        name: 'Geogiane Cavalcante',
        role: 'CEO',
        company: 'C de Construção',
        companyDesc: 'Elétrica, hidráulica e pintura em geral',
        // logo da empresa, mostrada ao lado do depoimento em destaque
        logo: 'clientes/c-de-construcao.png',
    },
    {
        // Depoimento da Infinity Quant, assinado pela empresa. Para assinar com nome e cargo de uma pessoa:
        // name: 'Nome', role: 'Cargo', company: 'Infinity Quant', companyDesc: 'Ciência de dados'
        quote: 'Na Infinity Quant, trabalhamos com ciência de dados e exigimos precisão. A GRB Assessoria Contábil entrega exatamente isso: organização, orientações claras e atendimento ágil. É uma parceria de total confiança, que recomendamos a outras empresas.',
        name: 'Infinity Quant',
        role: 'Ciência de dados',
        logo: 'clientes/infinity-quant.webp',
    },
    {
        quote: 'Migrei minha empresa para a GRB há 3 anos e nunca mais tive surpresa com imposto. Eles explicam tudo de um jeito que eu entendo, sem juridiquês.',
        name: 'Marcos Rodrigues',
        role: 'CEO',
        company: 'MR Distribuidora',
        companyDesc: 'Distribuidora de produtos alimentícios no Ceará',
    },
    {
        quote: 'O atendimento é impressionante. Mando uma dúvida pelo WhatsApp e recebo resposta em minutos, não em dias. Isso faz toda a diferença no dia a dia.',
        name: 'Ana Beatriz Lima',
        role: 'Sócia-proprietária',
        company: 'Studio Bella',
        companyDesc: 'Salão de beleza e estética em Fortaleza - CE',
    },
];

// Logos de clientes (arquivos em public/clientes/, preparados com scripts/preparar_logos.py)
export const CLIENTS = [
    { name: 'C de Construção', logo: 'clientes/c-de-construcao.png' },
    { name: 'Pinho Equipamentos', logo: 'clientes/pinho-equipamentos.png' },
    { name: 'Dominus', logo: 'clientes/dominus.png' },
    { name: 'Realize Mais Negócios Imobiliários', logo: 'clientes/realize-mais.png' },
    { name: 'S7 Gestão Industrial', logo: 'clientes/s7-gestao-industrial.png' },
    // logo sobre fundo escuro: preparada com scripts/preparar_logos.py --fundo-original
    { name: 'Infinity Quant', logo: 'clientes/infinity-quant.webp' },
];

export const FAQS = [
    {
        q: 'Qual é o valor dos honorários contábeis para a minha empresa?',
        a: 'Os honorários variam conforme o regime tributário, o volume de notas fiscais e o número de colaboradores. Realizamos um diagnóstico gratuito e apresentamos uma proposta detalhada, sem custos não previstos.',
    },
    {
        q: 'Como funciona a transferência da contabilidade atual para a GRB?',
        a: 'Conduzimos todo o processo: solicitamos a documentação ao contador atual, organizamos a base de dados e asseguramos que nenhuma obrigação deixe de ser cumprida durante a transição.',
    },
    {
        q: 'A GRB atende empresas de outros estados?',
        a: 'Sim. Nossa estrutura digital permite atender empresas em todo o Brasil com a mesma qualidade e agilidade oferecidas aos clientes de Fortaleza.',
    },
    {
        q: 'Qual é o prazo para a abertura de uma empresa?',
        a: 'Na maioria dos municípios, o CNPJ é emitido em até 5 dias úteis. Em casos como o do MEI, a formalização pode ser concluída de imediato.',
    },
    {
        q: 'É possível consultar os relatórios pela internet?',
        a: 'Sim. Disponibilizamos um portal do cliente para consulta de balanços, guias de impostos, folhas de pagamento e documentos contábeis, disponível 24 horas por dia.',
    },
];

export const SERVICE_OPTIONS = [
    'Contabilidade para a minha empresa',
    'Abertura de empresa',
    'Declarações e Imposto de Renda',
    'Departamento pessoal',
    'Regularização de empresa',
    'Troca de contabilidade',
    'Outro assunto',
];
