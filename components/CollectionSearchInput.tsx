"use client";

import CollectionCard from "./CollectionCard";
import { useState, useMemo } from "react";

type Collection = {
    id: string;
    title: string;
    description: string | null;
    visibility: string | boolean;
    _count: {
        keeps: number;
    };
};

type CollectionSearchInputProps = {
    collections: Collection[];
    username: string;
    isOwner: boolean;
};

export default function CollectionSearchInput({ collections, username, isOwner }: CollectionSearchInputProps) {
    const [query, setQuery] = useState("");

    const filteredCollections = useMemo(() => {
        if (!query.trim()) {
            return collections;
        }

        return collections.filter(collection =>
            collection.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [collections, query]);

    return (
        <div className="space-y-4">
            {collections.length > 0 && (
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search collections by title..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
            )}

            {collections.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                    No collections yet. {isOwner && "Create your first collection!"}
                </div>
            ) : filteredCollections.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                    No collections found matching "{query}"
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
