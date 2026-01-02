"use client"

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { deleteCollection } from "@/actions/deleteCollection";

type CollectionCardProps = {
    collection: {
        id: string;
        title: string;
        description: string | null;
        _count?: {
            keeps: number;
        };
    };
    username: string;
    isOwner: boolean;
}

export default function CollectionCard({ collection, username, isOwner }: CollectionCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleView = () => {
        window.location.href = `/${username}/${collection.id}`;
    };

    const handleEdit = () => {
        setShowMenu(false);
        window.location.href = `/${username}/${collection.id}`;
    };

    const handleDelete = () => {
        setShowMenu(false);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCollection(collection.id, username);
        } catch (error) {
            console.error('Failed to delete collection:', error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/${username}/${collection.id}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        setShowMenu(false);
    };

    return (
        <>
            <div className='relative p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition group'>
                <Link href={`/${username}/${collection.id}`} className='block'>
                    <h2 className='text-2xl font-bold'>{collection.title}</h2>
                    {collection.description && (
                        <p className='text-gray-400 mt-2 line-clamp-2'>{collection.description}</p>
                    )}
                    {collection._count && (
                        <p className='text-sm text-gray-500 mt-3'>
                            {collection._count.keeps} {collection._count.keeps === 1 ? 'keep' : 'keeps'}
                        </p>
                    )}
                </Link>

                {isOwner && (
                    <div className='absolute top-4 right-4' ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowMenu(!showMenu);
                            }}
                            className='p-2 rounded-full hover:bg-gray-600 transition opacity-0 group-hover:opacity-100'
                        >
                            <svg className='w-5 h-5 text-gray-300' fill='currentColor' viewBox='0 0 16 16'>
                                <circle cx='8' cy='3' r='1.5' />
                                <circle cx='8' cy='8' r='1.5' />
                                <circle cx='8' cy='13' r='1.5' />
                            </svg>
                        </button>

                        {showMenu && (
                            <div className='absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10'>
                                <button
                                    onClick={handleView}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center gap-2 rounded-t-lg'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                    </svg>
                                    View
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center gap-2'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center gap-2 text-red-400'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                    </svg>
                                    Delete
                                </button>
                                <button
                                    onClick={handleShare}
                                    className='w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center gap-2 rounded-b-lg'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' />
                                    </svg>
                                    Share
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showDeleteConfirm && (
                <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
                    <div className='bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4'>
                        <h3 className='text-xl font-bold mb-4'>Delete Collection</h3>
                        <p className='text-gray-400 mb-6'>
                            Are you sure you want to delete "{collection.title}"? This will also delete all keeps in this collection. This action cannot be undone.
                        </p>
                        <div className='flex gap-3'>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className='flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-50'
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className='flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition disabled:opacity-50'
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
