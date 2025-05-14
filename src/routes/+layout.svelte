<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="mx-auto max-w-6xl rounded-xl border-white/60 bg-white/70 py-12">
	{@render children()}
</div>

<svelte:head>
	<title>LoL Guess the Splash!</title>
</svelte:head>
