"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { APP_CONFIG } from "@/config/app-config";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function LoginV1() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="bg-primary relative hidden overflow-hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" width={100} height={100} />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-3xl font-bold">Welcome Back</h1>
              <p className="text-primary-foreground/80 text-xl">Login to continue</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary absolute -bottom-1/4 left-[70%] h-1/2 w-full -rotate-50 md:left-1/2"></div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <Image src={APP_CONFIG.icon} alt="SON_LOGO" className="block: mx-auto lg:hidden" width={70} height={70} />
            <div className="text-2xl font-bold tracking-tight text-black">Forgot Password</div>
            <div className="text-muted-foreground mx-auto max-w-xl text-sm">
              Submit your email to gain access back to your account
            </div>
          </div>
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input id="email" type="email" placeholder="you@gmail.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Submit Email
                </Button>
              </form>
            </Form>
            <Link href="/auth/login" className="flex items-center justify-center gap-4">
              <ArrowLeft size={15} className="text-primary" />
              <h5 className="text-primary text-sm">Back to Login</h5>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-secondary absolute -bottom-1/3 left-[65%] block h-1/2 w-full -rotate-40 md:hidden"></div>
      <div className="bg-primary absolute -bottom-1/3 left-[75%] mt-20 block h-1/2 w-full -rotate-40 md:hidden"></div>
    </div>
  );
}
