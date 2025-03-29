import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Github, LogOut, Mail, Trash2, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {getUser} from "@/lib/auth-session";
import {revalidatePath} from "next/cache";

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    return (
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Account Access</CardTitle>
            <CardDescription>Sign in to view your account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="p-8 rounded-full bg-muted/50">
              <User className="h-12 w-12 text-muted-foreground"/>
            </div>
            <p className="text-center text-muted-foreground">
              Please sign in to access your personal account information and settings.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
    );
  }

  const accounts = await auth.api.listUserAccounts({
    headers: await headers()
  });

  console.log("accounts", accounts);

  const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : user.email?.charAt(0).toUpperCase();

  // Function to get the provider icon
  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'github':
        return <Github className="h-5 w-5"/>;
      case 'google':
        return <Github className="h-5 w-5"/>;
      default:
        return <User className="h-5 w-5"/>;
    }
  };

  return (
      <div className="space-y-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Account</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || ""} alt={user.name || "User"}/>
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>

            <div className="w-full space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
                <User className="h-5 w-5 text-muted-foreground"/>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
                <Mail className="h-5 w-5 text-muted-foreground"/>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/account/settings">Account Settings</Link>
            </Button>
            <form className="w-full">
              <Button variant="destructive" className="w-full gap-2 cursor-pointer"
                      formAction={async () => {
                        "use server"
                        await auth.api.signOut({
                          headers: await headers()
                        })
                      }}>
                <LogOut className="h-4 w-4"/> Sign Out
              </Button>
            </form>
          </CardFooter>
        </Card>

        {/* Connected Accounts Section */}
        {accounts && accounts.length > 0 && (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Your linked authentication providers</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {accounts?.map((account, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-2">
                        {getProviderIcon(account.provider)}
                        <CardTitle
                            className="text-base capitalize">{account.provider} Account</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Provider ID:</div>
                          <div className="font-small  capitalize">{account.accountId}</div>

                          <div className="text-muted-foreground">Type:</div>
                          <div
                              className="font-medium capitalize">{account.provider || "Standard"}</div>

                          {account.scopes && (
                              <>
                                <div className="text-muted-foreground">Scopes:</div>
                                <div className="font-medium overflow-hidden text-ellipsis">
                                  {Array.isArray(account.scopes)
                                      ? account.scopes.join(", ")
                                      : ("None")}
                                </div>
                              </>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <form className="w-full">
                          <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-destructive hover:bg-destructive/10 border-destructive/30 flex items-center gap-2"
                              formAction={async () => {
                                "use server"
                                await auth.api.unlinkAccount({
                                  headers: await headers(),
                                  body: {
                                    providerId: account.provider,
                                    accountId: account.accountId
                                  }
                                });
                                revalidatePath("/auth")
                              }}
                          >
                            <Trash2 className="h-4 w-4"/> Unlink Account
                          </Button>
                        </form>
                      </CardFooter>
                    </Card>
                ))}
              </CardContent>
            </Card>
        )}
      </div>
  );
}