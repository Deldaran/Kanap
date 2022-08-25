
(async function(){
    let data =JSON.parse(localStorage.getItem("userPanier"));
    const product = getProduct(data)
    const apiProduct = await getApiProduct(product)
    addCart(data,apiProduct)
    changeQuantity(data)
    deleteProduct(data)
    calculatePrice(data,apiProduct)
    const order =  formSubmit(data)
})()
//change la quantié d'un produit
function changeQuantity(cart_items){
    const boxes = document.querySelectorAll('#cart__items input');

        boxes.forEach(box => {
        box.addEventListener('change', function handleChange(event) {
           let id = this.closest('.cart__item').dataset.id
           cart_items.forEach(item => {
                if(item.id == id){
                    item.quantity = parseInt(event.target.value)
                    localStorage.setItem("userPanier", JSON.stringify(cart_items))
                    window.location.href += "#cart__items";
                    location.reload();
                }
           });

        });
        });
    
}
//permet de supprimer un roduit
function deleteProduct(cart_items){
    const cards = document.querySelectorAll('.deleteItem');
    cards.forEach(card => {
        card.addEventListener('click',function (){
            let idSupp = this.closest('.cart__item').dataset.id
            cart_items.forEach(function callback(item, key) {
                if(item.id == idSupp){
                    cart_items.splice(key,1)
                    localStorage.setItem("userPanier", JSON.stringify(cart_items))
                    window.location.href += "#cart__items";
                    location.reload();
                }

            })

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
function calculatePrice(data,apiProduct){
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
function addCart(data,apiProduct){
    
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
    

    function formSubmit(data) {
         
        const submit = document.querySelector(".cart__order__form__submit input[id='order']") 
        submit.addEventListener('click', function(event){
            event.preventDefault();

            // Controle de validité des champs
            let errors = false;
            let verifEmail 	= /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
            let verifName = /^[a-zA-Z\-]+$/;
            let verifAddress = /^[0-9a-zA-Z\s,-]+$/;
            let verifCity = /^[A-Z][-a-zA-Z\s]+$/;
            const error_messages = document.querySelectorAll('.error-message');
            error_messages.forEach(error_message => {
                error_message.innerHTML = '';
            });

            let firstName = document.getElementById("firstName").value
            if(verifName.exec(firstName)== null || firstName.value == ''){
                document.querySelector("#firstNameErrorMsg").textContent ="Le prénom est éronnée"
                errors = true;
            }

            let lastName = document.getElementById("lastName").value
            if(verifName.exec(lastName) == null || lastName.value == ''){
                document.querySelector("#lastNameErrorMsg").textContent ="Le prénom est éronnée"
                errors = true;
            }
            

            let address = document.getElementById("address").value
            if(verifAddress.exec(address)== null || address.value == ''){
                document.querySelector("#addressErrorMsg").textContent = "Le prénom est éronnée"
                errors = true;
            }

            let city = document.getElementById("city").value
            if(verifCity.exec(city)== null || city.value == ''){
                document.querySelector("#cityErrorMsg").textContent = "Le prénom est éronnée"
                errors = true;
            }

            let email = document.getElementById("email").value
            if(verifEmail.exec(email)== null || email.value == ''){
                document.querySelector("#emailErrorMsg").textContent = "Le prénom est éronnée"
                errors = true;
            }

            // Si il y a des erreurs, on envoi pas le formulaire
            if(errors == true){
                return false;
            }

            let dataId = []
            data.forEach(element => {
             dataId.push(element.id)
            })
            let form = { contact : {
                firstName: document.getElementById("firstName").value,
                lastName : document.getElementById("lastName").value,
                address : document.getElementById("address").value,
                city : document.getElementById("city").value,
                email : document.getElementById("email").value,},
                
                products : dataId
            }
            
                fetch("http://localhost:3000/api/products/order", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                        method: "POST",
                        body: JSON.stringify(form)
                    })
                .then(res => res.json())
                //.then(promise => orderId = promise.orderId)
                .then(function(response) {
                   console.log(response.orderId);
                    let orderId =response.orderId
                    if(orderId == null){
                        alert (error)
                    }
                    else{
                        window.location =`confirmation.html?id=${orderId}`
                    }
                  })
                .catch( error => alert('error'))
                
        })
    }
    
/**
 * recuperer le orderId si il existe window location ver page confirm sinon erreur
 */




	

