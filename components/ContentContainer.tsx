"use client"

import { updateKeep } from "@/actions/updateKeep";
import { uploadToS3, deleteFromS3 } from "@/actions/s3Upload";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
    const [editContent, setEditContent] = useState(content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!isEditing || keepType !== 'TEXT') return;

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
            alert(`Invalid file type. Please upload a ${keepType.toLowerCase()}.`);
            return;
        }

        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size too large. Maximum size is 100MB.');
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
            router.refresh();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload file');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const renderViewMode = () => {
        if (keepType === 'TEXT') {
            return (
                <div className='whitespace-pre-wrap'>
                    {content || 'No content yet. Click edit to add content.'}
                </div>
            );
        }
        if (keepType === 'RICH_TEXT') {
            return (
                <div className='prose prose-invert max-w-none'>
                    {content || 'No content yet. Click edit to add content.'}
                </div>
            );
        }
        if (keepType === 'IMAGE') {
            return (
                <div>
                    {content ? (
                        <img src={content} alt={title} className='max-w-full rounded' />
                    ) : (
                        <p className='text-gray-400'>No image uploaded yet. Click edit to add an image.</p>
                    )}
                </div>
            );
        }
        if (keepType === 'VIDEO') {
            return (
                <div>
                    {content ? (
                        <video src={content} controls className='max-w-full rounded'>
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <p className='text-gray-400'>No video uploaded yet. Click edit to add a video.</p>
                    )}
                </div>
            );
        }
        if (keepType === 'FILE') {
            return (
                <div>
                    {content ? (
                        <a
                            href={content}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-400 hover:text-blue-300 flex items-center gap-2'
                        >
                            📎 Download File
                        </a>
                    ) : (
                        <p className='text-gray-400'>No file uploaded yet. Click edit to add a file.</p>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderEditMode = () => {
        if (keepType === 'TEXT' || keepType === 'RICH_TEXT') {
            return (
                <div>
                    <div className='flex justify-between items-center mb-2'>
                        <div className='text-sm text-gray-400'>
                            {isSaving && <span>Saving...</span>}
                            {!isSaving && lastSaved && (
                                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                            )}
                        </div>
                    </div>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className='w-full h-[500px] bg-gray-900 text-white p-4 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder={keepType === 'RICH_TEXT' ? 'Enter markdown content...' : 'Enter text content...'}
                        autoFocus
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
                <div>
                    <div className='mb-4'>
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
                            className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
                        >
                            {isUploading ? `Uploading... ${uploadProgress}%` : `Upload ${keepType.toLowerCase()}`}
                        </button>
                    </div>

                    {isUploading && (
                        <div className='mb-4'>
                            <div className='w-full bg-gray-700 rounded-full h-2'>
                                <div
                                    className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {editContent && keepType === 'IMAGE' && (
                        <div className='mt-4'>
                            <p className='text-sm text-gray-400 mb-2'>Current:</p>
                            <img src={editContent} alt='Preview' className='max-w-full rounded' />
                        </div>
                    )}
                    {editContent && keepType === 'VIDEO' && (
                        <div className='mt-4'>
                            <p className='text-sm text-gray-400 mb-2'>Current:</p>
                            <video src={editContent} controls className='max-w-full rounded' />
                        </div>
                    )}
                    {editContent && keepType === 'FILE' && (
                        <div className='mt-4'>
                            <p className='text-sm text-gray-400 mb-2'>Current file:</p>
                            <a
                                href={editContent}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-400 hover:text-blue-300 flex items-center gap-2'
                            >
                                📎 {editContent.split('/').pop()}
                            </a>
                        </div>
                    )}

                    {lastSaved && (
                        <div className='text-sm text-gray-400 mt-4'>
                            Last saved: {lastSaved.toLocaleTimeString()}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className='bg-gray-800 p-6 rounded-lg min-h-full relative'>
            {isOwner && (
                <div className='absolute top-4 right-4'>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm'
                        >
                            Edit Content
                        </button>
                    ) : (
                        <div className='flex gap-2'>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(content || '');
                                }}
                                className='bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-sm'
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className={isOwner ? 'pr-32' : ''}>
                {isEditing ? renderEditMode() : renderViewMode()}
            </div>
        </div>
    );
}
