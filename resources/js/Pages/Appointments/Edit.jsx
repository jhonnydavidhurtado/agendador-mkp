import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';

const statusOptions = [
    ['pending', 'Pendiente'],
    ['confirmed', 'Confirmada'],
    ['completed', 'Completada'],
    ['cancelled', 'Cancelada'],
];

export default function Edit({ appointment, companies, advisors, clients, services }) {
    const { data, setData, put, processing, errors } = useForm({
        company_id: appointment.company_id ?? '',
        advisor_id: appointment.advisor_id ?? '',
        client_id: appointment.client_id ?? '',
        service_id: appointment.service_id ?? '',
        date: appointment.date?.slice(0, 10) ?? '',
        hour: String(appointment.hour ?? '').slice(0, 5),
        status: appointment.status ?? 'pending',
        notes: appointment.notes ?? '',
    });

    const filteredAdvisors = advisors.filter((item) => String(item.company_id) === String(data.company_id));
    const filteredClients = clients.filter((item) => String(item.company_id) === String(data.company_id));
    const filteredServices = services.filter((item) => String(item.company_id) === String(data.company_id));

    const submit = (event) => {
        event.preventDefault();
        put(route('appointments.update', appointment.id));
    };

    const fieldError = (name) => errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>;

    return (
        <AppLayout>
            <Head title="Editar Cita" />
            <PageContainer>
                <PageHeader title="Editar Cita" subtitle={`Actualizar cita #${appointment.id}`} />

                <form onSubmit={submit} className="max-w-4xl space-y-6 rounded-xl bg-white p-6 shadow">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Empresa</label>
                            <select value={data.company_id} onChange={(event) => setData({ ...data, company_id: event.target.value, advisor_id: '', client_id: '', service_id: '' })} className="w-full rounded-lg border-gray-300">
                                <option value="">Seleccione una empresa</option>
                                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                            </select>
                            {fieldError('company_id')}
                        </div>

                        <SelectField label="Asesor" value={data.advisor_id} options={filteredAdvisors.map((item) => ({ id: item.id, name: item.user?.name ?? `Asesor #${item.id}` }))} disabled={!data.company_id} onChange={(value) => setData('advisor_id', value)} error={errors.advisor_id} />
                        <SelectField label="Cliente" value={data.client_id} options={filteredClients} disabled={!data.company_id} onChange={(value) => setData('client_id', value)} error={errors.client_id} />
                        <SelectField label="Servicio" value={data.service_id} options={filteredServices} disabled={!data.company_id} onChange={(value) => setData('service_id', value)} error={errors.service_id} />

                        <Field label="Fecha" type="date" value={data.date} onChange={(value) => setData('date', value)} error={errors.date} />
                        <Field label="Hora" type="time" value={data.hour} onChange={(value) => setData('hour', value)} error={errors.hour} />

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                            <select value={data.status} onChange={(event) => setData('status', event.target.value)} className="w-full rounded-lg border-gray-300">
                                {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                            {fieldError('status')}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
                            <textarea rows="4" value={data.notes} onChange={(event) => setData('notes', event.target.value)} className="w-full rounded-lg border-gray-300" />
                            {fieldError('notes')}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Link href={route('appointments.index')} className="rounded-lg border px-4 py-2 hover:bg-gray-100">Volver</Link>
                        <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Actualizar Cita'}
                        </button>
                    </div>
                </form>
            </PageContainer>
        </AppLayout>
    );
}

function Field({ label, type, value, onChange, error }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border-gray-300" />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function SelectField({ label, value, options, disabled, onChange, error }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="w-full rounded-lg border-gray-300 disabled:bg-gray-100">
                <option value="">Seleccione {label.toLowerCase()}</option>
                {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
