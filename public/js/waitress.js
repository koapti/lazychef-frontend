let stompClient = null;


const sampleFood = [
    {
        id: 1,
        cost: 32.3,
        name: "Kotlet",
        type: "DISH",
    },
    {
        id: 2,
        cost: 222.3,
        name: "Zur",
        type: "DISH",
    },
    {
        id: 3,
        cost: 21.3,
        name: "Martini",
        type: "DRINK",
    }
]

const socketURL = "http://localhost:8081/ws";
const orderFoods = [];

function connectBtnHandler() {
    const socket = new SockJS(socketURL);
    stompClient = Stomp.over(socket);

    stompClient.connect({username: "a", password: "b", token: "COOK"}, (frame) => {
        stompClient.subscribe('/topic/orders', orderResponse => {
            const message = JSON.parse(orderResponse.body)
            const messageType = message.messageType;
            switch(messageType) {
                case "ADDED":
                    addOrder(message);
                    break;
                case "FOOD_REMOVED":
                    removeOrderFood(message);
                    break;
                case "FOOD_STATE_UPDATED":
                    updateFoodState(message);
                    break;
                case "FAILURE":
                    console.log("FAILURE")
            }
        });
    });
}

function addBtnHandler() {
    stompClient.send("/app/order/add", {}, JSON.stringify({
        order: {
            state: "NOT_READY",
            tableNr: 1
        },
        ordersFood: [
            {
                comments: "abc",
                foodState: "NOT_READY",
                foodId: 2
            },
            {
                comments: "bca",
                foodState: "NOT_READY",
                foodId: 1
            }
        ]
    }));
}

function removeBtnHandler(orderFoodId) {
        stompClient.send("/app/order/remove-food", {}, JSON.stringify({
            orderFoodId: orderFoodId
        }));
}

function updateBtnHandler(orderFoodId) {
    orderFoods.filter(obj => obj.id === orderFoodId)
    .forEach(obj => {
        let newState;
        switch(obj.foodState) {
            case "NOT_READY":
                newState = "IN_PROGRESS";
                break;
            case "READY":
                return;
            case "IN_PROGRESS":
                newState = "READY";
                break;
        }
        stompClient.send("/app/order/update-food-state", {}, JSON.stringify({
            orderFoodId: orderFoodId,
            newState: newState
        }));
    })
}

function updateFoodState(message) {
    const id = message.orderFoodId;
    const newState = message.newState;

    orderFoods.filter(obj => obj.id == id)
    .forEach(obj => {
        let newStateColor;
        switch(newState) {
            case "NOT_READY":
                newStateColor = "red";
                break;
            case "READY":
                newStateColor = "green";
                break;
            case "IN_PROGRESS":
                newStateColor = "yellow";
                break;
        }
        obj.foodState = newState;
        document.getElementById(obj.id)
            .children[1]
            .children[1]
            .className = "info2 " + newStateColor;
    })

}

function removeOrderFood(message) {
    const removedOrderFoodId = message.orderFoodId;
    const index = orderFoods.findIndex(orderFood => orderFood.id === removedOrderFoodId);
    orderFoods.splice(index,1);

    document.getElementById(removedOrderFoodId).remove();
}

function addOrder(message) {
    const tableNr = message.tableNr;
    const receivedOrderFoods = message.orderFoods;

    receivedOrderFoods.forEach(orderFood => {
        orderFoods.push({...orderFood, tableNr: tableNr});
        const orderId = orderFood.orderId;
        const orderFoodId = orderFood.id;
        const comments = orderFood.comments;
        const foodState = orderFood.foodState;
        const foodId = orderFood.foodId;

        const food = sampleFood.filter(obj => obj.id === foodId)[0]
        const element = document.querySelector("#orders-for-all-orders").content.children[0].cloneNode(true);
        
        element.id = orderFood.id;
        const orderNavigation = element.children[0].children[0].children;
        orderNavigation[0].innerHTML += orderId;
        orderNavigation[1].innerHTML += tableNr;
        orderNavigation[2].innerHTML += food.cost;

        element.children[0].children[1].innerHTML += food.name;
        element.children[0].children[2].innerHTML += comments;

        //const removeButton = element.children[0].children[1].children[1];
        element.children[1].children[0].onclick = () => removeBtnHandler(orderFoodId);
        //element.children[1].children[1].onclick = () => updateBtnHandler(orderFoodId);
    
        document.querySelector(".orders").appendChild(element);
    })
}

function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}




//// MATI
function createNextAtomic(event, myForm, template){
    var nextAtomicOrder = template.content.cloneNode(true);

    var select = nextAtomicOrder.querySelector("select");

    var opt0 = document.createElement("option");
    opt0.text = "null";
    select.add(opt0);
    var opt = document.createElement("option");
    opt.text = "Kotlet + fryty ," + "10";
    select.add(opt);
    var opt1 = document.createElement("option");
    opt1.text = "zur ," + "20";
    select.add(opt1);

    select.addEventListener('change', createNextAtomic.bind(null, event, myForm, template));

    myForm.appendChild(nextAtomicOrder);
}

function selectChangeHandler() {
    const form = document.querySelector("form");
    const formDiv = document.querySelector("#form-div").content.cloneNode(true);
    const select = formDiv.children[0].children[0]
    sampleFood.map(foodObj => {
        const option = document.createElement("option");
        option.id = foodObj.id;
        option.text = foodObj.name + " " + foodObj.cost;
        return option;
    }).forEach(option => select.add(option))

    const option = document.createElement("option");
    option.text = "Wybierz";
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    select.add(option);

    select.addEventListener('change', selectChangeHandler)
    form.appendChild(formDiv);
}

function navigateToOrderCreator(){
    const makeOrderContainerClone = document.querySelector("#make-order-container").content.cloneNode(true);

    const form = makeOrderContainerClone.querySelector("form");
    const formDiv = document.querySelector("#form-div").content.cloneNode(true);
    const select = formDiv.children[0].children[0]
    sampleFood.map(foodObj => {
        const option = document.createElement("option");
        option.id = foodObj.id;
        option.text = foodObj.name + " " + foodObj.cost;
        return option;
    }).forEach(option => select.add(option))

    const option = document.createElement("option");
    option.text = "Wybierz";
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    option.className = "select default"
    select.add(option);

    select.addEventListener('change', selectChangeHandler)

    form.appendChild(formDiv);

    document.querySelector(".content-waiter-container").style.display = "none";
    document.querySelector(".container").appendChild(makeOrderContainerClone);
}

function addOrderGoBackHandler(event) {
    document.querySelector(".content-waiter-container").style.display = '';
    document.querySelector(".make-order").remove();
}

function addOrderHandler(event) {
    const form = document.querySelector("form");
    const order = {
        state: "NOT_READY",
        tableNr: document.querySelector('#tab-num').value
    }
    const ordersFood = Array.from(form.children)
    .filter(element => element.nodeName === "DIV")
    .filter(element => element.children[0].options[element.children[0].selectedIndex].className !== "select default")
    .map(element => element.children)
    .map(children => {
        const foodId = children[0].options[children[0].selectedIndex].id;
        const comments = children[1].value;
        return {
            comments: comments,
            state: "NOT_READY",
            foodId: foodId
        }
    })
    stompClient.send("/app/order/add", {}, JSON.stringify({
        order: order,
        ordersFood: ordersFood.slice(0, orderFoods.length - 1)
    }));


    document.querySelector(".make-order").remove();
    document.querySelector(".content-waiter-container").style.display = '';
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