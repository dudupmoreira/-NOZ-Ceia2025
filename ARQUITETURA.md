# 🎄 Arquitetura - Ceia do Noz 2025

> ⚠️ **NOTA:** Este documento contém o planejamento original do projeto. Para o estado atual e funcionalidades implementadas, consulte [README.md](README.md)

## ✅ Status de Implementação (Dezembro 2025)

### Implementado
- ✅ Site principal com carrinho de compras
- ✅ Painel administrativo (tema claro, grid compacto)
- ✅ Integração com LeadConnector/Homio API
- ✅ Webhook para criação de contatos
- ✅ Custom fields mapeados corretamente
- ✅ Sistema de confirmação via PIX
- ✅ Badge "PIX Confirmado" e botão de confirmação
- ✅ URL compartilhável para restaurar pedido
- ✅ Otimização de imagens (WebP, 94% redução)
- ✅ Deploy automático no Vercel
- ✅ Correção de fuso horário (UTC-3)
- ✅ Cache busting para scripts
- ✅ Filtros e busca no painel admin
- ✅ Atualização manual de pedidos

### Stack Implementada
- Frontend: HTML5, CSS3, JavaScript Vanilla
- Hospedagem: Vercel
- Integração: LeadConnector/Homio API
- Imagens: WebP otimizado

---

## Visão Geral do Projeto

**Objetivo:** Redesign do site de pedidos da Ceia de Natal do Restaurante Noz Comida Afetiva, com UX/UI intuitiva (estilo iFood) e integração com Homio para automações.

**Fluxo Principal:**
```
[Landing Page] → [Seleção de Produtos] → [Carrinho] → [Dados do Cliente] → [Página de Confirmação com PIX]
                                                                                    ↓
                                                                            [Webhook → Homio]
                                                                                    ↓
                                                                            [Automações WhatsApp]
```

---

## 1. Arquitetura Técnica

### Stack Recomendada

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | React + Vite | Performance, SEO, fácil manutenção |
| **Estilização** | Tailwind CSS | Responsivo, rápido desenvolvimento |
| **Hospedagem** | Vercel / Netlify | Deploy simples, SSL grátis, CDN global |
| **Integração** | Homio Inbound Webhook | Criar contatos e disparar workflows |
| **Domínio** | ceiadonoz.nozcomidaafetiva.com.br | Manter o mesmo |

### Alternativa Simplificada (Single HTML)
Se preferir algo mais simples de manter:
- HTML + CSS + JavaScript vanilla
- Hospedagem no próprio servidor ou GitHub Pages
- Sem necessidade de build/deploy complexo

---

## 2. Estrutura de Páginas

### Página 1: Landing + Cardápio (Home)
```
┌─────────────────────────────────────────────────────────┐
│  🎄 HEADER                                              │
│  Logo Noz | "Ceia de Natal 2025"                       │
│  [Retirada: 24/12 ▼] [31/12 ▼]                         │
├─────────────────────────────────────────────────────────┤
│  HERO SECTION                                           │
│  "Sua ceia com o sabor de casa"                        │
│  Imagem principal do site atual                        │
├─────────────────────────────────────────────────────────┤
│  CATEGORIAS (tabs ou scroll horizontal)                │
│  [Entradas] [Proteínas] [Acompanhamentos] [Sobremesa]  │
├─────────────────────────────────────────────────────────┤
│  GRID DE PRODUTOS (estilo iFood)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │  Foto   │ │  Foto   │ │  Foto   │                   │
│  │  Nome   │ │  Nome   │ │  Nome   │                   │
│  │  Desc   │ │  Desc   │ │  Desc   │                   │
│  │ [+] R$  │ │ [+] R$  │ │ [+] R$  │                   │
│  └─────────┘ └─────────┘ └─────────┘                   │
├─────────────────────────────────────────────────────────┤
│  CARRINHO FLUTUANTE (bottom)                           │
│  [🛒 Ver carrinho (3 itens) - R$ 450,00]              │
└─────────────────────────────────────────────────────────┘
```

