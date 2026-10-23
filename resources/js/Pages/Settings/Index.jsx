import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';

const timezones = [
    'America/Bogota',
    'America/Mexico_City',
    'America/New_York',
    'America/Sao_Paulo',
    'UTC',
];

export default function Index({ companies, selectedCompany, settings, canEdit }) {
    const { data, setData, patch, processing, errors } = useForm({
        company_id: selectedCompany?.id || '',
        timezone: settings.timezone || 'America/Bogota',
        currency: settings.currency || 'COP',
        language: settings.language || 'es',
        appointment_interval: String(settings.appointment_interval || 30),
        start_week: settings.start_week || 'monday',
        primary_color: settings.primary_color || '#0d6efd',
        secondary_color: settings.secondary_color || '#6c757d',
        notifications: Boolean(settings.notifications),
    });

    const changeCompany = (event) => {
        router.get(
            route('settings.index'),
            { company_id: event.target.value },
            { preserveState: false, replace: true }
        );
    };

    const submit = (event) => {
        event.preventDefault();
        patch(route('settings.update'));
    };

    const error = (field) => errors[field] && (
        <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
    );

    return (
        <AppLayout>
            <Head title="Configuración" />

            <PageContainer>
                <PageHeader
                    title="Configuración"
                    subtitle="Preferencias de agenda y empresa"
                />

                {!selectedCompany && (
                    <div className="max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
                        No hay una empresa disponible para configurar. Crea una empresa primero desde la sección Empresas.
                    </div>
                )}

                {selectedCompany && <form onSubmit={submit} className="max-w-4xl space-y-8 rounded-xl bg-white p-6 shadow">
                    <div>
                        <label htmlFor="company_id" className="mb-2 block font-medium text-gray-700">Empresa</label>
                        <select
                            id="company_id"
                            value={data.company_id}
                            onChange={changeCompany}
                            disabled={!canEdit}
                            className="w-full rounded-lg border-gray-300"
                        >
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="timezone" className="mb-2 block font-medium text-gray-700">Zona horaria</label>
                            <select id="timezone" value={data.timezone} onChange={(event) => setData('timezone', event.target.value)} disabled={!canEdit} className="w-full rounded-lg border-gray-300 disabled:bg-gray-100">
                                {timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
                            </select>
                            {error('timezone')}
                        </div>

                        <Field label="Moneda" name="currency" value={data.currency} onChange={(value) => setData('currency', value)} error={errors.currency} disabled={!canEdit} />
                        <Field label="Idioma" name="language" value={data.language} onChange={(value) => setData('language', value)} error={errors.language} disabled={!canEdit} />

                        <div>
                            <label htmlFor="appointment_interval" className="mb-2 block font-medium text-gray-700">Intervalo de citas</label>
                            <select id="appointment_interval" value={data.appointment_interval} onChange={(event) => setData('appointment_interval', event.target.value)} disabled={!canEdit} className="w-full rounded-lg border-gray-300 disabled:bg-gray-100">
                                {[15, 30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutos</option>)}
                            </select>
                            {error('appointment_interval')}
                        </div>

                        <div>
                            <label htmlFor="start_week" className="mb-2 block font-medium text-gray-700">Inicio de semana</label>
                            <select id="start_week" value={data.start_week} onChange={(event) => setData('start_week', event.target.value)} disabled={!canEdit} className="w-full rounded-lg border-gray-300 disabled:bg-gray-100">
                                <option value="monday">Lunes</option>
                                <option value="sunday">Domingo</option>
                            </select>
                            {error('start_week')}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Identidad visual</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ColorField label="Color principal" name="primary_color" value={data.primary_color} onChange={(value) => setData('primary_color', value)} error={errors.primary_color} disabled={!canEdit} />
                            <ColorField label="Color secundario" name="secondary_color" value={data.secondary_color} onChange={(value) => setData('secondary_color', value)} error={errors.secondary_color} disabled={!canEdit} />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 text-gray-700">
                        <input
                            type="checkbox"
                            checked={data.notifications}
                            onChange={(event) => setData('notifications', event.target.checked)}
                            disabled={!canEdit}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Recibir notificaciones de nuevas citas
                    </label>

                    {canEdit && (
                        <div className="flex justify-end border-t pt-6">
                            <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Guardar configuración'}
                            </button>
                        </div>
                    )}
                </form>}
            </PageContainer>
        </AppLayout>
    );
}

function Field({ label, name, value, onChange, error, disabled }) {
    return (
        <div>
            <label htmlFor={name} className="mb-2 block font-medium text-gray-700">{label}</label>
            <input id={name} type="text" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="w-full rounded-lg border-gray-300 disabled:bg-gray-100" />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function ColorField({ label, name, value, onChange, error, disabled }) {
    return (
        <div>
            <label htmlFor={name} className="mb-2 block font-medium text-gray-700">{label}</label>
            <div className="flex gap-3">
                <input id={name} type="color" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="h-10 w-14 rounded border-gray-300 p-1 disabled:bg-gray-100" />
                <input type="text" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="w-full rounded-lg border-gray-300 disabled:bg-gray-100" />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
