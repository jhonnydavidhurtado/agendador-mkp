
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ calendar }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Calendario
                </h2>
            }
        >
            <Head title="Información del Calendario" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        <div className="p-6 text-gray-900">

                            <div className="mb-6">
                                <h1 className="text-2xl font-bold">
                                    Información del Calendario
                                </h1>

                                <p className="text-gray-600 mt-1">
                                    Información detallada del calendario
                                </p>
                            </div>

                            <div className="space-y-5">

                                <div>
                                    <dt className="font-semibold">
                                        Empresa
                                    </dt>

                                    <dd className="mt-1">
                                        {calendar.company?.name ?? '-'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="font-semibold">
                                        Asesor
                                    </dt>

                                    <dd className="mt-1">
                                        {calendar.advisor?.user?.name ?? '-'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="font-semibold">
                                        Estado
                                    </dt>

                                    <dd className="mt-1">
                                        {calendar.status ? (
                                            <span className="text-green-600 font-medium">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-medium">
                                                Inactivo
                                            </span>
                                        )}
                                    </dd>
                                </div>

                            </div>

                            <div className="flex gap-4 mt-8">

                                <Link
                                    href={route(
                                        'calendars.days.index',
                                        calendar.id
                                    )}
                                    className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                                >
                                    Administrar días
                                </Link>

                                <Link
                                    href={route(
                                        'calendars.edit',
                                        calendar.id
                                    )}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                                >
                                    Editar
                                </Link>

                                <Link
                                    href={route('calendars.index')}
                                    className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300"
                                >
                                    Volver
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

