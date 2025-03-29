import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {BarChart3, PlusCircle, Share2} from "lucide-react";
import {getUser} from "@/lib/auth-session";

export default async function Home() {
  const user = await getUser();

  return (
      <div className="mx-auto max-w-5xl w-full px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Section d'introduction */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Créez des sondages, prenez des décisions ensemble</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Simplifiez vos décisions de groupe en créant des sondages rapides et en les partageant avec vos amis.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button asChild size="lg" className="gap-2">
              <Link href={user ? "/polls/create" : "/auth/signin"}>
                <PlusCircle className="h-5 w-5" />
                {user ? "Créer un sondage" : "Commencer"}
              </Link>
            </Button>
            {!user && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/signin">Se connecter</Link>
                </Button>
            )}
          </div>
        </section>

        {/* Section des fonctionnalités */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <Card>
            <CardHeader>
              <PlusCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Créez facilement</CardTitle>
              <CardDescription>Créez rapidement des sondages avec des options multiples</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Quelques clics suffisent pour créer un sondage personnalisé avec autant
                d&apos;options que vous le souhaitez.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Share2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Partagez instantanément</CardTitle>
              <CardDescription>Partagez vos sondages avec vos amis en un instant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Invitez vos amis à participer par email ou via un lien. Simple et rapide.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Résultats en temps réel</CardTitle>
              <CardDescription>Visualisez les résultats dès que les votes sont soumis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Suivez les tendances et les préférences en temps réel avec des graphiques clairs et détaillés.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section d'appel à l'action final */}
        <section className="bg-muted/50 rounded-xl p-8 text-center space-y-6">
          <h2 className="text-2xl font-bold">Prêt à créer votre premier sondage?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rejoignez des milliers d&apos;utilisateurs qui prennent déjà des décisions ensemble
            grâce à notre plateforme de sondage simple et intuitive.
          </p>
          <Button asChild size="lg">
            <Link href={user ? "/polls/create" : "/auth/signin"}>
              {user ? "Créer un sondage" : "S'inscrire gratuitement"}
            </Link>
          </Button>
        </section>
      </div>
  );
}