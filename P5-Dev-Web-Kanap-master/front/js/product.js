/**
 * permet l'affichage des produit lors du clique
 */
//permet d'éxecuter les fonction de façon asynchrone
(async function() {
    const productId = getProductId()
    const product = await getProduct(productId)
    hydrateProduct(product)
    addCart(product, productId)
    colorsValue(product)
    
})()


// recupère l'ID du produit via l'URL
function getProductId(){
    return new URL(location.href).searchParams.get("id")
}

//envoye une requéte GET a l'API pour récuper les dopnnées a afficher
function getProduct(productId){
return fetch(`http://localhost:3000/api/products/${productId}`)
    .then( res => res.json())
    .catch( error => alert(error))
}
//remplace les valeur dans le DOM et inscrit dans la page les données
function hydrateProduct(product){
    document.querySelector(".item__img").innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    document.querySelector("#title").textContent += `${product.name}`
    document.querySelector("#price").textContent += `${product.price}`
    document.querySelector("#description").textContent += `${product.description}`
}


// créer un variable data qui contien le produit et le push dans le local storage selon les paramétres
function addCart(productId){
    let selectElement = document.getElementById("addToCart")
    selectElement.addEventListener("click", () => {
        let data = {
        id: productId._id ,
        quantity : parseInt(document.getElementById('quantity').value, 10),
        color : document.getElementById('colors').value
        }
    let storage = JSON.parse(localStorage.getItem("userPanier"))
    
    if(storage) {
        let elementAna = [] 
        for(i=0;i<storage.length;i++){ 
            if(storage[i].id === data.id && storage[i].color=== data.color)
            elementAna = storage[i]
        }
        elementIndex = storage.indexOf(elementAna)
        if(elementAna.id === data.id && elementAna.color === data.color){
            el1 = parseInt(storage[elementIndex].quantity,10)
            el2 = parseInt(data.quantity,10)
            data.quantity = el1 + el2
            storage.splice(elementIndex, 1)
            storage.push(data)
            localStorage.setItem("userPanier", JSON.stringify(storage))
            
            
        }
        else{
            storage.push(data)
            localStorage.setItem("userPanier", JSON.stringify(storage))
        }
    }
    else{
        storage = []
        storage.push(data)
        
        localStorage.setItem("userPanier", JSON.stringify(storage))}
    })
    
}

//ajoute l'option qui permet de choisir les couleurs 
function colorsValue(product){
    let colors = product.colors
    for(let i in colors){
        document.querySelector("#colors").innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
    }  
}



























