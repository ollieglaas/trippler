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
  setStoredUser: React.Dispatch<React.SetStateAction<string | null>>;
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
        setStoredUser(JSON.stringify(res.data));
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
          <DialogTitle className="flex justify-center items-center">
            <img src="/trippler_logo.png" alt="logo" className="w-1/3" />
          </DialogTitle>
        </DialogHeader>
        <div>
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
