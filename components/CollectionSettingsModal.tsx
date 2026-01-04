"use client";

import { useState } from "react";
import { updateCollection } from "@/actions/updateCollection";
import { MdSettings, MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

type CollectionSettingsModalProps = {
    collection: {
        id: string;
        title: string;
        description: string | null;
        visibility: string;
    };
    username: string;
};

export default function CollectionSettingsModal({ collection, username }: CollectionSettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(collection.title);
    const [description, setDescription] = useState(collection.description || '');
    const [visibility, setVisibility] = useState(collection.visibility);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            setIsLoading(false);
            return;
        }

        if (visibility === 'LOCKED' && !password.trim()) {
            setError("Password is required for locked collections");
            setIsLoading(false);
            return;
        }

        try {
            await updateCollection(
                collection.id,
                {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    visibility: visibility as 'PUBLIC' | 'PRIVATE' | 'LOCKED',
                    ...(visibility === 'LOCKED' && password.trim() && { password: password.trim() })
                },
                username
            );
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error('Failed to update collection:', error);
            setError("Failed to update collection");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTitle(collection.title);
        setDescription(collection.description || '');
        setVisibility(collection.visibility);
        setPassword('');
        setError("");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title="Collection Settings"
            >
                <MdSettings size={20} />
                Settings
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Collection Settings</h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Collection title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Collection description"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Visibility <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="PUBLIC">Public - Anyone can view</option>
                                    <option value="PRIVATE">Private - Only you can view</option>
                                    <option value="LOCKED">Locked - Requires password</option>
                                </select>
                            </div>

                            {visibility === 'LOCKED' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter password to lock collection"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Leave blank to keep existing password
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 bg-red-900/50 border border-red-500 rounded-md">
                                    <p className="text-red-200 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
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
