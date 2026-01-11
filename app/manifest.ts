import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'KeepNet',
        short_name: 'keepnet',
        description: 'Your personal cloud storage solution. Keep your files, organize your collections, and share with ease.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            { src: '/favicon.svg', type: 'image/svg+xml' },
            { src: '/favicon.svg', type: 'image/svg+xml' },
        ],
    }
}