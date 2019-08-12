// import { WSMB } from './wsMB.js';
var WebSocketServer = require('ws').Server;
const SerialPort = require('serialport');
var mbPortNames = new Array('/dev/tty.usbmodem1422');
var mbPorts = new Array(1);
var Readlines = new Array(1);
var parsers = new Array(1);

for (var i = 0; i < mbPortNames.length; i++) {
    mbPorts[i] = new SerialPort(mbPortNames[i], {
        baudRate: 115200
    })
    Readlines[i] = SerialPort.parsers.Readline;
    parsers[i] = new Readlines[i]();
    mbPorts[i].pipe(parsers[i]);
    setupHandlers(mbPorts[i], parsers[i]);
}
  
function setupHandlers(port, parser) {
    port.on('open', function () {
        console.log('port open. Data rate: ' + port.baudRate);
    });

    port.write('Helo World\n', function(err,res) {
        if(err) console.log('err ' + err);
        console.log('results ' + res);
    });

    port.on('close', function () {
        console.log('port closed.');
    });

    port.on('error', function (error) {
        console.log('Serial port error: ' + error);
    });

    parser.on('data', function (data) {
        if(wss) {
            broadcast(data);
        }

        console.log('data received: ' + data);
    });
}

function sendToSerial(data) {
    console.log("sending to serial: " + data);
    myPort.write(data);
}

// // // // // // // // // // //
// // // WebSocket Part // // //
// // // // // // // // // // //

const SERVER_PORT = 8081;
var wss = new WebSocketServer({port: SERVER_PORT});
var connections = new Array(1);

wss.on('connection', function(client) {
    console.log('connection handled');
    console.log("New Connection"); // you have a new client
    connections.push(client); // add this client to the connections array

    // client.on('message', sendToSerial); // when a client sends a message,

    client.on('close', function() { // when a client closes its connection
        console.log("connection closed"); // print it out
        var position = connections.indexOf(client); // get the client's position in the array
        connections.splice(position, 1); // and delete it from the array
    });
});

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
    connections.forEach(function(connection) {
        connection.send(data)
    });

    // for (myConnection in connections) {   // iterate over the array of connections
    //     connections[myConnection].send(data); // send the data to each connection
    // }
}