### Página 2: Carrinho + Dados
```
┌─────────────────────────────────────────────────────────┐
│  ← Voltar ao cardápio                                  │
├─────────────────────────────────────────────────────────┤
│  SEU PEDIDO                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 2x Salada de Bacalhau 500g      R$ 250,00  [-][+]│   │
│  │ 1x Chester/Peru                  R$ 535,00  [-][+]│   │
│  │ 1x Farofa Natalina 1kg          R$ 105,00  [-][+]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📅 Data de retirada: [24/12 ▼] ou [31/12 ▼]          │
│                                                         │
│  SEUS DADOS                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Nome completo: [________________]               │   │
│  │ WhatsApp: [________________]                    │   │
│  │ E-mail: [________________]                      │   │
│  │ Observações: [________________]                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  RESUMO                                                │
│  Subtotal:           R$ 890,00                        │
│  Entrada (50%):      R$ 445,00                        │
│                                                         │
│  [FINALIZAR PEDIDO →]                                  │
└─────────────────────────────────────────────────────────┘
```

### Página 3: Confirmação + PIX
```
┌─────────────────────────────────────────────────────────┐
│  ✅ PEDIDO RECEBIDO!                                   │
│  Pedido #NOZ-2025-0001                                 │
├─────────────────────────────────────────────────────────┤
│  RESUMO DO PEDIDO                                      │
│  ─────────────────────────────────────────────────     │
│  2x Salada de Bacalhau 500g ........... R$ 250,00     │
│  1x Chester/Peru ...................... R$ 535,00     │
│  1x Farofa Natalina 1kg ............... R$ 105,00     │
│  ─────────────────────────────────────────────────     │
│  TOTAL: R$ 890,00                                      │
│  📅 Retirada: 24/12/2025                              │
├─────────────────────────────────────────────────────────┤
│  💰 PAGAMENTO DA ENTRADA (50%)                         │
│                                                         │
│  Valor: R$ 445,00                                      │
│                                                         │
│  ┌─────────────────────┐                               │
│  │    [QR CODE PIX]    │                               │
│  │                     │                               │
│  └─────────────────────┘                               │
│                                                         │
│  PIX Copia e Cola:                                     │
│  [00020126580014br.gov.bcb...]  [📋 Copiar]           │
│                                                         │
│  Dados bancários:                                      │
│  Banco: XXX | Ag: XXXX | CC: XXXXX-X                  │
│  CNPJ: XX.XXX.XXX/0001-XX                             │
│  Noz Comida Afetiva LTDA                              │
├─────────────────────────────────────────────────────────┤
│  📱 PRÓXIMOS PASSOS                                    │
│                                                         │
│  1. Faça o PIX da entrada (R$ 445,00)                 │
│  2. Envie o comprovante pelo WhatsApp                 │
│  3. Aguarde a confirmação da equipe                   │
│                                                         │
│  [📲 Enviar comprovante via WhatsApp]                 │
├─────────────────────────────────────────────────────────┤
│  DÚVIDAS?                                              │
│  📞 (27) XXXX-XXXX                                    │
│  📍 Rua XXX, Vitória - ES                             │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Cardápio Estruturado (Dados)

```javascript
const cardapio = {
  entradas: [
    {
      id: "salada-bacalhau",
      nome: "Salada de Bacalhau e Grão de Bico",
      descricao: "Lascas de bacalhau gadus morhua, grão de bico, tomate, cebola roxa, azeitona preta, coentro, limão e azeite",
      imagem: "/images/salada-bacalhau.jpg",
      opcoes: [
        { peso: "1kg", preco: 220 },
        { peso: "500g", preco: 125 }
      ]
    },
    {
      id: "vinagrete-polvo",
      nome: "Vinagrete de Polvo",
      descricao: "Polvo, feijão fradinho, cebola roxa, tomate, pimentão amarelo, pimentão vermelho, coentro, limão e azeite",
      imagem: "/images/vinagrete-polvo.jpg",
      opcoes: [
        { peso: "1kg", preco: 220 },
        { peso: "500g", preco: 125 }
      ]
    },
    {
      id: "maionese-camarao",
      nome: "Maionese de Camarão",
      descricao: "Batata em cubos, camarão VG, cebola roxa, aioli de alho assado com páprica, cebolinha e limão",
      imagem: "/images/maionese-camarao.jpg",
      opcoes: [
        { peso: "1kg", preco: 220 },
        { peso: "500g", preco: 125 }
      ]
    },
    {
      id: "salpicao-defumado",
      nome: "Salpicão Defumado",
      descricao: "Frango defumado na casa com lenha de macieira, cebola, ervilha, aioli de alho assado e páprica, cenoura, uva passas e batata palha da casa",
      imagem: "/images/salpicao.jpg",
      opcoes: [
        { peso: "1kg", preco: 155 },
        { peso: "500g", preco: 95 }
      ]
    },
    {
      id: "terrine-porco",
      nome: "Terrine de Porco",
      descricao: "Joelho e pernil de porco, pistache, picles de pepino e cranberry, envolto no bacon. Aprox. 1kg a peça",
      imagem: "/images/terrine.jpg",
      opcoes: [
        { peso: "~1kg", preco: 170 }
      ]
    }
  ],
  proteinas: [
    {
      id: "chester-peru",
      nome: "Chester ou Peru Assado",
      descricao: "Acompanha batata bolinha e farofa natalina. Aproximadamente 4,5kg o prato completo",
      imagem: "/images/chester-peru.jpg",
      opcoes: [
        { peso: "~4,5kg", preco: 535 }
      ]
    },
    {
      id: "beef-wellington",
      nome: "Beef Wellington",
      descricao: "Peça de filé mignon envolto no presunto de parma, creme de cogumelos e massa folhada. Aprox. 2kg",
      imagem: "/images/beef-wellington.jpg",
      opcoes: [
        { peso: "~2kg", preco: 395 }
      ]
    },
    {
      id: "pernil-cordeiro",
      nome: "Pernil de Cordeiro",
      descricao: "Acompanha molho do próprio assado com vinho tinto. Aproximadamente 1,8kg",
      imagem: "/images/pernil-cordeiro.jpg",
      opcoes: [
        { peso: "~1,8kg", preco: 380 }
      ]
    },
    {
      id: "rosbife",
      nome: "Rosbife",
      descricao: "Com molho de cogumelos (shimeji, Paris e funghi), conhaque e creme de leite fresco",
      imagem: "/images/rosbife.jpg",
      opcoes: [
        { peso: "1kg", preco: 275 },
        { peso: "500g", preco: 150 }
      ]
    },
    {
      id: "bacalhau-natas",
      nome: "Bacalhau com Natas",
      descricao: "Lascas de bacalhau gadus morhua, batata e nata. Gratinado com parmesão",
      imagem: "/images/bacalhau-natas.jpg",
      opcoes: [
        { peso: "1kg", preco: 220 },
        { peso: "500g", preco: 125 }
      ]
    }
  ],
  acompanhamentos: [
    {
      id: "arroz-amendoas",
      nome: "Arroz com Amêndoas",
      descricao: "Arroz aromático com amêndoas tostadas",
      imagem: "/images/arroz-amendoas.jpg",
      opcoes: [
        { peso: "1kg", preco: 95 },
        { peso: "500g", preco: 55 }
      ]
    },
    {
      id: "arroz-lentilha",
      nome: "Arroz com Lentilha",
      descricao: "Arroz com lentilha e cebola caramelizada",
      imagem: "/images/arroz-lentilha.jpg",
      opcoes: [
        { peso: "1kg", preco: 90 },
        { peso: "500g", preco: 50 }
      ]
    },
    {
      id: "farofa-natalina",
      nome: "Farofa Natalina",
      descricao: "Bacon, castanha, amêndoa, banana frita, cebola, alho e passas",
      imagem: "/images/farofa.jpg",
      opcoes: [
        { peso: "1kg", preco: 105 },
        { peso: "500g", preco: 60 }
      ]
    },
    {
      id: "batata-bolinha",
      nome: "Batata Bolinha",
      descricao: "Assada com alecrim e manteiga",
      imagem: "/images/batata-bolinha.jpg",
      opcoes: [
        { peso: "1kg", preco: 65 },
        { peso: "500g", preco: 35 }
      ]
    }
  ],
  sobremesas: [
    {
      id: "mousse-chocolate",
      nome: "Mousse de Chocolate e Avelã",
      descricao: "Mousse cremoso de chocolate meio amargo com avelãs",
      imagem: "/images/mousse.jpg",
      opcoes: [
        { peso: "500g", preco: 110 }
      ]
    }
  ]
};
```

---

## 4. Integração com Homio

### Configuração no Homio

#### 4.1. Criar Custom Fields no Contato
| Campo | Key | Tipo |
|-------|-----|------|
| Produtos do Pedido | `produtos_pedido` | Long Text |
| Valor Total | `valor_total` | Number |
| Valor Entrada (50%) | `valor_entrada` | Number |
| Data Retirada | `data_retirada` | Date |
| Status do Pedido | `status_pedido` | Dropdown |
| Número do Pedido | `numero_pedido` | Text |
| Observações | `observacoes_pedido` | Long Text |

#### 4.2. Criar Workflow com Inbound Webhook

```
Trigger: Inbound Webhook
    ↓
