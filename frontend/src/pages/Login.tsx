import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const { isAuthenticated, login, isLoading } = useAuth()
  const navigate = useNavigate()
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    await login(data)
  }

  useEffect(()=>{
    if(isAuthenticated){
      navigate('/')
    }
  },[isAuthenticated])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-zinc-200">
        <CardHeader>
          <h2 className="text-3xl font-semibold text-center text-zinc-800 dark:text-zinc-100">
            Welcome Back
          </h2>
          <p className="text-sm text-center text-muted-foreground dark:text-zinc-400">
            Enter your credentials to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register("username")}
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 focus-visible:ring-2 focus-visible:ring-primary"
              />
              {errors.username && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 focus-visible:ring-2 focus-visible:ring-primary"
              />
              {errors.password && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
