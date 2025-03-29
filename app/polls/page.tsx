import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-session";
import PollList from "./poll-list";

export default async function PollsPage() {
  const user = await getUser();
  if (!user?.email) {
    return <p className="p-4">Veuillez vous connecter pour voir vos sondages.</p>;
  }

  // On récupère les sondages + infos additionnelles (likes, location)
  const polls = await prisma.poll.findMany({
    where: { owner: { email: user.email } },
    orderBy: { createdAt: "desc" },
  });

  return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <h1 className="text-3xl font-bold mb-4">Mes sondages</h1>
        <PollList polls={polls} />
      </div>
  );
}
