"use client"

import { useState } from "react";
import PasswordModal from "./PasswordModal";
import CreateKeepModal from "./CreateKeepModal";
import KeepCard from "./KeepCard";
import { verifyCollectionPassword } from "@/actions/verifyPassword";

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

    const handlePasswordSubmit = async (password: string) => {
        const isValid = await verifyCollectionPassword(collection.id, password);

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
                title="This collection is locked"
                description="Enter the password to view this collection"
                onSubmit={handlePasswordSubmit}
                error={error}
            />
        );
    }

    return (
        <>
            <div>
                <h1 className='text-3xl font-bold'>{collection.title}</h1>
                {collection.description && (
                    <p className='text-gray-400 mt-2'>{collection.description}</p>
                )}
            </div>

            <div className='flex justify-between items-center'>
                <h2 className='text-2xl'>Keeps</h2>
                {isOwner && <CreateKeepModal collectionId={collection.id} />}
            </div>

            {collection.keeps.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                    No keeps yet. {isOwner && "Create your first keep!"}
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {collection.keeps.map((keep) => (
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
