import Link from "next/link";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="">
      <div className="w-full h-full shadow-2xl border-b border-slate-900">
        <div className="grid grid-cols-3 py-4">
          <Link href="/" className="px-2">
            <div className="px-2">Home</div>
          </Link>
          <div className="w-full flex-1 flex justify-start">
            <Search />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Search() {
  async function onSubmit(formData: FormData) {
    "use server";
    const name = formData.get("name");
    redirect(`/profile/${name}`); // Navigate to new route
  }
  return (
    <form
      method="get"
      className="flex items-center h-8 w-full"
      action={onSubmit}
    >
      <div className="flex flex-col h-full flex-1">
        <label htmlFor="name" className="sr-only">
          Summoner name
        </label>
        <input
          name="name"
          className="text-black h-full rounded rounded-r-none p-0 px-4 bg-slate-900 focus:bg-white/5"
          placeholder="Summoner name..."
        />
      </div>
      <button className="bg-slate-900 h-full rounded-l-none rounded px-4">
        Search
      </button>
    </form>
  );
}
