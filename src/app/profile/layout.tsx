import Link from "next/link";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="bg-neutral-900">
      <div className="mx-auto max-w-7xl w-full flex items-center justify-center py-4">
        <Link href="/">
          <div className="px-2">Home</div>
        </Link>
        <div className=" w-full">
          <Search />
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
    <form method="get" className="flex items-center h-8" action={onSubmit}>
      <div className="flex flex-col h-full flex-1">
        <label htmlFor="name" className="sr-only">
          Summoner name
        </label>
        <input
          name="name"
          className="text-black h-full rounded-lg ring-0 outline-none px-4"
          placeholder="Summoner name..."
        />
      </div>
      <button className="bg-neutral-900 p-2 rounded">Search</button>
    </form>
  );
}
