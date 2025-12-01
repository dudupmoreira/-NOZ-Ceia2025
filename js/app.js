// ============================================
// CONFIGURAÇÕES
// ============================================
const CONFIG = {
  whatsappNumber: "5527997016929",
  webhookUrl: "https://services.leadconnectorhq.com/hooks/iuYB2N2aOtvi7dlzJ1sQ/webhook-trigger/138b2fb5-81f4-43ba-8dc2-189fddb645c2",
  pixCNPJ: "33339742000103",
  pixNome: "NOZ COMIDA AFETIVA",
  pixCidade: "VITORIA",
  restaurantPhone: "(27) 99701-6929",
  restaurantAddress: "Rua Amélia Tartuce Nasser, 865, Loja 10 - Jardim da Penha, Vitória - ES",
  restaurantInstagram: "@nozcomidaafetiva"
};

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
let cart = [];
let selectedDate = "24/12";
let customerData = {
  nome: "",
  telefone: "",
  email: "",
  observacoes: ""
};

// ============================================
// GERADOR DE PIX
// ============================================
function gerarCodigoPix(valor) {
  function crc16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  function tlv(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return id + len + value;
  }

  const valorStr = valor.toFixed(2);
  const gui = tlv('00', 'br.gov.bcb.pix');
  const chave = tlv('01', CONFIG.pixCNPJ);
  const merchantAccount = tlv('26', gui + chave);

  let payload = '';
  payload += tlv('00', '01');
  payload += merchantAccount;
  payload += tlv('52', '0000');
  payload += tlv('53', '986');
  payload += tlv('54', valorStr);
  payload += tlv('58', 'BR');
  payload += tlv('59', CONFIG.pixNome.substring(0, 25));
  payload += tlv('60', CONFIG.pixCidade.substring(0, 15));
  payload += tlv('62', tlv('05', '***'));
  payload += '6304';

  const crc = crc16(payload);
  return payload + crc;
}

// ============================================
// UTILITÁRIOS
// ============================================
function formatPrice(value) {
  return value.toFixed(2).replace('.', ',');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2000);
}

function findProduct(productId) {
  for (const products of Object.values(cardapio)) {
    const product = products.find(p => p.id === productId);
    if (product) return product;
  }
  return null;
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = findProduct(item.productId);
    const opcao = product.opcoes[item.optionIndex];
    return sum + (opcao.preco * item.quantity);
  }, 0);
}

// ============================================
// RENDERIZAÇÃO DO CARDÁPIO
// ============================================
function renderCardapio() {
  const container = document.getElementById('cardapio');
  let html = '';

  for (const [category, products] of Object.entries(cardapio)) {
    html += `
      <section class="category-section" id="${category}">
        <h3>${categoryNames[category]}</h3>
        <div class="products-grid">
          ${products.map(product => renderProductCard(product, category)).join('')}
        </div>
      </section>
    `;
  }

  container.innerHTML = html;
}

