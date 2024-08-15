"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Separator } from "../../../components/ui/separator";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Loader2 } from "lucide-react";

// Update the schema to include password confirmation
const FormSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters.",
      })
      .max(15, {
        message: "Username must be at most 15 characters.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Only letters, numbers, and underscores allowed.",
      }),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .regex(/^\S+$/, {
        message: "Password cannot contain spaces.",
      }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .regex(/^\S+$/, {
        message: "Password cannot contain spaces.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { username, password } = data;
    let gReCaptchaToken;

    if (!executeRecaptcha) {
      toast({
        className:
          "fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[100] p-4",
        variant: "destructive",
        title: "Unable to execute ReCAPTCHA",
      });
    } else {
      gReCaptchaToken = await executeRecaptcha("inquirySubmit");
    }

    setIsSubmitLoading(true);

    try {
      const reCaptchaResponse = await fetch("/api/recaptcha", {
        method: "POST",
        headers: {
          Accept: "application.json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gReCaptchaToken }),
      });

      const reCaptchaData = await reCaptchaResponse.json();

      if (reCaptchaData.success === true) {
        console.log("yay, sucessful recaptcha");
        const response = await fetch("/api/credentials/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok && data?.data?.access_token) {
          const result = await signIn("credentials", {
            redirect: false,
            username,
            password,
          });

          if (result?.error === "Custom Sign In Error") {
            setIsSubmitLoading(false);
            toast({
              className:
                "fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[100] p-4",
              variant: "destructive",
              title: "Invalid credentials",
            });
          } else {
            console.log("Successful sign in");
            setIsSubmitLoading(false);
            router.push("/"); // Redirect to the home page after successful login
          }
        } else {
          setIsSubmitLoading(false);
          toast({
            className:
              "fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[100] p-4",
            variant: "destructive",
            title: "Username already taken",
          });
        }
      } else {
        setIsSubmitLoading(false);
        toast({
          className:
            "fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[100] p-4",
          variant: "destructive",
          title: "Uh oh! Are you a bot?",
          description:
            "If not, refresh the page or wait a few minutes to try again.",
        });
      }
    } catch (error: any) {
      setIsSubmitLoading(false);
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault(); // Prevent the default form submission behavior
          form.handleSubmit(onSubmit)();
        }}
        className="flex justify-center items-center flex-col"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="my-1">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} className="w-80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="my-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="password"
                  type="password"
                  {...field}
                  className="w-80"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="my-1">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="confirm password"
                  type="password"
                  {...field}
                  className="w-80"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-center m-4 w-80">
          {isSubmitLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin">Please wait</Loader2>
          ) : (
            "Sign up"
          )}
        </Button>
        <FormDescription>
          Have an account already?{" "}
          <Link
            href="../credentials/sign-in/"
            style={{ textDecoration: "underline" }}
          >
            Sign in.
          </Link>
        </FormDescription>
        <Separator className="m-5 w-60" />
        <FormDescription>
          Made with 💪 by{" "}
          <Link
            href="https://github.com/paolopedrigal"
            style={{ textDecoration: "underline" }}
          >
            paolopedrigal
          </Link>
          .
        </FormDescription>
      </form>
    </Form>
  );
}
