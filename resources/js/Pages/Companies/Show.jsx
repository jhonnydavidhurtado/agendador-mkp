import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';

export default function Show({ company }) {
    return (
        <AppLayout>

            <Head title={`Empresa - ${company.name}`} />

            <PageContainer>

                {/* Encabezado */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {company.name}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Información de la empresa
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={route('companies.edit', company.id)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Editar
                        </Link>

                        <Link
                            href={route('companies.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Volver
                        </Link>
                    </div>
                </div>

                {/* Información principal */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Logo */}
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="flex justify-center">
                            {company.logo ? (
                                <img
                                    src={`/storage/${company.logo}`}
                                    alt={`Logo de ${company.name}`}
                                    className="h-40 w-40 rounded-xl border object-contain shadow-sm"
                                />
                            ) : (
                                <div className="flex h-40 w-40 items-center justify-center rounded-xl border bg-gray-100 text-sm text-gray-500">
                                    Sin logo
                                </div>
                            )}
                        </div>

                        {company.cover && (
                            <div className="mt-6">
                                <p className="mb-2 text-sm font-semibold text-gray-700">
                                    Portada
                                </p>

                                <img
                                    src={`/storage/${company.cover}`}
                                    alt={`Portada de ${company.name}`}
                                    className="h-40 w-full rounded-lg border object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Datos de la empresa */}
                    <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Datos de la empresa
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Nombre
                                </p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {company.name || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    NIT
                                </p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {company.nit || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Correo electrónico
                                </p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {company.email || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Teléfono
                                </p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {company.phone || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Dirección
                                </p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {company.address || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Ciudad
                                </p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {company.city || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    País
                                </p>
                                <p className="mt-1 font-medium text-gray-800">
                                    {company.country || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Estado
                                </p>

                                <p
                                    className={
                                        company.status
                                            ? 'mt-1 font-semibold text-green-600'
                                            : 'mt-1 font-semibold text-red-600'
                                    }
                                >
                                    {company.status
                                        ? 'Activo'
                                        : 'Inactivo'}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </PageContainer>

        </AppLayout>
    );
}