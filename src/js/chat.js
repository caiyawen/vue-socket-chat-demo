import io from 'socket.io-client';
$('#submit').on('click', function() {
    var userName = $('.login').find('#userName').val();
    var roomID = $('.login').find('#roomID').val();
    var toUserName = false;
    $('#user').text(userName);
    $('#room').text(roomID);
    if (userName == '' || roomID == '') {
        $('#help-block').show();
        return;
    }
    $('.login').hide();
    $('.chat').show();
    var socket = io.connect('http://localhost:5000');
    socket.on('connect', function() {
        socket.emit('join', { userName, roomID });
    });
    socket.on('msg', function(userName, toUserName, msg) {
        var message = '' +
            '<div class="message">' +
            '  <span class="user">' + userName + ': </span>' +
            '  <span class="msg">' + msg + '</span>' +
            '</div>';
        $('#msglog').append(message);
        $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
    });
    socket.on('sys', function(sysMsg, users) {
        var message = '<div class="sysMsg">' + sysMsg + '</div>';
        $('#msglog').append(message);
        $('#count').text(users.length);
        $('#users').text('');
        // todo 按名字排序
        users.map((val) => {
            $('#users').append(`<li>${val}</li><button id="${val}" class="private-chat">私聊</button`);
        })
    });
    $('#messageInput').keydown(function(e) {
        if (e.which === 13) {
            e.preventDefault();
            var msg = $(this).val();
            $(this).val('');
            socket.send(userName, toUserName, msg);
        }
    });
    $('#leave').click(function() {
        socket.emit('leave');
        window.location.reload();
    });
    $('#users').on('click', '.private-chat', function(e) {
        console.log($(this)[0].id);
        toUserName = $(this)[0].id;
    })
})