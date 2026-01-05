"use client"

import { useState } from "react";
import PasswordModal from "./PasswordModal";
import ContentContainer from "./ContentContainer";
import DeleteKeepButton from "./DeleteKeepButton";
import KeepSettingsModal from "./KeepSettingsModal";
import { verifyKeepPassword } from "@/actions/verifyKeepPassword";
import { MdLock, MdPublic, MdVisibilityOff, MdCalendarToday, MdUpdate } from 'react-icons/md';

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
            <div className='flex items-center justify-center py-24'>
                <div className='text-center max-w-md'>
                    <div className='w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <MdVisibilityOff size={40} className='text-gray-600' />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-300 mb-2'>Private Keep</h2>
                    <p className='text-gray-500'>This content is private and can only be viewed by the owner.</p>
                </div>
            </div>
        );
    }

    const getVisibilityIcon = () => {
        switch (keep.visibility) {
            case 'PUBLIC': return <MdPublic size={16} className='text-green-400' />;
            case 'LOCKED': return <MdLock size={16} className='text-yellow-400' />;
            case 'PRIVATE': return <MdVisibilityOff size={16} className='text-red-400' />;
            default: return null;
        }
    };

    const getVisibilityColor = () => {
        switch (keep.visibility) {
            case 'PUBLIC': return 'bg-green-900/30 border-green-500/30 text-green-400';
            case 'LOCKED': return 'bg-yellow-900/30 border-yellow-500/30 text-yellow-400';
            case 'PRIVATE': return 'bg-red-900/30 border-red-500/30 text-red-400';
            default: return 'bg-gray-800 border-gray-700 text-gray-400';
        }
    };

    const getTypeColor = () => {
        switch (keep.type) {
            case 'TEXT': return 'bg-blue-900/30 border-blue-500/30 text-blue-400';
            case 'RICH_TEXT': return 'bg-purple-900/30 border-purple-500/30 text-purple-400';
            case 'IMAGE': return 'bg-pink-900/30 border-pink-500/30 text-pink-400';
            case 'VIDEO': return 'bg-red-900/30 border-red-500/30 text-red-400';
            case 'FILE': return 'bg-green-900/30 border-green-500/30 text-green-400';
            default: return 'bg-gray-800 border-gray-700 text-gray-400';
        }
    };

    return (
        <div className='flex flex-col h-full gap-6'>
            <div className='shrink-0 bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                    <div className='flex-1 min-w-0'>
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-100 mb-3 wrap-break-word'>{keep.title}</h1>
                        {keep.description && (
                            <p className='text-gray-400 text-sm sm:text-base mb-4 wrap-break-word'>{keep.description}</p>
                        )}
                        <div className='flex flex-wrap items-center gap-2'>
                            <span className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${getTypeColor()}`}>
                                {keep.type.replace('_', ' ')}
                            </span>
                            <span className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${getVisibilityColor()}`}>
                                {getVisibilityIcon()}
                                {keep.visibility}
                            </span>
                        </div>
                    </div>
                    {isOwner && (
                        <div className='flex gap-2 shrink-0'>
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

            <div className='flex-1 min-h-0'>
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

            <div className='shrink-0 bg-gray-900 border border-gray-800 rounded-xl p-4'>
                <div className='flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500'>
                    <div className='flex items-center gap-2'>
                        <MdCalendarToday size={16} className='text-gray-600' />
                        <span>Created: {new Date(keep.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className='hidden sm:block w-px h-4 bg-gray-700'></div>
                    <div className='flex items-center gap-2'>
                        <MdUpdate size={16} className='text-gray-600' />
                        <span>Updated: {new Date(keep.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
