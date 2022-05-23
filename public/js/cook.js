function addOrderToList(){
    const templateOrder = document.querySelector('#order-div');
    const templateAtomicOrder = document.querySelector('#atomic-order-div');
    const container = document.querySelector('.content-cook-container');
    const clone = templateOrder.content.cloneNode(true);

    const nrZam = clone.querySelector("div").querySelector("h1");
    
    nrZam.innerHTML = "2"; // tutaj wstawienie numeru zamowienia

    //tu for po atomic orderach i dla każdego zrobienie klona, uzupenienie go i dodanie
    const atomicOrderClone = templateAtomicOrder.content.cloneNode(true);
    const nazwaDania = atomicOrderClone.querySelector("div").querySelector("h2");

    nazwaDania.innerHTML = "Kotlet plus fryty";

    clone.querySelector("div").appendChild(atomicOrderClone);

   container.appendChild(clone);
}