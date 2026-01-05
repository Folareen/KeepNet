"use client";

import { useState, useRef } from "react";
import { updateUser } from "@/actions/updateUser";
import { uploadToS3, deleteFromS3 } from "@/actions/s3Upload";
import { MdSettings, MdClose, MdCameraAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

type User = {
    id: string;
    email: string;
    name: string;
    username?: string | null;
    displayUsername?: string | null;
    visibility?: boolean | null;
    [key: string]: any;
};

type EditAccountModalProps = {
    user: User;
};

export default function EditAccountModal({ user }: EditAccountModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username || "");
    const [visibility, setVisibility] = useState(user.visibility ?? true);
    const [imagePreview, setImagePreview] = useState<string | null>(user.image || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!name.trim()) {
            setError("Name is required");
            setIsLoading(false);
            return;
        }

        if (!username.trim()) {
            setError("Username is required");
            setIsLoading(false);
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError("Username can only contain letters, numbers, and underscores");
            setIsLoading(false);
            return;
        }

        let imageUrl = user.image;

        if (imageFile) {
            setIsUploading(true);
            try {
                const arrayBuffer = await imageFile.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);

                let binary = '';
                const chunkSize = 0x8000;
                for (let i = 0; i < bytes.length; i += chunkSize) {
                    const chunk = bytes.subarray(i, i + chunkSize);
                    binary += String.fromCharCode.apply(null, Array.from(chunk));
                }
                const base64 = btoa(binary);

                if (user.image) {
                    await deleteFromS3(user.image);
                }

                imageUrl = await uploadToS3(
                    base64,
                    imageFile.name,
                    imageFile.type,
                    'user',
                    user.username || user.id,
                    '',
                    user.id
                );

                toast.success('Image uploaded successfully');
            } catch (error) {
                console.error('Upload error:', error);
                toast.error('Failed to upload image');
                setIsLoading(false);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        const result = await updateUser({
            name: name.trim(),
            username: username.trim().toLowerCase(),
            visibility,
            image: imageUrl
        });

        if (result.success) {
            setIsOpen(false);
            router.refresh();
        } else {
            setError(result.error || "Failed to update account");
        }

        setIsLoading(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setName(user.name);
        setUsername(user.username || "");
        setVisibility(user.visibility ?? true);
        setImagePreview(user.image || null);
        setImageFile(null);
        setError("");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
                <MdSettings size={18} />
                <span className="hidden sm:inline text-sm font-medium">Settings</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Account Settings</h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative group">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-700">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                                        title="Change profile picture"
                                    >
                                        <MdCameraAlt size={16} />
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-500 mt-2">Click camera icon to change</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-gray-800 text-gray-500 border border-gray-700 rounded-lg cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-600 mt-1.5">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="username"
                                    required
                                />
                                <p className="text-xs text-gray-600 mt-1.5">
                                    Only letters, numbers, and underscores
                                </p>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="visibility"
                                    checked={visibility}
                                    onChange={(e) => setVisibility(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="visibility" className="text-sm text-gray-300">
                                    Make my account public
                                </label>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || isUploading}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                >
                                    {isUploading ? "Uploading..." : isLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading || isUploading}
                                    className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
