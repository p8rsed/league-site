import {
  fetchProfileMatches,
  formatChampionSquareAsset,
  formatItemSquareAsset,
  formatSummonerSpellSquareAsset,
  getSummonerByName,
} from "@/lib/riot-api/api";
import { LeagueMatch, Participant } from "@/lib/riot-api/types/league-match";
import { Profile } from "@/lib/riot-api/types/profile";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useId } from "react";
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

function Pings({ participant }: { participant: Participant }) {
  const allInPings = participant.allInPings;
  const assistMePings = participant.assistMePings;
  const baitPings = participant.baitPings;
  const basicPings = participant.basicPings;
  const commandPings = participant.commandPings;
  const dangerPings = participant.dangerPings;
  const enemyMissingPings = participant.enemyMissingPings;
  const enemyVisionPings = participant.enemyVisionPings;
  const getBackPings = participant.getBackPings;
  const holdPings = participant.holdPings;
  const needVisionPings = participant.needVisionPings;
  const onMyWayPings = participant.onMyWayPings;
  const pushPings = participant.pushPings;
  const visionClearedPings = participant.visionClearedPings;

  const pings = {
    allInPings,
    assistMePings,
    baitPings,
    basicPings,
    commandPings,
    dangerPings,
    enemyMissingPings,
    enemyVisionPings,
    getBackPings,
    holdPings,
    needVisionPings,
    onMyWayPings,
    pushPings,
    visionClearedPings,
  };

  return (
    <div>
      {Object.entries(pings).map(([key, value]) => {
        return (
          <div key={`ping-${key}`}>
            {key}: {value}
          </div>
        );
      })}
    </div>
  );
}

function Match({ profile, match }: { profile: Profile; match: LeagueMatch }) {
  const participant = match.info.participants.find(
    (p) => p.puuid === profile.puuid
  )!;
  const outcome = participant.win ? "Victory" : "Defeat";
  const matchDate = new Date(match.info.gameCreation);
  const championName = participant.championName;
  // Get build items

  return (
    <div
      key={match.metadata.matchId}
      className={`space-x-4 rounded-md flex items-center border border-neutral-500 p-2 ${
        outcome === "Victory" ? "bg-[#28344E]" : "bg-[#59343B]"
      }`}
    >
      <div className="flex items-center gap-x-2 w-24">
        <div className="flex flex-col text-center text-sm">
          <span>{match.info.gameMode}</span>
          <span>{dayjs(matchDate).fromNow()}</span>
          <span className="font-bold">{outcome}</span>
          <span>{Number(match.info.gameDuration / 60).toFixed(0)} minutes</span>
        </div>
      </div>
      <div className="flex-1 flex justify-start items-center space-x-2">
        <div className="overflow-hidden rounded-full">
          <Image
            src={formatChampionSquareAsset({
              championName,
            })}
            alt={championName}
            height={64}
            width={64}
          />
        </div>
        <ParticipantSummonerSpells participant={participant} />
        <ParticipantStats participant={participant} match={match} />
        <div className="pl-2">
          <ParticipantItems participant={participant} />
        </div>
      </div>
      <div></div>
    </div>
  );
}

function ParticipantItems({ participant }: { participant: Participant }) {
  const id = useId();

  const items = [
    participant.item0,
    participant.item1,
    participant.item2,
    participant.item3,
    participant.item4,
    participant.item5,
  ];

  const trinket = participant.item6;

  return (
    <div className="flex">
      <div className="grid grid-cols-3">
        {items
          .filter((item) => item) // 0 is empty
          .map((item) => (
            <div key={`${id}-${item}`}>
              <Image
                src={formatItemSquareAsset({ itemId: item })}
                alt={`${item}`}
                height={24}
                width={24}
              />
            </div>
          ))}
      </div>
      <div>
        <Image
          src={formatItemSquareAsset({ itemId: trinket })}
          alt={`trinket-${trinket}`}
          height={24}
          width={24}
        />
      </div>
    </div>
  );
}

export function ParticipantSummonerSpells({
  participant,
}: {
  participant: Participant;
}) {
  const id = useId();
  const summoner1 = participant.summoner1Id;
  const summoner2 = participant.summoner2Id;
  const spells = [summoner1, summoner2];
  return (
    <div className="grid grid-cols-1">
      {spells.map((spell) => (
        <div key={`${id}-${spell}`}>
          <Image
            src={formatSummonerSpellSquareAsset({ spellId: spell })}
            alt={`summoner spell ${spell}`}
            height={24}
            width={24}
          />
        </div>
      ))}
    </div>
  );
}

export function ParticipantStats({
  participant,
  match,
}: {
  participant: Participant;
  match: LeagueMatch;
}) {
  const k = participant.kills;
  const d = participant.deaths;
  const a = participant.assists;
  const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
  const gameDuration = match.info.gameDuration / 60;
  const csPerMin = cs / gameDuration;

  const sepClass = "text-neutral-400 px-0.5 font-semibold";

  return (
    <div className="w-24 flex flex-col justify-center items-center space-y-1">
      <h1 className="">
        <span>{k}</span>
        <span className={sepClass}>/</span>
        <span>{d}</span>
        <span className={sepClass}>/</span>
        <span>{a}</span>
      </h1>
      <div className="">
        <h2 className="text-xs space-x-1">
          <span>
            <span>{cs}</span> <span className="">CS</span>
          </span>
          <span>{"(" + csPerMin.toFixed(1) + ")"}</span>
        </h2>
      </div>
    </div>
  );
}
