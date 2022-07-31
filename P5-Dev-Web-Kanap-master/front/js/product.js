/**
 * permet l'affichage des produit lors du clique
 */
//permet d'éxecuter les fonction de façon asynchrone
(async function() {
    const productId = getProductId()
    const product = await getProduct(productId)
    hydrateProduct(product)
   
    const data = addPanier(product)
    const cont = equalverif(data)
    colorsValue(product)
    
    //resultQuantity(cont)
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


//permet de verifier les données du localStorage et du panier et de créer si localStorage = null 
function equalverif(data){
    let equalObject = JSON.parse((localStorage.getItem('userData')))
    const add = document.getElementById('addToCart');
    add.addEventListener('click', function(){
    if( equalObject === null){
        localStorage.setItem('userData', dataJSON); 
    }
    else{let obj = equalObject.id
        let objId = JSON.parse(dataJSON)
        let obj2 = objId.id
        let result = obj === obj2
        return result
    }})
}

/**function resultQuantity(cont){
    const add = document.getElementById('addToCart');
    add.addEventListener('click', function(){
    if(result== true){
        console.log('créer quantity')
    }
    else{
        console.log('error')
    }})
}*/

// créer un variable data qui contien le produit 
function addPanier(product){
    let output = ""
    let selectElement = document.querySelector("#colors")
    selectElement.addEventListener("change",function(){
        let select = selectElement.selectedIndex - 1;
        return output = product.colors[select]
    })
    selectElement.addEventListener("change",function(){
    let data = {
        id: `${product._id}`,
        quantity: 1,
        color : output
        }
        dataJSON = JSON.stringify(data);
        console.log(data)
    }) 
}

//ajoute l'option qui permet de choisir les couleurs 
function colorsValue(product){
    let colors = product.colors
    for(let i in colors){
        document.querySelector("#colors").innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
    }  
}



























