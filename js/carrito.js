// load products from JSON file
let products = []; // declare a global variable to store products

fetch('../json/products.json')
    .then(response => response.json())
    .then(data => {
        products = data; // store the products array in the global variable
        // render products
        const productList = document.getElementById('product-list');
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div class="card mb-3">
    <div class="row no-gutters">
      <div class="col-md-4">
        <img src="${product.imagen}" class="img-fluid rounded" alt="...">
      </div>
      <div class="col-md-8">
        <div class="card-body" style="background-color: #caa9ff;">
          <h5 class="card-title">${product.name}</h5>
          <h6 class="card-text">Categoría: ${product.categoria}</h6>
          <h6 class="card-text">Cantidad: ${product.cantidad}</h6>
          <span class="fw-bold">Precio:</span>
          <button class="add-to-cart-btn btn btn-primary" style="background-color: #873eff" data-product-id="${product.id}">${product.price}$</button>
        </div>
      </div>
    </div>
  </div>
         
            `;
            productList.appendChild(li);
        });

        // add event listeners to add to cart buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.getAttribute('data-product-id');
                const product = products.find(p => p.id === parseInt(productId)); // find the product by id
                addToCart(product);
            });
        });
    });

// cart logic
let cart = [];

function addToCart(product) {
    if (product) { // check if product is not null or undefined
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, 
                        categoria: product.categoria, imagen: product.imagen, quantity: 1 });
        }
        renderCart();
    }
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="background-color: #873eff; padding: 10px;">
            <img src="${item.imagen}" alt="">
            <span>${item.name} </span>
            <br>
            <span>Cantidad: ${item.quantity}</span>
            <br>
             <span>Precio: ${(item.price * item.quantity).toFixed(2)}$</span>
            <span>${item.categoria}</span>
            </div>
        `;
        cartList.appendChild(li);
    });
    const totalPrice =  cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById('total-price').innerHTML = `Total:$${totalPrice.toFixed(2)}`;
}

function clearCart() {
    cart = [];
    renderCart();
}

// checkout logic
document.getElementById('checkout-btn').addEventListener('click', () => {
    generatePdfInvoice();
    clearCart();
});

// generate PDF invoice

function generatePdfInvoice() {

    const docDefinition = {

        content: [

            { text: 'Recibo de Ferro Caribe', fontSize: 24, bold: true, margin: [0, 20, 0, 20] },

            {

                table: {

                    body: cart.map(item => [


                        { text: item.name, fontSize: 14 },

                        { text: `x ${item.quantity}`, fontSize: 14 },

                        { text: `$${(item.price * item.quantity).toFixed(2)}`, fontSize: 14 },

                        { text: item.categoria, fontSize: 14 } // add categoria column
                        


                    ]),

                    widths: ['*', '*', '*', '*']

                }

            },

            { text: `Total: $${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}`, fontSize: 18, bold: true, margin: [0, 20, 0, 20] }

        ],

        font: 'Helvetica',

        fontSize: 14

    };


    const pdfDoc = pdfMake.createPdf(docDefinition);

    pdfDoc.download('invoice.pdf');

}

// clear cart button
const clearCartBtn = document.createElement('button');
clearCartBtn.textContent = 'Limpiar';
clearCartBtn.style.backgroundColor = "#873eff";
clearCartBtn.style.border = "none";
clearCartBtn.style.padding = "7px";
clearCartBtn.style.fontWeight = "600";
clearCartBtn.addEventListener('click', clearCart);
document.getElementById('cart-actions').appendChild(clearCartBtn);