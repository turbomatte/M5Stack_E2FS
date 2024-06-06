document.addEventListener('DOMContentLoaded', (event) => {
    const clientId = 'Client69';
    const host = 'mqtt-broker.zdw31.cloud';
    const port = 9001;
    const path = 'mqtt';
    const username = 'user1';
    const password = 'HWSFI2024!';

    const client = new Paho.MQTT.Client(host, Number(port), path, clientId);

    client.onConnectionLost = function (responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("Connection lost: " + responseObject.errorMessage);
        }
    };

    client.onMessageArrived = function (message) {
        console.log("Message arrived: " + message.payloadString);
        document.getElementById("Distanz").innerText = message.payloadString;
    };

    const connectOptions = {
        onSuccess: onConnect,
        userName: username,
        password: password,
        useSSL: false
    };

    function onConnect() {
        console.log("Connected");
        client.subscribe("distance");
    }

    client.connect(connectOptions);

    function sendMessage(topic, message) {
        const mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = topic;
        client.send(mqttMessage);
    }

    // Example of sending a message
    sendMessage("/distance/", "Hello mqtt");
});
