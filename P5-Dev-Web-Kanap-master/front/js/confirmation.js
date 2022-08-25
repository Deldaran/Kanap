(async function() {
    getOrder()
})()

function getOrder(){
    let id = new URL(location.href).searchParams.get("id")
    document.getElementById("orderId").textContent = id
}