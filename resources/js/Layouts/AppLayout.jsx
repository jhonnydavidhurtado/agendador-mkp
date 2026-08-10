import Sidebar from '@/Components/Layout/Sidebar';
import Navbar from '@/Components/Layout/Navbar';
import FlashMessage from '@/Components/Layout/FlashMessage';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <Navbar />

            <main className="ml-64 pt-16">
                <div className="p-6">

                    <FlashMessage />

                    {children}

                </div>
            </main>
        </div>
    );
}