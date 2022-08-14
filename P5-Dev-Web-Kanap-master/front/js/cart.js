
(async function(){
    let data =JSON.parse(localStorage.getItem("userPanier"));
    const product = getProduct(data)
    const apiProduct = await getApiProduct(product)
    addPanier(data,apiProduct)
    changeQuantity(data)
    suppProduit(data)
    verifForm()
    caculeProd(data,apiProduct)
})()
//change la quantié d'un produit
function changeQuantity(data){
    const boxes = document.querySelectorAll('#cart__items input');

        boxes.forEach(box => {
        box.addEventListener('change', function handleChange(event) {
           let id = this.closest('.cart__item').dataset.id
           for(i=0; i<data.length; i++){
            if(data[i].id === id){
                data[i].quantity = event.target.value
                localStorage.setItem("userPanier", JSON.stringify(data))
                window.location.reload()
            }
           }
        });
        });
    
}
//permet de supprimer un roduit
function suppProduit(data){
    const cards = document.querySelectorAll('.deleteItem');
    cards.forEach(card => {
        card.addEventListener('click',function (){
            let idSupp = this.closest('.cart__item').dataset.id
            let storage = JSON.parse(localStorage.getItem("userPanier"))
            for(i=0; i<data.length; i++){
                if(data[i].id === idSupp){
                    data.splice(i,1)
                    localStorage.setItem("userPanier", JSON.stringify(data))
                    window.location.reload()
                }
            }

        })

    })
}

//récupére l'id des produit dans le panier 
function getProduct(data){
    let localdata = []
    if(data== null){
        alert('Le panier est vide')
    }
    else{
        for( i=0 ; i < data.length ; i++) {
            localdata[i] = {id : data[i].id}
        }
     return localdata
    }
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
//cacule total produit
function caculeProd(data,apiProduct){
    let total = 0
    let articles =0
    for (i=0;i<data.length;i++ ){
        total = total + apiProduct[i].price * data[i].quantity
        articles = articles + parseInt(data[i].quantity)
    }
    document.querySelector("#totalPrice").textContent += `${total}`;
        document.querySelector("#totalQuantity").textContent += `${articles}`
}
 //créer le panier 
function addPanier(data,apiProduct){
    
    for(i=0; i< apiProduct.length; i++){
    
        document.querySelector("#cart__items").innerHTML +=`<article class="cart__item" data-id="${apiProduct[i]._id}" data-color="${data[i].color}">
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
function verifForm(email){
    let dataEmail=document.querySelector(".cart__order__form");
        dataEmail.addEventListener('change',function (){
            let email 	= document.getElementById("email").value;
           let verif 	= /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/
           if (verif.exec(email) == null)
        {
            alert("Votre email est incorrecte");
            return false;
        }
        else
        {
            alert("Votre email est correcte");
            return true;
        }
        })
        	
}
