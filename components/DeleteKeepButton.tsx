"use client"

import { useState } from "react";
import { deleteKeep } from "@/actions/deleteKeep";

type DeleteKeepButtonProps = {
    keepId: string;
    username: string;
    collectionId?: string;
};

export default function DeleteKeepButton({ keepId, username, collectionId }: DeleteKeepButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteKeep(keepId, username, collectionId);
        } catch (error) {
            console.error(error);
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className='bg-red-600 px-4 py-2 rounded hover:bg-red-700'
            >
                Delete
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
                        <h2 className="text-2xl mb-4">Delete Keep</h2>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this keep? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
