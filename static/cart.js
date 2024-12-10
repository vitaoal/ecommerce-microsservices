function getCartFromCookies() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'cart') {
            return JSON.parse(decodeURIComponent(value));
        }
    }
    return null;
}

async function loadCart() {
    const container = document.querySelector('.container');
    const cart = getCartFromCookies() || [];
    container.innerHTML = '';

    console.log("Carrinho:",cart)

    try {
        // Busca o menu completo para ter acesso aos detalhes dos itens
        const response = await fetch('/menu');
        const menu = await response.json();
        
        // Cria um objeto para contar quantidades
        let summary = {};
        cart.forEach(itemId => {
            summary[itemId] = (summary[itemId] || 0) + 1;
        });

        let total = 0;
        
        // Adiciona os itens do carrinho
        Object.entries(summary).forEach(([itemId, quantity]) => {
            const item = menu.find(m => m.id === parseInt(itemId));
            if (item) {
                const subtotal = item.price * quantity;
                total += subtotal;
                
                const itemHtml = `
                    <div class="portion">
                        <img src="https://placehold.co/300x200" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <p>${item.details}</p>
                        <p>Quantidade: ${quantity}</p>
                        <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
                        <button data-id="${item.id}" class="remove-btn">Remover do carrinho</button>
                    </div>
                `;
                container.innerHTML += itemHtml;
            }
        });

        // Adiciona o resumo do carrinho
        const summaryHtml = `
            <div class="cart-summary">
                <h2>Resumo do Carrinho</h2>
                <label for="observacoes">Observações</label>
                <input type='text' id="observacoes">
                <div class="total">
                    <p>Total: R$ ${total.toFixed(2)}</p>
                </div>
            </div>
        `;
        container.innerHTML += summaryHtml;

    } catch(error) {
        console.error('Erro ao carregar o carrinho:', error);
        container.innerHTML = '<p>Erro ao carregar o carrinho</p>';
    }
}

async function removeFromCart(itemId) {
    // Get current cart
    let cart = getCartFromCookies();
    if (!cart) return;

    // Find first occurrence of item and remove it
    const index = cart.findIndex(item => item === parseInt(itemId));
    if (index > -1) {
        cart.splice(index, 1);
        
        // Update both storage mechanisms
        const cartString = JSON.stringify(cart);
        localStorage.setItem('cart', cartString);
        document.cookie = `cart=${encodeURIComponent(cartString)};path=/`;
        
        // Refresh cart display
        loadCart();
    }
}


const cart = getCartFromCookies();
console.log(cart);

document.addEventListener('DOMContentLoaded', loadCart);
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const itemId = event.target.getAttribute('data-id');
        console.log('ID da porção:', itemId);
        // Chame a função para remover do carrinho aqui
        removeFromCart(itemId);
    }
});