import { Link, usePage, router } from '@inertiajs/react';

export default function UserDropdown() {

    const { auth } = usePage().props;

    const user = auth?.user;


    const logout = () => {
        router.post('/logout');
    };


    return (
        <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-gray-900">
                    {user?.name ?? 'Usuario'}
                </p>

                <p className="text-xs text-gray-500">
                    {user?.email ?? ''}
                </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                {user?.name?.charAt(0) ?? 'U'}
            </div>


            <Link
                href="/profile"
                className="hidden rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 sm:block"
            >
                Perfil
            </Link>


            <button
                onClick={logout}
                className="hidden rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 sm:block"
            >
                Salir
            </button>


        </div>
    );
}