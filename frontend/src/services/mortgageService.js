// ============================================================
// MORTGAGE API SERVICE
// All HTTP calls to the Spring Boot backend.
// The Vite proxy forwards /banks and /mortgages to :8080.
// ============================================================

const apiFetch = (url, apiKey, options = {}) => {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["ApiKey"] = apiKey;
    return fetch(url, { ...options, headers: { ...headers, ...options.headers } });
};

// ── Banks ──────────────────────────────────────────────────

export const fetchBanks = async () => {
    const res = await fetch("/banks", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load banks");
    return res.json();
};

export const fetchBank = async (id) => {
    const res = await fetch(`/banks/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bank not found");
    return res.json();
};

export const createBank = async (bankData, apiKey) => {
    const res = await apiFetch("/banks", apiKey, {
        method: "POST",
        body: JSON.stringify(bankData)
    });
    if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Failed to create bank");
    return res.json();
};

export const updateBank = async (id, bankData, apiKey) => {
    const res = await apiFetch(`/banks/${id}`, apiKey, {
        method: "PUT",
        body: JSON.stringify(bankData)
    });
    if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Failed to update bank");
    return res.json();
};

export const deleteBank = async (id, apiKey) => {
    const res = await apiFetch(`/banks/${id}`, apiKey, { method: "DELETE" });
    if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Failed to delete bank");
    return true;
};

// ── Mortgages ──────────────────────────────────────────────

export const fetchMortgages = async (bankId) => {
    const res = await fetch(`/banks/${bankId}/mortgages`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load mortgages");
    return res.json();
};

export const createMortgage = async (bankId, mortgageData, apiKey) => {
    const res = await apiFetch(`/banks/${bankId}/mortgages`, apiKey, {
        method: "POST",
        body: JSON.stringify(mortgageData)
    });
    if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Failed to create mortgage");
    return res.json();
};

export const updateMortgage = async (bankId, id, mortgageData, apiKey) => {
    const res = await apiFetch(`/banks/${bankId}/mortgages/${id}`, apiKey, {
        method: "PUT",
        body: JSON.stringify(mortgageData)
    });
    if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Failed to update mortgage");
    return res.json();
};

export const deleteMortgageApi = async (bankId, id, apiKey) => {
    const res = await apiFetch(`/banks/${bankId}/mortgages/${id}`, apiKey, { method: "DELETE" });
    if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Failed to delete mortgage");
    return true;
};

export const simulateMortgage = async (bankId, id, principal, years) => {
    const res = await fetch(`/banks/${bankId}/mortgages/${id}/simulate?principal=${principal}&years=${years}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to simulate");
    return res.json();
};

export const downloadPdfApi = async (bankId, id, principal, years, apiKey) => {
    const res = await apiFetch(
        `/banks/${bankId}/mortgages/${id}/simulate/pdf?principal=${principal}&years=${years}`,
        apiKey,
        { method: "GET" }
    );
    if (!res.ok) throw new Error(res.status === 403 ? "Forbidden" : "Failed to generate PDF");
    return res.blob();
};

// ── Favourites ─────────────────────────────────────────────

export const toggleFavoriteApi = async (bankId, mortgageId, apiKey) => {
    const res = await apiFetch(
        `/banks/${bankId}/mortgages/${mortgageId}/favorite`,
        apiKey,
        { method: "POST" }
    );
    if (res.status === 401) throw new Error("Authentication required.");
    if (!res.ok) throw new Error("Failed to toggle favourite.");
    return res.json(); // { mortgageId, favorited, totalFavorites }
};

// ── Ranking ────────────────────────────────────────────────

export const fetchRanking = async () => {
    const res = await fetch("/mortgages/ranking", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load ranking");
    return res.json();
};
