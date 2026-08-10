import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const dayOptions = [
{ value: 'monday', label: 'Lunes' },
{ value: 'tuesday', label: 'Martes' },
{ value: 'wednesday', label: 'Miércoles' },
{ value: 'thursday', label: 'Jueves' },
{ value: 'friday', label: 'Viernes' },
{ value: 'saturday', label: 'Sábado' },
{ value: 'sunday', label: 'Domingo' },
];

export default function Edit({ calendar, day }) {
const { data, setData, put, processing, errors } = useForm({
day: day.day ?? '',
status: Boolean(day.status),
});


const submit = (e) => {
    e.preventDefault();

    put(
        route(
            'calendars.days.update',
            [calendar.id, day.id]
        )
    );
};

return (
    <AuthenticatedLayout
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Editar día
            </h2>
        }
    >
        <Head title="Editar día" />

        <div className="py-12">
            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                    <div className="p-6 text-gray-900">

                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">
                                Editar día
                            </h1>

                            <p className="text-gray-600 mt-1">
                                Modificar la configuración del día
                            </p>
                        </div>

                        <div className="mb-6 rounded-lg bg-gray-50 p-4">

                            <p className="text-sm text-gray-500">
                                Calendario
                            </p>

                            <p className="font-semibold">
                                {calendar.company?.name ?? '-'}
                                {' — '}
                                {calendar.advisor?.user?.name ?? '-'}
                            </p>

                        </div>

                        <form onSubmit={submit}>

                            <div className="mb-5">

                                <label
                                    htmlFor="day"
                                    className="block font-medium text-sm text-gray-700"
                                >
                                    Día
                                </label>

                                <select
                                    id="day"
                                    value={data.day}
                                    onChange={(e) =>
                                        setData('day', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {dayOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {errors.day && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.day}
                                    </p>
                                )}

                            </div>

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
                                        Día activo
                                    </span>

                                </label>

                                {errors.status && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}

                            </div>

                            <div className="flex gap-3">

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Actualizando...'
                                        : 'Actualizar'}
                                </button>

                                <Link
                                    href={route(
                                        'calendars.days.index',
                                        calendar.id
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
