import { Link } from '@inertiajs/react';

export default function Logo() {
    return (
        <Link
            href="/dashboard"
            className="flex items-center gap-3"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xl shadow">
                M
            </div>

            <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">
                    MKP
                </h1>

                <p className="text-xs text-gray-500">
                    Agendador
                </p>
            </div>
        </Link>
    );
}