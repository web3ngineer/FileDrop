import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4 text-center">
      <div className="max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or an unexpected error occurred.
        </p>
        <Link to="/">
          <Button variant="default">Go back home</Button>
        </Link>
      </div>
    </div>
  )
}
