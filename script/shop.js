//=============================================================================
//***********************************MODEL*************************************
//=============================================================================
const uniqueID = (function() {
    let id = 1;

    return function() { return id++; };
 })(); // Invoke the outer function after defining it.

const Types = Object.freeze({
    RING:     "Ring",
    NECKLACE: "Necklace",
    BRACELET: "Bracelet"
});

const Brands = Object.freeze({
    TIFFANY:       "Tiffany & Co",
    HARRY_WINSTON: "Harry Winston",
    CARTIER:       "Cartier",
    CHOPARD:       "Chopard",
    GRAFF:         "Graff"
});

class Product {

    constructor(type, brand, price, discount = 0, description = "No description was provided", inCart = true) {
        this.id          = uniqueID();
        this.name        = "Product - " + this.id;
        this.type        = type;
        this.brand       = brand;
        this.price       = price;
        this.discount    = discount;
        this.description = description;
        this.img         = "../img/shop/shop" + this.id + ".png";
        this.inCart      = inCart;
    }

}

const products = [];

const specialOffers = [];

const popular = [];

function initializeProducts(numberOfProducts) {
    for (let i = 0; i < numberOfProducts; i++) {
        const price = Math.round((Math.random() * 100 + 10) * 100) / 100;
        const discount = Math.round(Math.random() * 70);

        if (i % 3 === 0) 
            products.push(new Product(Types.RING, Brands.CARTIER, price, discount));
        else if (i % 3 === 1)
            products.push(new Product(Types.NECKLACE, Brands.CHOPARD, price, discount));
        else
            products.push(new Product(Types.BRACELET, Brands.TIFFANY, price, discount));

        if (products[i].discount > 50) 
            specialOffers.push(products[i]);

        if (i % 5 === 0)
            popular.push(products[i]);
    }
}

//=============================================================================
//**********************************SEARCH*************************************
//=============================================================================
function inputEvent(type = null) {
    autocomplete(type);
    searchProducts(type);
}

function autocomplete(type = null) {
    closeAllListsExcept();

    let productType = null;

    if (type !== null) {
        if (type === "RING")
            productType = Types.RING;
        else if (type === "BRACELET")
            productType = Types.BRACELET;
        else if (type === "NECKLACE")
            productType = Types.NECKLACE;
    }

    const inputElement = document.getElementById("search");
    
    if (!inputElement.value)
        return false;

    const itemsDiv = createDiv(inputElement.id + "-autocomplete-list", "autocomplete-items");

    inputElement.parentElement.appendChild(itemsDiv);

    let results = 0;

    for (let i = 0; i < products.length; i++) {
        if (productType !== null && products[i].type !== productType)
            continue;

        if (results === 5)
            break;

        if (products[i].name.includes(inputElement.value)) {
            const matchingDiv = document.createElement("div");

            // matching text will be bolded (<strong>) and the rest will have a noraml font
            matchingDiv.innerHTML = "<strong>" + products[i].name.substr(0, inputElement.value.length) + "</strong>";
            matchingDiv.innerHTML += products[i].name.substr(inputElement.value.length);

            // hidden input that contains product name
            const hiddentInput = document.createElement("input");
            hiddentInput.type = "hidden";
            hiddentInput.value = products[i].name;
            matchingDiv.appendChild(hiddentInput);

            matchingDiv.addEventListener("click", function() {
                inputElement.value = this.getElementsByTagName("input")[0].value;
                closeAllListsExcept();
                searchProducts(type);
            });

            itemsDiv.appendChild(matchingDiv);
            results++;
        }
    }
}

function closeAllListsExcept(selected) {
    const autocompleteItems = document.getElementsByClassName("autocomplete-items");

    for (let i = 0; i < autocompleteItems.length; i++) {
        if (selected !== autocompleteItems[i] && selected !== document.getElementById("search"))
            autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
    }
}

function searchProducts(type = null) {
    let productType = null;

    if (type !== null) {
        if (type === "RING")
            productType = Types.RING;
        else if (type === "BRACELET")
            productType = Types.BRACELET;
        else if (type === "NECKLACE")
            productType = Types.NECKLACE;
    }

    const inputElement = document.getElementById("search");
    const input = inputElement.value.toUpperCase();

    refreshPageSections(input, type);

    const productContainer = document.getElementById("product-container");
    let skipped = 0;

    for (let i = 0; i < products.length; i++) {
        if (productType !== null && products[i].type !== productType) {
            skipped++;
            continue;
        }

        // productContainer -> col-div -> card-div -> card-body-div -> h1 -> productName
        const colDiv = productContainer.childNodes[i + 2 - skipped];
        const productName = colDiv.childNodes[0].childNodes[1].childNodes[0].textContent;

        if (productName.toUpperCase().includes(input))
            colDiv.style.display = "";
        else 
            colDiv.style.display = "none";
    }
}

