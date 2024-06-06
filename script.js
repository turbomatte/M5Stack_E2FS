document.addEventListener('DOMContentLoaded', (event) => {
    const clientId = 'Client69';
    const host = 'mqtt-broker.zdw31.cloud';
    const port = 9001;
    const path = 'mqtt';
    const username = 'user1';
    const password = 'HWSFI2024!';

    // Connection status element
    const statusElement = document.getElementById('status');
    const distanzElement = document.getElementById('Distanz');

    // Initialize the MQTT client
    const client = new Paho.MQTT.Client(host, Number(port), path, clientId);

    client.onConnectionLost = function (responseObject) {
        if (responseObject.errorCode !== 0) {
            console.error("Connection lost: " + responseObject.errorMessage);
            statusElement.innerText = "Connection lost. Reconnecting...";
            reconnect();
        }
    };

    client.onMessageArrived = function (message) {
        console.log("Message arrived: " + message.payloadString);
        if (distanzElement) {
            distanzElement.innerText = message.payloadString + ' mm';
        } else {
            console.error("Element with id 'Distanz' not found.");
        }
    };

    const connectOptions = {
        onSuccess: onConnect,
        onFailure: function (responseObject) {
            console.error("Connection failed: " + responseObject.errorMessage);
            statusElement.innerText = "Connection failed. Retrying...";
            setTimeout(reconnect, 5000);
        },
        userName: username,
        password: password,
        useSSL: false
    };

    function onConnect() {
        console.log("Connected to MQTT broker");
        statusElement.innerText = "Connected";
        client.subscribe("distance", {
            onSuccess: function () {
                console.log("Subscribed successfully to 'distance'");
            },
            onFailure: function (responseObject) {
                console.error("Subscription failed: " + responseObject.errorMessage);
                statusElement.innerText = "Subscription failed. Retrying...";
                setTimeout(reconnect, 5000);
            }
        });
    }

    function reconnect() {
        client.connect(connectOptions);
    }

    // Initial connection
    client.connect(connectOptions);
});
