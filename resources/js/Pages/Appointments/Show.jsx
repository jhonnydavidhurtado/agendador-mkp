import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

export default function Show({ appointment }) {
    return (
        <AppLayout>
            <Head title={`Cita #${appointment.id}`} />
            <PageContainer>
                <PageHeader title="Detalle de Cita" subtitle={`Cita #${appointment.id}`} />

                <div className="max-w-4xl rounded-xl bg-white p-6 shadow">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Detail label="Empresa" value={appointment.company?.name} />
                        <Detail label="Cliente" value={appointment.client?.name} />
                        <Detail label="Asesor" value={appointment.advisor?.user?.name} />
                        <Detail label="Servicio" value={appointment.service?.name} />
                        <Detail label="Fecha" value={appointment.date} />
                        <Detail label="Hora" value={String(appointment.hour ?? '').slice(0, 5)} />
                        <Detail label="Estado" value={statusLabels[appointment.status] || appointment.status} />
                        <Detail label="Notas" value={appointment.notes} />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                        <Link href={route('appointments.index')} className="rounded-lg border px-4 py-2 hover:bg-gray-100">Volver</Link>
                        <Link href={route('appointments.edit', appointment.id)} className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700">Editar</Link>
                    </div>
                </div>
            </PageContainer>
        </AppLayout>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 font-medium text-gray-800">{value || '-'}</p>
        </div>
    );
}
