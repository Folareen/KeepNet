import Link from "next/link";
import { MdFolder, MdLock, MdShare, MdCloudUpload, MdDescription, MdImage, MdInsertDriveFile } from "react-icons/md";

export default async function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdFolder className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold">KeepNet</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium hidden md:block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <MdFolder className="absolute top-20 left-10 text-blue-500/10" size={120} style={{ transform: 'rotate(-15deg)' }} />
          <MdLock className="absolute top-40 right-20 text-purple-500/10" size={100} style={{ transform: 'rotate(15deg)' }} />
          <MdCloudUpload className="absolute bottom-40 left-20 text-green-500/10" size={140} style={{ transform: 'rotate(-10deg)' }} />
          <MdShare className="absolute bottom-20 right-10 text-red-500/10" size={110} style={{ transform: 'rotate(20deg)' }} />
          <MdImage className="absolute top-1/2 left-1/4 text-blue-400/5" size={160} style={{ transform: 'rotate(-25deg)' }} />
          <MdDescription className="absolute top-1/3 right-1/4 text-purple-400/5" size={150} style={{ transform: 'rotate(25deg)' }} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-4 text-2xl md:text-6xl lg:text-7xl font-bold">
              <span className="text-blue-500">Keep.</span>
              <span className="text-purple-500">Organize.</span>
              <span className="text-green-500">Share.</span>
            </div>
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Store your notes, files, and media in one place. Share with simple links.
              Organize in collections. Password-protect what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                href="/signup"
                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg md:text-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50"
              >
                Start Keeping Now
              </Link>
              <Link
                href="/login"
                className="px-10 py-5 bg-gray-800 hover:bg-gray-700 rounded-lg text-lg md:text-xl font-semibold transition-all border border-gray-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12">Everything You Need</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <MdCloudUpload className="text-blue-500" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Store Anything</h4>
              <p className="text-gray-400">
                Notes, images, videos, files. Upload and organize everything in collections.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <MdFolder className="text-purple-500" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Organize Simply</h4>
              <p className="text-gray-400">
                Create collections to group related items. Clean, intuitive organization.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <MdShare className="text-green-500" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Share Easily</h4>
              <p className="text-gray-400">
                Share via simple links. Make content public or keep it private.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <MdLock className="text-red-500" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lock It Down</h4>
              <p className="text-gray-400">
                Password-protect sensitive items. Your data, your control.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-800/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12">What You Can Keep</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <MdDescription className="text-blue-500" size={32} />
              </div>
              <h4 className="text-xl font-semibold">Notes & Ideas</h4>
              <p className="text-gray-400">Plain text or rich formatted notes with our built-in editor</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all text-center space-y-4">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <MdImage className="text-purple-500" size={32} />
              </div>
              <h4 className="text-xl font-semibold">Images & Videos</h4>
              <p className="text-gray-400">Store and share your media files securely in the cloud</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-green-500 transition-all text-center space-y-4">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <MdInsertDriveFile className="text-green-500" size={32} />
              </div>
              <h4 className="text-xl font-semibold">Documents</h4>
              <p className="text-gray-400">Upload any file type and access it from anywhere</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-linear-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h3 className="text-4xl font-bold">Ready to Start Keeping?</h3>
          <p className="text-xl text-gray-300">
            Join KeepNet today and get your personal vault up and running in seconds.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl text-center text-gray-400">
          <p>&copy; 2026 KeepNet. Your personal cloud, simplified.</p>
        </div>
      </footer>
    </div>
  );
}