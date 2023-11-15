import { getSummonerByName } from "@/lib/riot-api/api";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 3600; // revalidate at most every hour
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { name: string };
}) {
  return (
    <main className="flex min-h-screen h-full flex-col justify-center items-center space-y-4 w-full">
      <h1 className="pb-4 text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 inline-block text-transparent bg-clip-text">
        League Is Shit
      </h1>

      <div className="max-w-7xl mx-auto w-full">
        <Search />
      </div>
      <Suspense fallback={<div>Loading results...</div>}>
        {searchParams.name ? <Profile name={searchParams.name} /> : ""}
      </Suspense>
    </main>
  );
}

async function Profile({ name }: { name: string }) {
  const data = await getSummonerByName({ name });
  return (
    <div className="border rounded p-4 flex flex-col space-y-4 w-full max-w-7xl">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Link className="bg-neutral-900 p-2 rounded" href={`/profile/${name}`}>
        View this profile
      </Link>
    </div>
  );
}

function Search() {
  return (
    <form
      method="get"
      className="flex flex-col w-full justify-center items-center"
    >
      <div className="flex items-center h-12 w-full justify-center">
        <label htmlFor="name" className="sr-only">
          Summoner name
        </label>
        <input
          name="name"
          className="text-black h-full rounded-lg rounded-r-none w-full max-w-4xl"
        />
        <button className="bg-neutral-900 rounded-lg rounded-l-none h-full px-2">
          Search
        </button>
      </div>
    </form>
  );
}
