import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';

export default function Show({ advisor }) {
    return (
        <AppLayout>

            <Head
                title={`Asesor - ${advisor.user?.name ?? 'Asesor'}`}
            />

            <PageContainer>

                {/* Encabezado */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {advisor.user?.name ?? 'Asesor'}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Información del asesor
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <Link
                            href={route('advisors.edit', advisor.id)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Editar
                        </Link>

                        <Link
                            href={route('advisors.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Volver
                        </Link>

                    </div>
                </div>

                {/* Información */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Foto */}
                    <div className="rounded-xl bg-white p-6 shadow">

                        <div className="flex justify-center">

                            {advisor.photo ? (
                                <img
                                    src={`/storage/${advisor.photo}`}
                                    alt={
                                        advisor.user?.name ??
                                        'Foto del asesor'
                                    }
                                    className="h-48 w-48 rounded-full border object-cover shadow-sm"
                                />
                            ) : (
                                <div className="flex h-48 w-48 items-center justify-center rounded-full border bg-gray-100 text-sm text-gray-500">
                                    Sin foto
                                </div>
                            )}

                        </div>

                    </div>

                    {/* Datos */}
                    <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Datos del asesor
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Nombre
                                </p>

                                <p className="mt-1 font-medium text-gray-800">
                                    {advisor.user?.name ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Correo electrónico
                                </p>

                                <p className="mt-1 font-medium text-gray-800">
                                    {advisor.user?.email ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Empresa
                                </p>

                                <p className="mt-1 font-medium text-gray-800">
                                    {advisor.company?.name ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Profesión
                                </p>

                                <p className="mt-1 font-medium text-gray-800">
                                    {advisor.profession || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Teléfono
                                </p>

                                <p className="mt-1 font-medium text-gray-800">
                                    {advisor.user?.phone ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Estado
                                </p>

                                <p
                                    className={
                                        advisor.status
                                            ? 'mt-1 font-semibold text-green-600'
                                            : 'mt-1 font-semibold text-red-600'
                                    }
                                >
                                    {advisor.status
                                        ? 'Activo'
                                        : 'Inactivo'}
                                </p>
                            </div>

                        </div>

                        {/* Descripción */}
                        <div className="mt-6">

                            <p className="text-sm text-gray-500">
                                Descripción
                            </p>

                            <div className="mt-2 rounded-lg bg-gray-50 p-4 text-gray-700">
                                {advisor.description || 'Sin descripción'}
                            </div>

                        </div>

                    </div>

                </div>

            </PageContainer>

        </AppLayout>
    );
}