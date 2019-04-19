var WebSocketServer = new require('ws');

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
  port: 8081
});
webSocketServer.on('connection', function(ws) {
  var date = new Date();
  var id = date.getTime();
  var data = {
    id: id
  };

  clients[id] = ws;
  console.log("новое соединение " + id);
  
  ws.send(JSON.stringify(data));

  ws.on('message', function(json) {
    let message = JSON.parse(json);
    console.log(message);
    for (var key in clients) {
      data['message'] = message;
      clients[key].send(JSON.stringify(data));
    }
  });

  ws.on('close', function() {
    delete clients[id];
  });

});