import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useStore } from "@nanostores/react";
import { fetchBanks, createBank, updateBank, deleteBank } from "@/services/mortgageService";
import { $auth } from "@/stores/appStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, ChevronRight, Plus, Pencil, Trash, X } from "lucide-react";

export default function BanksPage() {
    const [banks, setBanks] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = useStore($auth);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [formData, setFormData] = useState({ name: "", bank_code: "", url: "" });

    const loadBanks = () => {
        fetchBanks()
            .then(setBanks)
            .catch(() => setError("Could not load banks. Is the backend running?"));
    };

    useEffect(() => { loadBanks(); }, []);

    const openCreateModal = () => {
        setEditingBank(null);
        setFormData({ name: "", bank_code: "", url: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (e, bank) => {
        e.stopPropagation();
        setEditingBank(bank);
        setFormData({ name: bank.name, bank_code: bank.bank_code, url: bank.url });
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!auth) return alert("Please sign in.");
        
        try {
            if (editingBank) {
                await updateBank(editingBank.id, formData, auth.apiKey);
                alert("✅ Bank updated successfully!");
            } else {
                await createBank(formData, auth.apiKey);
                alert("✅ Bank created successfully!");
            }
            setIsModalOpen(false);
            loadBanks();
        } catch (err) {
            alert(`⛔ Error: ${err.message}`);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!auth) return alert("Please sign in.");
        if (!confirm("Are you sure you want to delete this bank?")) return;

        try {
            await deleteBank(id, auth.apiKey);
            alert("✅ Bank deleted successfully!");
            loadBanks();
        } catch (err) {
            alert(`⛔ Error: ${err.message}`);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-12 animate-fade-in relative">
            {/* Header */}
            <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4" aria-labelledby="banks-title">
                <div>
                    <h1
                        id="banks-title"
                        className="mb-2 bg-gradient-to-br from-foreground to-primary bg-clip-text text-4xl font-bold text-transparent"
                    >
                        Banking Institutions
                    </h1>
                    <p className="text-muted-foreground">
                        Browse all registered banks and explore their mortgage products.
                    </p>
                </div>
                {auth && (
                    <Button onClick={openCreateModal} className="shrink-0 gap-1.5 cursor-pointer z-10">
                        <Plus size={16} /> Create Bank
                    </Button>
                )}
            </section>

            {error ? (
                <Card role="alert">
                    <CardContent className="p-12 text-center">
                        <div className="mb-3 text-4xl">⚠️</div>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            ) : banks === null ? (
                <div className="spinner" role="status" aria-label="Loading banks" />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {banks.map((bank, i) => (
                        <div
                            key={bank.id}
                            id={`bank-card-${bank.id}`}
                            onClick={() => navigate(`/banks/${bank.id}`)}
                            className={`group cursor-pointer text-left rounded-xl ring-1 ring-border bg-card hover:ring-primary/60 hover:bg-accent transition-all duration-200 animate-slide-up animate-delay-${Math.min(i * 100, 300)} focus:outline-none focus:ring-2 focus:ring-primary`}
                            aria-label={`View mortgages for ${bank.name}`}
                        >
                            <div className="p-5">
                                {/* Icon + name */}
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                        <Building2 size={20} />
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform"
                                    />
                                </div>

                                <h2 className="mb-1 font-semibold text-foreground">{bank.name}</h2>

                                <Badge variant="outline" className="mb-3 font-mono text-[10px]">
                                    {bank.bank_code}
                                </Badge>

                                {/* URL */}
                                <a
                                    href={bank.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors truncate mb-3"
                                    aria-label={`Visit ${bank.name} website`}
                                >
                                    <ExternalLink size={11} />
                                    <span className="truncate">{bank.url.replace(/^https?:\/\//, "")}</span>
                                </a>
                            </div>

                            <div className="flex items-center justify-between border-t border-border px-5 py-2.5 text-xs text-muted-foreground">
                                <span>View mortgages →</span>
                                
                                {auth && (
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={(e) => openEditModal(e, bank)}
                                            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                                            aria-label="Edit bank"
                                        >
                                            <Pencil size={12} /> Edit
                                        </div>
                                        <div
                                            onClick={(e) => handleDelete(e, bank.id)}
                                            className="flex items-center gap-1 text-destructive/80 hover:text-destructive transition-colors cursor-pointer"
                                            aria-label="Delete bank"
                                        >
                                            <Trash size={12} /> Delete
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card">
                        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                            <h2 className="font-semibold text-lg">
                                {editingBank ? "Edit Bank" : "Create New Bank"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Bank Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="e.g. CaixaBank"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Bank Code</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.bank_code}
                                    onChange={e => setFormData({...formData, bank_code: e.target.value})}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="e.g. CAIXA ES MM XXX"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Website URL</label>
                                <input
                                    required
                                    type="url"
                                    value={formData.url}
                                    onChange={e => setFormData({...formData, url: e.target.value})}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingBank ? "Save Changes" : "Create Bank"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
