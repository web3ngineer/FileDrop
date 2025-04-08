import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LogIn,
  LogOut,
  Moon,
  Sun,
  UserPlus,
  Upload,
  Sparkles,
  Menu,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed w-full flex justify-center items-center border-b bg-background text-foreground z-50">
      <div className="container px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-primary hover:opacity-90 transition"
        >
          FileDrop
        </Link>
        <div className="flex gap-3">
          {/* Theme Toggle (Always Visible) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Theme</TooltipContent>
          </Tooltip>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3 text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="#features">
                  <Button variant="ghost" className="gap-1">
                    <Sparkles className="w-4 h-4" />
                    Features
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>See what’s included</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="dashboard/files">
                  <Button variant="ghost" className="gap-1">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Upload your files</TooltipContent>
            </Tooltip>

            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="gap-1">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button size="sm" className="gap-1">
                    <UserPlus className="w-4 h-4" />
                    Signup
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer w-8 h-8">
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="font-semibold">
                    {user?.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className=" p-4 w-64">
                <div className="flex flex-col gap-4 mt-4">
                  <Link to="#features">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-1"
                    >
                      <Sparkles className="w-4 h-4" />
                      Features
                    </Button>
                  </Link>
                  <Link to="#upload">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-1"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  </Link>
                  {!isAuthenticated ? (
                    <>
                      <Link to="/login">
                        <Button variant="outline" className="w-full gap-1">
                          <LogIn className="w-4 h-4" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="w-full gap-1">
                          <UserPlus className="w-4 h-4" />
                          Signup
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-2 py-1 font-semibold">
                        {user?.username}
                      </div>
                      <Button
                        onClick={logout}
                        variant="destructive"
                        className="w-full gap-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
