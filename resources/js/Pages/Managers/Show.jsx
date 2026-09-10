import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';

export default function Show({ manager }) {
    return (
        <AppLayout>
            <Head title={`Manager - ${manager.name}`} />

            <PageContainer>
                <PageHeader
                    title={manager.name}
                    subtitle="Información del Manager"
                />

                <div className="max-w-3xl rounded-xl bg-white p-6 shadow">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-gray-500">
                                Nombre
                            </p>

                            <p className="font-medium">
                                {manager.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Correo
                            </p>

                            <p className="font-medium">
                                {manager.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Empresa
                            </p>

                            <p className="font-medium">
                                {manager.company?.name ?? '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Teléfono
                            </p>

                            <p className="font-medium">
                                {manager.phone ?? '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Ciudad
                            </p>

                            <p className="font-medium">
                                {manager.city ?? '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Estado
                            </p>

                            <p className="font-medium">
                                {manager.status
                                    ? 'Activo'
                                    : 'Inactivo'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Link
                            href={route(
                                'managers.edit',
                                manager.id
                            )}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white"
                        >
                            Editar
                        </Link>

                        <Link
                            href={route('managers.index')}
                            className="rounded-lg border px-5 py-2.5"
                        >
                            Volver
                        </Link>
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}
