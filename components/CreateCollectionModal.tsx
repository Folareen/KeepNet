"use client"

import { createCollection } from "@/actions/createCollection";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { MdAdd, MdClose } from "react-icons/md";

function SubmitButton({ onCancel }: { onCancel: () => void }) {
    const { pending } = useFormStatus();

    return (
        <div className="flex gap-3">
            <button
                type="submit"
                disabled={pending}
                className="flex-1 bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
            >
                {pending ? "Creating..." : "Create"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                disabled={pending}
                className="flex-1 bg-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
            >
                Cancel
            </button>
        </div>
    );
}

export default function CreateCollectionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [visibility, setVisibility] = useState("PUBLIC");

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm w-max'
            >
                <MdAdd size={20} />
                <span className="hidden sm:inline">New Collection</span>
                <span className="sm:hidden">New</span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">New Collection</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>
                        <form action={createCollection} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="My Collection"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                                    rows={3}
                                    placeholder="Optional description..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Visibility</label>
                                <select
                                    name="visibility"
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                    <option value="LOCKED">Locked</option>
                                </select>
                            </div>
                            {visibility === "LOCKED" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Enter password"
                                    />
                                </div>
                            )}
                            <SubmitButton onCancel={() => setIsOpen(false)} />
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
