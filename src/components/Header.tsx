import { useState } from "react";
import LoginAlert from "./LoginAlert";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { googleLogout } from "@react-oauth/google";
import { useUserContext } from "@/context/UserContext";
import { useTheme } from "./theme-provider";
import { ModeToggle } from "./ModeToggle";

function Header() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { storedUser, setStoredUser } = useUserContext();
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { theme } = useTheme();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-3 px-4 md:px-20 lg:px-32 xl:px-56 shadow-sm flex justify-between items-center ${
        theme === "light" ? "bg-gray-100" : "bg-card"
      }`}
    >
      <a href="/">
        <img src="/trippler_logo.png" alt="logo" className="w-[130px]" />
      </a>
      <div>
        {user ? (
          <div className="flex gap-4 lg:gap-8">
            <div className="hidden sm:block">
              <ModeToggle />
            </div>
            <a href="/create-trip">
              <Button variant={"default"} className="rounded-xl">
                + <span className="hidden sm:block">New Trip</span>
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant={"outline"} className="rounded-xl">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user.picture}
                  alt=""
                  className="rounded-3xl h-[35px] w-[35px] cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent>
                <a
                  href="/"
                  className="cursor-pointer"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    setStoredUser(null);
                  }}
                >
                  Logout
                </a>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setLoginModalOpen(true)}>Sign in</Button>
        )}
      </div>
      <LoginAlert
        modalOpen={loginModalOpen}
        setModalOpen={setLoginModalOpen}
        setStoredUser={setStoredUser}
      />
    </header>
  );
}

export default Header;
