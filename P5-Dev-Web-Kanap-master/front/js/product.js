/**
 * permet l'affichage des produit lors du clique
 */
//permet d'éxecuter les fonction de façon asynchrone
(async function() {
    const productId = getProductId()
    const product = await getProduct(productId)
    hydrateProduct(product)
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

