function renderProductCard(product, category) {
  const imageHtml = product.imagem 
    ? `<img src="${product.imagem}" alt="${product.nome}" class="product-image" onclick="openImageZoom('${product.imagem}')">`
    : `<div class="product-image-placeholder">🍽️</div>`;

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image-container">
        ${imageHtml}
      </div>
      <div class="product-info">
        <h4 class="product-name">${product.nome}</h4>
        <p class="product-description">${product.descricao}</p>
        <div class="product-options">
          ${product.opcoes.map((opcao, index) => `
            <div class="product-option">
              <div class="option-info">
                <span class="option-weight">${opcao.peso}</span>
                <span class="option-price">R$ ${formatPrice(opcao.preco)}</span>
              </div>
              ${renderAddButton(product.id, index, opcao)}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAddButton(productId, optionIndex, opcao) {
  const cartItem = cart.find(item => item.productId === productId && item.optionIndex === optionIndex);
  
  if (cartItem) {
    return `
      <div class="quantity-control">
        <button onclick="updateQuantity('${productId}', ${optionIndex}, -1)">−</button>
        <span>${cartItem.quantity}</span>
        <button onclick="updateQuantity('${productId}', ${optionIndex}, 1)">+</button>
      </div>
    `;
  }
  
  return `
    <button class="add-btn" onclick="addToCart('${productId}', ${optionIndex})">+</button>
  `;
}

// ============================================
// FUNÇÕES DO CARRINHO
// ============================================
function addToCart(productId, optionIndex) {
  const existingItem = cart.find(item => item.productId === productId && item.optionIndex === optionIndex);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      productId,
      optionIndex,
      quantity: 1
    });
  }

  updateCartUI();
  showToast('Item adicionado!');
}

function updateQuantity(productId, optionIndex, delta) {
  const itemIndex = cart.findIndex(item => item.productId === productId && item.optionIndex === optionIndex);
  
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  }

  updateCartUI();
}

function removeFromCart(productId, optionIndex) {
  cart = cart.filter(item => !(item.productId === productId && item.optionIndex === optionIndex));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getCartTotal();
  
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = `R$ ${formatPrice(total)}`;
  
  const cartFloat = document.getElementById('cartFloat');
  if (count > 0) {
    cartFloat.classList.add('visible');
  } else {
    cartFloat.classList.remove('visible');
  }

  renderCardapio();
  
  if (document.getElementById('cartModal').classList.contains('visible')) {
    renderCartBody();
    renderCartFooter();
  }
}

// ============================================
// MODAL DO CARRINHO
// ============================================
function openCart() {
  document.getElementById('modalOverlay').classList.add('visible');
  document.getElementById('cartModal').classList.add('visible');
  document.body.style.overflow = 'hidden';
  renderCartBody();
  renderCartFooter();
}

function closeCart() {
  document.getElementById('modalOverlay').classList.remove('visible');
  document.getElementById('cartModal').classList.remove('visible');
  document.body.style.overflow = '';
}

function selectDate(date) {
  selectedDate = date;
  renderCartBody();
}

function updateCustomerData(field, value) {
  customerData[field] = value;
  renderCartFooter();
}

function renderCartBody() {
  const body = document.getElementById('cartBody');
  
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Seu carrinho está vazio</p>
        <p>Adicione itens do cardápio para começar</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="date-picker-section">
      <label>📅 Data de Retirada</label>
      <div class="date-options">
        <div class="date-option ${selectedDate === '24/12' ? 'selected' : ''}" onclick="selectDate('24/12')">
          <strong>24/12</strong>
          <span>Véspera de Natal</span>
        </div>
        <div class="date-option ${selectedDate === '31/12' ? 'selected' : ''}" onclick="selectDate('31/12')">
          <strong>31/12</strong>
          <span>Véspera de Ano Novo</span>
        </div>
      </div>
    </div>

    <div class="cart-items">
      ${cart.map(item => renderCartItem(item)).join('')}
    </div>

    <div class="form-section">
      <h3>Seus Dados</h3>
      <div class="form-group">
        <label>Nome completo *</label>
        <input type="text" id="inputNome" placeholder="Digite seu nome" value="${customerData.nome}" onchange="updateCustomerData('nome', this.value)">
      </div>
      <div class="form-group">
        <label>WhatsApp *</label>
        <input type="tel" id="inputTelefone" placeholder="(27) 99999-9999" value="${customerData.telefone}" onchange="updateCustomerData('telefone', this.value)">
      </div>
      <div class="form-group">
        <label>E-mail</label>
        <input type="email" id="inputEmail" placeholder="seu@email.com" value="${customerData.email}" onchange="updateCustomerData('email', this.value)">
      </div>
      <div class="form-group">
        <label>Observações</label>
        <textarea id="inputObs" placeholder="Alguma restrição alimentar ou pedido especial?" onchange="updateCustomerData('observacoes', this.value)">${customerData.observacoes}</textarea>
      </div>
    </div>
  `;

  body.innerHTML = html;
}

function renderCartItem(item) {
  const product = findProduct(item.productId);
  const opcao = product.opcoes[item.optionIndex];
  const subtotal = opcao.preco * item.quantity;

  const imageHtml = product.imagem
    ? `<img src="${product.imagem}" alt="${product.nome}" class="cart-item-image">`
    : `<div class="cart-item-placeholder">🍽️</div>`;

  return `
    <div class="cart-item">
      <div class="cart-item-image-container">
        ${imageHtml}
      </div>
      <div class="cart-item-info">
        <span class="cart-item-name">${product.nome}</span>
        <span class="cart-item-weight">${opcao.peso}</span>
        <span class="cart-item-price">R$ ${formatPrice(subtotal)}</span>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button onclick="updateQuantity('${item.productId}', ${item.optionIndex}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.productId}', ${item.optionIndex}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.productId}', ${item.optionIndex})">🗑</button>
      </div>
    </div>
  `;
}

function renderCartFooter() {
  const footer = document.getElementById('cartFooter');
  const total = getCartTotal();
  const entrada = total / 2;
  const isValid = cart.length > 0 && customerData.nome && customerData.telefone;

  footer.innerHTML = `
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Subtotal</span>
        <span>R$ ${formatPrice(total)}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Total</span>
        <span>R$ ${formatPrice(total)}</span>
      </div>
      <div class="cart-summary-row highlight">
        <span>Entrada (50%)</span>
        <span>R$ ${formatPrice(entrada)}</span>
      </div>
    </div>
    <button class="checkout-btn" onclick="finalizarPedido()" ${!isValid ? 'disabled' : ''}>
      Finalizar Pedido
      <span>→</span>
    </button>
    ${!isValid && cart.length > 0 ? '<p style="text-align: center; color: var(--color-texto-claro); font-size: 0.85rem; margin-top: 0.5rem;">Preencha nome e WhatsApp para continuar</p>' : ''}
  `;
}

// ============================================
// FINALIZAÇÃO DO PEDIDO
// ============================================
async function finalizarPedido() {
  const orderNumber = `NOZ-2025-${String(Date.now()).slice(-4)}`;
  const total = getCartTotal();
  const entrada = total / 2;

  const pedido = {
    numero_pedido: orderNumber,
    data_retirada: selectedDate === '24/12' ? '2025-12-24' : '2025-12-31',
    nome: customerData.nome,
    telefone: customerData.telefone.replace(/\D/g, ''),
    email: customerData.email,
    observacoes: customerData.observacoes,
    produtos_pedido: cart.map(item => {
      const product = findProduct(item.productId);
      const opcao = product.opcoes[item.optionIndex];
      return `${item.quantity}x ${product.nome} ${opcao.peso} - R$ ${formatPrice(opcao.preco * item.quantity)}`;
    }).join('\n'),
    produtos_json: JSON.stringify(cart.map(item => {
      const product = findProduct(item.productId);
      const opcao = product.opcoes[item.optionIndex];
      return {
        id: item.productId,
        nome: product.nome,
        peso: opcao.peso,
        qtd: item.quantity,
        preco_unit: opcao.preco,
        subtotal: opcao.preco * item.quantity
      };
    })),
    valor_total: total,
    valor_entrada: entrada,
    status_pedido: "Aguardando PIX",
    created_at: new Date().toISOString()
  };

  try {
    await fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedido)
    });
  } catch (error) {
    console.log('Webhook enviado (ou erro ignorado):', error);
  }

  showConfirmationPage(pedido);
}

