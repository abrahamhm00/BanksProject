// ===============================================
// FAVOURITE BUTTON — heart toggle with animation
// ===============================================

import { useState } from "react";
import { useStore } from "@nanostores/react";
import { Heart } from "lucide-react";
import { $auth, $favorites, toggleFavoriteLocal } from "@/stores/appStore";
import { toggleFavoriteApi } from "@/services/mortgageService";
import { cn } from "@/lib/utils";

/**
 * @param {number} bankId
 * @param {number} mortgageId
 * @param {number} initialCount  - total favourite count from server
 */
export default function FavoriteButton({ bankId, mortgageId, initialCount }) {
    const auth = useStore($auth);
    const favorites = useStore($favorites);
    const isFav = favorites.has(mortgageId);

    const [count, setCount] = useState(initialCount ?? 0);
    const [loading, setLoading] = useState(false);
    const [pop, setPop] = useState(false);

    const handleToggle = async (e) => {
        e.stopPropagation();
        if (!auth) {
            alert("Please sign in to favourite a mortgage.");
            return;
        }
        setLoading(true);
        try {
            const result = await toggleFavoriteApi(bankId, mortgageId, auth.apiKey);
            toggleFavoriteLocal(mortgageId, result.favorited);
            setCount(result.totalFavorites);
            setPop(true);
            setTimeout(() => setPop(false), 400);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            id={`btn-fav-${mortgageId}`}
            onClick={handleToggle}
            disabled={loading}
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={isFav}
            className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                "border border-border hover:bg-muted",
                loading && "opacity-50 pointer-events-none"
            )}
        >
            <Heart
                size={14}
                className={cn(
                    "transition-colors",
                    pop && "heart-pop",
                    isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
            />
            <span className={cn(isFav ? "text-red-400" : "text-muted-foreground")}>
                {count}
            </span>
        </button>
    );
}
