"use client";

import { useState } from "react";
import { updateKeep } from "@/actions/updateKeep";
import { MdSettings, MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";

type KeepSettingsModalProps = {
    keep: {
        id: string;
        title: string;
        description: string | null;
        visibility: string;
        type: string;
    };
    username: string;
    collectionId: string;
};

export default function KeepSettingsModal({ keep, username, collectionId }: KeepSettingsModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(keep.title);
    const [description, setDescription] = useState(keep.description || '');
    const [visibility, setVisibility] = useState(keep.visibility);
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
            setError("Password is required for locked keeps");
            setIsLoading(false);
            return;
        }

        try {
            await updateKeep(
                keep.id,
                {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    visibility: visibility as 'PUBLIC' | 'PRIVATE' | 'LOCKED',
                    ...(visibility === 'LOCKED' && password.trim() && { password: password.trim() })
                },
                username,
                collectionId
            );
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error('Failed to update keep:', error);
            setError("Failed to update keep");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTitle(keep.title);
        setDescription(keep.description || '');
        setVisibility(keep.visibility);
        setPassword('');
        setError("");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title="Keep Settings"
            >
                <MdSettings size={20} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Keep Settings</h2>
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
                                    placeholder="Keep title"
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
                                    placeholder="Keep description"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    value={keep.type.toLowerCase().replace('_', ' ')}
                                    disabled
                                    className="w-full px-3 py-2 bg-gray-600 text-gray-400 rounded-md cursor-not-allowed capitalize"
                                />
                                <p className="text-xs text-gray-500 mt-1">Type cannot be changed</p>
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
                                        placeholder="Enter password to lock keep"
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
