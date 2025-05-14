<script lang="ts">
	let { data } = $props();
	import champions from '$lib/champion.json';
	import { onMount } from 'svelte';

	import audioFile from '../oakSounds/oak2.wav';
	import audioFile2 from '../oakSounds/oak16.wav';
	import audioFile3 from '../oakSounds/oak3.wav';

	let skinName = $state('Aatrox');
	let champNames: string[] = Object.keys(champions.data);

	let currentHints = $state([]);

	let audio;
	let audio2;
	let audio3;

	let randomChampName = $state('');
	let userGuessString: string = $state('');
	let words: string[] = $state([]);
	let xxxSentence: string[] = $state([]);
	let myInputElement: HTMLInputElement | undefined = $state();

	let fullWordGuess = $state(0);

	let soundsEnabled = $state(true);
	onMount(() => {
		fetchRandomChampData();
		audio = new Audio(audioFile);
		audio2 = new Audio(audioFile2);
		audio3 = new Audio(audioFile3);
	});

	// $inspect(data);

	let imageUrl = $state(
		'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg'
	);

	async function fetchRandomChampData() {
		randomChampName = champNames[Math.floor(Math.random() * champNames.length)];

		const champDataUrl = `https://ddragon.leagueoflegends.com/cdn/${data.latestVersion}/data/en_US/champion/${randomChampName}.json`;
		try {
			const response = await fetch(champDataUrl);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const jsonData = await response.json();
			let skinsArr = jsonData.data[randomChampName].skins;
			if (skinsArr.length > 1) {
				skinsArr = skinsArr.slice(1);
			}
			let skinData = skinsArr[Math.floor(Math.random() * skinsArr.length)];
			imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${randomChampName}_${skinData.num}.jpg`;
			skinName = skinData.name;

			words = skinName.split(' '); // Split sentence into words
			words.map((str) => str.replace(/[.,]/g, ''));

			xxxSentence = words.map((word) => 'x'.repeat(word.length));
			currentHints = skinName.toLowerCase().split(' ');
		} catch (error) {
			console.error(error.message);
		}
	}

	async function guessWord() {
		const splitGuess = userGuessString.split(' ');

		console.log('splitguess', splitGuess);

		let count = 0;
		for (let i = 0; i < words.length; i++) {
			console.log(words[i]);

			splitGuess.forEach((element) => {
				if (element.toLowerCase() == words[i].toLowerCase()) {
					xxxSentence[i] = words[i];
					count++;
					console.log('match', element);
				}
			});
		}

		if (soundsEnabled) {
			if (words.length == count) {
				audio2.play();
			} else if (count > 0) {
				audio.play();
			}
		}
		userGuessString = '';
		setTimeout(() => {
			myInputElement.focus();
		}, 200);

		if (xxxSentence.join(' ') == skinName) {
			setTimeout(() => {
				if (soundsEnabled) audio3.play();
				fetchRandomChampData();
			}, 2000);
		}
	}
</script>

<div class="h-full gap-4 space-y-8 text-center">
	<div class="flex flex-col items-center justify-center gap-4 lg:flex-row">
		<button
			onclick={fetchRandomChampData}
			class="cursor-pointer rounded bg-sky-500 px-8 py-2 font-semibold text-white shadow transition-colors duration-300 ease-in-out dark:bg-gray-700"
			>Skip</button
		><label for="" class="rounded bg-sky-500 px-4 py-2 font-semibold text-white shadow-xl">
			<input type="checkbox" bind:checked={soundsEnabled} />
			Sounds Enabled
		</label>
	</div>
	<div class="champ flex flex-col items-center text-center">
		<img title={skinName} class="w-40 xl:w-72" src={imageUrl} alt="" />
		<h1 class="text-4xl font-bold">{xxxSentence.join(' ') || 'placeholder'}</h1>
	</div>
	<form onsubmit={guessWord} class="mx-auto w-full max-w-md p-4">
		<label class="flex justify-center gap-4">
			<input
				class="rounded-2xl bg-sky-500 px-4 py-2 font-semibold text-white shadow-xl focus:ring-2 focus:outline-none dark:bg-gray-700"
				bind:this={myInputElement}
				bind:value={userGuessString}
				placeholder="Enter skin guess"
			/>

			<input
				type="submit"
				value="Submit"
				class="cursor-pointer rounded-2xl bg-sky-500 px-4 py-2 font-semibold text-white shadow-xl transition-colors duration-200 dark:bg-gray-700"
			/>
		</label>
	</form>
	<button
		class="cursor-pointer rounded-2xl bg-sky-500 px-4 py-2 font-semibold text-white shadow-xl"
		onclick={() => {
			let hint = currentHints[Math.floor(Math.random() * currentHints.length)];

			currentHints = currentHints.filter((element) => element !== hint);

			alert(hint);
		}}>Hint, please!</button
	>
</div>
