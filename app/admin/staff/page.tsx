"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Plus, Trash2, X,
    Mail, Clock, ToggleLeft, ToggleRight, Search, AlertCircle,
    Shield, Lock, Layers
} from "lucide-react";

interface StaffMember {
    id: string;
    email: string;
    display_name: string;
    role: "oracle" | "admin" | "staff";
    is_active: boolean;
    created_at: string;
    last_login?: string;
    permissions: string[];
}

const PERMISSION_OPTIONS = [
    { id: "products_view", label: "View Products", category: "Products" },
    { id: "products_edit", label: "Edit Products", category: "Products" },
    { id: "products_create", label: "Create Products", category: "Products" },
    { id: "products_delete", label: "Delete Products", category: "Products" },
    { id: "orders_view", label: "View Orders", category: "Orders" },
    { id: "orders_edit", label: "Update Order Status", category: "Orders" },
    { id: "customers_view", label: "View Customers", category: "Customers" },
    { id: "customers_edit", label: "Edit Customers", category: "Customers" },
    { id: "inventory_view", label: "View Inventory", category: "Inventory" },
    { id: "inventory_edit", label: "Update Stock", category: "Inventory" },
    { id: "analytics_view", label: "View Analytics", category: "Analytics" },
    { id: "content_edit", label: "Edit Content", category: "Content" },
    { id: "blog_edit", label: "Manage Blog", category: "Content" },
    { id: "discounts_manage", label: "Manage Discounts", category: "Marketing" },
    { id: "settings_view", label: "View Settings", category: "Settings" },
];

const ROLE_CONFIG = {
    oracle: {
        label: "Oracle",
        description: "Unrestricted system access. Full control over all features, code editor, and staff management.",
        gradient: "from-amber-50 to-orange-50",
        border: "border-amber-200/60",
        icon: Lock,
        iconColor: "text-amber-600",
        labelColor: "text-amber-800",
        descColor: "text-amber-700",
    },
    admin: {
        label: "Admin",
        description: "Full product, order, and customer management. Content editing. No code access.",
        gradient: "from-blue-50 to-indigo-50",
        border: "border-blue-200/60",
        icon: Shield,
        iconColor: "text-blue-600",
        labelColor: "text-blue-800",
        descColor: "text-blue-700",
    },
    staff: {
        label: "Staff",
        description: "View-only access with limited order fulfillment capabilities.",
        gradient: "from-slate-50 to-gray-50",
        border: "border-gray-200/60",
        icon: Layers,
        iconColor: "text-gray-600",
        labelColor: "text-gray-800",
        descColor: "text-gray-600",
    },
};