function refreshPageSections(input, type = null) {
    if (type === null) {
        if (input === "") {
            document.getElementById("special-offers").style.display = "";
            document.getElementById("popular").style.display = "";
            document.getElementById("products-header").textContent = "All Products";
        } else {
            document.getElementById("special-offers").style.display = "none";
            document.getElementById("popular").style.display = "none";
            document.getElementById("products-header").textContent = "Search Results";
        }
    }
}

//=============================================================================
//**********************************FILTER*************************************
//=============================================================================
function processForm(e) {
    if (e.preventDefault)
        e.preventDefault();

    document.getElementById("special-offers").style.display = "none";
    document.getElementById("popular").style.display = "none";
    document.getElementById("products-header").textContent = "Search Results"; 

    const selected = {};
    const formData = new FormData(e.target);

    let count = 0;
    
    for (const brand in Brands) {
        const checkBox = formData.get("check-box-" + count);
        
        selected[Brands[brand]] = checkBox !== null;

        count++;
    }

    const productContainer = document.getElementById("product-container");

    for (let i = 0; i < products.length; i++) {
        // productContainer -> col-div -> card-div -> card-body-div -> h1 -> productName
        const colDiv = productContainer.childNodes[i + 2];

        if (selected[products[i].brand])
            colDiv.style.display = "";
        else 
            colDiv.style.display = "none";
    }
}

function attachFormEvent() {
    const filterForm = document.getElementById("filter-form");

    if (filterForm.addEventListener)
        filterForm.addEventListener("submit", processForm);
    else if (filterForm.attachEvent)
        filterForm.attachEvent("submit", processForm);
    else
        filterForm["onsubmit"] = processForm;
}

//=============================================================================
//***********************************CART**************************************
//=============================================================================
let totalPrice = 0;

function fillCartTable() {
    totalPrice = 0;

    const table = document.getElementById("cart-table");
    const oldTBody = table.tBodies[0];
    const newTBody = document.createElement("tBody");

    for (let i = 0; i < products.length; i++) {
        if (products[i].inCart) {
            const row = document.createElement("tr");
            const nameTd = document.createElement("td");
            const brandTd = document.createElement("td");
            const priceTd = document.createElement("td");
            const discountTd = document.createElement("td");
            const removeTd = document.createElement("td");
            const button = createInput("", "button", "");

            nameTd.innerHTML = products[i].name;
            brandTd.innerHTML = products[i].brand;
            priceTd.innerHTML = products[i].price + " $";
            discountTd.innerHTML = products[i].discount + " %";
            button.value = " X ";
            button.setAttribute("onclick", "deleteRow(this)");
            button.className = "remove-button";

            removeTd.appendChild(button);
            row.appendChild(nameTd);
            row.appendChild(brandTd);
            row.appendChild(priceTd);
            row.appendChild(discountTd);
            row.appendChild(removeTd);

            newTBody.appendChild(row);

            totalPrice += products[i].price;
        }
    }

    table.replaceChild(newTBody, oldTBody);
}

function deleteRow(button) {
    const parentIndex = button.parentNode.parentNode.rowIndex;

    document.getElementById("cart-table").deleteRow(parentIndex);

    totalPrice -= products[parentIndex - 1].price;
    products[parentIndex - 1].inCart = false;
    showTotalPrice();
}

function showTotalPrice() {
    const oldH4 = document.getElementsByClassName("total-price");
    const container = document.getElementById("price-container");
    const h4 = createH4("total-price", "Total price: " + Math.round(totalPrice * 100) / 100 + " $");

    container.replaceChild(h4, oldH4[0]);
}

function attachEventsToCheckboxes() {
    const homeDeliveryBox = document.getElementById("home-delivery");
    const storeDeliveryBox = document.getElementById("store-delivery");

    homeDeliveryBox.addEventListener("click", function () {
        if (storeDeliveryBox.checked)
            storeDeliveryBox.checked = false;
    });

    storeDeliveryBox.addEventListener("click", function () {
        if (homeDeliveryBox.checked)
            homeDeliveryBox.checked = false;
    });

    const onDeliveryBox = document.getElementById("on-delivery");
    const creditCardBox = document.getElementById("credit-card");

    onDeliveryBox.addEventListener("click", function () {
       if (creditCardBox.checked)
           creditCardBox.checked = false;
    });

    creditCardBox.addEventListener("click", function () {
        if (onDeliveryBox.checked)
            onDeliveryBox.checked = false;
    });
}

// todo=============================================================================
// todo***********************************FORM**************************************
// todo=============================================================================
function processDeliveryForm() {
    if (e.preventDefault)
        e.preventDefault();

    const homeDeliveryBox = document.getElementById("home-delivery");
    const storeDeliveryBox = document.getElementById("store-delivery");

    const onDeliveryBox = document.getElementById("on-delivery");
    const creditCardBox = document.getElementById("credit-card");


}

