'use client';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LoginDropdown } from './LoginDropdown';
import { ModeToggle } from './ModeToggle';
import SignOut from './SignOut';

function Navbar() {
  const pathname = usePathname();
  const { user } = useClerk();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="w-full h-16 px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white shadow-sm">
      {/* 🔵 Logo */}
      <Link
        href="/"
        className="font-extrabold text-2xl tracking-wide text-blue-700 hover:opacity-90 transition"
      >
        Ast<span className="text-gray-800">raa</span>
      </Link>

      {/* 🔗 Navigation Links */}
      <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
        <Link
          href="/"
          className={`${
            isActive('/') ? 'text-blue-700 font-semibold' : 'hover:text-blue-700'
          } transition-colors duration-200`}
        >
          Home
        </Link>

        {!user?.unsafeMetadata.isAdmin && (
          <Link
            href="/create-post"
            className={`${
              isActive('/create-post')
                ? 'text-blue-700 font-semibold'
                : 'hover:text-blue-700'
            } transition-colors duration-200`}
          >
            Create Post
          </Link>
        )}

        {(user?.unsafeMetadata as { isAdmin: boolean })?.isAdmin && (
          <Link
            href="/dashboard"
            className={`${
              isActive('/dashboard')
                ? 'text-blue-700 font-semibold'
                : 'hover:text-blue-700'
            } transition-colors duration-200`}
          >
            Dashboard
          </Link>
        )}

        {/* 🧑‍⚖️ Legal Assistant */}
        <Link
          href="/lawbot"
          className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition duration-200"
        >
          Legal Assistant
        </Link>

        {/* 🧠 Mental Health Companion */}
        <Link
          href="https://ai-avatar-frontend-coral.vercel.app/"
          className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition duration-200"
        >
          Saathi
        </Link>
      </div>

      {/* 🌓 Mode & Auth Controls */}
      <div className="flex items-center gap-3">
        <ModeToggle />
        {!user ? <LoginDropdown /> : <SignOut />}
      </div>
    </nav>
  );
}

export default Navbar;