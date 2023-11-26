import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, signOutAccount } from "../appwrite/api";
import { INewPost } from "@/types";

export const useSignOutMutation = () => {
  return useMutation({
    mutationKey: ["sign-out"],
    mutationFn: () => signOutAccount()
  }) 
}

export const useCreatePostMutation = () => {

  // const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-post"],
    mutationFn: (post: INewPost) => createPost(post),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["create-post"]
    //   })
    // }
  })
}