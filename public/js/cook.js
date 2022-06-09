const socketURL = "http://localhost:8081/ws";
const orderFoods = [];

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



function addOrder(message) {
    const tableNr = message.tableNr;
    const receivedOrderFoods = message.orderFoods;

    receivedOrderFoods.forEach(orderFood => {
        const orderId = orderFood.orderId;
        const foodName = sampleFood.filter(food => food.id == orderFood.foodId)[0].name
        if(orderFoods.filter(orderFood => orderFood.orderId == orderId).length != 0) {
            const orderContainer = document.getElementById(orderId);
            const newOrder = document.getElementById("atomic-order-div").content.children[0].cloneNode(true);
            newOrder.id = orderFood.id;
            newOrder.children[0].children[0].innerHTML = foodName;
            newOrder.children[0].children[1].innerHTML = orderFood.comments
            newOrder.children[1].onclick = () => updateBtnHandler(orderFood.id);
            orderContainer.appendChild(newOrder);
        } else {
            const mainContainer = document.getElementById("content-cook-container");
            const orderContainer = document.getElementById("order-div").content.children[0].cloneNode(true);
            const newOrder = document.getElementById("atomic-order-div").content.children[0].cloneNode(true);
            orderContainer.id = orderFood.orderId;
            orderContainer.children[0].children[0].innerHTML = orderFood.orderId;
            newOrder.id = orderFood.id;
            newOrder.children[0].children[0].innerHTML = foodName;
            newOrder.children[0].children[1].innerHTML = orderFood.comments
            newOrder.children[1].onclick = () => updateBtnHandler(orderFood.id);
            orderContainer.appendChild(newOrder);
            mainContainer.appendChild(orderContainer);
        }

        orderFoods.push({...orderFood, tableNr: tableNr});
        // const orderFoodId = orderFood.id;
        // const comments = orderFood.comments;
        // const foodState = orderFood.foodState;
        // const foodId = orderFood.foodId;

        // const food = sampleFood.filter(obj => obj.id === foodId)[0]
    })
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
            .className = "atomic-status " + newStateColor;
    })

}

function removeOrderFood(message) {
    const removedOrderFoodId = message.orderFoodId;
    const index = orderFoods.findIndex(orderFood => orderFood.id === removedOrderFoodId);
    orderFoods.splice(index,1);

    const orderFoodToRemove = document.getElementById(removedOrderFoodId);
    const parent = orderFoodToRemove.parentElement;
    orderFoodToRemove.remove();

    if(parent.children.length == 1) {
        parent.remove()
    }

}
























var counter = 2;

function changeStatusByDiv(event, divStatus, isAtomicOrder){
    if(divStatus.style.backgroundColor == 'red'){
        divStatus.style.backgroundColor = 'orange';
    }else{
        if(!isAtomicOrder){
            // if all atomic == green
            const allAtomics = divStatus.parentElement.parentElement.querySelectorAll(".atomic-status");
            var completed = true;
            
            allAtomics.forEach(element => {
                if(element.style.backgroundColor != "green"){
                    completed = false;
                }
            });

            if(completed){
                divStatus.style.backgroundColor = 'green';
                setTimeout(function () {
                    divStatus.parentElement.parentElement.remove();
                }, 2000);
            }
        }else{
            divStatus.style.backgroundColor = 'green';
        }
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
    divAtomicStatus.addEventListener("click", changeStatusByDiv.bind(null,event,divAtomicStatus, true));

    // koniec atomic orderow
    const divStatus = clone.querySelector(".order-status");
    divStatus.style.backgroundColor = 'red';
    divStatus.addEventListener("click", changeStatusByDiv.bind(null,event,divStatus, false));

    clone.querySelector("div").appendChild(atomicOrderClone);

   container.appendChild(clone);
}