import { LeagueMatch } from "@/lib/riot-api/types/league-match";

const key = process.env.API_KEY!;
const headers = new Headers();
headers.append(`X-Riot-Token`, key);

export async function fetchProfileMatches({
  id,
  limit,
  offset,
}: {
  id: string;
  offset: number;
  limit: number;
}) {
  const matches = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${id}/ids?start=${offset}&count=${limit}`,
    {
      headers: headers,
    }
  ).then((r) => r.json());

  const populatedMatches = (await Promise.all(
    matches.map((id: string) => fetchMatch({ id }))
  )) as LeagueMatch[];

  return populatedMatches;
}

export async function fetchMatch({ id }: { id: string }) {
  const populatedMatch = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${id}`,
    {
      headers,
    }
  );

  return populatedMatch.json() as Promise<LeagueMatch>;
}

export async function getSummonerByName({ name }: { name: string }) {
  const key = process.env.API_KEY!;
  const headers = new Headers();
  headers.append(`X-Riot-Token`, key);
  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`,
    {
      method: "GET",
      headers: headers,
    }
  );

  return response.json();
}
