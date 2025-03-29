import {ModeToggle} from "../theme/theme-mode-toggle";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {getUser} from "@/lib/auth-session";

const Logo = () => (
    <div className="flex items-center gap-2">
      <svg width="30" height="30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,40 h100 a10,10 0 0 1 10,10 v80 a10,10 0 0 1 -10,10 h-60 l-20,20 v-20 h-30 a10,10 0 0 1 -10,-10 v-80 a10,10 0 0 1 10,-10 z" fill="currentColor" className="text-primary"/>
        <polyline points="70,80 90,100 130,60" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-bold">Votopia</span>
    </div>
);


export async function Header() {
  const user = await getUser()

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b border-accent">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex-1" />
      { user ? (
          <Link
              className= {buttonVariants({size: "sm", variant: "link"})}
              href="/auth">{user.email}
          </Link>
      ) :
          <Link
              className={buttonVariants({size: "sm", variant: "link"})}
              href="/auth/signin"> Sign IN
          </Link>
      }

      <ModeToggle />
    </header>
  );
}