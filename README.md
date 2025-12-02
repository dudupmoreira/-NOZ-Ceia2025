# 🎄 Ceia de Natal 2025 - Restaurante Noz

Sistema de pedidos online para a Ceia de Natal do Restaurante Noz Comida Afetiva.

## 🚀 URLs de Produção

- **Site Principal:** [Vercel Deploy]
- **Painel Admin:** [URL]/admin.html
- **Repositórios:**
  - Original: https://github.com/dudupmoreira/-NOZ-Ceia2025 (privado)
  - Deploy: https://github.com/WebChuva/-NOZ-Ceia2025 (privado)

## 📋 Sobre o Projeto

Sistema web para gerenciamento de pedidos da Ceia de Natal, com:
- Interface intuitiva para clientes (estilo iFood)
- Carrinho de compras interativo
- Integração com LeadConnector/Homio via webhook
- Painel administrativo para gestão de pedidos
- Sistema de confirmação via PIX
- Automações de WhatsApp

## 🏗️ Estrutura do Projeto

```
CeiaNoz/
├── index.html              # Página principal (pedidos)
├── admin.html              # Painel administrativo
├── css/
│   └── styles.css          # Estilos do projeto
├── js/
│   ├── app.js              # Lógica principal e carrinho
│   └── cardapio.js         # Dados do cardápio (produtos)
├── imagens/                # Imagens otimizadas (WebP)
│   ├── *.webp              # Produtos e backgrounds
│   ├── logo-*.webp         # Logos do restaurante
│   └── favicon.png
├── .gitignore              # Arquivos ignorados pelo Git
├── .vercelignore           # Arquivos ignorados pelo Vercel
├── ARQUITETURA.md          # Documentação técnica detalhada
├── GUIA-WEBHOOK-HOMIO.md   # Guia de configuração do webhook
└── README.md               # Este arquivo
```

## ✨ Funcionalidades Implementadas

### Site Principal (index.html)
- ✅ Seleção de produtos por categoria
- ✅ Carrinho de compras com cálculo automático
- ✅ Seleção de data de retirada (24/12 ou 31/12)
- ✅ Formulário de dados do cliente
- ✅ Geração de número de pedido único
- ✅ Envio de pedido via webhook para Homio
- ✅ Página de confirmação com dados do PIX
- ✅ Botão de compartilhamento via WhatsApp
- ✅ URL compartilhável para restaurar pedido (?pedido=)

### Painel Admin (admin.html)
- ✅ Listagem de pedidos em cards compactos
- ✅ Grid responsivo (3-4 cards por linha)
- ✅ Filtros por data, status e busca
- ✅ Badge "PIX Confirmado" para pedidos pagos
- ✅ Botão para confirmar PIX (adiciona tag no Homio)
- ✅ Botão manual de atualização
- ✅ Correção de fuso horário (UTC-3)
- ✅ Tema claro e UX otimizada
- ✅ Exibição correta de custom fields da API

## 🔧 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Estilização:** CSS Grid, Flexbox, CSS Variables
- **Integração:** LeadConnector/Homio API
- **Hospedagem:** Vercel
- **Imagens:** WebP (otimizado)
- **Versionamento:** Git + GitHub

## 🎨 Performance

- **Otimização de Imagens:** 
  - Conversão de JPG para WebP
  - Redução de ~100MB para ~6MB (94%)
  - 16 imagens de produtos otimizadas
  - 3 backgrounds otimizados

- **Cache Busting:**
  - Versionamento de scripts (v=20251202-2)
  - Garantia de atualização do cache

## 🔐 Variáveis de Ambiente

### LeadConnector/Homio API

Configurar no código `admin.html`:

```javascript
const API_URL = 'https://services.leadconnectorhq.com/contacts/';
const API_KEY = 'SEU_API_KEY_AQUI';
const LOCATION_ID = 'SEU_LOCATION_ID';
const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/SEU_WEBHOOK_ID';
```

### Custom Fields IDs

No `admin.html`, os IDs dos custom fields estão mapeados:

```javascript
const CUSTOM_FIELD_IDS = {
    numero_pedido: 'hOelFeYPqjmxjPas71g8',
    produtos_pedido: 'oQhKiHM0b35bSdMoJjdz',
    valor_total: 'q4e6e0CJqy37YrWqOvNd',
    // ... outros campos
};
```

## 📦 Deploy

### Deploy Automático (Vercel)

O projeto está configurado para deploy automático:

1. Push para `main` no repositório WebChuva
2. Vercel detecta as mudanças
3. Build e deploy automático

### Deploy Manual (Vercel CLI)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Configurações do Vercel

```
Framework Preset: Other
Root Directory: (vazio)
Build Command: (vazio)
Output Directory: .
Install Command: (vazio)
```

## 🛠️ Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/WebChuva/-NOZ-Ceia2025.git
cd CeiaNoz
```

2. Abra o `index.html` em um servidor local:
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

3. Acesse: http://localhost:8000

## 📝 Configuração Inicial

### 1. Configurar Custom Fields no Homio

Criar os seguintes custom fields em Settings > Custom Fields:

| Nome | Key | Tipo |
|------|-----|------|
| Número do Pedido | numero_pedido | Text |
| Produtos do Pedido | produtos_pedido | Long Text |
| Valor Total | valor_total | Number |
| Valor Entrada | valor_entrada | Number |
| Data Retirada | data_retirada | Date |
| Status do Pedido | status_pedido | Text |
| Observações | observacoes | Long Text |

### 2. Configurar Webhook

Siga o guia completo em: [GUIA-WEBHOOK-HOMIO.md](GUIA-WEBHOOK-HOMIO.md)

### 3. Atualizar Credenciais

Edite `admin.html` e `index.html` com suas credenciais da API.

## 🔄 Fluxo de Pedidos

```
Cliente acessa site
    ↓
Seleciona produtos e adiciona ao carrinho
    ↓
Preenche dados (nome, telefone, email)
    ↓
Finaliza pedido
    ↓
Webhook envia dados para Homio
    ↓
Contato criado/atualizado com custom fields
    ↓
Tags aplicadas: "ceia-2025", "aguardando-pix"
    ↓
Cliente recebe dados do PIX
    ↓
Cliente faz pagamento
    ↓
Admin confirma PIX no painel
    ↓
Tag "pix-confirmado" adicionada no Homio
    ↓
Automação envia confirmação via WhatsApp
```

## 📞 Contato

**Restaurante Noz Comida Afetiva**
- WhatsApp: (27) 99701-6929
- Instagram: @nozcomidaafetiva
- Endereço: Rua Amélia Tartuce Nasser, 865, Loja 10 - Jardim da Penha, Vitória/ES

## 📄 Licença

Projeto proprietário - Restaurante Noz Comida Afetiva © 2025

## 🎯 Roadmap Futuro

- [ ] Integração com gateway de pagamento (PIX automático)
- [ ] Relatórios e dashboards de vendas
- [ ] Sistema de cupons de desconto
- [ ] Notificações push para clientes
- [ ] App mobile (PWA)

---

**Última atualização:** Dezembro 2025
