import {useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Validation schema
const formSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z
      .string()
      .min(8, "Phone number is too short")
      .max(15, "Phone number must not exceed 15 characters")
      .regex(/^\+\d{1,3}\d{4,}$/, "Include country code (e.g., +91...)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type RegisterValues = z.infer<typeof formSchema>;

export default function Register() {
  const {isAuthenticated, register: signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    await signUp(data);
    navigate("/login");
  };

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/')
    }
  },[isAuthenticated])

  return (
    <div className="pt-12 min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200">
        <h2 className="text-3xl font-semibold mb-6 text-center text-zinc-800 dark:text-white">
          Create an Account
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex gap-4">
              {["first_name", "last_name"].map((name) => (
                <FormField
                  key={name}
                  name={name as keyof RegisterValues}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="capitalize text-zinc-700 dark:text-zinc-300">
                        {name.replace("_", " ")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 focus-visible:ring-2 focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {[
              "username",
              "email",
              "phone_number",
              "password",
              "confirm_password",
            ].map((name) => (
              <FormField
                key={name}
                name={name as keyof RegisterValues}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize text-zinc-700 dark:text-zinc-300">
                      {name.replace("_", " ")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={
                          name.includes("password")
                            ? "password"
                            : name === "email"
                            ? "email"
                            : "text"
                        }
                        className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
