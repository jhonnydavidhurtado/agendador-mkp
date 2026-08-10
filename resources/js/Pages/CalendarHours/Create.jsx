import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ calendarDay }) {
    const { data, setData, post, processing, errors } = useForm({
        start_time: '',
        end_time: '',
        status: true,
    });

    const submit = (e) => {
        e.preventDefault();

        post(
            route(
                'calendar-days.hours.store',
                calendarDay.id
            )
        );
    };

    const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Nuevo horario
                </h2>
            }
        >
            <Head title="Nuevo horario" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="mb-6">
                                <h1 className="text-2xl font-bold">
                                    Nuevo horario
                                </h1>

                                <p className="text-gray-600 mt-1">
                                    Agregar un horario al día seleccionado
                                </p>
                            </div>

                            {/* Información del calendario */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">

                                <p className="text-sm text-gray-500">
                                    Calendario
                                </p>

                                <p className="font-semibold">
                                    {calendarDay.calendar?.company?.name ?? '-'}
                                    {' — '}
                                    {calendarDay.calendar?.advisor?.user?.name ?? '-'}
                                </p>

                                <p className="text-sm text-gray-600 mt-1">
                                    Día:{' '}
                                    <span className="font-medium">
                                        {dayNames[calendarDay.day] ??
                                            calendarDay.day ??
                                            '-'}
                                    </span>
                                </p>

                            </div>

                            <form onSubmit={submit}>

                                {/* Hora inicial */}
                                <div className="mb-5">

                                    <label
                                        htmlFor="start_time"
                                        className="block font-medium text-sm text-gray-700"
                                    >
                                        Hora inicial
                                    </label>

                                    <input
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) =>
                                            setData(
                                                'start_time',
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />

                                    {errors.start_time && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.start_time}
                                        </p>
                                    )}

                                </div>

                                {/* Hora final */}
                                <div className="mb-5">

                                    <label
                                        htmlFor="end_time"
                                        className="block font-medium text-sm text-gray-700"
                                    >
                                        Hora final
                                    </label>

                                    <input
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) =>
                                            setData(
                                                'end_time',
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />

                                    {errors.end_time && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.end_time}
                                        </p>
                                    )}

                                </div>

                                {/* Estado */}
                                <div className="mb-6">

                                    <label className="inline-flex items-center">

                                        <input
                                            type="checkbox"
                                            checked={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    'status',
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />

                                        <span className="ml-2 text-sm text-gray-700">
                                            Horario activo
                                        </span>

                                    </label>

                                    {errors.status && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}

                                </div>

                                {/* Botones */}
                                <div className="flex gap-3">

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Guardando...'
                                            : 'Guardar'}
                                    </button>

                                    <Link
                                        href={route(
                                            'calendar-days.hours.index',
                                            calendarDay.id
                                        )}
                                        className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </Link>

                                </div>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

