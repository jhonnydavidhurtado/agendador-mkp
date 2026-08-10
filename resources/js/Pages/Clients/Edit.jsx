import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

import Card from '@/Components/Card';
import FlashMessage from '@/Components/Layout/FlashMessage';

import ClientForm from './ClientForm';

export default function Edit({
    auth,
    client,
    companies,
}) {

    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Editar Cliente
                </h2>
            }
        >

            <Head title="Editar Cliente" />

            <div className="py-6">

                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">

                    <FlashMessage />

                    <Card title="Editar Cliente">

                        <ClientForm
                            client={client}
                            companies={companies}
                        />

                        <div className="mt-6">

                            <Link
                                href={route('clients.index')}
                                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                            >
                                Volver
                            </Link>

                        </div>

                    </Card>

                </div>

            </div>

        </AuthenticatedLayout>
    );
}