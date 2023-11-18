import * as z from "zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { createUserAccount, signInAccount } from "@/lib/appwrite/api";
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query";
import { INewUser } from "@/types";
import { useAuthContext } from "@/context/AuthContext";


const formSchema = z.object({
  name: z.string(),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Signup = () => {
  const { mutateAsync: createUserAccountMutation, isPending: isCreatingUser } = useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user)
  })

  const { mutateAsync: signInAccountMutation } = useMutation({
    mutationFn: (user: { email: string; password: string; }) => signInAccount(user)
  })

  const { checkAuthUser } = useAuthContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newUser = await createUserAccountMutation(values); // createUserAccount api call
    if(!newUser) {
      toast({ title: "Sign up failed, please try again."})
    }
    toast({ title: "Signed up successfully"})
    const session = await signInAccountMutation({ email: values.email, password: values.password })

    if(!session) {
      toast({ title: "Sign in failed, please try again."})
    }

    const isLoggedIn = await checkAuthUser()
    if(isLoggedIn){
      form.reset()
      navigate("/")
    } else {
      return toast({ title: "Sign up failed. Please try again"})
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-[420px] flex-center flex-col">
        <h2 className="h3-b01d md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-1ight-3 small-medium md:base-regular mt-2">To use Shareit, please enter your details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary w-full" disabled={isCreatingUser}>
            { isCreatingUser ? "Submiting..." : "Submit" }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default Signup;