function attachDeliveryFormEvent() {
    const deliveryForm = document.getElementById("delivery-form");

    if (deliveryForm.addEventListener)
        deliveryForm.addEventListener("submit", processDeliveryForm);
    else if (deliveryForm.attachEvent)
        deliveryForm.attachEvent("submit", processDeliveryForm);
    else
        deliveryForm["onsubmit"] = processDeliveryForm;
}

//=============================================================================
//*********************************PRODUCT*************************************
//=============================================================================
function createProductElement() {
    const url = window.location.toString();
    const productIndex = url.substring(url.indexOf("product=") + "product=".length, url.indexOf("img=") - 1);
    const image = url.substring(url.indexOf("img=") + "img=".length, url.indexOf("price=") - 1);
    const price = url.substring(url.indexOf("price=") + "price=".length);

    const titleContainer = document.getElementById("title-container");
    const nameTitle = createH2("", "Product - " + productIndex);
    const priceTitle = createH4("", "Price " + price + "$");

    titleContainer.replaceChild(nameTitle, document.getElementById("name-title"));
    titleContainer.replaceChild(priceTitle, document.getElementById("price-title"));

    const imageContainer = document.getElementById("image-container");
    const img = createImg("img-fluid", image);

    imageContainer.appendChild(img);
}

//=============================================================================
//***********************************HTML**************************************
//=============================================================================
function createSpecialOfferElements() {
    createElementsWorker(specialOffers, "special-offer-container");
}

function createPopularElements() {
    createElementsWorker(popular, "popular-container");
}

function createProductElements() {
    createElementsWorker(products, "product-container");
}

function createRingElements() {
    createElementsWorker(products, "product-container", Types.RING);
}

function createNecklaceElements() {
    createElementsWorker(products, "product-container", Types.NECKLACE);
}

function createBraceletElements() {
    createElementsWorker(products, "product-container", Types.BRACELET);
}

// worker function for creating elements
//
// products - products array or any of its subtype (specialOffers, popular...)
// containerId - id of the parent element
function createElementsWorker(products, containerId, type = null) {
    const container = document.getElementById(containerId);
    console.log(type);
    for (let i = 0; i < products.length; i++) {
        if (type !== null && products[i].type !== type)
            continue;

        const parentDiv = createDiv("", "col-md-4");
        const cardDiv = createDiv("", "card");
        const cardBodyDiv = createDiv("", "card-body");
        const img = createImg("card-img-top card-image", products[i].img);
        const imgA = document.createElement("a");
        imgA.href = "product.html?product=" + i + ",img=" + products[i].img + ",price=" + products[i].price;
        imgA.appendChild(img);
        const buttonA = createA("btn btn-outline-secondary", "cart.html", "Add To Cart");
        const cardPriceP = createP(products[i]);
        const cardTitleH4 = createH4("card-title", products[i].name);

        cardBodyDiv.appendChild(cardTitleH4);
        cardBodyDiv.appendChild(cardPriceP);
        cardBodyDiv.appendChild(buttonA);
        cardDiv.appendChild(imgA);
        cardDiv.appendChild(cardBodyDiv);
        parentDiv.appendChild(cardDiv);
        container.appendChild(parentDiv);
    }
}

function createFilterElements() {
    const container = document.getElementById("filter-body");

    let count = 0;

    for (const brand in Brands) {
        const checkBoxDiv = createDiv("", "custom-control custom-checkbox");
        const checkBox = createInput("check-box-" + count, "checkbox", "custom-control-input");
        checkBox.checked = true;
        const checkBoxText = createLabel("custom-control-label", "check-box-" + count, Brands[brand]);

        checkBoxDiv.append(checkBox);
        checkBoxDiv.append(checkBoxText);
        container.append(checkBoxDiv);

        count++;
    }
}

function createDiv(id, className) {
    const div = document.createElement("div");

    div.id = id;
    div.name = name;
    div.className = className;

    return div;
}

function createImg(className, src) {
    const img = document.createElement("img");

    img.className = className;
    img.src = src;

    return img;
}

function createH4(className, textContent) {
    const h4 = document.createElement("h4");

    h4.className = className;
    h4.textContent = textContent;

    return h4;
}

function createH2(className, textContent) {
    const h2 = document.createElement("h2");

    h2.className = className;
    h2.textContent = textContent;

    return h2;
}

function createP(product) {
    const p = document.createElement("p");

    let textContent = product.price + " $";

    if (product.discount > 0)
        textContent += " -" + product.discount + "%";

    p.textContent = textContent;

    return p;
}

function createA(className, href, textContent) {
    const a = document.createElement("a");

    a.className = className;
    a.href = href;
    a.textContent = textContent;

    return a;
}

function createInput(id, type, className) {
    const input = document.createElement("input");

    input.id = id;
    input.name = id;
    input.type = type;
    input.className = className;

    return input;
}

function createLabel(className, forId, textContent) {
    const label = document.createElement("label");

    label.htmlFor = forId;
    label.className = className;
    label.textContent = textContent;

    return label;
}