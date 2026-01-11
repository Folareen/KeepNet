"use client"

import { updateKeep } from "@/actions/updateKeep";
import { uploadToS3, deleteFromS3 } from "@/actions/s3Upload";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "./TiptapEditor";
import toast from 'react-hot-toast';
import {
    MdEdit,
    MdCheck,
    MdClose,
    MdFullscreen,
    MdFullscreenExit,
    MdCloudUpload,
    MdImage,
    MdVideoLibrary,
    MdInsertDriveFile,
    MdDownload,
    MdRefresh
} from 'react-icons/md';

type ContentContainerProps = {
    keepType: string;
    content: string | null;
    title: string;
    isOwner: boolean;
    keepId: string;
    username: string;
    collectionId?: string;
};

export default function ContentContainer({ keepType, content, title, isOwner, keepId, username, collectionId }: ContentContainerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [editContent, setEditContent] = useState(content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!isEditing || (keepType !== 'TEXT' && keepType !== 'RICH_TEXT')) return;

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            if (editContent !== content) {
                setIsSaving(true);
                try {
                    await updateKeep(keepId, { content: editContent }, username, collectionId);
                    setLastSaved(new Date());
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsSaving(false);
                }
            }
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [editContent, keepType, isEditing, content, keepId, username, collectionId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validations = {
            IMAGE: /^image\//,
            VIDEO: /^video\//,
            FILE: /.*/
        };

        const allowedType = validations[keepType as keyof typeof validations];
        if (allowedType && !allowedType.test(file.type)) {
            toast.error(`Invalid file type. Please upload a ${keepType.toLowerCase()}.`);
            return;
        }

        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File size too large. Maximum size is 100MB.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);

            let binary = '';
            const chunkSize = 0x8000;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                const chunk = bytes.subarray(i, i + chunkSize);
                binary += String.fromCharCode.apply(null, Array.from(chunk));
            }
            const base64 = btoa(binary);

            if (content && (keepType === 'IMAGE' || keepType === 'VIDEO' || keepType === 'FILE')) {
                await deleteFromS3(content);
            }

            const fileUrl = await uploadToS3(
                base64,
                file.name,
                file.type,
                'keep',
                username,
                collectionId || '',
                keepId
            );

            await updateKeep(keepId, { content: fileUrl }, username, collectionId);
            setEditContent(fileUrl);
            setLastSaved(new Date());
            toast.success('File uploaded successfully!');
            router.refresh();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const getTypeIcon = () => {
        switch (keepType) {
            case 'IMAGE': return <MdImage size={20} />;
            case 'VIDEO': return <MdVideoLibrary size={20} />;
            case 'FILE': return <MdInsertDriveFile size={20} />;
            default: return null;
        }
    };

    const renderViewMode = () => {
        if (keepType === 'TEXT') {
            return (
                <div className='prose prose-invert max-w-none'>
                    <pre className='whitespace-pre-wrap font-sans bg-transparent border-none p-0 text-gray-200'>
                        {content || <span className='text-gray-500 italic'>No content yet. Click edit to add content.</span>}
                    </pre>
                </div>
            );
        }
        if (keepType === 'RICH_TEXT') {
            return (
                <div className='prose prose-invert max-w-none'>
                    <div dangerouslySetInnerHTML={{ __html: content || '' }} />
                    {!content && <p className='text-gray-500 italic'>No content yet. Click edit to add content.</p>}
                </div>
            );
        }
        if (keepType === 'IMAGE') {
            return (
                <div className='space-y-4'>
                    {content ? (
                        <>
                            <div className='flex items-center justify-center bg-gray-800/30 rounded-xl p-4'>
                                <img src={content} alt={title} className='max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow-2xl' />
                            </div>
                            <div className='flex flex-wrap gap-3 justify-center'>
                                <a
                                    href={content}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium'
                                >
                                    <MdImage size={18} />
                                    <span>View Full Size</span>
                                </a>
                                <a
                                    href={content}
                                    download
                                    className='flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium'
                                >
                                    <MdDownload size={18} />
                                    <span>Download</span>
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className='text-center py-16'>
                            <MdImage size={64} className='mx-auto text-gray-600 mb-4' />
                            <p className='text-gray-500 italic'>No image uploaded yet. Click edit to add an image.</p>
                        </div>
                    )}
                </div>
            );
        }
        if (keepType === 'VIDEO') {
            return (
                <div className='space-y-4'>
                    {content ? (
                        <>
                            <div className='flex items-center justify-center bg-gray-800/30 rounded-xl p-4'>
                                <video src={content} controls className='max-w-full max-h-[70vh] w-auto h-auto rounded-lg shadow-2xl'>
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className='flex flex-wrap gap-3 justify-center'>
                                <a
                                    href={content}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium'
                                >
                                    <MdVideoLibrary size={18} />
                                    <span>Open in New Tab</span>
                                </a>
                                <a
                                    href={content}
                                    download
                                    className='flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium'
                                >
                                    <MdDownload size={18} />
                                    <span>Download</span>
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className='text-center py-16'>
                            <MdVideoLibrary size={64} className='mx-auto text-gray-600 mb-4' />
                            <p className='text-gray-500 italic'>No video uploaded yet. Click edit to add a video.</p>
                        </div>
                    )}
                </div>
            );
        }
        if (keepType === 'FILE') {
            return (
                <div>
                    {content ? (
                        <div className='flex items-center justify-center py-16'>
                            <a
                                href={content}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-3 px-6 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-all group'
                            >
                                <MdDownload size={24} className='text-blue-400 group-hover:text-blue-300' />
                                <div className='text-left'>
                                    <p className='text-white font-medium group-hover:text-blue-300 transition-colors'>Download File</p>
                                    <p className='text-sm text-gray-500 truncate max-w-xs'>{content.split('/').pop()}</p>
                                </div>
                            </a>
                        </div>
                    ) : (
                        <div className='text-center py-16'>
                            <MdInsertDriveFile size={64} className='mx-auto text-gray-600 mb-4' />
                            <p className='text-gray-500 italic'>No file uploaded yet. Click edit to add a file.</p>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderEditMode = () => {
        if (keepType === 'TEXT') {
            const fullscreenClasses = isFullscreen
                ? 'w-full h-full bg-gray-950 text-white p-8 resize-none focus:outline-none font-mono text-base leading-relaxed border-none rounded-none'
                : 'flex-1 w-full bg-gray-900 text-white p-6 rounded-xl border border-gray-800 resize-none focus:outline-none focus:border-blue-500 transition-all font-mono text-sm leading-relaxed';

            return (
                <div className='h-full flex flex-col'>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={fullscreenClasses}
                        placeholder='Start typing...'
                        autoFocus
                    />
                </div>
            );
        }
        if (keepType === 'RICH_TEXT') {
            return (
                <div className='h-full'>
                    <TiptapEditor
                        content={editContent}
                        onChange={setEditContent}
                        editable={true}
                        isFullscreen={isFullscreen}
                    />
                </div>
            );
        }
        if (keepType === 'IMAGE' || keepType === 'VIDEO' || keepType === 'FILE') {
            const acceptTypes = keepType === 'IMAGE'
                ? 'image/*'
                : keepType === 'VIDEO'
                    ? 'video/*'
                    : '*/*';

            return (
                <div className='space-y-6'>
                    <div className='flex items-center justify-center'>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept={acceptTypes}
                            onChange={handleFileUpload}
                            className='hidden'
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className='flex items-center gap-3 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20'
                        >
                            {isUploading ? (
                                <>
                                    <MdRefresh size={20} className='animate-spin' />
                                    <span>Uploading... {uploadProgress}%</span>
                                </>
                            ) : (
                                <>
                                    <MdCloudUpload size={20} />
                                    <span>Upload {keepType === 'IMAGE' ? 'Image' : keepType === 'VIDEO' ? 'Video' : 'File'}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {isUploading && (
                        <div className='max-w-md mx-auto'>
                            <div className='w-full bg-gray-800/50 rounded-full h-2 overflow-hidden'>
                                <div
                                    className='bg-linear-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all duration-300'
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {editContent && keepType === 'IMAGE' && (
                        <div className='space-y-3'>
                            <p className='text-sm text-gray-400 font-medium'>Current Image:</p>
                            <div className='flex items-center justify-center bg-gray-800/30 rounded-xl p-4'>
                                <img src={editContent} alt='Preview' className='max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg shadow-2xl' />
                            </div>
                        </div>
                    )}
                    {editContent && keepType === 'VIDEO' && (
                        <div className='space-y-3'>
                            <p className='text-sm text-gray-400 font-medium'>Current Video:</p>
                            <div className='flex items-center justify-center bg-gray-800/30 rounded-xl p-4'>
                                <video src={editContent} controls className='max-w-full max-h-[60vh] w-auto h-auto rounded-lg shadow-2xl' />
                            </div>
                        </div>
                    )}
                    {editContent && keepType === 'FILE' && (
                        <div className='space-y-3'>
                            <p className='text-sm text-gray-400 font-medium'>Current File:</p>
                            <div className='flex items-center justify-center'>
                                <a
                                    href={editContent}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-3 px-6 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-all group'
                                >
                                    <MdDownload size={24} className='text-blue-400 group-hover:text-blue-300' />
                                    <div className='text-left'>
                                        <p className='text-white font-medium group-hover:text-blue-300 transition-colors'>Download File</p>
                                        <p className='text-sm text-gray-500 truncate max-w-xs'>{editContent.split('/').pop()}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    if (isFullscreen) {
        if (keepType === 'TEXT') {
            return (
                <div className='fixed inset-0 z-50 bg-gray-950'>
                    <div className='absolute top-4 right-4 z-10 flex items-center gap-3'>
                        <div className='flex items-center gap-2 text-sm bg-gray-800/90 px-3 py-2 rounded-lg'>
                            {isSaving && (
                                <span className='text-yellow-400 flex items-center gap-2'>
                                    <MdRefresh size={16} className='animate-spin' />
                                    Saving...
                                </span>
                            )}
                            {!isSaving && lastSaved && (
                                <span className='text-green-400 flex items-center gap-2'>
                                    <MdCheck size={16} />
                                    Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className='p-2 bg-gray-800/90 hover:bg-gray-700 rounded-lg transition-colors'
                            title='Exit Fullscreen'
                        >
                            <MdFullscreenExit size={20} />
                        </button>
                    </div>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className='w-full h-full bg-gray-950 text-white p-8 resize-none focus:outline-none font-mono text-base leading-relaxed border-none'
                        placeholder='Start typing...'
                        autoFocus
                    />
                </div>
            );
        }

        if (keepType === 'RICH_TEXT') {
            return (
                <div className='fixed inset-0 z-50 bg-gray-950 flex flex-col'>
                    <div className='absolute top-4 right-4 z-10 flex items-center gap-3'>
                        <div className='flex items-center gap-2 text-sm bg-gray-800/90 px-3 py-2 rounded-lg'>
                            {isSaving && (
                                <span className='text-yellow-400 flex items-center gap-2'>
                                    <MdRefresh size={16} className='animate-spin' />
                                    Saving...
                                </span>
                            )}
                            {!isSaving && lastSaved && (
                                <span className='text-green-400 flex items-center gap-2'>
                                    <MdCheck size={16} />
                                    Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className='p-2 bg-gray-800/90 hover:bg-gray-700 rounded-lg transition-colors'
                            title='Exit Fullscreen'
                        >
                            <MdFullscreenExit size={20} />
                        </button>
                    </div>
                    <div className='w-full h-full pt-16'>
                        <TiptapEditor
                            content={editContent}
                            onChange={setEditContent}
                            editable={true}
                            isFullscreen={isFullscreen}
                        />
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className='bg-gray-900 rounded-xl border border-gray-800 h-full flex flex-col'>
            <div className='shrink-0 bg-gray-800 border-b border-gray-700 rounded-t-xl  px-4 sm:px-6 py-3'>
                <div className='flex items-center justify-between gap-4'>
                    <div className='flex items-center gap-3 min-w-0 flex-1'>
                        {getTypeIcon()}
                        <span className='text-sm font-medium text-gray-400 uppercase tracking-wide'>
                            {keepType.replace('_', ' ')}
                        </span>
                        {(keepType === 'TEXT' || keepType === 'RICH_TEXT') && isEditing && (
                            <div className='hidden sm:flex items-center gap-2 text-xs'>
                                {isSaving && (
                                    <span className='text-yellow-400 flex items-center gap-1'>
                                        <MdRefresh size={14} className='animate-spin' />
                                        Saving...
                                    </span>
                                )}
                                {!isSaving && lastSaved && (
                                    <span className='text-green-400 flex items-center gap-1'>
                                        <MdCheck size={14} />
                                        Saved
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='flex items-center gap-2 shrink-0'>
                        {(keepType === 'TEXT' || keepType === 'RICH_TEXT') && (
                            <button
                                onClick={() => setIsFullscreen(true)}
                                className='p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white'
                                title='Fullscreen'
                            >
                                <MdFullscreen size={20} />
                            </button>
                        )}
                        {isOwner && (
                            !isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium'
                                >
                                    <MdEdit size={18} />
                                    <span className='hidden sm:inline'>Edit</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditContent(content || '');
                                    }}
                                    className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium'
                                >
                                    <MdCheck size={18} />
                                    <span className='hidden sm:inline'>Done</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className='flex-1 min-h-0 overflow-y-auto p-4 sm:p-6'>
                {isEditing ? renderEditMode() : renderViewMode()}
            </div>
        </div>
    );
}
