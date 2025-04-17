<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="container mx-auto flex flex-col items-center gap-8">
	{@render children()}
</div>
