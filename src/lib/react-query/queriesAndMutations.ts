import { useMutation } from "@tanstack/react-query";
import { signOutAccount } from "../appwrite/api";

export const useSignOutMutation = () => {
  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: () => signOutAccount()
  }) 
}