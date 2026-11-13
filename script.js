// Base de Produtos Iniciais
let produtos = [
    { id: 1, name: "Árvore de Natal Luxo Nevada 2.10m", category: "Arvores", price: 499.90, image: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=600&q=80", desc: "Árvore densa com efeito neve realista, galhos firmes e fácil montagem." },
    { id: 2, name: "Kit Bolas Natalinas Douradas & Bordô (30 pçs)", category: "Enfeites", price: 129.90, image: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?auto=format&fit=crop&w=600&q=80", desc: "Ornamentos sofisticados com acabamento brilhante e fosco." },
    { id: 3, name: "Guirlanda Premium Porta Principal com Pinhas", category: "Guirlandas", price: 159.90, image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=600&q=80", desc: "Guirlanda luxuosa decorada com laços de veludo e pinhas naturais." },
    { id: 4, name: "Cascata Pisca-Pisca LED Branco Warm (500L)", category: "Piscas", price: 89.90, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80", desc: "Iluminação aconchegante para fachadas, varandas e salas." },
    { id: 5, name: "Cesta de Natal Família Especial", category: "Cestas", price: 349.90, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80", desc: "Seleção gourmet com panetones artesanais, chocolates finos e espumante." },
    { id: 6, name: "Rena Decorativa Iluminada para Jardim", category: "Enfeites", price: 0, image: "https://images.unsplash.com/photo-1574856344991-afa3f07e0c5d?auto=format&fit=crop&w=600&q=80", desc: "Peça imponente para decoração externa. Preço sob consulta." }
];

let carrinho = JSON.parse(localStorage.getItem('natal_cart')) || [];
let pedidos = JSON.parse(localStorage.getItem('natal_orders')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initSnow();
    initCountdown();
    renderProducts();
    updateCartCount();
    setupEventListeners();
});

// Efeito de Neve
function initSnow() {
    const snowContainer = document.getElementById('snowContainer');
    const snowflakeCount = 45;
    for (let i = 0; i < snowflakeCount; i++) {
        const sf = document.createElement('div');
        sf.classList.add('snowflake');
        sf.style.left = `${Math.random() * 100}vw`;
        sf.style.top = `${Math.random() * -100}vh`;
        const size = `${Math.random() * 6 + 4}px`;
        sf.style.width = size;
        sf.style.height = size;
        sf.style.animationDuration = `${Math.random() * 5 + 3}s`;
        sf.style.animationDelay = `${Math.random() * 5}s`;
        snowContainer.appendChild(sf);
    }
}

// Contagem Regressiva para 25 de Dezembro
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    function updateTimer() {
        const now = new Date();
        let christmas = new Date(now.getFullYear(), 11, 25);
        if (now > christmas) christmas.setFullYear(christmas.getFullYear() + 1);
        const diff = christmas - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        countdownEl.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    setInterval(updateTimer, 1000);
    updateTimer();
}

// Renderizar Produtos
function renderProducts(category = 'todos') {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    
    const filtered = category === 'todos' ? produtos : produtos.filter(p => p.category === category);
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const priceText = p.price > 0 ? `R$ ${p.price.toFixed(2)}` : 'Sob Consulta';
        
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-footer">
                    <span class="product-price">${priceText}</span>
                    <button class="btn-add-cart" onclick="addToCart(${p.id})">Comprar</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Carrinho de Compras
function addToCart(id) {
    const prod = produtos.find(p => p.id === id);
    const existing = carrinho.find(item => item.id === id);
    if (existing) {
        existing.qtd++;
    } else {
        carrinho.push({ ...prod, qtd: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`"${prod.name}" adicionado ao carrinho!`);
}

function saveCart() {
    localStorage.setItem('natal_cart', JSON.stringify(carrinho));
}

function updateCartCount() {
    const totalQtd = carrinho.reduce((sum, item) => sum + item.qtd, 0);
    document.getElementById('cartCount').innerText = totalQtd;
}

// Event Listeners e Modais
function setupEventListeners() {
    // Filtros de Categoria
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.dataset.category);
        });
    });

    // Abrir/Fechar Carrinho
    const cartModal = document.getElementById('cartModal');
    document.getElementById('btnCart').addEventListener('click', () => {
        renderCartItems();
        cartModal.style.display = 'flex';
    });
    document.getElementById('closeCart').addEventListener('click', () => cartModal.style.display = 'none');

    // Checkout Modal
    const checkoutModal = document.getElementById('checkoutModal');
    document.getElementById('btnCheckout').addEventListener('click', () => {
        if(carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'flex';
    });
    document.getElementById('closeCheckout').addEventListener('click', () => checkoutModal.style.display = 'none');

    // Integração ViaCEP
    document.getElementById('chkCep').addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        if(cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(res => res.json())
                .then(data => {
                    if(!data.erro) {
                        document.getElementById('chkRua').value = data.logradouro;
                        document.getElementById('chkBairro').value = data.bairro;
                        document.getElementById('chkCidadeUf').value = `${data.localidade} - ${data.uf}`;
                    } else {
                        alert('CEP não encontrado.');
                    }
                });
        }
    });

    // Formulário de Checkout & WhatsApp
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('chkNome').value;
        const tel = document.getElementById('chkTel').value;
        const cep = document.getElementById('chkCep').value;
        const rua = document.getElementById('chkRua').value;
        const num = document.getElementById('chkNumero').value;
        const bairro = document.getElementById('chkBairro').value;
        const cidUf = document.getElementById('chkCidadeUf').value;
        const comp = document.getElementById('chkComplemento').value;
        const obs = document.getElementById('cartObs').value;

        const orderId = Math.floor(100000 + Math.random() * 900000);
        
        let produtosStr = carrinho.map(i => `- ${i.name} (Qtd: ${i.qtd})`).join('\n');
        let totalEst = carrinho.reduce((sum, i) => sum + (i.price > 0 ? i.price * i.qtd : 0), 0);

        const newOrder = {
            id: orderId,
            cliente: nome,
            telefone: tel,
            endereco: `${rua}, ${num} - ${bairro}, ${cidUf} (CEP: ${cep}) ${comp}`,
            itens: carrinho,
            observacao: obs,
            status: 'Novo pedido',
            data: new Date().toLocaleString()
        };

        pedidos.push(newOrder);
        localStorage.setItem('natal_orders', JSON.stringify(pedidos));

        // Montar mensagem WhatsApp
        let msg = `Olá! Gostaria de finalizar meu pedido de Natal.\n\n`;
        msg += `Número do Pedido: #${orderId}\n`;
        msg += `Nome: ${nome}\n`;
        msg += `Telefone: ${tel}\n`;
        msg += `Endereço: ${rua}, ${num} - ${bairro}, ${cidUf} (CEP: ${cep}) ${comp}\n\n`;
        msg += `Produtos escolhidos:\n${produtosStr}\n\n`;
        if(obs) msg += `Observações: ${obs}\n\n`;
        if(totalEst > 0) msg += `Total Estimado: R$ ${totalEst.toFixed(2)}\n\n`;
        msg += `Gostaria de combinar o preço final, frete e pagamento.`;

        const encodedMsg = encodeURIComponent(msg);
        document.getElementById('whatsappFinalLink').href = `https://wa.me/5515998205675?text=${encodedMsg}`;

        checkoutModal.style.display = 'none';
        document.getElementById('whatsappModal').style.display = 'flex';

        // Limpar carrinho
        carrinho = [];
        saveCart();
        updateCartCount();
    });

    // Painel Admin Modals
    const adminModal = document.getElementById('adminModal');
    document.getElementById('btnAdmin').addEventListener('click', () => {
        adminModal.style.display = 'flex';
    });
    document.getElementById('closeAdmin').addEventListener('click', () => adminModal.style.display = 'none');

    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('adminUser').value;
        const p = document.getElementById('adminPass').value;
        if(u === 'admin' && p === 'natal2026') {
            document.getElementById('adminLoginView').style.display = 'none';
            document.getElementById('adminDashboardView').style.display = 'block';
            renderAdminProducts();
            renderAdminOrders();
        } else {
            alert('Usuário ou senha incorretos! (Dica: admin / natal2026)');
        }
    });

    // Abas do Admin
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab).classList.add('active');
        });
    });

    // Cadastro/Edição de Produtos Admin
    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('prodId').value;
        const name = document.getElementById('prodName').value;
        const cat = document.getElementById('prodCat').value;
        const price = parseFloat(document.getElementById('prodPrice').value) || 0;
        const image = document.getElementById('prodImage').value;
        const desc = document.getElementById('prodDesc').value;

        if(id) {
            const p = produtos.find(item => item.id == id);
            p.name = name; p.category = cat; p.price = price; p.image = image; p.desc = desc;
        } else {
            const newId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
            produtos.push({ id: newId, name, category: cat, price, image, desc });
        }
        document.getElementById('productForm').reset();
        document.getElementById('prodId').value = '';
        renderAdminProducts();
        renderProducts();
        alert('Produto salvo com sucesso!');
    });
}

