"use client"

import { createCollection } from "@/actions/createCollection";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ onCancel }: { onCancel: () => void }) {
    const { pending } = useFormStatus();

    return (
        <>
            <button
                type="submit"
                disabled={pending}
                className="flex-1 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {pending ? "Creating..." : "Create"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                disabled={pending}
                className="flex-1 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
                Cancel
            </button>
        </>
    );
}

export default function CreateCollectionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [visibility, setVisibility] = useState("PUBLIC");

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='flex items-center space-x-1 bg-blue-800 px-2 py-1 rounded-md hover:bg-blue-700 cursor-pointer'
            >
                Create New Collection
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl">Create Collection</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <form action={createCollection}>
                            <div className="mb-4">
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full px-3 py-2 bg-gray-700 rounded"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Visibility</label>
                                <select
                                    name="visibility"
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 rounded"
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                    <option value="LOCKED">Locked</option>
                                </select>
                            </div>
                            {visibility === "LOCKED" && (
                                <div className="mb-4">
                                    <label className="block mb-2">Password (for locked collections)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full px-3 py-2 bg-gray-700 rounded"
                                    />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <SubmitButton onCancel={() => setIsOpen(false)} />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
