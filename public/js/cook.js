var counter = 2;


function changeStatus(event, id){
    const order = document.getElementById(id);
    const status = order.querySelector(".order-status");
    console.log(status.style.backgroundColor)

    if(status.style.backgroundColor == 'red'){
        status.style.backgroundColor = 'orange';
    }else{
        status.style.backgroundColor = 'green';
    }
}

function addOrderToList(){
    const templateOrder = document.querySelector('#order-div');
    const templateAtomicOrder = document.querySelector('#atomic-order-div');
    const container = document.querySelector('.content-cook-container');
    const clone = templateOrder.content.cloneNode(true);
    counter = counter + 1;

    clone.querySelector("div").id = counter; // id diva takie samo jak zamowienia

    const nrZam = clone.querySelector("div").querySelector("h1");
    
    nrZam.innerHTML = counter; // tutaj wstawienie numeru zamowienia

    //tu for po atomic orderach i dla każdego zrobienie klona, uzupenienie go i dodanie
    const atomicOrderClone = templateAtomicOrder.content.cloneNode(true);
    const nazwaDania = atomicOrderClone.querySelector("div").querySelector("h2");

    nazwaDania.innerHTML = "Kotlet plus fryty";

    //.order-status

    const divStatus = clone.querySelector(".order-status");
    divStatus.style.backgroundColor = 'red';

    divStatus.addEventListener("click", changeStatus.bind(null,event,counter));

    clone.querySelector("div").appendChild(atomicOrderClone);

   container.appendChild(clone);
}