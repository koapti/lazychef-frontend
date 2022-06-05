const { application } = require("express");

function createNextAtomic(event, myForm, template){
    console.log(template.innerHTML);
    var nextAtomicOrder = template.content.cloneNode(true);

    var select = nextAtomicOrder.querySelector("select");

    var opt0 = document.createElement("option");
    opt0.text = null;
    select.add(opt0);
    var opt = document.createElement("option");
    opt.text = "Kotlet + fryty";
    select.add(opt);
    var opt1 = document.createElement("option");
    opt1.text = "zur";
    select.add(opt1);

    select.addEventListener('change', createNextAtomic.bind(null, event, myForm, template));

    myForm.appendChild(nextAtomicOrder);
}

function addOrder(){
    const containerContent = document.querySelector(".content-waiter-container");
    const addOrderTemplate = document.querySelector("#make-order-container");
    const container = document.querySelector(".container");
    const clone = addOrderTemplate.content.cloneNode(true);
    const atomicOrderTemplate = document.querySelector("#options-for-make-order-container");

    //pobranie numeru stolika
    //dodanie opcji wyboru
    var tablenumber;
    const search = clone.querySelector('input[placeholder="nr"');
    search.addEventListener('keyup', function(event){
        tablenumber = search.value;
    });

    const form = clone.querySelector("form");

    const atomicOrder  = atomicOrderTemplate.content.cloneNode(true);

    const select = atomicOrder.querySelector("#type");

    var opt0 = document.createElement("option");
    opt0.text = null;
    select.add(opt0);
    var opt = document.createElement("option");
    opt.text = "Kotlet + fryty";
    select.add(opt);
    var opt1 = document.createElement("option");
    opt1.text = "zur";
    select.add(opt1);

    select.addEventListener('change', createNextAtomic.bind(null, event,form, atomicOrderTemplate));

    form.appendChild(atomicOrder);

    containerContent.style.display = "none";
    container.appendChild(clone);
}

function sumOrders(){
    const summaryTemplate = document.querySelector("#summary-orders-container");
    const clone = summaryTemplate.content.cloneNode(true);
    const containerContent = document.querySelector(".content-waiter-container");
    const container = document.querySelector(".container");
    const allOrders = containerContent.querySelectorAll(".order");
    const orderTemplate = document.querySelector("#one-order-container");
    const placeForOrders = clone.querySelector(".table-orders");
    const totalCost = clone.querySelector(".summary");

    const search = clone.querySelector('input[placeholder="nr"]');
    search.addEventListener('keyup', function(event){
        //tutaj przefiltrowanie orderów z allOrders
        placeForOrders.querySelectorAll(".order").forEach(element => {element.remove()});

        allOrders.forEach(element =>{
            var realOrderInfos = element.querySelector(".order-navigation").querySelectorAll("h3");
        
            if(realOrderInfos[1].innerHTML == ("Nr. stol: " + search.value)){
                var clone1 = orderTemplate.content.cloneNode(true);
                var infos = clone1.querySelector(".order-details-sum").querySelectorAll("h3");

                infos[0].innerHTML = realOrderInfos[0].innerHTML;
                infos[1].innerHTML = realOrderInfos[1].innerHTML;

                var infos2 = clone1.querySelector(".order-cost").querySelector("h3");
                infos2.innerHTML = realOrderInfos[2].innerHTML;

                placeForOrders.appendChild(clone1);
            }
        })

        var prices = placeForOrders.querySelectorAll(".price");
        var sum = Number(0); 
        prices.forEach(element => {sum += Number(element.innerHTML)});

        totalCost.querySelector("h1").innerHTML = sum;
    });

    const buttonBack = clone.querySelector("#button-delete");

    buttonBack.addEventListener('click', function(event){
        containerContent.style.display = '';
        document.querySelector(".summary-orders").remove();
    });

    const buttonAccept = clone.querySelector("#button-accept");

    buttonAccept.addEventListener('click', function(event){
        var desiredOrders = placeForOrders.querySelectorAll(".order");
        
        if(desiredOrders.length == 0) window.alert("Nie wybrano żadnych zamowień");

        allOrders.forEach(element => {
            var infos =  element.querySelector(".order-navigation").querySelectorAll("h3");
            if(infos[1].innerHTML == ("Nr. stol: " + search.value)) element.remove();
        });

        document.querySelector(".summary-orders").remove();
        containerContent.style.display = '';
    });

    containerContent.style.display = "none";
    container.appendChild(clone);
}