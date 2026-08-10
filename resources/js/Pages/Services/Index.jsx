
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import SearchInput from '@/Components/Table/SearchInput';
import Pagination from '@/Components/Table/Pagination';
import EmptyState from '@/Components/Table/EmptyState';
import TableActions from '@/Components/Table/TableActions';

export default function Index({ services, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        router.get(
            route('services.index'),
            {
                search: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (service) => {
        if (
            confirm(
                `¿Deseas eliminar el servicio ${service.name}?`
            )
        ) {
            router.delete(
                route('services.destroy', service.id)
            );
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppLayout>

            <Head title="Servicios" />

            <PageContainer>

                <PageHeader
                    title="Servicios"
                    subtitle="Administración de servicios"
                    buttonText="Nuevo Servicio"
                    buttonHref={route('services.create')}
                />

                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por servicio, empresa o descripción..."
                />

                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-6 py-3 text-left">
                                    Servicio
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Empresa
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Duración
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Precio
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Estado
                                </th>

                                <th className="px-6 py-3 text-right">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {services.data.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <EmptyState
                                            title="No existen servicios registrados."
                                        />
                                    </td>
                                </tr>
                            )}

                            {services.data.map((service) => (

                                <tr
                                    key={service.id}
                                    className="border-t"
                                >

                                    {/* Servicio + Foto */}
                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-3">

                                            {service.photo ? (
                                                <img
                                                    src={`/storage/${service.photo}`}
                                                    alt={service.name}
                                                    className="h-14 w-14 rounded-lg object-cover border shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-gray-100 text-xs text-gray-500">
                                                    Sin foto
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">

                                                <span
                                                    className="h-4 w-4 flex-shrink-0 rounded-full border"
                                                    style={{
                                                        backgroundColor:
                                                            service.color || '#0d6efd',
                                                    }}
                                                />

                                                <span className="font-medium text-gray-800">
                                                    {service.name}
                                                </span>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Empresa */}
                                    <td className="px-6 py-4">
                                        {service.company?.name ?? '-'}
                                    </td>

                                    {/* Duración */}
                                    <td className="px-6 py-4">
                                        {service.duration} min
                                    </td>

                                    {/* Precio */}
                                    <td className="px-6 py-4">
                                        {formatPrice(service.price)}
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4">

                                        <span
                                            className={
                                                service.status
                                                    ? 'font-semibold text-green-600'
                                                    : 'font-semibold text-red-600'
                                            }
                                        >
                                            {service.status
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </span>

                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4 text-right">

                                        <TableActions
                                            item={service}
                                            showHref={route(
                                                'services.show',
                                                service.id
                                            )}
                                            editHref={route(
                                                'services.edit',
                                                service.id
                                            )}
                                            onDelete={handleDelete}
                                        />

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <Pagination
                    links={services.links}
                />

            </PageContainer>

        </AppLayout>
    );
}

