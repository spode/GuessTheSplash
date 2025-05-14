<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="flex h-screen w-screen items-center justify-center">
	<div
		class=" flex items-center justify-center rounded-xl border-white/60 bg-white/70 py-12 lg:w-3xl"
	>
		{@render children()}
	</div>
</main>

<svelte:head>
	<title>LoL Guess the Splash!</title>
</svelte:head>
