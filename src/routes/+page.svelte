<script lang="ts">
	import champions from '$lib/champion.json';

	let skinName = $state('Aatrox');
	let champNames: string[] = Object.keys(champions.data);

	let name: string[] = $state([]);
	let words: string[] = $state([]);
	let hiddenSentence: string[] = $state([]);
	let userGuess: string = $state('');

	let imageUrl = $state(
		'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg'
	);

	async function fetchRandomChampData() {
		let randomChampName = champNames[Math.floor(Math.random() * champNames.length)];
		console.log(randomChampName);

		const champDataUrl = `https://ddragon.leagueoflegends.com/cdn/14.24.1/data/en_US/champion/${randomChampName}.json`;
		try {
			const response = await fetch(champDataUrl);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const json = await response.json();
			let skinsArr = json.data[randomChampName].skins;
			let skinData = skinsArr[Math.floor(Math.random() * skinsArr.length)];
			imageUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${randomChampName}_${skinData.num}.jpg`;
			skinName = skinData.name;

			if (skinName == 'default') {
				skinName = randomChampName;
			}
			console.log(json);
			console.log(skinName);
			console.log(imageUrl);

			words = skinName.split(' '); // Split sentence into words
			hiddenSentence = words.map((word) => 'x'.repeat(word.length));
		} catch (error) {
			console.error(error.message);
		}
	}

	async function guessWord() {
		const guess: string = name.toLowerCase();

		// Check if the guessed word is part of the sentence
		let correctGuess = false;
		for (let i = 0; i < words.length; i++) {
			if (words[i].toLowerCase() === guess) {
				hiddenSentence[i] = words[i]; // Reveal the word
				correctGuess = true;
			}
		}

		name = '';
		setTimeout(() => {
			userGuess.focus();
		}, 200);

		if (hiddenSentence.join(' ') == skinName) {
			setTimeout(() => {
				fetchRandomChampData();
			}, 2000);
		}
	}
</script>

<button
	onclick={fetchRandomChampData}
	class="btn-primary rounded px-8 py-4 font-semibold transition-colors duration-300 ease-in-out"
	>random skin</button
>
<img title={skinName} class="w-72" src={imageUrl} alt="" />
<h1 class="text-4xl font-bold">{hiddenSentence.join(' ') || 'placeholder'}</h1>

<form onsubmit={guessWord}>
	<label class="block">
		<span>guess champ:</span>
		<input
			class="block rounded bg-gray-600 text-white"
			bind:this={userGuess}
			bind:value={name}
			placeholder="enter your name"
		/>
	</label>
</form>