Action: Create/Update Contact
    - First Name: {{webhook.nome}}
    - Phone: {{webhook.telefone}}
    - Email: {{webhook.email}}
    - Custom Fields: mapear todos
    - Tags: ["ceia-2025", "aguardando-pix", "{{webhook.data_retirada}}"]
    ↓
Action: Send WhatsApp (Template ou Mensagem)
    - "Olá {{contact.first_name}}! Recebemos seu pedido #{{webhook.numero_pedido}}..."
    ↓
Action: Internal Notification
    - Notificar equipe de novo pedido
```

#### 4.3. Payload do Webhook (enviado pelo site)

```javascript
// POST para: https://services.leadconnectorhq.com/hooks/WEBHOOK_ID

const payload = {
  // Dados do cliente
  nome: "João Silva",
  telefone: "+5527999999999",
  email: "joao@email.com",
  
  // Dados do pedido
  numero_pedido: "NOZ-2025-0042",
  data_retirada: "2025-12-24",
  
  // Produtos (formato legível)
  produtos_pedido: `
    2x Salada de Bacalhau 500g - R$ 250,00
    1x Chester/Peru ~4,5kg - R$ 535,00
    1x Farofa Natalina 1kg - R$ 105,00
  `,
  
  // Produtos (formato JSON para processamento)
  produtos_json: JSON.stringify([
    { id: "salada-bacalhau", nome: "Salada de Bacalhau", peso: "500g", qtd: 2, preco: 125, subtotal: 250 },
    { id: "chester-peru", nome: "Chester/Peru", peso: "~4,5kg", qtd: 1, preco: 535, subtotal: 535 },
    { id: "farofa-natalina", nome: "Farofa Natalina", peso: "1kg", qtd: 1, preco: 105, subtotal: 105 }
  ]),
  
  // Valores
  valor_total: 890,
  valor_entrada: 445,
  
  // Observações
  observacoes: "Sem passas na farofa, por favor",
  
  // Metadata
  status_pedido: "Aguardando PIX",
  created_at: "2025-12-15T14:30:00Z"
};
```

---

## 5. Fluxo de Automações no Homio

### Workflow 1: Novo Pedido Recebido
```
[Inbound Webhook] 
    → Criar/Atualizar Contato
    → Adicionar Tag "ceia-2025" + "aguardando-pix"
    → Enviar WhatsApp: "Pedido recebido! Aguardando PIX..."
    → Notificar equipe (email/slack/interno)
