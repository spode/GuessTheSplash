import type { PageServerLoad } from './$types';

async function getLatestVersion() {
    const url = 'https://ddragon.leagueoflegends.com/api/versions.json';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();


        return json[0];
    } catch (error) {
        console.error(error.message);
    }
}

async function getLatestChampions(version) {

    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json
    } catch (error) {
        console.error(error.message);
    }

    // https://ddragon.leagueoflegends.com/cdn/15.10.1/data/en_US/champion.json
}

const latestVersion = await getLatestVersion()
const latestChampions = await getLatestChampions(latestVersion)

export const load = (async () => {
    return { latestVersion, latestChampions };
}) satisfies PageServerLoad;