import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import SearchInput from '@/Components/Table/SearchInput';
import Pagination from '@/Components/Table/Pagination';
import EmptyState from '@/Components/Table/EmptyState';
import TableActions from '@/Components/Table/TableActions';

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

export default function Index({ appointments, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value);

        router.get(
            route('appointments.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (appointment) => {
        if (confirm('¿Deseas eliminar esta cita?')) {
            router.delete(route('appointments.destroy', appointment.id));
        }
    };

    return (
        <AppLayout>
            <Head title="Citas" />

            <PageContainer>
                <PageHeader
                    title="Citas"
                    subtitle="Gestión de citas del sistema"
                    buttonText="Nueva Cita"
                    buttonHref={route('appointments.create')}
                />

                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por cliente, asesor, servicio o empresa..."
                />

                <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hora</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Asesor</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Servicio</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.data.length === 0 && (
                                <tr>
                                    <td colSpan={7}>
                                        <EmptyState title="No existen citas registradas." />
                                    </td>
                                </tr>
                            )}

                            {appointments.data.map((appointment) => (
                                <tr key={appointment.id} className="border-t">
                                    <td className="px-6 py-4 text-gray-700">{appointment.date}</td>
                                    <td className="px-6 py-4 text-gray-700">{String(appointment.hour).slice(0, 5)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{appointment.client?.name ?? '-'}</td>
                                    <td className="px-6 py-4 text-gray-700">{appointment.advisor?.user?.name ?? '-'}</td>
                                    <td className="px-6 py-4 text-gray-700">{appointment.service?.name ?? '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[appointment.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {statusLabels[appointment.status] || appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <TableActions
                                            item={appointment}
                                            showHref={route('appointments.show', appointment.id)}
                                            editHref={route('appointments.edit', appointment.id)}
                                            onDelete={handleDelete}
                                        />
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
