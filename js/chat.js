$(document).ready(function () {

    let socket = new WebSocket("ws://localhost:8081");
    let id = null;

    // отправить сообщение из формы publish
    $('#chat-form').on('submit', function (e) {
        e.preventDefault();
        let now = new Date();
        let time = now.getHours() + ":" + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) + ":" + (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
        let outData = {
            username: $('#chat-username').val(),
            outcomingMessage: $('#chat-text').val(),
            time: time
        };
        socket.send(JSON.stringify(outData));
    });

    // обработчик входящих сообщений
    socket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        if (!id) {
            id = data.id;
        }
        var incomingMessage = event.data;
        showMessage(incomingMessage);
    };

    function showMessage(message) {

        let data = JSON.parse(message);
        let userID = data.id;
        if (data.message) {
            let username = data.message.username;
            let time = data.message.time;
            let text = data.message.outcomingMessage;

            let row = $('<div></div>');
            let col = $('<div></div>');
            let arrow = $('<div></div>');
            let h5 = $('<h5></h5>');
            let h6 = $('<h6></h6>');
            let p = $('<p></p>');

            if(id == userID) {
                row.addClass('row mb-3 chat-message-out');
                col.addClass('chat-message col-auto bg-success text-white p-3 rounded');
                arrow.addClass('chat-arrow bg-success');
                h5.text("Me");
            } else {
                row.addClass('row mb-3 chat-message-in');
                col.addClass('chat-message col-auto bg-primary text-white p-3 rounded');
                arrow.addClass('chat-arrow bg-primary');
                h5.text(username);
            }

            h6.text(time);
            p.text(text);

            col.append(h5);
            col.append(h6);
            col.append(p);

            row.append(col);
            row.append(arrow);

            $('#messages').append(row);
        }
    }

});