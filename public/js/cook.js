function addOrderToList(){
    const templateOrder = document.querySelector('#order-div');
    const container = document.querySelector('.content-cook-container');
    const clone = templateOrder.content.cloneNode(true);

    const nrZam = clone.querySelector("div").querySelector("h1");
    console.log(nrZam);
    nrZam.innerHTML = "2";
   container.appendChild(clone);
}