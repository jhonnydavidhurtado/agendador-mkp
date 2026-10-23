import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import EmptyState from '@/Components/Table/EmptyState';
import Pagination from '@/Components/Table/Pagination';

const statusLabels = {
    pending: 'Pendientes',
    confirmed: 'Confirmadas',
    completed: 'Completadas',
    cancelled: 'Canceladas',
};

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
};

export default function Index({ month, summary, appointments }) {
    const handleMonthChange = (event) => {
        router.get(
            route('reports.index'),
            { month: event.target.value },
            { preserveState: true, replace: true }
        );
    };

    const metrics = [
        { label: 'Total de citas', value: summary.total, color: 'text-gray-900' },
        { label: 'Pendientes', value: summary.pending, color: 'text-amber-600' },
        { label: 'Confirmadas', value: summary.confirmed, color: 'text-blue-600' },
        { label: 'Completadas', value: summary.completed, color: 'text-emerald-600' },
        { label: 'Canceladas', value: summary.cancelled, color: 'text-red-600' },
    ];

    return (
        <AppLayout>
            <Head title="Reportes" />

            <PageContainer>
                <PageHeader
                    title="Reportes"
                    subtitle="Resumen mensual de citas"
                />

                <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                    <label htmlFor="report-month" className="font-medium text-gray-700">
                        Mes del reporte
                    </label>
                    <input
                        id="report-month"
                        type="month"
                        value={month}
                        onChange={handleMonthChange}
                        className="rounded-lg border-gray-300"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">{metric.label}</p>
                            <p className={`mt-2 text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h2 className="font-semibold text-gray-800">Detalle de citas</h2>
                    </div>

                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hora</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Servicio</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Empresa</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.data.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <EmptyState title="No hay citas para el mes seleccionado." />
                                    </td>
                                </tr>
                            )}

                            {appointments.data.map((appointment) => (
                                <tr key={appointment.id} className="border-t">
                                    <td className="px-6 py-4 text-gray-700">{appointment.date}</td>
                                    <td className="px-6 py-4 text-gray-700">{appointment.hour}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{appointment.client || '-'}</td>
                                    <td className="px-6 py-4 text-gray-700">{appointment.service || '-'}</td>
                                    <td className="px-6 py-4 text-gray-700">{appointment.company || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[appointment.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {statusLabels[appointment.status] || appointment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination links={appointments.links} />
            </PageContainer>
        </AppLayout>
    );
}
