import { Head, Link, useForm } from '@inertiajs/react';

import AppLayout from '@/Layouts/AppLayout';

import PageHeader from '@/Components/Form/PageHeader';
import FormSection from '@/Components/Form/FormSection';
import FormInput from '@/Components/Form/FormInput';
import FormSelect from '@/Components/Form/FormSelect';


export default function Edit({ company }) {

    const { data, setData, put, processing, errors } = useForm({

        name: company.name || '',
        nit: company.nit || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        city: company.city || '',
        country: company.country || 'Colombia',
        status: company.status,

    });


    const submit = (e) => {

        e.preventDefault();

        put(route('companies.update', company.id));

    };


    return (

        <AppLayout>

            <Head title="Editar Empresa" />


            <PageHeader

                title="Editar Empresa"

                subtitle="Actualizar información de la empresa"

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

                            onChange={(e) => setData('status', e.target.value === '1')}

                            error={errors.status}

                            options={[

                                {
                                    value: '1',
                                    label: 'Activo'
                                },

                                {
                                    value: '0',
                                    label: 'Inactivo'
                                },

                            ]}

                        />


                    </div>


                    <div className="mt-6">


                        <FormInput

                            label="Dirección"

                            value={data.address}

                            onChange={(e) => setData('address', e.target.value)}

                            error={errors.address}

                        />


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

                        {processing ? 'Actualizando...' : 'Actualizar Empresa'}

                    </button>


                </div>


            </form>


        </AppLayout>

    );

}