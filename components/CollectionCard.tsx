"use client"

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { deleteCollection } from "@/actions/deleteCollection";
import { MdFolder, MdMoreVert, MdVisibility, MdEdit, MdDelete, MdShare, MdLock } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

type CollectionCardProps = {
    collection: {
        id: string;
        title: string;
        description: string | null;
        visibility?: string | boolean;
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
    const router = useRouter();

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
        router.push(`/${username}/${collection.id}`);
    };

    const handleEdit = () => {
        setShowMenu(false);
        router.push(`/${username}/${collection.id}`);
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
        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${username}/${collection.id}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        setShowMenu(false);
    };

    const isLocked = collection.visibility === 'LOCKED' || collection.visibility === true;

    return (
        <>
            <div className='relative group'>
                <Link
                    href={`/${username}/${collection.id}`}
                    className='block p-6 bg-gray-900/40 hover:bg-gray-800/60 border border-gray-800 hover:border-gray-700 rounded-xl transition-all'
                >
                    <div className='flex items-start gap-4'>
                        <div className='shrink-0 w-14 h-14 bg-blue-600/20 rounded-lg flex items-center justify-center'>
                            <MdFolder className='text-blue-500' size={28} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                                <h3 className='text-lg font-semibold text-gray-100 truncate'>{collection.title}</h3>
                                {isLocked && <MdLock className='text-yellow-500 shrink-0' size={16} />}
                            </div>
                            {collection.description && (
                                <p className='text-sm text-gray-400 line-clamp-2 mb-3'>{collection.description}</p>
                            )}
                            {collection._count !== undefined && (
                                <p className='text-xs text-gray-500'>
                                    {collection._count.keeps} {collection._count.keeps === 1 ? 'keep' : 'keeps'}
                                </p>
                            )}
                        </div>
                    </div>
                </Link>

                {isOwner && (
                    <div className='absolute top-3 right-3' ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowMenu(!showMenu);
                            }}
                            className='p-2 rounded-lg hover:bg-gray-700 transition opacity-0 group-hover:opacity-100'
                        >
                            <MdMoreVert className='text-gray-400' size={20} />
                        </button>

                        {showMenu && (
                            <div className='absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden'>
                                <button
                                    onClick={handleView}
                                    className='w-full text-left px-4 py-3 hover:bg-gray-800 transition flex items-center gap-3 text-sm'
                                >
                                    <MdVisibility size={18} className='text-gray-400' />
                                    View
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className='w-full text-left px-4 py-3 hover:bg-gray-800 transition flex items-center gap-3 text-sm'
                                >
                                    <MdEdit size={18} className='text-gray-400' />
                                    Edit
                                </button>
                                <button
                                    onClick={handleShare}
                                    className='w-full text-left px-4 py-3 hover:bg-gray-800 transition flex items-center gap-3 text-sm'
                                >
                                    <MdShare size={18} className='text-gray-400' />
                                    Share
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className='w-full text-left px-4 py-3 hover:bg-gray-800 transition flex items-center gap-3 text-sm text-red-400'
                                >
                                    <MdDelete size={18} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showDeleteConfirm && (
                <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
                    <div className='bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800'>
                        <h3 className='text-xl font-bold mb-3'>Delete Collection</h3>
                        <p className='text-gray-400 mb-6 text-sm'>
                            Are you sure you want to delete "{collection.title}"? This will also delete all keeps in this collection. This action cannot be undone.
                        </p>
                        <div className='flex gap-3'>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className='flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50 font-medium text-sm'
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className='flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50 font-medium text-sm'
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
