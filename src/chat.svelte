<script>
    import io from 'socket.io-client';
    import { Remarkable } from 'remarkable';

    import { createEventDispatcher } from 'svelte';
    import Messages from './messages.svelte';
    import Input from './input.svelte';
    import Login from './Login.svelte';
    
    export let roomsActive;

    const md            = new Remarkable ();
    const dispatch      = createEventDispatcher ();
    const socket        = io (window.location.href.indexOf ('localhost:') !== -1 ? 
        'http://localhost:3000' : 'https://chattarooga.herokuapp.com');


    let username        = ''
    let tempUsername    = ''
    let joinedRoom      = null
    let messagesCount   = 0
    let messages        = [ ];
    let loginActive     = false
    let inputActive     = false


    $: {
        dispatch ('message', {
            type: 'update-messages-count',
            count: messagesCount
        })
    }


    
    
    socket.on ('connect', function () {
        // console.log ('===> connect')
    });
    
    socket.on ('username', function (data) {
        tempUsername = data.username;
        loginActive = true;
    });

    socket.on ('join', function (data) {
        if (data.joined) {
            joinedRoom = data.room;
            addMessage ('system', (username + ' connected @ ' + new Date().toLocaleString ()), 'system');
        }
    });

    socket.on ('rooms', function (data) {
        // console.log ('==> rooms', data)
    });

    socket.on ('chat-message', function  (data) {
        var m = [...messages];
        
        m.push ({
            id: messagesCount,
            type: data.type,
            author: data.author,
            text: data.text,
            room: data.room
        });
        messages = m;
        messagesCount += 1;
    });




    function addMessage (author, text, type = 'user-message') {
        var m = [...messages],
            d = {
                type: type,
                author: author,
                text: text,
                room: joinedRoom
            };

        m.push (d);
        socket.emit ('chat-message', d);

        messagesCount += 1;
        messages = m;
    }

    function new_message (data) {
        let md_text = md.render (data.detail.text);
        addMessage (username, md_text);
    }

    function handle_writing (data) {
        // console.log ('handle_writing', data.detail)
        socket.emit ('user-writing', {
            writing: data.detail,
            author: username
        });
    }

    function onLogin () {
        username = tempUsername;
        socket.emit ('register', { 'username': username });
        socket.emit ('join', { 'room': 'Tomare' });
        inputActive = true;
    }
</script>


<div class={"Chat" + (roomsActive ? ' with-rooms' : '')}>
    <Messages messages={messages} author={username} roomsActive={roomsActive} />
    <Input on:message={new_message} on:writing={handle_writing} active={inputActive} roomsActive={roomsActive} />
</div>
<Login active={loginActive} username={tempUsername} on:login={onLogin} />


<style>
    .Chat {
        padding: 0 0 61px 50px;
    }

    .Chat.with-rooms {
        padding: 0 0 61px 310px;
    }
</style>