// ===============================================
// LOGIN PAGE
// ===============================================

import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KeyRound, User } from "lucide-react";

// Demo credentials shown in the UI for easy testing
const DEMO_USERS = [
    { username: "alice", apiKey: "key-alice-1234" },
    { username: "bob",   apiKey: "key-bob-5678" },
    { username: "carol", apiKey: "key-carol-9012" },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!username.trim() || !apiKey.trim()) {
            setError("Username and API Key are required.");
            return;
        }
        login(username.trim(), apiKey.trim());
        navigate("/");
    };

    const loginAs = (user) => {
        login(user.username, user.apiKey);
        navigate("/");
    };

    return (
        <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 py-16 animate-fade-in">
            {/* Hero */}
            <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-3xl shadow-lg shadow-primary/30">
                    🏦
                </div>
                <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome to MortgageHub</h1>
                <p className="text-muted-foreground">Sign in with your API key to manage and favourite mortgages.</p>
            </div>

            <div className="w-full max-w-md space-y-4">
                {/* Manual login form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your username and API key</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="login-form" onSubmit={handleLogin} className="space-y-3">
                            {error && (
                                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Username
                                </label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="input-username"
                                        placeholder="alice"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    API Key
                                </label>
                                <div className="relative">
                                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="input-apikey"
                                        placeholder="key-alice-1234"
                                        value={apiKey}
                                        onChange={e => setApiKey(e.target.value)}
                                        className="pl-9 font-mono text-xs"
                                    />
                                </div>
                            </div>
                            <Button id="btn-login-submit" type="submit" className="w-full mt-2">
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Quick login shortcuts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Demo Accounts</CardTitle>
                        <CardDescription>Click to sign in instantly for the demo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {DEMO_USERS.map(user => (
                                <button
                                    key={user.username}
                                    id={`btn-demo-${user.username}`}
                                    onClick={() => loginAs(user)}
                                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm hover:bg-muted transition-colors text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary uppercase">
                                            {user.username[0]}
                                        </div>
                                        <span className="font-medium">{user.username}</span>
                                    </div>
                                    <span className="font-mono text-xs text-muted-foreground">{user.apiKey}</span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
