import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    calendars,
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route('calendars.index'),
            {
                search,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (calendar) => {
        const advisorName =
            calendar.advisor?.user?.name ?? 'este asesor';

        if (
            confirm(
                `¿Deseas eliminar el calendario del asesor ${advisorName}?`
            )
        ) {
            router.delete(
                route('calendars.destroy', calendar.id)
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Calendarios
                </h2>
            }
        >
            <Head title="Calendarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        <div className="p-6 text-gray-900">

                            {/* Encabezado */}
                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Calendarios
                                    </h1>

                                    <p className="text-gray-600">
                                        Administración de calendarios
                                    </p>
                                </div>

                                <Link
                                  href={route('dashboard')}
                                 className="rounded-lg bg-gray-600 px-5 py-2 text-white hover:bg-gray-700"
                               >
                                ← Volver al Dashboard
                              </Link>
                                

                                <Link
                                    href={route('calendars.create')}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                                >
                                    Nuevo Calendario
                                </Link>

                            </div>

                            {/* Buscador */}
                            <form
    onSubmit={handleSearch}
    className="mb-6 flex gap-2"
>
    <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por empresa o asesor..."
        className="flex-1 rounded-lg border-gray-300"
    />

    <button
        type="submit"
        className="rounded-lg bg-gray-800 px-5 py-2 text-white hover:bg-gray-900"
    >
        Buscar
    </button>
</form>

                            {/* Tabla */}
                            <div className="overflow-x-auto">

                                <table className="w-full border-collapse">

                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="px-4 py-3 text-left">
                                                Empresa
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Asesor
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Estado
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {calendars.data.length > 0 ? (

                                            calendars.data.map((calendar) => (

                                                <tr
                                                    key={calendar.id}
                                                    className="border-b"
                                                >

                                                    <td className="px-4 py-3">
                                                        {calendar.company?.name ?? '-'}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {calendar.advisor?.user?.name ?? '-'}
                                                    </td>

                                                    <td className="px-4 py-3">

                                                        {calendar.status ? (
                                                            <span className="text-green-600 font-medium">
                                                                Activo
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600 font-medium">
                                                                Inactivo
                                                            </span>
                                                        )}

                                                    </td>

                                                    <td className="px-4 py-3">

                                                        <div className="flex gap-3">

                                                            <Link
                                                                href={route(
                                                                    'calendars.show',
                                                                    calendar.id
                                                                )}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Ver
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    'calendars.edit',
                                                                    calendar.id
                                                                )}
                                                                className="text-indigo-600 hover:underline"
                                                            >
                                                                Editar
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(calendar)
                                                                }
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                Eliminar
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))

                                        ) : (

                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-4 py-8 text-center text-gray-500"
                                                >
                                                    No se encontraron calendarios.
                                                </td>
                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                            {/* Paginación */}
                            {calendars.links && calendars.links.length > 0 && (

                                <div className="mt-6 flex flex-wrap gap-2">

                                    {calendars.links.map((link, index) => (

                                        <Link
                                            key={index}
                                            href={link.url ?? '#'}
                                            className={`px-3 py-2 rounded border ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-700'
                                            } ${
                                                !link.url
                                                    ? 'opacity-50 pointer-events-none'
                                                    : ''
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}