```

### Workflow 2: PIX Confirmado (manual)
```
[Tag Added: "pix-confirmado"]
    → Remover Tag "aguardando-pix"
    → Atualizar status_pedido para "Confirmado"
    → Enviar WhatsApp: "Pagamento confirmado! Seu pedido está garantido..."
```

### Workflow 3: Lembrete de Retirada
```
[Scheduled: 1 dia antes da data_retirada]
    → Enviar WhatsApp: "Lembrete: amanhã é dia de buscar sua ceia!"
```

### Workflow 4: Lembrete de Pagamento (se não pagou)
```
[Wait: 24h após criação]
    → IF Tag contains "aguardando-pix"
    → Enviar WhatsApp: "Ainda não identificamos seu pagamento..."
```

---

## 6. Estrutura de Arquivos do Projeto

```
ceia-noz/
├── index.html              # Página principal (Single Page App)
├── css/
│   └── styles.css          # Estilos customizados
├── js/
│   ├── app.js              # Lógica principal
│   ├── cardapio.js         # Dados do cardápio
│   ├── carrinho.js         # Lógica do carrinho
│   └── checkout.js         # Envio para Homio
├── images/
│   ├── logo.png
│   ├── hero.jpg
│   └── produtos/           # Fotos dos pratos
├── assets/
│   └── qrcode-pix.png      # QR Code do PIX
└── README.md
```

---

## 7. Requisitos Técnicos

### Performance
- [ ] Lighthouse score > 90
- [ ] Imagens otimizadas (WebP, lazy loading)
- [ ] CSS/JS minificados
- [ ] Cache adequado

### Responsividade
- [ ] Mobile-first design
- [ ] Breakpoints: 320px, 768px, 1024px, 1440px
- [ ] Touch-friendly (botões grandes, espaçamento adequado)

### Acessibilidade
- [ ] Contraste adequado
- [ ] Labels em todos os inputs
- [ ] Navegação por teclado
- [ ] Alt text nas imagens

### SEO
- [ ] Meta tags apropriadas
- [ ] Open Graph para compartilhamento
- [ ] Schema.org para restaurante/menu

---

## 8. Checklist de Implementação

### Fase 1: Setup
- [ ] Configurar Custom Fields no Homio
- [ ] Criar Workflow com Inbound Webhook no Homio
- [ ] Testar webhook com Postman/cURL
- [ ] Obter imagens do site atual

### Fase 2: Desenvolvimento
- [ ] Criar estrutura HTML
- [ ] Implementar estilos CSS
- [ ] Desenvolver lógica do carrinho
- [ ] Integrar com webhook do Homio
- [ ] Criar página de confirmação com PIX

### Fase 3: Testes
- [ ] Testar fluxo completo
- [ ] Testar em diferentes dispositivos
- [ ] Validar envio para Homio
- [ ] Testar automações de WhatsApp

### Fase 4: Deploy
- [ ] Subir para hospedagem
- [ ] Configurar domínio
- [ ] Configurar SSL
- [ ] Monitoramento de erros

---

## 9. Dados do PIX

```javascript
const dadosPix = {
  chavePix: "33.339.742/0001-03", // CNPJ
  razaoSocial: "Noz Comida Afetiva",
  // QR Code é gerado dinamicamente com o valor da entrada
};

const contatoRestaurante = {
  whatsapp: "5527997016929",
  telefone: "(27) 99701-6929",
  endereco: "Rua Amélia Tartuce Nasser, 865, Loja 10 - Jardim da Penha, Vitória/ES",
  instagram: "@nozcomidaafetiva"
};
```

---

## Próximos Passos

1. ✅ **Dados do PIX e contato** - Configurados
2. **Me envia as imagens** do site atual (logo, hero, fotos dos pratos)
3. **Configura o Homio** (Custom Fields + Workflow com Inbound Webhook)
4. **Copia a URL do Webhook** e substitui no código do site
5. **Testamos a integração** juntos
6. **Deploy** no domínio final

---

*Documento criado em: Dezembro 2025*
*Versão: 1.0*
