import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

import Card from '@/Components/Card';
import FlashMessage from '@/Components/Layout/FlashMessage';

export default function Create({
    auth,
    companies,
    advisors,
    clients,
    services,
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        company_id: '',
        advisor_id: '',
        client_id: '',
        service_id: '',
        date: '',
        hour: '',
        status: 'pending',
        notes: '',
    });

    const filteredAdvisors = advisors.filter(
        (advisor) =>
            String(advisor.company_id) === String(data.company_id)
    );

    const filteredClients = clients.filter(
        (client) =>
            String(client.company_id) === String(data.company_id)
    );

    const filteredServices = services.filter(
        (service) =>
            String(service.company_id) === String(data.company_id)
    );

    const handleCompanyChange = (e) => {
        const companyId = e.target.value;

        setData((currentData) => ({
            ...currentData,
            company_id: companyId,
            advisor_id: '',
            client_id: '',
            service_id: '',
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('appointments.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Nueva Cita
                </h2>
            }
        >
            <Head title="Nueva Cita" />

            <div className="py-6">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">

                    <FlashMessage />

                    <Card title="Crear Cita">

                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >

                            {/* Empresa */}
                            <div>
                                <label
                                    htmlFor="company_id"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Empresa
                                </label>

                                <select
                                    id="company_id"
                                    value={data.company_id}
                                    onChange={handleCompanyChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">
                                        Seleccione una empresa
                                    </option>

                                    {companies.map((company) => (
                                        <option
                                            key={company.id}
                                            value={company.id}
                                        >
                                            {company.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.company_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.company_id}
                                    </p>
                                )}
                            </div>

                            {/* Asesor */}
                            <div>
                                <label
                                    htmlFor="advisor_id"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Asesor
                                </label>

                                <select
                                    id="advisor_id"
                                    value={data.advisor_id}
                                    onChange={(e) =>
                                        setData(
                                            'advisor_id',
                                            e.target.value
                                        )
                                    }
                                    disabled={!data.company_id}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        Seleccione un asesor
                                    </option>

                                    {filteredAdvisors.map((advisor) => (
                                        <option
                                            key={advisor.id}
                                            value={advisor.id}
                                        >
                                            {advisor.user?.name ??
                                                `Asesor #${advisor.id}`}
                                        </option>
                                    ))}
                                </select>

                                {errors.advisor_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.advisor_id}
                                    </p>
                                )}
                            </div>

                            {/* Cliente */}
                            <div>
                                <label
                                    htmlFor="client_id"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Cliente
                                </label>

                                <select
                                    id="client_id"
                                    value={data.client_id}
                                    onChange={(e) =>
                                        setData(
                                            'client_id',
                                            e.target.value
                                        )
                                    }
                                    disabled={!data.company_id}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        Seleccione un cliente
                                    </option>

                                    {filteredClients.map((client) => (
                                        <option
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.client_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.client_id}
                                    </p>
                                )}
                            </div>

                            {/* Servicio */}
                            <div>
                                <label
                                    htmlFor="service_id"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Servicio
                                </label>

                                <select
                                    id="service_id"
                                    value={data.service_id}
                                    onChange={(e) =>
                                        setData(
                                            'service_id',
                                            e.target.value
                                        )
                                    }
                                    disabled={!data.company_id}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        Seleccione un servicio
                                    </option>

                                    {filteredServices.map((service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                            {service.duration
                                                ? ` (${service.duration} min)`
                                                : ''}
                                        </option>
                                    ))}
                                </select>

                                {errors.service_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.service_id}
                                    </p>
                                )}
                            </div>

                            {/* Fecha y hora */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="date"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Fecha
                                    </label>

                                    <input
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) =>
                                            setData(
                                                'date',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />

                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="hour"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Hora
                                    </label>

                                    <input
                                        id="hour"
                                        type="time"
                                        value={data.hour}
                                        onChange={(e) =>
                                            setData(
                                                'hour',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />

                                    {errors.hour && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.hour}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* Estado */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Estado
                                </label>

                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            'status',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="pending">
                                        Pendiente
                                    </option>

                                    <option value="confirmed">
                                        Confirmada
                                    </option>

                                    <option value="completed">
                                        Completada
                                    </option>

                                    <option value="cancelled">
                                        Cancelada
                                    </option>
                                </select>

                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Notas */}
                            <div>
                                <label
                                    htmlFor="notes"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Notas
                                </label>

                                <textarea
                                    id="notes"
                                    rows="4"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData(
                                            'notes',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Observaciones de la cita..."
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 border-t pt-6">

                                <Link
                                    href={route('appointments.index')}
                                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                                >
                                    Volver
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Guardando...'
                                        : 'Guardar Cita'}
                                </button>

                            </div>

                        </form>

                    </Card>

                </div>
            </div>

        </AuthenticatedLayout>
    );
}