function showConfirmationPage(pedido) {
  const total = pedido.valor_total;
  const entrada = pedido.valor_entrada;

  document.getElementById('orderNumberDisplay').textContent = `#${pedido.numero_pedido}`;

  document.getElementById('orderSummaryItems').innerHTML = cart.map(item => {
    const product = findProduct(item.productId);
    const opcao = product.opcoes[item.optionIndex];
    return `
      <div class="order-item">
        <span>${item.quantity}x ${product.nome} (${opcao.peso})</span>
        <span>R$ ${formatPrice(opcao.preco * item.quantity)}</span>
      </div>
    `;
  }).join('');

  document.getElementById('orderSummaryTotals').innerHTML = `
    <div class="total-row">
      <span>Subtotal</span>
      <span>R$ ${formatPrice(total)}</span>
    </div>
    <div class="total-row">
      <span>📅 Retirada</span>
      <span>${selectedDate}/2025</span>
    </div>
    <div class="total-row big">
      <span>Total</span>
      <span>R$ ${formatPrice(total)}</span>
    </div>
    <div class="total-row highlight">
      <span>💰 Entrada (50%)</span>
      <span>R$ ${formatPrice(entrada)}</span>
    </div>
  `;

  document.getElementById('pixAmount').textContent = `R$ ${formatPrice(entrada)}`;

  const pixCode = gerarCodigoPix(entrada);
  document.getElementById('pixCode').value = pixCode;

  const qrContainer = document.querySelector('.pix-qrcode');
  qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}" alt="QR Code PIX">`;

  const itensResumo = cart.map(item => {
    const product = findProduct(item.productId);
    const opcao = product.opcoes[item.optionIndex];
    return `• ${item.quantity}x ${product.nome} (${opcao.peso})`;
  }).join('\n');

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Acabei de fazer o pedido *${pedido.numero_pedido}* para a Ceia de Natal. 🎄\n\n` +
    `*📋 Itens do pedido:*\n${itensResumo}\n\n` +
    `📅 *Retirada:* ${selectedDate}/2025\n` +
    `💰 *Total:* R$ ${formatPrice(total)}\n` +
    `💳 *Entrada (50%):* R$ ${formatPrice(entrada)}\n\n` +
    `👤 *Nome:* ${pedido.nome}\n\n` +
    `Segue o comprovante do PIX em anexo. ✅`
  );
  document.getElementById('whatsappBtn').onclick = () => {
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${mensagemWhatsApp}`, '_blank');
  };

  document.getElementById('mainPage').style.display = 'none';
  document.getElementById('confirmationPage').classList.add('visible');
  closeCart();
  window.scrollTo(0, 0);
}

