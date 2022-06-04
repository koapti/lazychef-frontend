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
    var socket = new SockJS(socketURL);
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
    const nextState = "IN_PROGRESS"
    stompClient.send("/app/order/update-food-state", {}, JSON.stringify({
        orderFoodId: orderFoodId,
        newState: nextState
    }));
}

function updateFoodState(message) {
    const id = message.orderFoodId;
    const newState = message.newState;

    orderFoods.filter(obj => obj.id == id)
    .forEach(obj => {
        obj.state = newState;
        const element = document.getElementById(obj.id);
        element.style = "background-color: red";
    })

}

function removeOrderFood(message) {
    const removedOrderFoodId = message.orderFoodId;
    const index = orderFoods.findIndex(orderFood => orderFood.id === removedOrderFoodId);
    orderFoods.splice(index,1);

    const element = document.getElementById(removedOrderFoodId);
    document.querySelector(".table-orders").removeChild(element);
}

function addOrder(message) {
    const receivedOrderFoods = message.orderFoods;

    receivedOrderFoods.forEach(orderFood => {
        orderFoods.push(orderFood);
        const orderFoodId = orderFood.id;
        const comments = orderFood.comments;
        const foodState = orderFood.foodState;
        const foodId = orderFood.foodId;

        const element = document.createElement("div");
        element.style = "width: 100%; height: 50px; border: 1px solid black;";
        element.id = orderFood.id;

        const food = sampleFood.filter(obj => obj.id === foodId)[0]

        const btnRemove = document.createElement("button");
        btnRemove.style = "width: 20%; height: 20%; background-color: blue;";
        btnRemove.onclick = () => removeBtnHandler(orderFoodId);

        const btnUpdate = document.createElement("button");
        btnUpdate.style = "width: 20%; height: 20%; background-color: yellow;";
        btnUpdate.onclick = () => updateBtnHandler(orderFoodId);
    
        element.innerHTML = orderFood.orderId + " | "  + orderFood.foodId + " | " + food.name + " | " + food.cost + " | " + comments;
        element.appendChild(btnRemove);
        element.appendChild(btnUpdate);
    
        document.querySelector(".table-orders").appendChild(element);
    })
}

function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}


