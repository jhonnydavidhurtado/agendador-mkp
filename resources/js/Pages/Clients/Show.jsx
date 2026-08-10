import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import Card from '@/Components/Card';

export default function Show({ client, birthdateFormatted }) {

    return (

        <AppLayout>

            <Head title={`Cliente - ${client.name}`} />

            <PageContainer>

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Cliente
                    </h1>

                    <p className="text-gray-500">
                        Información detallada del cliente
                    </p>

                </div>

                <Card title="Información del Cliente">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>

                            <p className="text-sm text-gray-500">
                                Nombre
                            </p>

                            <p className="font-medium text-gray-800">
                                {client.name}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Empresa
                            </p>

                            <p className="font-medium text-gray-800">
                                {client.company?.name ?? '-'}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Teléfono
                            </p>

                            <p className="font-medium text-gray-800">
                                {client.phone ?? '-'}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Correo electrónico
                            </p>

                            <p className="font-medium text-gray-800">
                                {client.email ?? '-'}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Fecha de nacimiento
                            </p>

                            <p className="font-medium text-gray-800">
                            {birthdateFormatted ?? '-'}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Estado
                            </p>

                            <p className="font-medium text-gray-800">
                                {client.status
                                    ? 'Activo'
                                    : 'Inactivo'}
                            </p>

                        </div>

                    </div>

                    <div className="mt-6">

                        <p className="text-sm text-gray-500">
                            Observaciones
                        </p>

                        <p className="mt-1 text-gray-800 whitespace-pre-line">
                            {client.notes ?? '-'}
                        </p>

                    </div>

                    <div className="mt-8 flex gap-3">

                        <Link
                            href={route(
                                'clients.edit',
                                client.id
                            )}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                        >
                            Editar
                        </Link>

                        <Link
                            href={route('clients.index')}
                            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                        >
                            Volver
                        </Link>

                    </div>

                </Card>

            </PageContainer>

        </AppLayout>
    );
}