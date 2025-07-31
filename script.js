let allDesserts;
async function start() {
    try {
        const desserts = await fetch("./data.json").then(res => res.json());
        allDesserts = desserts;

    } catch(err) {
        console.log(err);
    }
}

const dessertsContent = document.getElementById("desserts");
async function showDesserts() {
    allDesserts.forEach(dessert => {
        const li = document.createElement("li");
        li.className = "desserts__item";
        li.innerHTML =  `
            <figure class="desserts__picture">
                <img class="desserts__img" src="${dessert.image.mobile}" alt="${dessert.category}" />
                <div data-dessert="${dessert.category}" class="btnCart only">
                    <img src="./assets/images/icon-add-to-cart.svg" alt="Add Cart">
                    <p class="desserts__add-cart">Add to Cart</p>
                </div>
            </figure>
            <section class="desserts__information">
                <h3 class="desserts__category">${dessert.category}</h3>
                <h2 class="desserts__name">${dessert.name}</h2>
                <h2 class="desserts__price">$${dessert.price}</h2>
            </section>
        `;
        dessertsContent.append(li);
    })
}

async function addDesserts() {
    const btns = document.querySelectorAll(".btnCart");
    btns.forEach(btn => {
        btn.addEventListener("click", addDessert);
    })
}

// Save Desserts
let dessertsChose = [];
const addDessert = (e) => {
    const btnSelect = e.currentTarget;
    const categoryName = btnSelect.dataset.dessert;
    console.log(categoryName);
    if (e.target.closest(".decrement")) {
        const showCount = btnSelect.querySelector(".count");
        removeCountDessert(categoryName, showCount);
        return
    } 
    if (e.target.closest(".increment"))  {
        const showCount = btnSelect.querySelector(".count");
        addCountDessert(categoryName, showCount);
        return 
    } 
    if (btnSelect.classList.contains("only")) {
        btnSelect.classList.remove("only");
        const picture = btnSelect.closest(".desserts__picture");
        picture.classList.add("desserts__picture--add");
        if (categoryName) appendDessert(categoryName);
        btnSelect.classList.add("decrement-increment-btn");
        btnSelect.innerHTML = `
            <div>
                    <svg class="circumference decrement" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 10 2">
                        <path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
                    </svg>
            </div>
            <p class="count">1</p>
            <div>
                    <svg class="circumference increment" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 10 10">
                        <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
                    </svg>
            </div>
        `;

    } 
}

function removeCountDessert(nameCategory, showCount) {
    const index = dessertsChose.findIndex(d => d.category === nameCategory);
    let countDessert = dessertsChose[index].number;
    countDessert--;
    if (countDessert > 0) {
        dessertsChose[index].number = countDessert;
        showCount.textContent = countDessert;
    } else if (countDessert <= 0) {
        dessertsChose[index].number = 0;
        dessertsChose.splice(index, 1);
        resetBtn(nameCategory);
    }
    updateList();
    calculateAllTotal();
    calculateCountDesserts();
}

function addCountDessert(nameCategory, showCount) {
    const index = dessertsChose.findIndex(d => d.category === nameCategory);
    let countDessert = dessertsChose[index].number;
    countDessert++;
    if (countDessert > 0) {
        dessertsChose[index].number = countDessert;
        showCount.textContent = countDessert;
    } 
    updateList();

}


function isInList(thisDessert) {
    return dessertsChose.some(d => d.category == thisDessert.category);
}

function appendDessert(category) {
    const dessert = allDesserts.find(d => d.category === category);
    if (isInList(dessert)) {
        const index = dessertsChose.findIndex(d => d.category == dessert.category);
        dessertsChose[index].count++;
    } else {
        dessert.number = 1;
        dessertsChose.push(dessert);
    }
    updateList();
}

const pictureCartEmpty = document.getElementById("figure"); 
const block = document.getElementById("block");
const numberDessertsInCart = document.getElementById("countDesserts");
const listShow = document.getElementById("list");
const totalShow = document.getElementById("allTotal");
function updateList() {
    if (dessertsChose.length > 0) {
        pictureCartEmpty.style.display = 'none';
        block.style.display = 'grid';
        addToCartDesserts();
    } else {
        removeToCartDessers();
    }
    console.log(dessertsChose);
}

function resetBtn(nameCategory) {
    const btns = document.querySelectorAll(".btnCart");
    btns.forEach(b => {
        if (b.dataset.dessert === nameCategory) {
             const picture = b.closest(".desserts__picture");
            picture.classList.remove("desserts__picture--add");
            b.classList.add("only");
            b.classList.remove("decrement-increment-btn");
            b.innerHTML = `
                <img src="./assets/images/icon-add-to-cart.svg" alt="Add Cart">
                <p>Add to Cart</p>
            `
        }
    })
}

function calculateCountDesserts() {
    let countDesserts = 0;
    dessertsChose.forEach(d => countDesserts += d.number);
    countShow.textContent = countDesserts;
}


