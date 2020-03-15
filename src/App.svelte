<script>
	import Chat from './chat.svelte';
	
	let messagesCount = 0
	let chatRooms = []

	$: broad_props = {
		
	}

</script>

<Chat {...broad_props} />
