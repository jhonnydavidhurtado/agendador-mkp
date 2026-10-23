import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import EmptyState from '@/Components/Table/EmptyState';

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
};

export default function Dashboard({ date, summary, appointments }) {
    const metrics = [
        { label: 'Citas de hoy', value: summary.total, color: 'text-gray-900' },
        { label: 'Pendientes', value: summary.pending, color: 'text-amber-600' },
        { label: 'Confirmadas', value: summary.confirmed, color: 'text-blue-600' },
        { label: 'Completadas', value: summary.completed, color: 'text-emerald-600' },
        { label: 'Canceladas', value: summary.cancelled, color: 'text-red-600' },
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <PageContainer>
                <PageHeader title="Dashboard" subtitle={`Resumen de citas para hoy, ${date}`} />

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
                        <h2 className="font-semibold text-gray-800">Agenda de hoy</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hora</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Asesor</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Servicio</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Empresa</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 && (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyState title="No hay citas programadas para hoy." />
                                        </td>
                                    </tr>
                                )}

                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="border-t">
                                        <td className="px-6 py-4 text-gray-700">{appointment.hour}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{appointment.client || '-'}</td>
                                        <td className="px-6 py-4 text-gray-700">{appointment.advisor || '-'}</td>
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
                </div>
            </PageContainer>
        </AppLayout>
    );
}