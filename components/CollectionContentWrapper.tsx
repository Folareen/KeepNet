"use client"

import { verifyCollectionPassword } from "@/actions/verifyCollectionPassword";
import { useMemo, useState } from "react";
import CreateKeepModal from "./CreateKeepModal";
import KeepCard from "./KeepCard";
import PasswordModal from "./PasswordModal";
import CollectionSettingsModal from "./CollectionSettingsModal";
import { MdSearch, MdFolder } from "react-icons/md";

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
            updatedAt: Date | null;
        }>;
    };
    username: string;
    isOwner: boolean;
}

type SortOption = 'name' | 'updated';

export default function CollectionContentWrapper({ collection, username, isOwner }: CollectionContentWrapperProps) {
    const [isUnlocked, setIsUnlocked] = useState(collection.visibility !== 'LOCKED' || isOwner);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>('updated');

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value as SortOption);
    };

    const filteredKeeps = useMemo(() => {
        let result = collection.keeps;
        if (!searchQuery.trim()) {
            result = collection.keeps;
        }
        if (sortOption === 'name') {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOption === 'updated') {
            result = [...result].sort((a, b) => {
                if (a.updatedAt && b.updatedAt) {
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                }
                return b.id.localeCompare(a.id);
            });
        }

        return result.filter(keep =>
            keep.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [collection.keeps, searchQuery, sortOption]);

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
            <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6'>
                <div className='flex items-start gap-3 sm:gap-4 min-w-0 flex-1'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0'>
                        <MdFolder className='text-blue-500' size={20} />
                    </div>
                    <div className='min-w-0 flex-1'>
                        <h1 className='text-xl sm:text-2xl font-bold text-gray-100 wrap-break-word'>{collection.title}</h1>
                        {collection.description && (
                            <p className='text-xs sm:text-sm text-gray-400 mt-1 wrap-break-word'>{collection.description}</p>
                        )}
                    </div>
                </div>
                {isOwner && (
                    <div className='shrink-0'>
                        <CollectionSettingsModal
                            collection={collection}
                            username={username}
                        />
                    </div>
                )}
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6'>
                <h2 className='text-base sm:text-lg font-semibold text-gray-300'>Keeps</h2>
                {isOwner && <CreateKeepModal collectionId={collection.id} />}
            </div>

            {collection.keeps.length > 0 && (
                <div className="flex items-center space-x-4  mb-6">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search keeps..."
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-900/40 text-white border border-gray-800 focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="bg-gray-900/40 border border-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        >
                            <option value="updated">Recently Updated</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>
            )}

            {collection.keeps.length === 0 ? (
                <div className='text-center text-gray-500 py-16'>
                    <p className="text-lg">No keeps yet</p>
                    {isOwner && <p className="text-sm mt-2">Create your first keep to get started</p>}
                </div>
            ) : filteredKeeps.length === 0 ? (
                <div className='text-center text-gray-500 py-16'>
                    <p className="text-lg">No keeps found</p>
                    <p className="text-sm mt-2">Try a different search term</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
