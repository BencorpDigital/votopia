import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getUser} from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, options } = body;
    console.log("user", user);

    // Récupérer l'utilisateur
    const users = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Créer le sondage
    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        ownerId: user.id,
        options: {
          create: options.map((optionText: string) => ({
            text: optionText,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
