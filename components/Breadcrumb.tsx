'use client';

import Link from 'next/link';
import { MdHome, MdChevronRight, MdFolder, MdDescription } from 'react-icons/md';

type BreadcrumbItem = {
    label: string;
    href: string;
    icon?: React.ReactNode;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className='bg-gray-900/50 border-b border-gray-800/50'>
            <div className='container mx-auto px-4 sm:px-6 py-2 sm:py-3'>
                <ol className='flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto scrollbar-hide'>
                    {items.map((item, index) => (
                        <li key={index} className='flex items-center gap-1 sm:gap-2 shrink-0'>
                            {index > 0 && (
                                <MdChevronRight className='text-gray-600' size={16} />
                            )}
                            {index === items.length - 1 ? (
                                <span className='flex items-center gap-1 sm:gap-2 text-white font-medium'>
                                    {item.icon}
                                    <span className='max-w-[120px] sm:max-w-[200px] truncate'>{item.label}</span>
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className='flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors'
                                >
                                    {item.icon}
                                    <span className='max-w-[100px] sm:max-w-[200px] truncate'>{item.label}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}
