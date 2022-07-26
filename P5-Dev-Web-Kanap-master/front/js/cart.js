
(async function(){
    let cart_items =JSON.parse(localStorage.getItem("userPanier"));
    const product = getProduct(cart_items);
    const apiProduct = await getApiProduct(product);
    addCart(cart_items,apiProduct);
    changeQuantity(cart_items);
    deleteProduct(cart_items);
    calculatePrice(cart_items,apiProduct);
    formSubmit(cart_items);
})()
//Change la quantité d'un produit
function changeQuantity(cart_items){
    const cartInput = document.querySelectorAll('#cart__items input');
    cartInput.forEach(inputElement => {
        inputElement.addEventListener('change', function handleChange(event) {
           let id = this.closest('.cart__item').dataset.id;
           cart_items.forEach(item => {
                if(item.id == id){
                    item.quantity = parseInt(event.target.value);
                    localStorage.setItem("userPanier", JSON.stringify(cart_items));
                    window.location.href = "#cart__items";
                    location.reload();
                }
           });
        });
    });
}
//Permet de supprimer un produit
function deleteProduct(cart_items){
    const cards = document.querySelectorAll('.deleteItem');
    cards.forEach(card => {
        card.addEventListener('click',function (){
            let idSupp = this.closest('.cart__item').dataset.id;
            cart_items.forEach(function callback(item, key) {
                if(item.id == idSupp){
                    cart_items.splice(key,1);
                    localStorage.setItem("userPanier", JSON.stringify(cart_items));
                    window.location.href = "#cart__items";
                    location.reload();
                }
            })
        })
    })
}

//Récupère l'id des produit dans le panier 
function getProduct(cart_items){
    let localcart_items = [];
    if(cart_items== null){
        alert('Le panier est vide');
    }
    else{
        for( i=0 ; i < cart_items.length ; i++) {
            localcart_items[i] = {id : cart_items[i].id};
        }
    return localcart_items;
    }
}
//Récupère les détaille du produit dans l'API
function getApiProduct(product){
    let id= [];
    for(i=0 ; i<product.length ; i++){
        let response = (fetch(`http://localhost:3000/api/products/${product[i].id}`)
                        .then(res => res.json()))
                        .catch( error => alert('Impossible de récuperer le produit'))       
        id.push(response);
    }
    return Promise.all(id);
}
//Calcule le total des produits
function calculatePrice(cart_items,apiProduct){
    let total = 0;
    let articles =0;
    for (i=0;i<cart_items.length;i++ ){
        total = total + apiProduct[i].price * cart_items[i].quantity;
        articles = articles + parseInt(cart_items[i].quantity);
    }
    document.querySelector("#totalPrice").textContent += `${total}`;
    document.querySelector("#totalQuantity").textContent += `${articles}`;
}
 //créer le panier 
function addCart(cart_items,apiProduct){
    for(i=0; i< apiProduct.length; i++){
        document.querySelector("#cart__items").innerHTML +=`<article class="cart__item" data-id="${apiProduct[i]._id}" data-color="${cart_items[i].color}">
                                            <div class="cart__item__img">
                                            <img src=${apiProduct[i].imageUrl} alt="${apiProduct[i].description}">
                                            </div>
                                            <div class="cart__item__content">
                                            <div class="cart__item__content__description">
                                                <h2>${apiProduct[i].name}</h2>
                                                <p>${cart_items[i].color}</p>
                                                <p>${apiProduct[i].price}</p>
                                            </div>
                                            <div class="cart__item__content__settings">
                                                <div class="cart__item__content__settings__quantity">
                                                <p>Qté : </p>
                                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart_items[i].quantity}">
                                                </div>
                                                <div class="cart__item__content__settings__delete">
                                                <p class="deleteItem">Supprimer</p>
                                                </div>
                                            </div>
                                            </div>
                                        </article>`;

    }
}
//vérifie les champs du formulaire et l'envoie si tout est bon
function formSubmit(cart_items) {
    const submit = document.querySelector(".cart__order__form__submit input[id='order']") ;
    submit.addEventListener('click', function(event){
        event.preventDefault();
        // Contrôle de validité des champs
        let errors = false;
        let verifEmail 	= /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
        let verifName = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-]+$/;
        let verifAddress = /^[0-9a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s,-]+$/;
        let verifCity = /^[A-Z][-a-zA-Z\s]+$/;
        const error_messages = document.querySelectorAll('.error-message');
        error_messages.forEach(error_message => {
            error_message.innerHTML = '';
        });
        let firstName = document.getElementById("firstName").value;
        if(verifName.exec(firstName)== null || firstName.value == ''){
            document.querySelector("#firstNameErrorMsg").textContent ="Le prénom est erroné";
            errors = true;
        }
        let lastName = document.getElementById("lastName").value
        if(verifName.exec(lastName) == null || lastName.value == ''){
            document.querySelector("#lastNameErrorMsg").textContent ="Le nom est erroné";
            errors = true;
        }
        let address = document.getElementById("address").value
        if(verifAddress.exec(address)== null || address.value == ''){
            document.querySelector("#addressErrorMsg").textContent = "L'adresse' est erroné";
            errors = true;
        }
        let city = document.getElementById("city").value
        if(verifCity.exec(city)== null || city.value == ''){
            document.querySelector("#cityErrorMsg").textContent = "Le nom de la ville est erroné";
            errors = true;
        }
        let email = document.getElementById("email").value
        if(verifEmail.exec(email)== null || email.value == ''){
            document.querySelector("#emailErrorMsg").textContent = "L'émail est erroné";
            errors = true;
        }
        // Si il y a des erreurs, on n'envoie pas le formulaire.
        if(errors == true){
            return false;
        }
        let cart_itemsId = []
        cart_items.forEach(element => {
            cart_itemsId.push(element.id);
        })
        let form = { contact : {
            firstName: document.getElementById("firstName").value,
            lastName : document.getElementById("lastName").value,
            address : document.getElementById("address").value,
            city : document.getElementById("city").value,
            email : document.getElementById("email").value,}, 
            products : cart_itemsId
        };
        fetch("http://localhost:3000/api/products/order", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(form)
            })
        .then(res => res.json())
        .then(function(response) {
            console.log(response.orderId);
            let orderId =response.orderId;
            if(orderId == null){
                alert ('error');
            }
            else{
                window.location =`confirmation.html?id=${orderId}`;
            }
            })
        .catch( error => alert("Impossible de se connecter au serveur l'envoie du formulaire est impossible"))   
    })
}




	

