import { fetchProfileMatches, getSummonerByName } from "@/lib/riot-api/api";
import { LeagueMatch } from "@/lib/riot-api/types/league-match";
import { Profile } from "@/lib/riot-api/types/profile";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
dayjs.extend(relativeTime);

export const revalidate = 3600; // revalidate at most every hour
export default async function Page({
  params,
}: {
  params: {
    name: string;
  };
}) {
  const profile = await getSummonerByName({ name: params.name });
  if (!profile?.id) {
    return (
      <div className="w-full flex items-center justify-center pt-24">
        <h1 className="text-2xl">Summoner not found {":("}</h1>
      </div>
    );
  }
  const matches = await fetchProfileMatches({
    id: profile.puuid,
    offset: 0,
    limit: 10,
  });

  return (
    <div className="space-y-4">
      <div className="bg-neutral-800">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader profile={profile} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="space-y-1">
          {matches.map((match) => (
            <Match
              key={match.metadata.matchId}
              match={match}
              profile={profile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="py-4 flex space-x-4">
      <div>
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/13.9.1/img/profileicon/${profile.profileIconId}.png`}
          alt={profile.name}
          width={100}
          height={100}
        />
      </div>
      <div>
        <h1 className="font-bold text-xl">{profile.name}</h1>
      </div>
    </div>
  );
}

function Match({ profile, match }: { profile: Profile; match: LeagueMatch }) {
  const participant = match.info.participants.find(
    (p) => p.puuid === profile.puuid
  )!;
  const outcome = participant.win ? "Victory" : "Defeat";
  // Match date
  const date = new Date(match.info.gameCreation);
  const champion = participant.championName;

  return (
    <div
      key={match.metadata.matchId}
      className={`rounded flex items-center border border-neutral-500 p-2 ${
        outcome === "Victory" ? "bg-[#28344E]" : "bg-[#59343B]"
      }`}
    >
      <div className="flex items-center gap-x-2">
        <div className="flex flex-col text-center">
          <span>{match.info.gameMode}</span>
          <span>{dayjs(date).fromNow()}</span>
          <span>{outcome}</span>
          <span>{Number(match.info.gameDuration / 60).toFixed(2)} minutes</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center">{champion}</div>
    </div>
  );
}
