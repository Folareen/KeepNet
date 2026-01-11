"use client";

import CollectionCard from "./CollectionCard";
import { useState, useMemo } from "react";
import { MdSearch } from "react-icons/md";

type Collection = {
    id: string;
    title: string;
    description: string | null;
    visibility: string | boolean;
    _count: {
        keeps: number;
    };
    updatedAt: Date;
};


type SortOption = 'name' | 'updated';

type CollectionSearchInputProps = {
    collections: Collection[];
    username: string;
    isOwner: boolean;
    sort?: SortOption;
    onSortChange?: (sort: SortOption) => void;
};

export default function CollectionSearchInput({ collections, username, isOwner }: CollectionSearchInputProps) {
    const [query, setQuery] = useState("");
    const [sortOption, setSortOption] = useState<SortOption>('updated');

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value as SortOption);
    };

    const filteredCollections = useMemo(() => {
        let result = collections;
        if (query.trim()) {
            result = result.filter(collection =>
                collection.title.toLowerCase().includes(query.toLowerCase())
            );
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
        return result;
    }, [collections, query, sortOption]);

    return (
        <div className="space-y-6">
            {collections.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="relative flex-1">
                        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search collections..."
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

            {collections.length === 0 ? (
                <div className='text-center text-gray-500 py-16'>
                    <p className="text-lg">No collections yet</p>
                    {isOwner && <p className="text-sm mt-2">Create your first collection to get started</p>}
                </div>
            ) : filteredCollections.length === 0 ? (
                <div className='text-center text-gray-500 py-16'>
                    <p className="text-lg">No collections found</p>
                    <p className="text-sm mt-2">Try a different search term</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredCollections.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            username={username}
                            isOwner={isOwner}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
