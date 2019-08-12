var WebSocketServer = require('ws').Server;
class WSMB {
    constructor(port) {
        this.SERVER_PORT = port;
        this.wss = new WebSocketServer({port: this.SERVER_PORT});
        this.connections = new Array(1);
        this.setupConnections();
    }

    setupConnections() {
        this.wss.on('connection', function(client) {
            console.log('connection handled');
            console.log("New Connection"); // you have a new client
            this.connections.push(client); // add this client to the connections array
        
            this.client.on('message', sendToSerial); // when a client sends a message,
        
            this.client.on('close', function() { // when a client closes its connection
                console.log("connection closed"); // print it out
                var position = connections.indexOf(client); // get the client's position in the array
                this.connections.splice(position, 1); // and delete it from the array
            });
        });
    }
    
    // This function broadcasts messages to all webSocket clients
    broadcast(data) {
        for (myConnection in this.connections) {   // iterate over the array of connections
            this.connections[myConnection].send(data); // send the data to each connection
        }
    }
}

export { WSMB };