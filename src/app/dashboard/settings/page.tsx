import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/SettingsForm";

export default async function Settings() {
  const u = await prisma.user.findUniqueOrThrow({ where: { id: (await auth())!.user.id } });
  return (
    <div className="max-w-2xl">
      <h1 className="mb-5 text-2xl font-extrabold">Settings</h1>
      <SettingsForm user={{ displayName: u.displayName ?? "", username: u.username, bio: u.bio ?? "", theme: u.theme }} />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="mt-10"
      >
        <button className="text-sm font-semibold text-slate underline">Log out</button>
      </form>
    </div>
  );
}
