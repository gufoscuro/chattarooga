<script>
    import io from 'socket.io-client';
    import { createEventDispatcher } from 'svelte';
    import Messages from './messages.svelte';
    import Input from './input.svelte';
    import Login from './Login.svelte';
    
    export let roomsActive;

    
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
        console.log ('===> connect')
    });
    socket.on ('username', function (data) {
        console.log ('===> username', data.username)
        tempUsername = data.username;
        loginActive = true;
        // username = data.username
        // socket.emit ('register', { 'username': username });
        // socket.emit ('join', { 'room': 'Tomare' })
    });

    socket.on ('join', function (data) {
        // console.log ('==> join', data)
        if (data.joined)
            joinedRoom = data.room;
    });

    socket.on ('rooms', function (data) {
        // console.log ('==> rooms', data)
    });

    socket.on ('chat-message', function  (data) {
        // console.log ('===> chat-message', data);

        var m = [...messages];

        m.push ({
            id: messagesCount,
            author: data.author,
            text: data.text,
            room: data.room
        });
        messages = m;
        messagesCount += 1;
    });

    

    

    function autoAnswer () {
        const s = [
            "Hello there",
            "Nope",
            "Howdy?",
            "What about some cheese?",
            "Shame on you, bastard."
        ]
        setTimeout (() => {
            var m = [...messages],
                r = Math.floor(Math.random() * (s.length - 1)) + 1;

            m.push ({
                author: 1,
                text: s[r]
            });
            messages = m;
            messagesCount += 1;
        }, 2000)
    }

    function addMessage (text) {
        var m = [...messages],
            d = {
                id: messagesCount,
                author: username,
                text: text,
                room: joinedRoom
            };

        m.push (d);
        socket.emit ('chat-message', d);

        messagesCount += 1;
        messages = m;
    }

    function handle_messages (data) {
        addMessage (data.detail.text);
    }

    function handle_writing (data) {
        // console.log ('handle_writing', data.detail)
        socket.emit ('user-writing', {
            writing: data.detail,
            author: username
        });
    }

    function onLogin () {
        // console.log ('==> login', tempUsername)
        username = tempUsername;
        socket.emit ('register', { 'username': username });
        socket.emit ('join', { 'room': 'Tomare' });
        inputActive = true;
    }
</script>

<div class={"Chat" + (roomsActive ? ' with-rooms' : '')}>
    <Messages messages={messages} author={username} roomsActive={roomsActive} />
    <Input on:message={handle_messages} on:writing={handle_writing} active={inputActive} roomsActive={roomsActive} />
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