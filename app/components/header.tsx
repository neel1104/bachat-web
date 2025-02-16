'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname();

    const getLinkStyle = (path: string) => {
        return pathname === path 
            ? "text-green-600 font-medium" 
            : "text-gray-600 hover:text-green-600 transition-colors";
    };

    return (
        <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full" />
            <Link href="/"><span className="text-xl font-bold">WalletWise</span></Link>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className={getLinkStyle("/")}>Import</Link>
            <Link href="/transactions" className={getLinkStyle("/transactions")}>Transactions</Link>
            {/* <Link href="/" className={getLinkStyle("/bulk-edit")}>Bulk Edit</Link> */}
          </nav>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 border border-green-600 text-green-600 rounded-md">
            Sign Out
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md">
            Help
          </button>
        </div>
      </div>
    );
}