import AppLayout from '@/components/AppLayout'
import Breadcrumb from '@/components/Breadcrumb'
import KeepContentWrapper from '@/components/KeepContentWrapper'
import { getKeepById } from '@/lib/getKeepById'
import { getUser } from '@/lib/getUser'
import { getUserByUsername } from '@/lib/getUserByUsername'
import { MdHome, MdPerson, MdFolder, MdDescription } from 'react-icons/md'

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

    const user = await getUserByUsername(username)
    const isOwner = currentUser?.id === keep.userId

    return (
        <AppLayout>
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/home', icon: <MdHome size={18} /> },
                    { label: user?.name || username, href: `/${username}`, icon: <MdPerson size={18} /> },
                    { label: keep.collection?.title || 'Collection', href: `/${username}/${collectionId}`, icon: <MdFolder size={18} /> },
                    { label: keep.title, href: `/${username}/${collectionId}/${keepId}`, icon: <MdDescription size={18} /> }
                ]}
            />
            <div className='flex flex-col h-[calc(100vh-160px)]'>

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