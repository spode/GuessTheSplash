<script lang="ts">
	let { data } = $props();

	import { onMount } from 'svelte';

	import perfectFile from '../oakSounds/oak16.wav';
	import wowFile from '../oakSounds/oak2.wav';
	import herePresentFile from '../oakSounds/oak3.wav';

	let randomSkinName = $state('Aatrox');
	let champNames: string[] = Object.keys(data.latestChampions.data);

	let currentHints: string[] = $state([]);
	export function delayed(value, ms = 500) {
		return new Promise((f) => {
			setTimeout(() => f(value), ms);
		});
	}

	let wowAudio: HTMLAudioElement,
		perfectAudio: HTMLAudioElement,
		herePresentAudio: HTMLAudioElement;

	let randomChampName = $state('');
	let userGuessString: string = $state('');
	let words: string[] = $state([]);
	let xxxSentence: string[] = $state([]);
	let myInputElement: HTMLInputElement | undefined = $state();

	let soundsEnabled = $state(true);
	onMount(async () => {
		wowAudio = new Audio(wowFile);
		perfectAudio = new Audio(perfectFile);
		herePresentAudio = new Audio(herePresentFile);
		fetchRandomChampData();
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

			// remove default skin
			if (skinsArr.length > 1) {
				skinsArr = skinsArr.slice(1);
			}

			// pick a random skin object
			let randomSkinData = skinsArr[Math.floor(Math.random() * skinsArr.length)];
			imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${randomChampName}_${randomSkinData.num}.jpg`;
			randomSkinName = randomSkinData.name;

			words = randomSkinName.split(' '); // Split sentence into words
			words.map((str) => str.replace(/[.,]/g, ''));

			xxxSentence = words.map((word) => 'x'.repeat(word.length));
			currentHints = randomSkinName.split(' ');
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
				perfectAudio.play();
			} else if (count > 0) {
				wowAudio.play();
			}
		}
		userGuessString = '';
		setTimeout(() => {
			myInputElement?.focus();
		}, 200);

		if (xxxSentence.join(' ') == randomSkinName) {
			setTimeout(() => {
				if (soundsEnabled) herePresentAudio.play();
				fetchRandomChampData();
			}, 2000);
		}
	}
</script>

<div class="h-full w-2xl flex-col space-y-8 bg-white/40 text-center">
	<h2 class="text-5xl font-bold text-white text-shadow-lg text-shadow-sky-500">Guess the Skin!</h2>
	<div class="flex flex-col items-center justify-center gap-4 lg:flex-row">
		<button
			onclick={() => {
				fetchRandomChampData();
			}}
			class="cursor-pointer rounded bg-sky-500 px-8 py-2 font-semibold text-white shadow-lg transition-colors duration-300 ease-in-out dark:bg-gray-700"
			>Skip</button
		>
		<div class="block rounded bg-sky-500 px-4 py-2">
			<div>
				<label class="inline-flex items-center font-semibold text-white select-none">
					<input type="checkbox" class="accent-white" bind:checked={soundsEnabled} />
					<span class="ml-2">Enable sounds</span>
				</label>
			</div>
		</div>
	</div>
	<div class="champ flex flex-col items-center text-center">
		<img title={randomSkinName} class="w-40 xl:w-72" src={imageUrl} alt="" />
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
			let randomWord = currentHints[Math.floor(Math.random() * currentHints.length)];
			currentHints = currentHints.filter((element) => element !== randomWord);
			alert(randomWord);
		}}>Hint please!</button
	>
</div>