export default function StaffManagementPage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // New staff form
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState<"oracle" | "admin" | "staff">("staff");
    const [newPermissions, setNewPermissions] = useState<string[]>([]);
    const [addError, setAddError] = useState("");

    useEffect(() => {
        loadStaff();
    }, []);

    async function loadStaff() {
        const { data } = await supabase
            .from("admin_users")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setStaff(data.map((d: any) => ({
                id: d.id,
                email: d.email,
                display_name: d.display_name || d.email.split("@")[0],
                role: d.role,
                is_active: d.is_active !== false,
                created_at: d.created_at,
                last_login: d.last_login,
                permissions: d.permissions || [],
            })));
        }
        setLoading(false);
    }

    async function addStaffMember() {
        if (!newEmail || !newName) {
            setAddError("Email and name are required");
            return;
        }

        const exists = staff.find((s) => s.email === newEmail);
        if (exists) {
            setAddError("This email is already registered");
            return;
        }

        const defaultPermissions = newRole === "oracle" || newRole === "admin"
            ? PERMISSION_OPTIONS.map((p) => p.id)
            : ["products_view", "orders_view", "customers_view", "inventory_view"];

        const { error } = await supabase.from("admin_users").insert({
            email: newEmail,
            display_name: newName,
            role: newRole,
            is_active: true,
            permissions: newPermissions.length > 0 ? newPermissions : defaultPermissions,
            created_at: new Date().toISOString(),
        });

        if (error) {
            setAddError(error.message);
            return;
        }

        setShowAddModal(false);
        setNewEmail("");
        setNewName("");
        setNewRole("staff");
        setNewPermissions([]);
        setAddError("");
        loadStaff();
    }

    async function toggleActive(id: string, currentState: boolean) {
        await supabase.from("admin_users").update({ is_active: !currentState }).eq("id", id);
        setStaff((prev) => prev.map((s) => s.id === id ? { ...s, is_active: !currentState } : s));
    }

    async function removeStaff(id: string, email: string) {
        if (!confirm(`Remove this member? They will lose all admin access.`)) return;
        await supabase.from("admin_users").delete().eq("id", id);
        setStaff((prev) => prev.filter((s) => s.id !== id));
    }

    async function updateRole(id: string, role: "oracle" | "admin" | "staff") {
        await supabase.from("admin_users").update({ role }).eq("id", id);
        setStaff((prev) => prev.map((s) => s.id === id ? { ...s, role } : s));
    }

    const filteredStaff = staff.filter((s) =>
        !searchTerm ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage access levels, roles, and permissions</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-500/20"
                >
                    <Plus size={16} /> Add Staff Member
                </button>
            </div>

            {/* Access Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.keys(ROLE_CONFIG) as Array<keyof typeof ROLE_CONFIG>).map((key) => {
                    const config = ROLE_CONFIG[key];
                    const Icon = config.icon;
                    return (
                        <div key={key} className={`bg-gradient-to-br ${config.gradient} border ${config.border} rounded-2xl p-5`}>
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm`}>
                                    <Icon size={15} className={config.iconColor} />
                                </div>
                                <span className={`text-xs font-bold ${config.labelColor} uppercase tracking-wide`}>{config.label}</span>
                            </div>
                            <p className={`text-xs ${config.descColor} leading-relaxed`}>{config.description}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search staff members..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
                />
            </div>

            {/* Staff List */}
            <div className="space-y-3">
                {filteredStaff.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                            <Layers size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-600 font-semibold">No staff members yet</p>
                        <p className="text-gray-400 text-sm mt-1">Add your first team member to get started</p>
                    </div>
                ) : (
                    filteredStaff.map((member) => {
                        const roleConfig = ROLE_CONFIG[member.role] || ROLE_CONFIG.staff;
                        return (
                            <div key={member.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${member.is_active ? "border-gray-100" : "border-red-100 opacity-60"}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ${member.role === "oracle"
                                            ? "bg-gradient-to-br from-amber-500 to-orange-600"
                                            : member.role === "admin"
                                                ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                                                : "bg-gradient-to-br from-gray-400 to-slate-600"
                                            }`}>
                                            {member.display_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-gray-900 text-sm">{member.display_name}</p>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${member.role === "oracle"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : member.role === "admin"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {member.role}
                                                </span>
                                                {!member.is_active && (
                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg bg-red-100 text-red-600">Disabled</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                <Mail size={10} /> {member.email}
                                            </p>
                                            <p className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5">
                                                <Clock size={9} /> Added {new Date(member.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                        {/* Role Switcher */}
                                        <select
                                            value={member.role}
                                            onChange={(e) => updateRole(member.id, e.target.value as "oracle" | "admin" | "staff")}
                                            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 bg-white"
                                        >
                                            <option value="oracle">Oracle</option>
                                            <option value="admin">Admin</option>
                                            <option value="staff">Staff</option>
                                        </select>

                                        {/* Toggle Active */}
                                        <button
                                            onClick={() => toggleActive(member.id, member.is_active)}
                                            className={`p-2 rounded-lg transition-colors ${member.is_active ? "text-blue-600 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-100"}`}
                                            title={member.is_active ? "Disable access" : "Enable access"}
                                        >
                                            {member.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                        </button>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeStaff(member.id, member.email)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Permissions */}
                                {member.permissions && member.permissions.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-50">
                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Permissions</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {member.permissions.slice(0, 6).map((perm) => (
                                                <span key={perm} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md font-medium border border-gray-100">
                                                    {PERMISSION_OPTIONS.find((p) => p.id === perm)?.label || perm}
                                                </span>
                                            ))}
                                            {member.permissions.length > 6 && (
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">
                                                    +{member.permissions.length - 6} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
                            <button onClick={() => { setShowAddModal(false); setAddError(""); }} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {addError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                                <AlertCircle size={14} /> {addError}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block tracking-wide">Full Name</label>
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g., John Doe"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="staff@dreamworksdirect.com"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition-all"
                                />
                                <p className="text-[10px] text-gray-400 mt-1.5">This person must have an auth account with this email to log in.</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block tracking-wide">Access Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["oracle", "admin", "staff"] as const).map((r) => {
                                        const config = ROLE_CONFIG[r];
                                        const Icon = config.icon;
                                        return (
                                            <button
                                                key={r}
                                                onClick={() => setNewRole(r)}
                                                className={`p-3 rounded-xl border-2 text-left transition-all ${newRole === r ? "border-blue-500 bg-blue-50/50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <Icon size={15} className={newRole === r ? "text-blue-600" : "text-gray-400"} />
                                                <p className="text-xs font-bold mt-1.5 capitalize">{r}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block tracking-wide">Permissions</label>
                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-0.5">
                                    {PERMISSION_OPTIONS.map((perm) => (
                                        <label key={perm.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer hover:bg-gray-50 px-2.5 rounded-lg transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={newPermissions.includes(perm.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setNewPermissions([...newPermissions, perm.id]);
                                                    else setNewPermissions(newPermissions.filter((p) => p !== perm.id));
                                                }}
                                                className="accent-blue-600 w-3.5 h-3.5 rounded"
                                            />
                                            <span className="text-xs text-gray-700">{perm.label}</span>
                                            <span className="text-[9px] text-gray-400 ml-auto">{perm.category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={() => { setShowAddModal(false); setAddError(""); }}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addStaffMember}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-500/20"
                            >
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
