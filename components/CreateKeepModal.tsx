"use client"

import { createKeep } from "@/actions/createKeep";
import { useState } from "react";
import { useFormStatus } from "react-dom";

type CreateKeepModalProps = {
    collectionId?: string;
};

function SubmitButton({ onCancel }: { onCancel: () => void }) {
    const { pending } = useFormStatus();

    return (
        <>
            <button
                type="submit"
                disabled={pending}
                className="flex-1 bg-green-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors text-sm"
            >
                {pending ? "Creating..." : "Create"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                disabled={pending}
                className="flex-1 bg-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors text-sm"
            >
                Cancel
            </button>
        </>
    );
}

export default function CreateKeepModal({ collectionId }: CreateKeepModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [keepType, setKeepType] = useState<string>("TEXT");
    const [visibility, setVisibility] = useState("PUBLIC");

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='flex items-center gap-1 sm:gap-2 bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
            >
                <span className='text-sm sm:text-base'>+</span>
                <span className='hidden xs:inline'>New Keep</span>
                <span className='xs:hidden'>New</span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold">Create Keep</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <form action={async (formData: FormData) => {
                            if (collectionId) {
                                formData.append("collectionId", collectionId);
                                await createKeep(formData);
                            } else {
                                throw new Error("A keep must be created inside a collection");
                            }
                        }}>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1.5 sm:mb-2 text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                />
                            </div>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1.5 sm:mb-2 text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1.5 sm:mb-2 text-sm font-medium">Type</label>
                                <select
                                    name="type"
                                    value={keepType}
                                    onChange={(e) => setKeepType(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                >
                                    <option value="TEXT">Text</option>
                                    <option value="RICH_TEXT">Rich Text</option>
                                    <option value="IMAGE">Image</option>
                                    <option value="VIDEO">Video</option>
                                    <option value="FILE">File</option>
                                </select>
                            </div>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1.5 sm:mb-2 text-sm font-medium">Visibility</label>
                                <select
                                    name="visibility"
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                    <option value="LOCKED">Locked</option>
                                </select>
                            </div>
                            {visibility === "LOCKED" && (
                                <div className="mb-3 sm:mb-4">
                                    <label className="block mb-1.5 sm:mb-2 text-sm font-medium">Password (for locked keeps)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
                                    />
                                </div>
                            )}
                            <div className="flex gap-2 sm:gap-3">
                                <SubmitButton onCancel={() => setIsOpen(false)} />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
