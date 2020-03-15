<script>
    import io from 'socket.io-client';
    import { Remarkable } from 'remarkable';
    import remarkableEmoji from 'remarkable-emoji';
    

    import { createEventDispatcher } from 'svelte';
    import Sidebar from './sidebar.svelte';
    import Messages from './messages.svelte';
    import Input from './input.svelte';
    import Login from './Login.svelte';
    

    const md            = new Remarkable ();
    const dispatch      = createEventDispatcher ();
    const socket        = io (window.location.href.indexOf ('localhost:') !== -1 ? 
        'http://localhost:3000' : 'https://chattarooga.herokuapp.com');
    
    // const messageSound  = new Audio ('./audio/message.mp3')
    md.use (remarkableEmoji);


    let username        = ''
    let joinedRoom      = null
    let messagesCount   = 0
    let messages        = [ ];
    let loginActive     = false
    let inputActive     = false

    let roomsList       = []


    // $: {
    //     dispatch ('message', {
    //         type: 'update-messages-count',
    //         count: messagesCount
    //     })
    // }


    
    
    socket.on ('connect', function () {
        console.log ('===> connect')
    });
    
    socket.on ('username', function (data) {
        username = data.username;
        loginActive = true;
        socket.emit ('register', {
            username: username
        });
    });

    socket.on ('join', function (data) {
        // console.log ('join');
        if (data.joined) {
            joinedRoom = data.room;
            addMessage ('system', (username + ' connected @ ' + new Date().toLocaleString ()), 'system');
        }
    });

    socket.on ('rooms', function (data) {
        // console.log ('==> rooms', data);
        roomsList = data;
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
        // messageSound.play ();
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

    function onLogin (event) {
        inputActive = true;
        if (roomsList.length)
            joinRoom (roomsList[0])
    }

    function joinRoom (name) {
        socket.emit ('join', { room: name });
    }

    function chat_messages (data) {
		if (data.detail.type === 'update-rooms') {
			chatRooms = data.detail.rooms;
		}
    }
    
    function sidebar_messages (event) {
        const detail = event.detail
        const action = detail.action

        console.log ('sidebar:messages', detail);

        if (action === 'join-room')
            joinRoom (detail.roomName);
	}
</script>

<Sidebar on:message={sidebar_messages} rooms={roomsList} joined={joinedRoom} />
<div class="Chat">
    <Messages messages={messages} author={username} />
    <Input on:message={new_message} on:writing={handle_writing} active={inputActive} />
</div>
<Login active={loginActive} username={username} on:login={onLogin} />


<style>
    .Chat {
        padding: 0 0 61px 220px;
    }
</style>