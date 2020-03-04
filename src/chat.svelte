<script>
    import io from 'socket.io-client';
    import { createEventDispatcher } from 'svelte';
    import Messages from './messages.svelte';
    import Input from './input.svelte';
    export let roomsActive;


    
    const socket = io ('http://localhost:3003');
    socket.on ('connection', function () {
        console.log ('==> on.connect');
    });

    socket.on ('chat-message', function  (data) {
        console.log ('===> chat-message', data);

        var m = [...messages];

        m.push ({
            author: data.author,
            text: data.text
        });
        messages = m;
        messagesCount += 1;
    })

    const dispatch = createEventDispatcher ();
    const currentAuthor = 2;
    
    let messagesCount   = 0;
    let messages        = [ ];

    $: {
        dispatch ('message', {
            type: 'update-messages-count',
            count: messagesCount
        })
    }

    

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
                author: currentAuthor,
                text: text
            };

        m.push (d);
        socket.emit ('chat-message', d);

        messagesCount += 1;
        messages = m;
        // autoAnswer ();
    }

    function handle_messages (data) {
        addMessage (data.detail.text);
    }

    function handle_writing (data) {
        // console.log ('handle_writing', data.detail)
        socket.emit ('user-writing', {
            writing: data.detail,
            author: currentAuthor
        });
    }
</script>

<div class={"Chat" + (roomsActive ? ' with-rooms' : '')}>
    <Messages messages={messages} author={currentAuthor} roomsActive={roomsActive} />
    <Input on:message={handle_messages} on:writing={handle_writing} roomsActive={roomsActive} />
</div>

<style>
    .Chat {
        padding: 0 0 61px 50px;
    }

    .Chat.with-rooms {
        padding: 0 0 61px 310px;
    }
</style>