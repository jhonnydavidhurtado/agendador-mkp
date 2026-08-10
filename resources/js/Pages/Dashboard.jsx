import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">

                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-gray-700">
                        Bienvenido al sistema Agendador MKP.
                    </p>
                </div>

            </div>
        </AppLayout>
    );
}