import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';

export default function Edit({ user, companies, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        company_id: user.company_id ?? '',
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        password_confirmation: '',
        nit: user.nit ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        city: user.city ?? '',
        country: user.country ?? '',
        status: user.status ?? true,
        role: user.roles?.[0]?.name ?? roles?.[0]?.name ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout>
            <Head title="Editar Usuario" />

            <PageContainer>
                <PageHeader
                    title="Editar Usuario"
                    subtitle={`Actualizar información de ${user.name}`}
                />

                <form onSubmit={submit} className="max-w-4xl rounded-xl bg-white p-6 shadow">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block font-medium text-gray-700">Empresa</label>
                            <select
                                value={data.company_id}
                                onChange={(event) => setData('company_id', event.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            >
                                <option value="">Seleccione...</option>
                                {(companies || []).map((company) => (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                ))}
                            </select>
                            {errors.company_id && <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Nombre</label>
                            <input type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} className="w-full rounded-lg border-gray-300" />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Correo</label>
                            <input type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className="w-full rounded-lg border-gray-300" />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Nueva contraseña</label>
                            <input type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} placeholder="Dejar vacío para conservar" className="w-full rounded-lg border-gray-300" />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Confirmar contraseña</label>
                            <input type="password" value={data.password_confirmation} onChange={(event) => setData('password_confirmation', event.target.value)} className="w-full rounded-lg border-gray-300" />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Rol</label>
                            <select value={data.role} onChange={(event) => setData('role', event.target.value)} className="w-full rounded-lg border-gray-300">
                                {(roles || []).map((role) => <option key={role.id} value={role.name}>{role.name}</option>)}
                            </select>
                            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                        </div>

                        {[
                            ['nit', 'NIT'],
                            ['phone', 'Teléfono'],
                            ['address', 'Dirección'],
                            ['city', 'Ciudad'],
                            ['country', 'País'],
                        ].map(([field, label]) => (
                            <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                                <label className="mb-2 block font-medium text-gray-700">{label}</label>
                                <input type="text" value={data[field]} onChange={(event) => setData(field, event.target.value)} className="w-full rounded-lg border-gray-300" />
                                {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
                            </div>
                        ))}

                        <div className="md:col-span-2 flex items-center gap-2">
                            <input id="status" type="checkbox" checked={data.status} onChange={(event) => setData('status', event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="status" className="text-sm text-gray-700">Usuario activo</label>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <Link href={route('users.index')} className="rounded-lg border px-5 py-2.5">Cancelar</Link>
                        <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50">
                            {processing ? 'Guardando...' : 'Actualizar usuario'}
                        </button>
                    </div>
                </form>
            </PageContainer>
        </AppLayout>
    );
}