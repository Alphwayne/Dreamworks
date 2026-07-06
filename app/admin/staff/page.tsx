"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    UserCog, Plus, Shield, Crown, Trash2, Edit2, Check, X,
    Mail, Clock, ToggleLeft, ToggleRight, Search, AlertCircle
} from "lucide-react";

interface StaffMember {
    id: string;
    email: string;
    display_name: string;
    role: "admin" | "staff";
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

export default function StaffManagementPage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // New staff form
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState<"admin" | "staff">("staff");
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

        // Check if email already exists
        const exists = staff.find((s) => s.email === newEmail);
        if (exists) {
            setAddError("This email is already registered as staff");
            return;
        }

        const defaultPermissions = newRole === "admin"
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
        if (!confirm(`Remove ${email} from staff? They will lose all admin access.`)) return;
        await supabase.from("admin_users").delete().eq("id", id);
        setStaff((prev) => prev.filter((s) => s.id !== id));
    }

    async function updateRole(id: string, role: "admin" | "staff") {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Crown size={20} className="text-amber-500" /> Staff Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage admin access, roles, and permissions</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition-all"
                >
                    <Plus size={16} /> Add Staff Member
                </button>
            </div>

            {/* Access Tiers Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Crown size={16} className="text-amber-600" />
                        <span className="text-xs font-bold text-amber-800 uppercase">Oracle</span>
                    </div>
                    <p className="text-xs text-amber-700">Full system control, code editor, staff management. Only you (amosudnl896@gmail.com).</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-blue-800 uppercase">Admin</span>
                    </div>
                    <p className="text-xs text-blue-700">Full product, order, and customer management. Content editing. No code access.</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <UserCog size={16} className="text-gray-600" />
                        <span className="text-xs font-bold text-gray-800 uppercase">Staff</span>
                    </div>
                    <p className="text-xs text-gray-700">View-only access with limited order fulfillment capabilities.</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search staff members..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Staff List */}
            <div className="space-y-3">
                {filteredStaff.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <UserCog size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No staff members yet</p>
                        <p className="text-gray-400 text-sm mt-1">Add your first team member to get started</p>
                    </div>
                ) : (
                    filteredStaff.map((member) => (
                        <div key={member.id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${member.is_active ? "border-gray-100" : "border-red-100 bg-red-50/30"}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm ${member.role === "admin" ? "bg-gradient-to-br from-blue-500 to-blue-700" : "bg-gradient-to-br from-gray-400 to-gray-600"
                                        }`}>
                                        {member.display_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900 text-sm">{member.display_name}</p>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${member.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {member.role}
                                            </span>
                                            {!member.is_active && (
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-600">Disabled</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Mail size={10} /> {member.email}
                                        </p>
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Clock size={9} /> Added {new Date(member.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Role Switcher */}
                                    <select
                                        value={member.role}
                                        onChange={(e) => updateRole(member.id, e.target.value as "admin" | "staff")}
                                        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                    </select>

                                    {/* Toggle Active */}
                                    <button
                                        onClick={() => toggleActive(member.id, member.is_active)}
                                        className={`p-2 rounded-lg transition-colors ${member.is_active ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}
                                        title={member.is_active ? "Disable access" : "Enable access"}
                                    >
                                        {member.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    </button>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeStaff(member.id, member.email)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove staff member"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Permissions</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(member.permissions || []).slice(0, 6).map((perm) => (
                                        <span key={perm} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                            {PERMISSION_OPTIONS.find((p) => p.id === perm)?.label || perm}
                                        </span>
                                    ))}
                                    {(member.permissions || []).length > 6 && (
                                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-medium">
                                            +{member.permissions.length - 6} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add Staff Member</h2>
                            <button onClick={() => { setShowAddModal(false); setAddError(""); }} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {addError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                                <AlertCircle size={14} /> {addError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Full Name</label>
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g., John Doe"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Email Address</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="staff@dreamworksdirect.com"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">This person must have a Supabase auth account with this email to log in.</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setNewRole("admin")}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${newRole === "admin" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                                    >
                                        <Shield size={16} className={newRole === "admin" ? "text-blue-600" : "text-gray-400"} />
                                        <p className="text-sm font-bold mt-1">Admin</p>
                                        <p className="text-[10px] text-gray-500">Full management access</p>
                                    </button>
                                    <button
                                        onClick={() => setNewRole("staff")}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${newRole === "staff" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                                    >
                                        <UserCog size={16} className={newRole === "staff" ? "text-blue-600" : "text-gray-400"} />
                                        <p className="text-sm font-bold mt-1">Staff</p>
                                        <p className="text-[10px] text-gray-500">Limited view access</p>
                                    </button>
                                </div>
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Permissions</label>
                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-1">
                                    {PERMISSION_OPTIONS.map((perm) => (
                                        <label key={perm.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={newPermissions.includes(perm.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setNewPermissions([...newPermissions, perm.id]);
                                                    else setNewPermissions(newPermissions.filter((p) => p !== perm.id));
                                                }}
                                                className="accent-blue-600 w-3.5 h-3.5"
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
                                className="flex-1 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition-colors"
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
