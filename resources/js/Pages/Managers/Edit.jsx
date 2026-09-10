import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';

export default function Edit({ manager, companies }) {
    const { data, setData, put, processing, errors } = useForm({
        company_id: manager.company_id ?? '',
        name: manager.name ?? '',
        email: manager.email ?? '',
        password: '',
        password_confirmation: '',
        phone: manager.phone ?? '',
        address: manager.address ?? '',
        city: manager.city ?? '',
        country: manager.country ?? '',
        status: manager.status ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('managers.update', manager.id));
    };

    return (
        <AppLayout>
            <Head title="Editar Manager" />

            <PageContainer>
                <PageHeader
                    title="Editar Manager"
                    subtitle={`Editar ${manager.name}`}
                />

                <form
                    onSubmit={submit}
                    className="max-w-3xl rounded-xl bg-white p-6 shadow"
                >
                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="md:col-span-2">
                            <label className="mb-2 block font-medium">
                                Empresa
                            </label>

                            <select
                                value={data.company_id}
                                onChange={(e) =>
                                    setData(
                                        'company_id',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            >
                                <option value="">
                                    Seleccione...
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

                        <div>
                            <label className="mb-2 block font-medium">
                                Nombre
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Correo
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData(
                                        'email',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />

                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Nueva contraseña
                            </label>

                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData(
                                        'password',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                                placeholder="Dejar vacío para conservar"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Confirmar contraseña
                            </label>

                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Teléfono
                            </label>

                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) =>
                                    setData(
                                        'phone',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Ciudad
                            </label>

                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) =>
                                    setData(
                                        'city',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block font-medium">
                                Dirección
                            </label>

                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) =>
                                    setData(
                                        'address',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                País
                            </label>

                            <input
                                type="text"
                                value={data.country}
                                onChange={(e) =>
                                    setData(
                                        'country',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-8">
                            <input
                                type="checkbox"
                                checked={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.checked
                                    )
                                }
                            />

                            <span>Activo</span>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <Link
                            href={route('managers.index')}
                            className="rounded-lg border px-5 py-2.5"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing
                                ? 'Guardando...'
                                : 'Actualizar Manager'}
                        </button>
                    </div>
                </form>
            </PageContainer>
        </AppLayout>
    );
}