import { Head, Link, useForm } from '@inertiajs/react';

import AppLayout from '@/Layouts/AppLayout';

import PageHeader from '@/Components/Form/PageHeader';
import FormSection from '@/Components/Form/FormSection';
import FormInput from '@/Components/Form/FormInput';
import FormSelect from '@/Components/Form/FormSelect';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nit: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Colombia',
        logo: null,
        cover: null,
        status: true,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('companies.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>

            <Head title="Nueva Empresa" />

            <PageHeader
                title="Nueva Empresa"
                subtitle="Registrar una nueva empresa en el sistema"
            />

            <form onSubmit={submit} className="space-y-6">

                <FormSection title="Información General">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <FormInput
                            label="Nombre"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />

                        <FormInput
                            label="NIT"
                            value={data.nit}
                            onChange={(e) => setData('nit', e.target.value)}
                            error={errors.nit}
                        />

                        <FormInput
                            label="Correo Electrónico"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                        />

                        <FormInput
                            label="Teléfono"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            error={errors.phone}
                        />

                        <FormInput
                            label="Ciudad"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            error={errors.city}
                        />

                        <FormInput
                            label="País"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            error={errors.country}
                        />

                        <FormSelect
                            label="Estado"
                            value={data.status ? '1' : '0'}
                            onChange={(e) =>
                                setData('status', e.target.value === '1')
                            }
                            error={errors.status}
                            options={[
                                {
                                    value: '1',
                                    label: 'Activo',
                                },
                                {
                                    value: '0',
                                    label: 'Inactivo',
                                },
                            ]}
                        />

                    </div>

                    <div className="mt-6">

                        <FormInput
                            label="Dirección"
                            value={data.address}
                            onChange={(e) =>
                                setData('address', e.target.value)
                            }
                            error={errors.address}
                        />

                    </div>

                    {/* Imágenes */}

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Logo */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'logo',
                                        e.target.files[0] || null
                                    )
                                }
                                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                            />

                            {errors.logo && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.logo}
                                </p>
                            )}

                            <p className="mt-1 text-xs text-gray-500">
                                Máximo 2 MB.
                            </p>
                        </div>

                        {/* Portada */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Portada
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'cover',
                                        e.target.files[0] || null
                                    )
                                }
                                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                            />

                            {errors.cover && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.cover}
                                </p>
                            )}

                            <p className="mt-1 text-xs text-gray-500">
                                Máximo 4 MB.
                            </p>
                        </div>

                    </div>

                </FormSection>

                <div className="flex justify-end gap-3">

                    <Link
                        href={route('companies.index')}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing
                            ? 'Guardando...'
                            : 'Guardar Empresa'}
                    </button>

                </div>

            </form>

        </AppLayout>
    );
}