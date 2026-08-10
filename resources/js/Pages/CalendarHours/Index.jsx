import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ calendarDay, hours }) {
    const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    const formatTime = (time) => {
        if (!time) {
            return '-';
        }

        return time.substring(0, 5);
    };

    const handleDelete = (hour) => {
        if (
            !confirm(
                `¿Estás seguro de eliminar el horario ${formatTime(
                    hour.start_time
                )} - ${formatTime(hour.end_time)}?`
            )
        ) {
            return;
        }

        router.delete(
            route('calendar-days.hours.destroy', [
                calendarDay.id,
                hour.id,
            ])
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Horarios del día
                </h2>
            }
        >
            <Head title="Horarios del día" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Encabezado */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Horarios
                                    </h1>

                                    <p className="text-gray-600 mt-1">
                                        Administrar horarios del día
                                    </p>
                                </div>

                                <Link
                                    href={route(
                                        'calendar-days.hours.create',
                                        calendarDay.id
                                    )}
                                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
                                >
                                    + Nuevo horario
                                </Link>

                            </div>

                            {/* Información del calendario */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Calendario
                                        </p>

                                        <p className="font-semibold">
                                            {calendarDay.calendar?.company?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Asesor
                                        </p>

                                        <p className="font-semibold">
                                            {calendarDay.calendar?.advisor?.user?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Día
                                        </p>

                                        <p className="font-semibold">
                                            {dayNames[calendarDay.day] ??
                                                calendarDay.day ??
                                                '-'}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Tabla */}
                            {hours.length > 0 ? (
                                <div className="overflow-x-auto">

                                    <table className="min-w-full divide-y divide-gray-200">

                                        <thead className="bg-gray-50">

                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hora inicio
                                                </th>

                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hora final
                                                </th>

                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>

                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>

                                        </thead>

                                        <tbody className="bg-white divide-y divide-gray-200">

                                            {hours.map((hour) => (

                                                <tr key={hour.id}>

                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                        {formatTime(
                                                            hour.start_time
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        {formatTime(
                                                            hour.end_time
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">

                                                        {hour.status ? (
                                                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                                                Activo
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                                                                Inactivo
                                                            </span>
                                                        )}

                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-right">

                                                        <div className="flex justify-end gap-2">

                                                            <Link
                                                                href={route(
                                                                    'calendar-days.hours.show',
                                                                    [
                                                                        calendarDay.id,
                                                                        hour.id,
                                                                    ]
                                                                )}
                                                                className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                            >
                                                                Ver
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    'calendar-days.hours.edit',
                                                                    [
                                                                        calendarDay.id,
                                                                        hour.id,
                                                                    ]
                                                                )}
                                                                className="rounded-lg bg-indigo-100 px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-200"
                                                            >
                                                                Editar
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        hour
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                                                            >
                                                                Eliminar
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            ) : (

                                <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">

                                    <h3 className="text-lg font-semibold text-gray-800">
                                        No hay horarios configurados
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        Este día todavía no tiene horarios registrados.
                                    </p>

                                    <Link
                                        href={route(
                                            'calendar-days.hours.create',
                                            calendarDay.id
                                        )}
                                        className="inline-flex mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
                                    >
                                        Crear primer horario
                                    </Link>

                                </div>

                            )}

                            {/* Volver */}
                            <div className="mt-6">

                                <Link
                                    href={route(
                                        'calendars.days.index',
                                        calendarDay.calendar_id
                                    )}
                                    className="inline-flex rounded-lg bg-gray-200 px-5 py-2.5 text-gray-700 hover:bg-gray-300"
                                >
                                    ← Volver a días
                                </Link>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}