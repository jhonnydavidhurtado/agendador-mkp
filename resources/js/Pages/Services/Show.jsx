import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

import PageContainer from '@/Components/Layout/PageContainer';
import Card from '@/Components/Card';

export default function Show({ service }) {

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppLayout>

            <Head title={`Servicio - ${service.name}`} />

            <PageContainer>

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Servicio
                    </h1>

                    <p className="text-gray-500">
                        Información detallada del servicio
                    </p>

                </div>

                <Card title="Información del Servicio">

                    {/* FOTO */}
                    <div className="mb-8">

                        <p className="mb-2 text-sm text-gray-500">
                            Foto del servicio
                        </p>

                        {service.photo ? (
                            <img
                                src={`/storage/${service.photo}`}
                                alt={service.name}
                                className="h-64 w-64 rounded-xl object-cover border shadow-sm"
                            />
                        ) : (
                            <div className="flex h-64 w-64 items-center justify-center rounded-xl border bg-gray-100 text-gray-500">
                                Sin foto
                            </div>
                        )}

                    </div>

                    {/* COLOR */}
                    <div className="mb-6 flex items-center gap-3">

                        <span
                            className="h-6 w-6 rounded-full border"
                            style={{
                                backgroundColor:
                                    service.color || '#0d6efd',
                            }}
                        />

                        <div>

                            <p className="text-sm text-gray-500">
                                Color del servicio
                            </p>

                            <p className="font-medium">
                                {service.color || '-'}
                            </p>

                        </div>

                    </div>

                    {/* INFORMACIÓN */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div>

                            <p className="text-sm text-gray-500">
                                Nombre
                            </p>

                            <p className="font-medium text-gray-800">
                                {service.name}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Empresa
                            </p>

                            <p className="font-medium text-gray-800">
                                {service.company?.name ?? '-'}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Duración
                            </p>

                            <p className="font-medium text-gray-800">
                                {service.duration} minutos
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Precio
                            </p>

                            <p className="font-medium text-gray-800">
                                {formatPrice(service.price)}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Estado
                            </p>

                            <p
                                className={
                                    service.status
                                        ? 'font-semibold text-green-600'
                                        : 'font-semibold text-red-600'
                                }
                            >
                                {service.status
                                    ? 'Activo'
                                    : 'Inactivo'}
                            </p>

                        </div>

                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="mt-6">

                        <p className="text-sm text-gray-500">
                            Descripción
                        </p>

                        <p className="mt-1 whitespace-pre-line text-gray-800">
                            {service.description ?? '-'}
                        </p>

                    </div>

                    {/* BOTONES */}
                    <div className="mt-8 flex gap-3">

                        <Link
                            href={route(
                                'services.edit',
                                service.id
                            )}
                            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
                        >
                            Editar
                        </Link>

                        <Link
                            href={route('services.index')}
                            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                        >
                            Volver
                        </Link>

                    </div>

                </Card>

            </PageContainer>

        </AppLayout>
    );
}

