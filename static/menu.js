async function loadMenu(){
    try {
        const response = await fetch('/menu');
        const menu = await response.json();

        const container = document.querySelector('.container');
        container.innerHTML = '';

        menu.forEach(item=>{
            const portionHtml = `
                <div class="portion">
                    <img src="https://placehold.co/300x200" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>${item.details}</p>
                    <button data-id="${item.id}" data-price="${item.price}">
                        Adicionar - R$ ${item.price.toFixed(2)}
                    </button>
                </div>
            `;
            container.innerHTML += portionHtml;
        });
    } catch(error) {
        console.error('Erro ao carregar o menu:', error);
    }
}

// Adiciona o id do item à variável cart nos cookies
function addToCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')||'[]');
    cart.push(itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    document.cookie = `cart=${JSON.stringify(cart)};path=/`;
}

document.addEventListener('DOMContentLoaded', loadMenu)

document.addEventListener('click', function(e){
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id){
        addToCart(parseInt(e.target.dataset.id));
    }
})