function copyPix() {
  const pixCode = document.getElementById('pixCode');
  pixCode.select();
  document.execCommand('copy');
  showToast('Código PIX copiado!');
}

// ============================================
// ZOOM DE IMAGEM
// ============================================
function openImageZoom(imageSrc) {
  const overlay = document.getElementById('imageZoomOverlay');
  const zoomedImage = document.getElementById('zoomedImage');
  zoomedImage.src = imageSrc;
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeImageZoom() {
  const overlay = document.getElementById('imageZoomOverlay');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

// ============================================
// NAVEGAÇÃO POR CATEGORIAS
// ============================================
function setupCategoryNav() {
  const buttons = document.querySelectorAll('.category-btn');
  const categoriesNav = document.querySelector('.categories');
  const mainContent = document.querySelector('.main-content');
  const mobileSelect = document.getElementById('categorySelect');
  
  // Navegação desktop
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      scrollToCategory(category);
    });
  });

  // Navegação mobile
  if (mobileSelect) {
    mobileSelect.addEventListener('change', (e) => {
      scrollToCategory(e.target.value);
    });
  }

  // Função auxiliar para scroll
  function scrollToCategory(category) {
    const section = document.getElementById(category);
    const headerHeight = window.innerWidth <= 768 ? 105 : 140;
    const y = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.category-section');
    const scrollPos = window.scrollY + 200;

    // Atualizar categoria ativa
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        const category = section.id;
        buttons.forEach(b => {
          b.classList.toggle('active', b.dataset.category === category);
        });
        // Atualizar select mobile
        if (mobileSelect) {
          mobileSelect.value = category;
        }
      }
    });

    // Ocultar menu quando passar da seção de produtos
    if (mainContent) {
      const mainContentBottom = mainContent.offsetTop + mainContent.offsetHeight;
      const currentScroll = window.scrollY + window.innerHeight;
      
      if (currentScroll > mainContentBottom + 100) {
        categoriesNav.classList.add('hidden');
      } else {
        categoriesNav.classList.remove('hidden');
      }
    }
  });
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderCardapio();
  setupCategoryNav();
});
