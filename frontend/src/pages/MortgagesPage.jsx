import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useStore } from "@nanostores/react";
import { fetchBank, fetchMortgages, fetchRanking, createMortgage, updateMortgage, deleteMortgageApi, simulateMortgage, downloadPdfApi } from "@/services/mortgageService";
import { $favorites, setFavorites, $auth } from "@/stores/appStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/FavoriteButton";
import { ArrowLeft, TrendingDown, Percent, FileText, Plus, Pencil, Trash, X, Calculator, Download } from "lucide-react";

export default function MortgagesPage() {
    const { bankId } = useParams();
    const navigate = useNavigate();
    const auth = useStore($auth);

    const [bank, setBank] = useState(null);
    const [mortgages, setMortgages] = useState(null);
    const [countMap, setCountMap] = useState({});
    const [error, setError] = useState(null);

    // Modal state for Create/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMortgage, setEditingMortgage] = useState(null);
    const [formData, setFormData] = useState({ name: "", type: "FIXED", description: "", TAE: "" });

    // Modal state for Simulation
    const [simModalOpen, setSimModalOpen] = useState(false);
    const [simMortgage, setSimMortgage] = useState(null);
    const [simPrincipal, setSimPrincipal] = useState(150000);
    const [simYears, setSimYears] = useState(25);
    const [simFee, setSimFee] = useState(null);

    const loadData = () => {
        Promise.all([
            fetchBank(bankId),
            fetchMortgages(bankId),
            fetchRanking().catch(() => []),
        ])
            .then(([bankData, mortgageData, ranking]) => {
                setBank(bankData);
                setMortgages(mortgageData);
                const map = {};
                ranking.forEach(m => { map[m.id] = m.favoriteCount; });
                setCountMap(map);
            })
            .catch(() => setError("Could not load mortgage data."));
    };

    useEffect(() => { loadData(); }, [bankId]);

    // Handle Simulation real-time updates
    useEffect(() => {
        if (simModalOpen && simMortgage) {
            simulateMortgage(bankId, simMortgage.id, simPrincipal, simYears)
                .then(fee => setSimFee(fee))
                .catch(err => setSimFee(0));
        }
    }, [simModalOpen, simMortgage, simPrincipal, simYears, bankId]);

    const openCreateModal = () => {
        setEditingMortgage(null);
        setFormData({ name: "", type: "FIXED", description: "", TAE: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (e, m) => {
        e.stopPropagation();
        setEditingMortgage(m);
        setFormData({ name: m.name, type: m.type, description: m.description, TAE: m.TAE.toString() });
        setIsModalOpen(true);
    };

    const openSimModal = (e, m) => {
        e.stopPropagation();
        setSimMortgage(m);
        setSimPrincipal(150000);
        setSimYears(25);
        setSimModalOpen(true);
    };

    const handleDownloadPdf = async () => {
        if (!auth) return alert("Please sign in to download the precontractual document.");
        try {
            const blob = await downloadPdfApi(bankId, simMortgage.id, simPrincipal, simYears, auth.apiKey);
            // Create a temporary link to download the blob
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cuadro_amortizacion_${simMortgage.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert(`⛔ Error: ${err.message}`);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!auth) return alert("Please sign in.");
        
        const payload = {
            name: formData.name,
            type: formData.type.toUpperCase(),
            description: formData.description,
            TAE: parseFloat(formData.TAE)
        };
        
        try {
            if (editingMortgage) {
                await updateMortgage(bankId, editingMortgage.id, payload, auth.apiKey);
                alert("✅ Mortgage updated successfully!");
            } else {
                await createMortgage(bankId, payload, auth.apiKey);
                alert("✅ Mortgage created successfully!");
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            alert(`⛔ Error: ${err.message}`);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!auth) return alert("Please sign in.");
        if (!confirm("Are you sure you want to delete this mortgage?")) return;

        try {
            await deleteMortgageApi(bankId, id, auth.apiKey);
            alert("✅ Mortgage deleted successfully!");
            loadData();
        } catch (err) {
            alert(`⛔ Error: ${err.message}`);
        }
    };

    const typeColor = (type) =>
        type === "FIXED"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : "bg-blue-500/15 text-blue-400 border-blue-500/30";

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-10 animate-fade-in relative">
            <Button
                id="btn-back-banks"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="mb-6"
            >
                <ArrowLeft size={15} />
                All Banks
            </Button>

            {bank && (
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="mb-1 text-3xl font-bold">{bank.name}</h1>
                        <p className="text-sm text-muted-foreground font-mono">{bank.bank_code}</p>
                    </div>
                    {auth && (
                        <Button onClick={openCreateModal} className="shrink-0 gap-1.5 cursor-pointer z-10">
                            <Plus size={16} /> Create Mortgage
                        </Button>
                    )}
                </div>
            )}

            {error ? (
                <Card role="alert">
                    <CardContent className="p-12 text-center">
                        <div className="mb-3 text-4xl">⚠️</div>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            ) : mortgages === null ? (
                <div className="spinner" role="status" aria-label="Loading mortgages" />
            ) : mortgages.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="mb-3 text-4xl">📭</div>
                        <p className="text-muted-foreground">No mortgages found for this bank.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <p className="mb-4 text-sm text-muted-foreground">
                        {mortgages.length} mortgage{mortgages.length !== 1 ? "s" : ""} available
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {mortgages.map((m, i) => (
                            <div
                                key={m.id}
                                id={`mortgage-card-${m.id}`}
                                className={`animate-slide-up animate-delay-${Math.min(i * 100, 300)} rounded-xl ring-1 ring-border bg-card p-5 flex flex-col gap-3 hover:ring-primary/40 transition-all`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="font-semibold leading-snug text-foreground">{m.name}</h2>
                                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeColor(m.type)}`}>
                                        {m.type}
                                    </span>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                                    <FileText size={12} className="mt-0.5 shrink-0" />
                                    {m.description}
                                </p>

                                <div className="flex items-center gap-1.5 text-primary font-bold text-xl">
                                    <Percent size={16} className="text-primary/70" />
                                    {parseFloat(m.TAE).toFixed(2)}
                                    <span className="text-xs font-normal text-muted-foreground ml-0.5">TAE</span>
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground font-mono">ID #{m.id}</span>
                                        {auth && (
                                            <>
                                                <button
                                                    onClick={(e) => openEditModal(e, m)}
                                                    className="text-[10px] uppercase font-bold tracking-wider text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Pencil size={10} /> Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, m.id)}
                                                    className="text-[10px] uppercase font-bold tracking-wider text-destructive hover:underline flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Trash size={10} /> Delete
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={(e) => openSimModal(e, m)}
                                            className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer ml-2 bg-emerald-500/10 px-2 py-1 rounded-sm"
                                        >
                                            <Calculator size={10} /> Simulate
                                        </button>
                                    </div>
                                    <FavoriteButton
                                        bankId={parseInt(bankId)}
                                        mortgageId={m.id}
                                        initialCount={countMap[m.id] ?? 0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* CREATE/EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card">
                        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                            <h2 className="font-semibold text-lg">
                                {editingMortgage ? "Edit Mortgage" : "Create New Mortgage"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Mortgage Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="e.g. Hipoteca Fija Bonificada"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                >
                                    <option value="FIXED">FIXED</option>
                                    <option value="VARIABLE">VARIABLE</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="Brief description of the conditions..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">TAE (%)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.TAE}
                                    onChange={e => setFormData({...formData, TAE: e.target.value})}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                    placeholder="e.g. 2.95"
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingMortgage ? "Save Changes" : "Create Mortgage"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* SIMULATOR MODAL */}
            {simModalOpen && simMortgage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg shadow-2xl border-border/50 bg-card overflow-hidden">
                        <div className="bg-primary/5 border-b border-border/50 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-xl text-foreground flex items-center gap-2">
                                    <Calculator className="text-primary" size={20} />
                                    Mortgage Simulator
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">{simMortgage.name}</p>
                            </div>
                            <button onClick={() => setSimModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 flex flex-col gap-6">
                            {/* Sliders */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium">Loan Amount (Principal)</label>
                                        <span className="text-sm font-bold text-primary">{simPrincipal.toLocaleString()} €</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="10000" max="1000000" step="5000" 
                                        value={simPrincipal} 
                                        onChange={(e) => setSimPrincipal(Number(e.target.value))}
                                        className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer" 
                                    />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium">Duration</label>
                                        <span className="text-sm font-bold text-primary">{simYears} Years</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="5" max="40" step="1" 
                                        value={simYears} 
                                        onChange={(e) => setSimYears(Number(e.target.value))}
                                        className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer" 
                                    />
                                </div>
                            </div>

                            {/* Result */}
                            <div className="bg-accent rounded-xl p-6 text-center border border-border mt-2">
                                <p className="text-sm text-muted-foreground font-medium mb-1">Estimated Monthly Payment</p>
                                <div className="text-4xl font-extrabold text-foreground">
                                    {simFee === null ? "..." : simFee.toFixed(2)} <span className="text-xl text-muted-foreground">€/mo</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Based on {simMortgage.TAE}% TAE
                                </p>
                            </div>
                            
                            {/* PDF Button */}
                            <button
                                onClick={handleDownloadPdf}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors mt-2 shadow-sm"
                            >
                                <Download size={16} />
                                Download Amortization Schedule (PDF)
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
