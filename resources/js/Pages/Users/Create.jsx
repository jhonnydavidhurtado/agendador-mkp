import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';

export default function Create({ companies, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: companies?.[0]?.id ?? '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nit: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        status: true,
        role: roles?.[0]?.name ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout>
            <Head title="Nuevo Usuario" />

            <PageContainer>
                <PageHeader
                    title="Nuevo Usuario"
                    subtitle="Crear un usuario y asignarle un rol"
                />

                <form onSubmit={submit} className="max-w-4xl rounded-xl bg-white p-6 shadow">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block font-medium text-gray-700">Empresa</label>
                            <select
                                value={data.company_id}
                                onChange={(e) => setData('company_id', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            >
                                <option value="">Seleccione...</option>
                                {(companies || []).map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            {errors.company_id && <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Correo</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Confirmar contraseña</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Rol</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            >
                                {(roles || []).map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">NIT</label>
                            <input
                                type="text"
                                value={data.nit}
                                onChange={(e) => setData('nit', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Teléfono</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block font-medium text-gray-700">Dirección</label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">Ciudad</label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-gray-700">País</label>
                            <input
                                type="text"
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-2">
                            <input
                                id="status"
                                type="checkbox"
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="status" className="text-sm text-gray-700">Usuario activo</label>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Guardar usuario'}
                        </button>
                    </div>
                </form>
            </PageContainer>
        </AppLayout>
    );
}
