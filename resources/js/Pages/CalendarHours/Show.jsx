
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

export default function Show({ calendarDay, hour }) {
    const dayName =
        dayNames[calendarDay?.day] ??
        calendarDay?.day ??
        '-';

    const startTime =
        hour?.start_time?.substring(0, 5) ?? '-';

    const endTime =
        hour?.end_time?.substring(0, 5) ?? '-';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detalle del horario
                </h2>
            }
        >
            <Head title={`Horario - ${startTime} - ${endTime}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        <div className="p-6 text-gray-900">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Detalle del horario
                                    </h1>

                                    <p className="mt-1 text-gray-600">
                                        Información del horario configurado
                                    </p>
                                </div>

                                <span
                                    className={
                                        hour.status
                                            ? 'inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800'
                                            : 'inline-flex w-fit rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800'
                                    }
                                >
                                    {hour.status
                                        ? 'Activo'
                                        : 'Inactivo'}
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
                                            {calendarDay?.calendar?.company?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Asesor
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {calendarDay?.calendar?.advisor?.user?.name ?? '-'}
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

                            <div className="rounded-lg border border-gray-200 p-6 mb-6">

                                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                    Horario
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Hora inicial
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            {startTime}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Hora final
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            {endTime}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-wrap gap-3">

                                <Link
                                    href={route(
                                        'calendar-days.hours.edit',
                                        [
                                            calendarDay.id,
                                            hour.id,
                                        ]
                                    )}
                                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
                                >
                                    Editar horario
                                </Link>

                                <Link
                                    href={route(
                                        'calendar-days.hours.index',
                                        calendarDay.id
                                    )}
                                    className="rounded-lg bg-gray-200 px-5 py-2.5 text-gray-700 hover:bg-gray-300"
                                >
                                    ← Volver a horarios
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </AuthenticatedLayout>
    );
}

