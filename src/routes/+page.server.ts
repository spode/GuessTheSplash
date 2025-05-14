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


export const load = (async () => {
    return { latestVersion: await getLatestVersion() };
}) satisfies PageServerLoad;