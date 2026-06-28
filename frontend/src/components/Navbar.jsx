// ===============================================
// NAVBAR — sticky top bar with logo + nav links
// ===============================================

import { NavLink } from "react-router";
import { useStore } from "@nanostores/react";
import { $auth, logout } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Building2, Trophy, LogOut, User } from "lucide-react";

export default function Navbar() {
    const auth = useStore($auth);

    return (
        <nav
            className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2.5 font-heading text-xl font-bold text-foreground"
                    aria-label="Home"
                >
                    <div
                        className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground text-base"
                        aria-hidden="true"
                    >
                        🏦
                    </div>
                    MortgageHub
                </NavLink>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        id="nav-banks"
                        className={({ isActive }) =>
                            `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isActive
                                ? "bg-primary/15 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                        }
                    >
                        <Building2 size={15} />
                        Banks
                    </NavLink>

                    <NavLink
                        to="/ranking"
                        id="nav-ranking"
                        className={({ isActive }) =>
                            `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isActive
                                ? "bg-primary/15 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                        }
                    >
                        <Trophy size={15} />
                        Ranking
                    </NavLink>
                </div>

                {/* User info / logout */}
                {auth ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
                            <User size={13} />
                            <span className="font-medium text-foreground">{auth.username}</span>
                        </div>
                        <Button
                            id="btn-logout"
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            aria-label="Sign out"
                        >
                            <LogOut size={15} />
                        </Button>
                    </div>
                ) : (
                    <NavLink to="/login">
                        <Button id="btn-login-nav" size="sm">Sign in</Button>
                    </NavLink>
                )}
            </div>
        </nav>
    );
}
