import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

interface LoginAlertProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStoredUser: React.Dispatch<React.SetStateAction<string | null>>; // New prop for updating storedUser
  handleGenerateTrip?: () => void;
}

function LoginAlert({
  modalOpen,
  setModalOpen,
  setStoredUser,
  handleGenerateTrip,
}: LoginAlertProps) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      getUserProfile(tokenResponse);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const getUserProfile = (tokenInfo: TokenResponse) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((res) => {
        localStorage.setItem("travel_planner_user", JSON.stringify(res.data));
        setStoredUser(JSON.stringify(res.data)); // Update state in Header component
        setModalOpen(false);

        if (handleGenerateTrip) {
          handleGenerateTrip();
        }
      });
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>
            <img src="/logo.svg" alt="logo" />
          </DialogTitle>
        </DialogHeader>
        <div>
          {/* <h2 className="text-gray-500 text-xl mb-8">
            Please Sign in to continue
          </h2> */}
          <Button className="w-full" onClick={() => login()}>
            <FcGoogle className="mr-2" />
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginAlert;
