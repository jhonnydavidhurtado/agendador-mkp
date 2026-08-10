import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

export default function Index({ calendar, days = [] }) {

    const handleDelete = (day) => {
        const dayName = dayNames[day.day] ?? day.day;

        if (
            confirm(
                `¿Deseas eliminar el día ${dayName} del calendario?`
            )
        ) {
            router.delete(
                route('calendars.days.destroy', [
                    calendar.id,
                    day.id,
                ])
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Días del calendario
                </h2>
            }
        >
            <Head title="Días del calendario" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        <div className="p-6 text-gray-900">

                            {/* Encabezado */}
                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Días del calendario
                                    </h1>

                                    <p className="text-gray-600 mt-1">
                                        {calendar.company?.name ?? '-'}
                                        {' — '}
                                        {calendar.advisor?.user?.name ?? '-'}
                                    </p>
                                </div>

                                <Link
                                    href={route(
                                        'calendars.days.create',
                                        calendar.id
                                    )}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                                >
                                    Nuevo Día
                                </Link>

                            </div>

                            {/* Información del calendario */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Empresa
                                        </p>

                                        <p className="font-semibold">
                                            {calendar.company?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Asesor
                                        </p>

                                        <p className="font-semibold">
                                            {calendar.advisor?.user?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Estado
                                        </p>

                                        {calendar.status ? (
                                            <span className="text-green-600 font-medium">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-medium">
                                                Inactivo
                                            </span>
                                        )}
                                    </div>

                                </div>

                            </div>

                            {/* Tabla */}
                            <div className="overflow-x-auto">

                                <table className="w-full border-collapse">

                                    <thead>
                                        <tr className="border-b bg-gray-50">

                                            <th className="px-4 py-3 text-left">
                                                Día
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Estado
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Horarios
                                            </th>

                                            <th className="px-4 py-3 text-left">
                                                Acciones
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {days.length > 0 ? (

                                            days.map((day) => (

                                                <tr
                                                    key={day.id}
                                                    className="border-b"
                                                >

                                                    <td className="px-4 py-3 font-medium">
                                                        {dayNames[day.day] ?? day.day}
                                                    </td>

                                                    <td className="px-4 py-3">

                                                        {day.status ? (
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

                                                        {day.hours?.length > 0 ? (
                                                            <span className="text-gray-700">
                                                                {day.hours.length}{' '}
                                                                {day.hours.length === 1
                                                                    ? 'horario'
                                                                    : 'horarios'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                Sin horarios
                                                            </span>
                                                        )}

                                                    </td>

                                                    <td className="px-4 py-3">

                                                        <div className="flex gap-3">

                                                            <Link
                                                                href={route(
                                                                    'calendars.days.show',
                                                                    [
                                                                        calendar.id,
                                                                        day.id,
                                                                    ]
                                                                )}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Ver
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    'calendars.days.edit',
                                                                    [
                                                                        calendar.id,
                                                                        day.id,
                                                                    ]
                                                                )}
                                                                className="text-indigo-600 hover:underline"
                                                            >
                                                                Editar
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(day)
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
                                                    No hay días configurados
                                                    para este calendario.
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                            {/* Botón volver */}
                            <div className="mt-6">

                                <Link
                                    href={route('calendars.show', calendar.id)}
                                    className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300"
                                >
                                    Volver al calendario
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </AuthenticatedLayout>
    );
}