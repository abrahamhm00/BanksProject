import { Routes, Route, Navigate } from "react-router";
import { useStore } from "@nanostores/react";
import { $auth } from "@/stores/appStore";
import Navbar from "@/components/Navbar";
import LoginPage from "@/pages/LoginPage";
import BanksPage from "@/pages/BanksPage";
import MortgagesPage from "@/pages/MortgagesPage";
import RankingPage from "@/pages/RankingPage";

// Guard: redirects unauthenticated users to /login
function RequireAuth({ children }) {
    const auth = useStore($auth);
    return auth ? children : <Navigate to="/login" replace />;
}

function RootLayout({ children }) {
    return (
        <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
                MortgageHub · UPC School · Spring Boot 3 + React 19
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <RootLayout>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/ranking" element={<RankingPage />} />

                {/* Semi-public: banks and mortgages visible to all, but favourite requires auth (handled inside component) */}
                <Route path="/" element={<BanksPage />} />
                <Route path="/banks/:bankId" element={<MortgagesPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </RootLayout>
    );
}
