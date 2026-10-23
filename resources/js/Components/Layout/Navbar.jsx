import UserDropdown from '@/Components/Layout/UserDropdown';
import { Link, usePage } from '@inertiajs/react';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const unreadNotificationsCount = usePage().props.unreadNotificationsCount || 0;

    return (
        <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b bg-white">

            <div className="flex h-full items-center justify-between px-6">

                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Panel Administrativo
                    </h2>
                </div>


                <div className="flex items-center gap-4">
                    <Link
                        href={route('notifications.index')}
                        aria-label={`Notificaciones${unreadNotificationsCount ? `, ${unreadNotificationsCount} sin leer` : ''}`}
                        className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <BellIcon className="h-6 w-6" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs font-semibold leading-5 text-white">
                                {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                            </span>
                        )}
                    </Link>

                    <UserDropdown />
                </div>

            </div>

        </header>
    );
}