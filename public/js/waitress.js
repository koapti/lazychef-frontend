function addOrder(){
    const wrapper = document.createElement('div');
    wrapper.style = "width: 100vw; height: 100vh; background-color: white; opacity:0.8; position: fixed; top: 0; left: 0; z-index: 9999;";
    const wrapperForm = document.createElement('form');
    wrapperForm.className = 'name';
    wrapperForm.style = "width: 50vw; height: 50vh; background-color: black; opacity:0.8; position: fixed; top: 25vh; left: 25vw; z-index: 9999;";
    const btn = document.createElement('button');
    btn.onclick = function () {
        wrapper.remove();
        wrapperForm.remove();
    }
    wrapperForm.appendChild(btn);
    wrapper.appendChild(wrapperForm);
    const body = document.querySelector('body');
    body.appendChild(wrapper);
}

function sumOrders(){
    const summaryTemplate = document.querySelector("#summary-orders-container");
    const clone = summaryTemplate.content.cloneNode(true);
    const allOrders = document.querySelector(".content-waiter-container");
    const container = document.querySelector(".container");

    const search = clone.querySelector('input[placeholder="nr"]');
    search.addEventListener('keyup', function(event){
        
    });

    allOrders.style.display = "none";
    container.appendChild(clone);
}