"use client"

import { verifyCollectionPassword } from "@/actions/verifyCollectionPassword";
import { useMemo, useState } from "react";
import CreateKeepModal from "./CreateKeepModal";
import KeepCard from "./KeepCard";
import PasswordModal from "./PasswordModal";
import CollectionSettingsModal from "./CollectionSettingsModal";

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

    if (collection.visibility === 'PRIVATE' && !isOwner) {
        return (
            <div className='text-center text-gray-400 py-16'>
                <p className='text-xl'>This collection is private</p>
            </div>
        );
    }

    return (
        <>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>{collection.title}</h1>
                    {collection.description && (
                        <p className='text-gray-400 mt-2'>{collection.description}</p>
                    )}
                </div>
                {isOwner && (
                    <CollectionSettingsModal
                        collection={collection}
                        username={username}
                    />
                )}
            </div>

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
