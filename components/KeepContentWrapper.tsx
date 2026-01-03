"use client"

import { useState } from "react";
import PasswordModal from "./PasswordModal";
import ContentContainer from "./ContentContainer";
import DeleteKeepButton from "./DeleteKeepButton";
import { verifyKeepPassword } from "@/actions/verifyKeepPassword";
import { updateKeep } from "@/actions/updateKeep";
import { MdEdit, MdCheck, MdClose } from "react-icons/md";

type KeepContentWrapperProps = {
    keep: {
        id: string;
        title: string;
        description: string | null;
        type: string;
        content: string | null;
        visibility: string;
        createdAt: Date;
        updatedAt: Date;
    };
    username: string;
    collectionId: string;
    isOwner: boolean;
}

export default function KeepContentWrapper({ keep, username, collectionId, isOwner }: KeepContentWrapperProps) {
    const [isUnlocked, setIsUnlocked] = useState(keep.visibility !== 'LOCKED' || isOwner);
    const [error, setError] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState(keep.title);
    const [editDescription, setEditDescription] = useState(keep.description || '');
    const [isSaving, setIsSaving] = useState(false);

    const handlePasswordSubmit = async (password: string) => {
        const isValid = await verifyKeepPassword(keep.id, password);

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
            await updateKeep(
                keep.id,
                { title: editTitle, description: editDescription },
                username,
                collectionId
            );
            setIsEditingTitle(false);
        } catch (error) {
            console.error('Failed to update keep:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(keep.title);
        setEditDescription(keep.description || '');
        setIsEditingTitle(false);
    };

    if (!isUnlocked) {
        return (
            <PasswordModal
                title="This keep is locked"
                description="Enter the password to view this content"
                onSubmit={handlePasswordSubmit}
                error={error}
            />
        );
    }

    return (
        <>
            <div className='shrink-0 pb-4 border-b border-gray-700'>
                <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                        {isEditingTitle ? (
                            <div className='space-y-3'>
                                <input
                                    type='text'
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className='text-4xl font-bold bg-gray-800 w-full px-3 py-2 rounded'
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
                            <>
                                <div className='flex items-center gap-3'>
                                    <h1 className='text-4xl font-bold'>{keep.title}</h1>
                                    {isOwner && (
                                        <button
                                            onClick={() => setIsEditingTitle(true)}
                                            className='text-gray-400 hover:text-white'
                                        >
                                            <MdEdit size={20} />
                                        </button>
                                    )}
                                </div>
                                {keep.description && (
                                    <p className='text-gray-400 mt-2'>{keep.description}</p>
                                )}
                            </>
                        )}
                        <div className='flex gap-2 mt-3'>
                            <span className='text-xs bg-gray-800 px-3 py-1 rounded-full capitalize'>
                                {keep.type.toLowerCase().replace('_', ' ')}
                            </span>
                            <span className='text-xs bg-gray-800 px-3 py-1 rounded-full capitalize'>
                                {keep.visibility.toLowerCase()}
                            </span>
                        </div>
                    </div>
                    {isOwner && !isEditingTitle && (
                        <div className='flex gap-2'>
                            <DeleteKeepButton keepId={keep.id} username={username} collectionId={collectionId} />
                        </div>
                    )}
                </div>
            </div>

            <div className='flex-1 overflow-y-auto py-6'>
                <ContentContainer
                    keepType={keep.type}
                    content={keep.content}
                    title={keep.title}
                    isOwner={isOwner}
                    keepId={keep.id}
                    username={username}
                    collectionId={collectionId}
                />
            </div>

            <div className='shrink-0 text-sm text-gray-400 pt-4 border-t border-gray-700'>
                <p>Created: {new Date(keep.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(keep.updatedAt).toLocaleDateString()}</p>
            </div>
        </>
    );
}
