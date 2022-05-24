let stompClient = null;

const socketURL = "http://localhost:8081/ws";
const orders = [];

function connectBtnHandler() {
    var socket = new SockJS(socketURL);
    stompClient = Stomp.over(socket);

    stompClient.connect({username: "a", password: "b", token: "COOK"}, (frame) => {
        stompClient.subscribe('/topic/orders', orderResponse => {
            const responseBody = JSON.parse(orderResponse.body)
            const messageType = responseBody.orderOutgoingMessageType;
            const order = responseBody.order;
            switch(messageType) {
                case "ADDED":
                    addOrder(order);
                    break;
                case "REMOVED":
                    removeOrder(order);
                    break;
                case "FAILURE":
                    console.log("FAILURE")
            }
        });
    });
}

function addBtnHandler() {
    stompClient.send("/app/order", {}, JSON.stringify({
        'orderIncomingMessageType': "ADD",
        'order': {
            'content': Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) //random string
        }
    }));
}

function removeBtnHandler(order) {
    stompClient.send("/app/order", {}, JSON.stringify({
        'orderIncomingMessageType': "REMOVE",
        'order': {
            'id': order.id,
            'content': order.content
        }
    }));
}

function removeOrder(order) {
    const index = orders.findIndex(thisOrder => thisOrder.id === order.id);
    orders.splice(index, 1);
    removeOrderFromBody(order);
}

function removeOrderFromBody(order) {
    const element = document.getElementById(order.id);
    document.querySelector(".table-orders").removeChild(element);
}

function addOrder(order) {
    orders.push(order);
    addOrderToBody(order);
}

function addOrderToBody(order) {
    const element = document.createElement("div");
    element.style = "width: 100%; height: 50px; border: 1px solid black;";
    element.id = order.id;

    const btn = document.createElement("button");
    btn.style = "width: 20%; height: 20%;";
    btn.onclick = () => removeBtnHandler(order);

    element.innerHTML = order.content;
    element.appendChild(btn);

    document.querySelector(".table-orders").appendChild(element);
}


