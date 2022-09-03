/**
 * permet l'affichage des produit lors du clique
 */
//permet d'éxecuter les fonctions de façon asynchrone
(async function() {
    const productId = getProductId();
    const product = await getProduct(productId);
    hydrateProduct(product);
    addCart(product, productId);
    colorsValue(product);
    tilte(product)
})()

// recupère l'ID du produit via l'URL
function getProductId(){
    return new URL(location.href).searchParams.get("id");
}

//Envoie une requête GET a l'API pour récupérer les données à afficher selon l'ID du produit
function getProduct(productId){
return fetch(`http://localhost:3000/api/products/${productId}`)
    .then( res => res.json())
    .catch( error => alert("Impossible de récupérer le produit"))
}
//Ajoute le titre
function tilte(product){
    document.querySelector("title").textContent = `${product.name}`
}
//Remplace les valeurs dans le DOM et inscris dans la page les données
function hydrateProduct(product){
    document.querySelector(".item__img").innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    document.querySelector("#title").textContent += `${product.name}`
    document.querySelector("#price").textContent += `${product.price}`
    document.querySelector("#description").textContent += `${product.description}`
}
// ajoute un produit au panier
function addCart(productId){
    let selectElement = document.getElementById("addToCart");
    selectElement.addEventListener("click", () => {
        let dataOfProduct = {
        id: productId._id ,
        quantity : parseInt(document.getElementById('quantity').value, 10),
        color : document.getElementById('colors').value
        };
    let storage = JSON.parse(localStorage.getItem("userPanier"));
    if(storage) {
        let elementAna = [];
        for(i=0;i<storage.length;i++){ 
            if(storage[i].id === dataOfProduct.id && storage[i].color=== dataOfProduct.color)
            elementAna = storage[i];
        }
        elementIndex = storage.indexOf(elementAna);
        if(elementAna.id === dataOfProduct.id && elementAna.color === dataOfProduct.color){
            el1 = parseInt(storage[elementIndex].quantity,10);
            el2 = parseInt(dataOfProduct.quantity,10);
            dataOfProduct.quantity = el1 + el2;
            storage.splice(elementIndex, 1);
            storage.push(dataOfProduct);
            localStorage.setItem("userPanier", JSON.stringify(storage));
        }
        else{
            storage.push(dataOfProduct);
            localStorage.setItem("userPanier", JSON.stringify(storage));
        }
    }
    else{
        storage = [];
        storage.push(dataOfProduct);
        localStorage.setItem("userPanier", JSON.stringify(storage));
    }
    })
}
//Ajoute l'option qui permet de choisir les couleurs
function colorsValue(product){
    let colors = product.colors;
    for(let i in colors){
        document.querySelector("#colors").innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
    }  
}



























