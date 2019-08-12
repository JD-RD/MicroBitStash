debugger;
var mb1Text;
var mb2Text;
var mb3Text;
var socket = new WebSocket("ws://localhost:8081");
var snArray = new Array();

function setup() {
    // The socket connection needs two event listeners:
    socket.onopen = openSocket;
    socket.onmessage = msgHandling;
    // make a new divs and positions:
    mb1Text = createDiv("Micro:Bit 1 Light Level:");
    mb2Text = createDiv("Micro:Bit 2 Light Level:");
    mb3Text = createDiv("Micro:Bit 3 Light Level:");
    mb1Text.position(10,10);
    mb2Text.position(10,110);
    mb3Text.position(10,210);
}

function openSocket() {
    socket.send('Hello server');
}

function msgHandling(result) {
    // when the server returns, show the result in the div:
    parseData(result.data);
}

function parseData(receivedData) {
    var data = str(receivedData).trimEnd();;
    
    if (data.includes('sn') && data.includes('ll')) {
        // console.log('data includes sn & ll');
        var currentSN = data.substring(2, 5);
        if (!snArray.includes(currentSN)) {
            snArray.push(currentSN);
        }
        var currentLL = data.substring(7, data.length);
        var relPos = setRelPos(currentLL, currentSN);
        showData(relPos, currentSN);
    } else {
        
    }
}

function showData(relPos, sn) {
    var snIndex = snArray.indexOf(sn);
    if(snIndex !== -1) {
        var dispStr = 'sn: ' + str(sn) + ' | Position: ' + relPos;
        switch(snIndex) {
            case 0:
                mb1Text.html(dispStr);
                break;
            case 1:
                mb2Text.html(dispStr);
                break;
            case 2:
                mb3Text.html(dispStr);
                break;
        }
    }
}

function setRelPos(ll, sn) {
    // console.log('ll = ' + str(ll));
    if (ll <= 30) {
        relPos = 'right';
    }
    if (ll > 30 && ll < 150) {
        relPos = 'middle';
    }
    if (ll >= 150) {
        relPos = 'left';
    }
    console.log('sn: ' + str(sn) + ' | postion = ' + relPos + ' | ' + str(ll));
    return relPos;
}