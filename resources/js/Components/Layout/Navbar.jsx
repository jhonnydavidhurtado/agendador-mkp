import UserDropdown from '@/Components/Layout/UserDropdown';

export default function Navbar() {
    return (
        <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b bg-white">

            <div className="flex h-full items-center justify-between px-6">

                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Panel Administrativo
                    </h2>
                </div>


                <UserDropdown />

            </div>

        </header>
    );
}