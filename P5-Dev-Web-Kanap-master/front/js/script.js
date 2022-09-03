/**
 * Gére l'affichage dynamique de index.html
 */
//Demande grâce a la méthode GET pour récupérer les données des produits et créer donc chaque carte par produit et l'inclus dans le DOM  
fetch("http://localhost:3000/api/products")
.then( data => data.json())
.then( jsonListProduct =>{
    for(let product of jsonListProduct){
        document.querySelector(".items").innerHTML += `<a href="./product.html?id=${product._id}">
                                                                <article>
                                                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                <h3 class="productName">${product.name}</h3>
                                                                <p class="productDescription">${product.description}</p>
                                                                </article>
                                                            </a>`;
    } 
})
.catch(error => alert("Impossible de récupérer les articles"));
