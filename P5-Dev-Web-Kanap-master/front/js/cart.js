
(async function(){
    let data =JSON.parse(localStorage.getItem("userPanier"));
    const product = getProduct(data)
    const apiProduct = await getApiProduct(product)
    console.log(apiProduct);
    
    
    
    addPanier(data,apiProduct)
    
    
})()

//récupére l'id des produit dans le panier 
function getProduct(data){
    let localData = []
    for( i=0 ; i < data.length ; i++) {
     localData[i] = {id : data[i].id}
    }
     return localData
}
//récupére les detaille du produit dans l'api
function getApiProduct(product){
    let id= []
    for(i=0 ; i<product.length ; i++){
    let response = (fetch(`http://localhost:3000/api/products/${product[i].id}`)
                    .then(res => res.json()))
                    .catch( error => alert('error'))
                    
    id.push(response);
    }
    return Promise.all(id)
    
    
}
 //créer le panier 
function addPanier(data,apiProduct){
    console.log(data);
    for(i=0; i< apiProduct.length; i++){
        document.querySelector("#cart__items").innerHTML +=`<article class="cart__item" data-id="${apiProduct[i].id}" data-color="${data[i].color}">
                                            <div class="cart__item__img">
                                            <img src=${apiProduct[i].imageUrl} alt="${apiProduct[i].description}">
                                            </div>
                                            <div class="cart__item__content">
                                            <div class="cart__item__content__description">
                                                <h2>${apiProduct[i].name}</h2>
                                                <p>${data[i].color}</p>
                                                <p>${apiProduct[i].price}</p>
                                            </div>
                                            <div class="cart__item__content__settings">
                                                <div class="cart__item__content__settings__quantity">
                                                <p>Qté : </p>
                                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${data[i].quantity}">
                                                </div>
                                                <div class="cart__item__content__settings__delete">
                                                <p class="deleteItem">Supprimer</p>
                                                </div>
                                            </div>
                                            </div>
                                        </article>`

    }
}

