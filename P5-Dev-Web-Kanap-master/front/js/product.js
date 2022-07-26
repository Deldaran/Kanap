/**
 * permet l'affichage des produit lors du clique
 */
(async function() {
    const productId = getProductId()
    const product = await getProduct(productId)
    hydrateProduct(product)
})()


function getProductId(){
    return new URL(location.href).searchParams.get("id")
}

function getProduct(productId){
return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res){
        return res.json()
    })
    .then (function(Product){
        return Product
    })
    .catch(function(error){
        alert(error)
    })
}
function hydrateProduct(product){
 document.querySelector(".item__img").innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
 document.querySelector("#title").textContent += `${product.name}`
 document.querySelector("#price").textContent += `${product.price}`
 document.querySelector("#description").textContent += `${product.description}`
}
















