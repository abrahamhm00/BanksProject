// ===============================================
// RANKING PAGE — all mortgages sorted by ❤️ count
// ===============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useStore } from "@nanostores/react";
import { fetchRanking } from "@/services/mortgageService";
import { $auth, $favorites } from "@/stores/appStore";
import { Card, CardContent } from "@/components/ui/card";
import FavoriteButton from "@/components/FavoriteButton";
import { Trophy, Medal, Percent, TrendingDown } from "lucide-react";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function RankingPage() {
    const auth = useStore($auth);
    const navigate = useNavigate();
    const [ranking, setRanking] = useState(null);
    const [error, setError] = useState(null);

    const loadRanking = () => {
        setRanking(null);
        fetchRanking()
            .then(setRanking)
            .catch(() => setError("Could not load ranking."));
    };

    useEffect(() => { loadRanking(); }, []);

    const typeColor = (type) =>
        type === "FIXED"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : "bg-blue-500/15 text-blue-400 border-blue-500/30";

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-12 animate-fade-in">
            {/* Header */}
            <section className="mb-8 text-center" aria-labelledby="ranking-title">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400/20 to-primary/20 text-3xl">
                    🏆
                </div>
                <h1
                    id="ranking-title"
                    className="mb-2 bg-gradient-to-br from-yellow-300 to-primary bg-clip-text text-4xl font-bold text-transparent"
                >
                    Mortgage Ranking
                </h1>
                <p className="text-muted-foreground">
                    All mortgages ranked by number of favourites. Refreshed live.
                </p>
            </section>

            {error ? (
                <Card role="alert">
                    <CardContent className="p-12 text-center">
                        <div className="mb-3 text-4xl">⚠️</div>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            ) : ranking === null ? (
                <div className="spinner" role="status" aria-label="Loading ranking" />
            ) : (
                <div className="space-y-3">
                    {ranking.map((m, i) => (
                        <div
                            key={m.id}
                            id={`ranking-row-${m.id}`}
                            className={`flex items-center gap-4 rounded-xl ring-1 bg-card p-4 transition-all animate-slide-up animate-delay-${Math.min(i * 100, 300)} ${i < 3 ? "ring-yellow-400/30 hover:ring-yellow-400/50" : "ring-border hover:ring-primary/30"}`}
                        >
                            {/* Rank position */}
                            <div className="flex w-8 shrink-0 items-center justify-center text-xl font-bold">
                                {i < 3 ? (
                                    <span aria-label={`Rank ${i + 1}`}>{MEDAL[i]}</span>
                                ) : (
                                    <span className="text-sm text-muted-foreground font-mono">#{i + 1}</span>
                                )}
                            </div>

                            {/* Mortgage info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h2 className="font-semibold text-sm truncate">{m.name}</h2>
                                    <span className={`shrink-0 rounded-full border px-2 py-0 text-[10px] font-semibold uppercase ${typeColor(m.type)}`}>
                                        {m.type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <button
                                        onClick={() => navigate(`/banks/${m.bankId}`)}
                                        className="hover:text-primary transition-colors"
                                        aria-label={`View bank ${m.bankId}`}
                                    >
                                        Bank #{m.bankId} →
                                    </button>
                                    <span className="flex items-center gap-0.5 text-primary font-semibold">
                                        <Percent size={11} />
                                        {parseFloat(m.TAE).toFixed(2)} TAE
                                    </span>
                                </div>
                            </div>

                            {/* Favourite count + toggle */}
                            <div className="shrink-0">
                                <FavoriteButton
                                    bankId={m.bankId}
                                    mortgageId={m.id}
                                    initialCount={m.favoriteCount}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Refresh note */}
            {ranking && (
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Toggle a ❤️ and{" "}
                    <button
                        id="btn-refresh-ranking"
                        onClick={loadRanking}
                        className="text-primary hover:underline"
                    >
                        refresh the ranking
                    </button>{" "}
                    to see the updated order.
                </p>
            )}
        </div>
    );
}
