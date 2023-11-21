import { Link, useNavigate } from "react-router-dom";

// components
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// zod and react hoot form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// appwrite
import { signInAccount } from "@/lib/appwrite/api";

// react query
import { useMutation } from "@tanstack/react-query";

// types

// context
import { useAuthContext } from "@/context/AuthContext";


const formSchema = z.object({
  email: z.string().email("Please enter the valid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Signin = () => {

  const { mutateAsync: signInAccountMutation, isPending: isSigningIn } = useMutation({
    mutationKey: ["signin"],
    mutationFn: (user: { email: string; password: string; }) => signInAccount(user)
  })

  const { checkAuthUser, isLoading } = useAuthContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        <h2 className="h3-b01d md:h2-bold pt-5 sm:pt-12">Welcome Back!</h2>
        <p className="text-1ight-3 small-medium md:base-regular mt-2">Please enter your details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

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
          <Button type="submit" className="shad-button_primary w-full" disabled={isSigningIn || isLoading}>
            { (isSigningIn || isLoading) ? "Submiting..." : "Submit" }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?. Please sign up
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default Signin;
