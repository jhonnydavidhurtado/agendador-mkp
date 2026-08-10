
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

export default function Show({ calendar, day }) {
    const dayName = dayNames[day?.day] ?? day?.day ?? '-';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detalle del día
                </h2>
            }
        >
            <Head title={`Día - ${dayName}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {dayName}
                                    </h1>

                                    <p className="mt-1 text-gray-600">
                                        Información y horarios del día
                                    </p>
                                </div>

                                <span
                                    className={
                                        day.status
                                            ? 'inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800'
                                            : 'inline-flex w-fit rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800'
                                    }
                                >
                                    {day.status ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-5 mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Información del calendario
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Empresa
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {calendar?.company?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Asesor
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {calendar?.advisor?.user?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Día
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {dayName}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-5 mb-6">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Horarios
                                        </h2>

                                        <p className="mt-1 text-gray-600">
                                            {day.hours?.length > 0
                                                ? `${day.hours.length} horario(s) configurado(s)`
                                                : 'Sin horarios configurados'}
                                        </p>
                                    </div>

                                    <Link
                                        href={route(
                                            'calendar-days.hours.index',
                                            day.id
                                        )}
                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
                                    >
                                        Administrar horarios
                                    </Link>

                                </div>

                                {day.hours?.length > 0 && (
                                    <div className="mt-5 overflow-x-auto">

                                        <table className="min-w-full divide-y divide-gray-200">

                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Inicio
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fin
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y divide-gray-200">

                                                {day.hours.map((hour) => (
                                                    <tr key={hour.id}>

                                                        <td className="px-4 py-3 font-medium text-gray-900">
                                                            {hour.start_time?.substring(0, 5) ?? '-'}
                                                        </td>

                                                        <td className="px-4 py-3 text-gray-700">
                                                            {hour.end_time?.substring(0, 5) ?? '-'}
                                                        </td>

                                                        <td className="px-4 py-3">

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

                                                    </tr>
                                                ))}

                                            </tbody>

                                        </table>

                                    </div>
                                )}

                            </div>

                            <div className="flex flex-wrap gap-3">

                                <Link
                                    href={route(
                                        'calendar-days.hours.index',
                                        day.id
                                    )}
                                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
                                >
                                    Administrar horarios
                                </Link>

                                <Link
                                    href={route(
                                        'calendars.days.edit',
                                        [calendar.id, day.id]
                                    )}
                                    className="rounded-lg bg-gray-100 px-5 py-2.5 text-gray-700 hover:bg-gray-200"
                                >
                                    Editar día
                                </Link>

                                <Link
                                    href={route(
                                        'calendars.days.index',
                                        calendar.id
                                    )}
                                    className="rounded-lg bg-gray-200 px-5 py-2.5 text-gray-700 hover:bg-gray-300"
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

