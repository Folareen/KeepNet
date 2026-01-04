"use client"

import { updateCollection } from "@/actions/updateCollection";
import { verifyCollectionPassword } from "@/actions/verifyCollectionPassword";
import { useMemo, useState } from "react";
import { MdCheck, MdClose, MdEdit } from "react-icons/md";
import CreateKeepModal from "./CreateKeepModal";
import KeepCard from "./KeepCard";
import PasswordModal from "./PasswordModal";

type CollectionContentWrapperProps = {
    collection: {
        id: string;
        title: string;
        description: string | null;
        visibility: string;
        keeps: Array<{
            id: string;
            title: string;
            description: string | null;
            type: string;
        }>;
    };
    username: string;
    isOwner: boolean;
}

export default function CollectionContentWrapper({ collection, username, isOwner }: CollectionContentWrapperProps) {
    const [isUnlocked, setIsUnlocked] = useState(collection.visibility !== 'LOCKED' || isOwner);
    const [error, setError] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(collection.title);
    const [editDescription, setEditDescription] = useState(collection.description || '');
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredKeeps = useMemo(() => {
        if (!searchQuery.trim()) {
            return collection.keeps;
        }

        return collection.keeps.filter(keep =>
            keep.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [collection.keeps, searchQuery]);

    const handlePasswordSubmit = async (password: string) => {
        const isValid = await verifyCollectionPassword(collection.id, password);

        if (isValid) {
            setIsUnlocked(true);
            setError('');
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCollection(
                collection.id,
                { title: editTitle, description: editDescription },
                username
            );
            setIsEditingTitle(false);
        } catch (error) {
            console.error('Failed to update collection:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(collection.title);
        setEditDescription(collection.description || '');
        setIsEditingTitle(false);
    };

    if (!isUnlocked) {
        return (
            <PasswordModal
                title="This collection is locked"
                description="Enter the password to view this collection"
                onSubmit={handlePasswordSubmit}
                error={error}
            />
        );
    }

    return (
        <>
            {isEditingTitle ? (
                <div className='space-y-3'>
                    <input
                        type='text'
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className='text-3xl font-bold bg-gray-800 w-full px-3 py-2 rounded'
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder='Add description...'
                        className='text-gray-400 bg-gray-800 w-full px-3 py-2 rounded resize-none'
                        rows={2}
                    />
                    <div className='flex gap-2'>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className='flex items-center gap-1 bg-green-600 px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50'
                        >
                            <MdCheck /> {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className='flex items-center gap-1 bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50'
                        >
                            <MdClose /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex items-center gap-3'>
                    <div>
                        <h1 className='text-3xl font-bold'>{collection.title}</h1>
                        {collection.description && (
                            <p className='text-gray-400 mt-2'>{collection.description}</p>
                        )}
                    </div>
                    {isOwner && (
                        <button
                            onClick={() => setIsEditingTitle(true)}
                            className='text-gray-400 hover:text-white'
                        >
                            <MdEdit size={20} />
                        </button>
                    )}
                </div>
            )}

            <div className='flex justify-between items-center'>
                <h2 className='text-2xl'>Keeps</h2>
                {isOwner && <CreateKeepModal collectionId={collection.id} />}
            </div>

            {collection.keeps.length > 0 && (
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keeps by title..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
            )}

            {collection.keeps.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                    No keeps yet. {isOwner && "Create your first keep!"}
                </div>
            ) : filteredKeeps.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                    No keeps found matching "{searchQuery}"
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredKeeps.map((keep) => (
                        <KeepCard
                            key={keep.id}
                            keep={keep}
                            username={username}
                            collectionId={collection.id}
                            isOwner={isOwner}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
