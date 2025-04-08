import { motion } from "framer-motion"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"

function Home() {
  const features = [
    {
      title: "Fast Uploads",
      desc: "Experience lightning-fast file uploads with our optimized servers.",
    },
    {
      title: "Secure Sharing",
      desc: "All files are encrypted and protected with secure access links.",
    },
    {
      title: "No Login Needed",
      desc: "Upload and share files instantly — no account required.",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Upload & Share Files Effortlessly
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
            Fast, secure, and reliable file upload service for individuals and teams.
          </p>

          <a href="/upload">
            <Button className="text-lg gap-2">
              <UploadCloud className="h-5 w-5" />
              Get Started
            </Button>
          </a>
        </motion.div>
      </main>

      <section id="features" className="py-16 border-t">
        <h3 className="text-3xl font-semibold mb-10 text-center">
          Why Choose FileDrop?
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
