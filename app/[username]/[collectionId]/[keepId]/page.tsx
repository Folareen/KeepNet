import AppLayout from '@/components/AppLayout'
import KeepContentWrapper from '@/components/KeepContentWrapper'
import { getKeepById } from '@/lib/getKeepById'
import { getUser } from '@/lib/getUser'
import Link from 'next/link'

export default async function KeepPage({ params }: { params: Promise<{ username: string, collectionId: string, keepId: string }> }) {
    const { username, collectionId, keepId } = await params
    const keep = await getKeepById(keepId)
    const currentUser = await getUser()

    if (!keep) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-950 text-white'>
                <h1 className='text-2xl'>Keep not found</h1>
            </div>
        )
    }

    const isOwner = currentUser?.id === keep.userId

    return (
        <AppLayout>
            <div className='flex flex-col h-[calc(100vh-80px)]'>
                <div className='text-sm text-gray-400 mb-4'>
                    <Link href={`/${username}`} className='hover:text-white'>
                        @{username}
                    </Link>
                    {keep.collection && (
                        <>
                            <span className='mx-2'>/</span>
                            <Link href={`/${username}/${collectionId}`} className='hover:text-white'>
                                {keep.collection.title}
                            </Link>
                        </>
                    )}
                    <span className='mx-2'>/</span>
                    <span className='text-white'>{keep.title}</span>
                </div>

                <KeepContentWrapper
                    keep={{
                        id: keep.id,
                        title: keep.title,
                        description: keep.description,
                        type: keep.type,
                        content: keep.content,
                        visibility: keep.visibility,
                        createdAt: keep.createdAt,
                        updatedAt: keep.updatedAt
                    }}
                    username={username}
                    collectionId={collectionId}
                    isOwner={isOwner}
                />
            </div>
        </AppLayout>
    )
}