function renderCartItems() {
    const list = document.getElementById('cartItemsList');
    list.innerHTML = '';
    let total = 0;

    if(carrinho.length === 0) {
        list.innerHTML = '<p>Seu carrinho está vazio.</p>';
        document.getElementById('cartTotalPrice').innerText = 'R$ 0,00';
        return;
    }

    carrinho.forEach((item, index) => {
        const itemTotal = item.price > 0 ? item.price * item.qtd : 0;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>Qtd: ${item.qtd} x ${item.price > 0 ? 'R$ ' + item.price.toFixed(2) : 'Sob Consulta'}</small>
            </div>
            <div>
                <button onclick="changeQtd(${index}, 1)">+</button>
                <button onclick="changeQtd(${index}, -1)">-</button>
                <button onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });

    document.getElementById('cartTotalPrice').innerText = `R$ ${total.toFixed(2)}`;
}

function changeQtd(index, delta) {
    carrinho[index].qtd += delta;
    if(carrinho[index].qtd <= 0) {
        carrinho.splice(index, 1);
    }
    saveCart();
    updateCartCount();
    renderCartItems();
}

function removeFromCart(index) {
    carrinho.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductList');
    list.innerHTML = '';
    produtos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'admin-product-item';
        div.innerHTML = `
            <span><strong>${p.name}</strong> - ${p.price > 0 ? 'R$ ' + p.price.toFixed(2) : 'Sob Consulta'}</span>
            <div>
                <button onclick="editProduct(${p.id})"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

function editProduct(id) {
    const p = produtos.find(item => item.id === id);
    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCat').value = p.category;
    document.getElementById('prodPrice').value = p.price > 0 ? p.price : '';
    document.getElementById('prodImage').value = p.image;
    document.getElementById('prodDesc').value = p.desc;
}

function deleteProduct(id) {
    produtos = produtos.filter(p => p.id !== id);
    renderAdminProducts();
    renderProducts();
}

function renderAdminOrders() {
    const list = document.getElementById('adminOrdersList');
    list.innerHTML = '';
    if(pedidos.length === 0) {
        list.innerHTML = '<p>Nenhum pedido recebido ainda.</p>';
        return;
    }
    pedidos.forEach(o => {
        const div = document.createElement('div');
        div.style.cssText = "border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 6px; background: #fff;";
        div.innerHTML = `
            <h4>Pedido #${o.id} - ${o.data}</h4>
            <p><strong>Cliente:</strong> ${o.cliente} (${o.telefone})</p>
            <p><strong>Endereço:</strong> ${o.endereco}</p>
            <p><strong>Status:</strong> ${o.status}</p>
            <p><strong>Itens:</strong></p>
            <ul>
                ${o.itens.map(i => `<li>${i.name} (Qtd: ${i.qtd})</li>`).join('')}
            </ul>
            <a href="https://wa.me/55${o.telefone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(o.cliente)},%20estamos%20entrando%20em%20contato%20sobre%20o%20seu%20pedido%20%23${o.id}" target="_blank" class="btn-primary" style="margin-top:10px; display:inline-block; font-size:0.85rem; padding:8px 14px;">
                <i class="fa-brands fa-whatsapp"></i> Chamar no WhatsApp
            </a>
        `;
        list.appendChild(div);
    });
}
