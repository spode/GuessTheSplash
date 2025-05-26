<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="flex h-full justify-center">
	{@render children()}
</main>

<svelte:head>
	<title>LoL Guess the Splash!</title>
</svelte:head>
