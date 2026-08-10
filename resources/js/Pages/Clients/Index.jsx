import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import SearchInput from '@/Components/Table/SearchInput';
import Pagination from '@/Components/Table/Pagination';
import EmptyState from '@/Components/Table/EmptyState';
import TableActions from '@/Components/Table/TableActions';

export default function Index({ clients, filters }) {

    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {

        const value = e.target.value;

        setSearch(value);

        router.get(
            route('clients.index'),
            {
                search: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );

    };

    const handleDelete = (client) => {

        if (
            confirm(
                `¿Deseas eliminar el cliente ${client.name}?`
            )
        ) {

            router.delete(
                route('clients.destroy', client.id)
            );

        }

    };

    return (

        <AppLayout>

            <Head title="Clientes" />

            <PageContainer>

                <PageHeader
                    title="Clientes"
                    subtitle="Administración de clientes"
                    buttonText="Nuevo Cliente"
                    buttonHref={route('clients.create')}
                />

                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre, teléfono o correo..."
                />

                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-6 py-3 text-left">
                                    Cliente
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Empresa
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Teléfono
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Correo
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

                            {clients.data.length === 0 && (

                                <tr>

                                    <td colSpan={6}>

                                        <EmptyState
                                            title="No existen clientes registrados."
                                        />

                                    </td>

                                </tr>

                            )}

                            {clients.data.map((client) => (

                                <tr
                                    key={client.id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-4">
                                        {client.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {client.company?.name ?? '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        {client.phone ?? '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        {client.email ?? '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        {client.status
                                            ? 'Activo'
                                            : 'Inactivo'}
                                    </td>

                                    <td className="px-6 py-4 text-right">

                                        <TableActions
                                            item={client}
                                            showHref={route(
                                                'clients.show',
                                                client.id
                                            )}
                                            editHref={route(
                                                'clients.edit',
                                                client.id
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
                    links={clients.links}
                />

            </PageContainer>

        </AppLayout>
    );
}