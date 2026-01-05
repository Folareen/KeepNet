"use client";

import { useState } from "react";
import { updateUser } from "@/actions/updateUser";
import { MdSettings, MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    email: string;
    name: string;
    username?: string | null;
    displayUsername?: string | null;
    visibility?: boolean | null;
    [key: string]: any;
};

type EditAccountModalProps = {
    user: User;
};

export default function EditAccountModal({ user }: EditAccountModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username || "");
    const [visibility, setVisibility] = useState(user.visibility ?? true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!name.trim()) {
            setError("Name is required");
            setIsLoading(false);
            return;
        }

        if (!username.trim()) {
            setError("Username is required");
            setIsLoading(false);
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError("Username can only contain letters, numbers, and underscores");
            setIsLoading(false);
            return;
        }

        const result = await updateUser({
            name: name.trim(),
            username: username.trim().toLowerCase(),
            visibility
        });

        if (result.success) {
            setIsOpen(false);
            router.refresh();
        } else {
            setError(result.error || "Failed to update account");
        }

        setIsLoading(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setName(user.name);
        setUsername(user.username || "");
        setVisibility(user.visibility ?? true);
        setError("");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
                <MdSettings size={18} />
                <span className="hidden sm:inline text-sm font-medium">Settings</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Account Settings</h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-gray-800 text-gray-500 border border-gray-700 rounded-lg cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-600 mt-1.5">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="username"
                                    required
                                />
                                <p className="text-xs text-gray-600 mt-1.5">
                                    Only letters, numbers, and underscores
                                </p>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="visibility"
                                    checked={visibility}
                                    onChange={(e) => setVisibility(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="visibility" className="text-sm text-gray-300">
                                    Make my account public
                                </label>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
