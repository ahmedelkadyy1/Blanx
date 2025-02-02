const header = document.querySelector("header");
window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 0);
});

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('open')
} 

const sr = ScrollReveal ({
    distance: '50px',
    duration: 700,
});

sr.reveal('.home-text', {delay:100, origin:'bottom'});
sr.reveal('.featured, .cta, .new, .brand, .contact', {delay:60, origin:'bottom'});

// const wheel = document.getElementById("wheel");
// let isSpinning = false;

// function spinWheel() {
//   if (isSpinning) return;

//   isSpinning = true;

//   // Generate a random degree between 2000 and 5000
//   const randomDegree = Math.floor(Math.random() * 3000) + 2000;

//   // Apply rotation
//   wheel.style.transform = `rotate(${randomDegree}deg)`;

//   // Reset after animation ends
//   setTimeout(() => {
//     isSpinning = false;
//   }, 4000);
// }


let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let checkoutdiv = document.querySelector('.checkOutcontainer')
let checkOutProductHTML = document.querySelector('.productscheckout');
let checkoutbtn = document.querySelector('.checkOut');
let closecheckoutbtn = document.querySelector('.closecheckdiv');
let totalPriceElement = document.querySelector('.totalPrice');
let checkoutbtn2 = document.querySelector('.button');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
    // remove datas default from HTML

        // add new datas
        if(products.length > 0) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;  // Track total price

    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            
            let itemTotalPrice = info.price * item.quantity;
            totalPrice += itemTotalPrice;  // Add to total price
            
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${itemTotalPrice}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    
    // Update total price element
    if(totalPriceElement) {
        totalPriceElement.innerHTML = `$${totalPrice.toFixed(2)}`;
    }
    
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

checkoutbtn.addEventListener('click', () => {
    checkoutdiv.classList.toggle('showcheck');
});

closecheckoutbtn.addEventListener('click', () => {
    checkoutdiv.classList.toggle('showcheck');
});

checkoutbtn2.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission
    alert('Thank You For Your Purchase');
    
    // Clear the cart
    cart = [];
    addCartToHTML();
    addCartToMemory();
    
    // Close the checkout div
    checkoutdiv.classList.remove('showcheck');
    
    // Refresh the page
    location.reload();
});

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();