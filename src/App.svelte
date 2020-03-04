<script>
	import Sidebar from './sidebar.svelte';
	import Chat from './chat.svelte';
	import Rooms from './rooms.svelte';

	let roomsActive = false
	let messagesCount = 0

	$: broad_props = {
		roomsActive: roomsActive
	}

	
	function sidebar_messages (data) {
		if (data.detail.action === 'toggle-rooms') {
			roomsActive = !roomsActive;
		}
	}

	function chat_messages (data) {
		if (data.detail.type === 'update-messages-count') {
			messagesCount = data.detail.count;
		}
	}
</script>

<Sidebar on:message={sidebar_messages} count={messagesCount} {...broad_props} />
<Rooms active={roomsActive} />
<Chat on:message={chat_messages} {...broad_props} />
