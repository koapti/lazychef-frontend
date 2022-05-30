var counter = 2;

function changeStatusByDiv(event, divStatus){
    if(divStatus.style.backgroundColor == 'red'){
        divStatus.style.backgroundColor = 'orange';
    }else{
        divStatus.style.backgroundColor = 'green';
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

    const divAtomicStatus = atomicOrderClone.querySelector(".atomic-status");
    divAtomicStatus.style.backgroundColor = 'red';

    divAtomicStatus.addEventListener("click", changeStatusByDiv.bind(null,event,divAtomicStatus));

    const divStatus = clone.querySelector(".order-status");
    divStatus.style.backgroundColor = 'red';

    divStatus.addEventListener("click", changeStatusByDiv.bind(null,event,divStatus));

    clone.querySelector("div").appendChild(atomicOrderClone);

   container.appendChild(clone);
}