function removeToCartDessers() {
    listShow.innerHTML = '';
    pictureCartEmpty.style.display = 'grid';
    block.style.display = 'none';
}


function addToCartDesserts() {
    listShow.innerHTML = '';
    dessertsChose.forEach(dessert => {
        const li = document.createElement("li");
        li.className = "cart__item";
        li.setAttribute("data-dessert", dessert.category);
        li.innerHTML = `
            <div class="cart__information">
                    <h3 class="cart__name">${dessert.name}</h3>
                    <div class="cart__prices">
                        <p class="cart__number">${dessert.number}x</p>
                        <p class="cart__base">@ $${(dessert.price).toFixed(2)}</p>
                        <p class="cart__total">$${(dessert.price * dessert.number).toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart__close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 10 10">
                        <path fill="currentColor" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                    </svg>
                </div>
        `
        listShow.append(li);
    })
    calculateAllTotal();
    calculateCountDesserts();
}

function calculateAllTotal() {
    let total = 0;
    dessertsChose.forEach(d => {
        total += d.number * d.price;
    })
    
    totalShow.textContent = `$ ${(total).toFixed(2)}`
}

function calculateCountDesserts() {
    let count = 0;
    dessertsChose.forEach(d => {
        count += d.number;
    })
    numberDessertsInCart.textContent = count;
}


function deleteItem(e) {
    const btns = document.querySelectorAll(".btnCart");
    const item = e.target.closest(".cart__item");
    const category = item.dataset.dessert;
    console.log("Eliminar la categoria", category);
    let btnDecrementIncrement;
    btns.forEach(b => {
        if (b.dataset.dessert == category) {
            const showCount = b.querySelector(".count")
            let number = Number(showCount.textContent);
            for (number; number > 0; number--) {
                removeCountDessert(category, showCount);
                
            }
            console.log("The number count", number);
        }
    })
   
}

listShow.addEventListener("click", (e) => {
    if (e.target.closest(".cart__close")) {
        deleteItem(e);
    }
})

const show = document.getElementById("show");
const btnConfirm = document.getElementById("confirm");
async function showTicket() {
    const section = document.createElement("section");
    section.className = 'ticket';
    
    section.innerHTML = `
            <img class="ticket__img-confirm" src="./assets/images/icon-order-confirmed.svg" alt="Confirm">
            <h2 class="ticket__title">Order Confirm</h2>
            <p class="ticket__hope">We hope you enjoy your food!</p>
            <section class="ticket-content">
                <ul class="ticket__list">
                </ul>
                <section class="ticket__total">
                    <p class="ticket__order cart__text-total">Order Total</p>
                    <h2 class="ticket__all-total cart__allTotal">$146.50</h2>
                </section>
            </section>
            <button id="reset" class="cart__confirm-order ticket__btn-new" type="button">Start New Order</button>
    `
    show.append(section);
    await addDessertsInTicket();
    const btnResetAll = document.getElementById("reset");
    btnResetAll.addEventListener("click", resetAllInformation);
}

async function addDessertsInTicket() {
    const ticketList = document.querySelector(".ticket__list");
    const ticketTotal = document.querySelector(".ticket__all-total");
    let total = 0;
    dessertsChose.forEach(dessert => {
        total += dessert.number * dessert.price;
        const li = document.createElement("li");
        li.className = "ticket__dessert";
        li.innerHTML = `
                <img src="${dessert.image.thumbnail}" alt="${dessert.category}" class="ticket__img">
                <div class="ticket__information">
                    <h4 class="ticket__name cart__name">${dessert.category}</h4>
                    <p class="ticket__count cart__number">${dessert.number}x</p>
                    <p class="ticket__base cart__base">@ $${dessert.price}</p>
                </div>
                <h3 class="ticket__price cart__total">$${(dessert.number * dessert.price).toFixed(2)}</h3>
        
        `
        ticketList.append(li);
    })
    ticketTotal.textContent = `$${(total).toFixed(2)}`
}
btnConfirm.addEventListener("click", showTicket);

function resetAllBtns() {
    const btns = document.querySelectorAll(".btnCart");
    btns.forEach(b => {
            const picture = b.closest(".desserts__picture");
            picture.classList.remove("desserts__picture--add");
            b.classList.add("only");
            b.classList.remove("decrement-increment-btn");
            b.innerHTML = `
                <img src="./assets/images/icon-add-to-cart.svg" alt="Add Cart">
                <p>Add to Cart</p>
            `
    })
}


function resetAllInformation() {
     const ticketList = document.querySelector(".ticket__list");
     const ticketAllTotal = document.querySelector(".ticket__all-total");
     resetAllBtns();
     dessertsChose = [];
     updateList();
    totalShow.textContent = '$0.00';
    numberDessertsInCart.textContent = 0;
    ticketList.innerHTML = '';
    ticketAllTotal.textContent = '$0.00';
    const ticket = document.querySelector(".ticket");
    show.removeChild(ticket);
}



window.addEventListener("DOMContentLoaded", async () => {
    await start();
    await showDesserts();
    await addDesserts();
})
