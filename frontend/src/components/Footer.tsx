import { motion } from "framer-motion"

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="py-4 text-center text-muted-foreground text-sm border-t bg-background"
    >
      © {new Date().getFullYear()} <span className="font-medium">FileDrop</span> — Built with <span role="img" aria-label="love">❤️</span> by web3ngineer
    </motion.footer>
  )
}

export default Footer
