"use client"

import { useState } from "react";
import PasswordModal from "./PasswordModal";
import ContentContainer from "./ContentContainer";
import DeleteKeepButton from "./DeleteKeepButton";
import KeepSettingsModal from "./KeepSettingsModal";
import { verifyKeepPassword } from "@/actions/verifyKeepPassword";

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

    const handlePasswordSubmit = async (password: string) => {
        const isValid = await verifyKeepPassword(keep.id, password);

        if (isValid) {
            setIsUnlocked(true);
            setError('');
        } else {
            setError('Incorrect password. Please try again.');
        }
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

    if (keep.visibility === 'PRIVATE' && !isOwner) {
        return (
            <div className='text-center text-gray-400 py-16'>
                <p className='text-xl'>This keep is private</p>
            </div>
        );
    }

    return (
        <>
            <div className='shrink-0 pb-4 border-b border-gray-700'>
                <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                        <h1 className='text-4xl font-bold'>{keep.title}</h1>
                        {keep.description && (
                            <p className='text-gray-400 mt-2'>{keep.description}</p>
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
                    {isOwner && (
                        <div className='flex gap-2'>
                            <KeepSettingsModal
                                keep={keep}
                                username={username}
                                collectionId={collectionId}
                            />
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
