
(async function(){
    let data =JSON.parse(localStorage.getItem("userPanier"));
    const product = getProduct(data)
    const apiProduct = await getApiProduct(product)
    addPanier(data,apiProduct)
    changeQuantity(data)
    suppProduit(data)
    caculeProd(data,apiProduct)
    const validForm = creatForm(data)
    const order =  formSubmit(data)
    
    creatOrderId(order)
})()
//change la quantié d'un produit
function changeQuantity(data){
    const boxes = document.querySelectorAll('#cart__items input');

        boxes.forEach(box => {
        box.addEventListener('change', function handleChange(event) {
           let id = this.closest('.cart__item').dataset.id
           for(i=0; i<data.length; i++){
            //element.id for each 
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

function creatForm (data){
    //click verifier regex 
        let formArray= []
        let verifEmail 	= /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
        let verifName = /^[a-zA-Z\-]+$/;
        let verifAddress = /^[0-9a-zA-Z\s,-]+$/;
        let verifCity = /^[A-Z][-a-zA-Z]+$/;
        let locationFirstName = document.querySelector(".cart__order__form input[name='firstName']");
        let locationLastName = document.querySelector(".cart__order__form input[name='lastName']");
        let locationAddress = document.querySelector(".cart__order__form input[name='address']");
        let locationverifCity = document.querySelector(".cart__order__form input[name='city']");
        let locationEmail = document.querySelector(".cart__order__form input[name='email']");
        locationFirstName.addEventListener('change',function(){
            let firstName = document.getElementById("firstName").value
            if(verifName.exec(firstName) == null){
            document.querySelector("#firstNameErrorMsg").textContent ="Le Nom est éronnée"
            }
            else{
                document.querySelector("#firstNameErrorMsg").textContent =''
                
            }
        })
        locationLastName.addEventListener('change',function(){
            let lastName = document.getElementById("lastName").value
            if(verifName.exec(lastName)== null){
                document.querySelector("#lastNameErrorMsg").textContent ="Le prénom est éronnée"
            }
            else{
                document.querySelector("#lastNameErrorMsg").textContent =''
                
            }
        })
        locationAddress.addEventListener('change',function(){
            let address = document.getElementById("address").value
            if(verifAddress.exec(address) == null){
            document.querySelector("#addressErrorMsg").textContent ="L'adrèsse est éronnée"
            }
            else{
                document.querySelector("#addressErrorMsg").textContent =''
                
            }
        })
        locationverifCity.addEventListener('change',function(){
            let city = document.getElementById("city").value
            if(verifCity.exec(city) == null){
                document.querySelector("#cityErrorMsg").textContent ="La ville est éronnée"
            }
            else{
                document.querySelector("#cityErrorMsg").textContent =''
            }
        })
        locationEmail.addEventListener('change',function (){
            let email = document.getElementById("email").value
            if( verifEmail.exec(email) == null){
                document.querySelector("#emailErrorMsg").textContent = "L'email est éronnée"
            }
            else{
                document.querySelector("#emailErrorMsg").textContent =''
                }
            
        })
            
}
    

    function formSubmit(data) {
        
        const submit = document.querySelector(".cart__order__form__submit input[id='order']") 
        submit.addEventListener('click', function(event){
            event.preventDefault();
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
                
                 let promise = (fetch("http://localhost:3000/api/products/order", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                        method: "POST",
                        body: JSON.stringify(form)
                    })
                    .then( res => res.json())
                    .catch( error => alert('error')))
                    
        })
    }
    
/**
 * recuperer le orderId si il existe window location ver page confirm sinon erreur
 */
function creatOrderId(order){
    const submit = document.querySelector(".cart__order__form__submit input[id='order']") 
    submit.addEventListener('click', function(event){
        /*if(order == null){
            alert('error')
        }
        else{*/
            console.log(order);
            //window.location = `confirmation.html? ${orderId}`
        //}
})
}



	

