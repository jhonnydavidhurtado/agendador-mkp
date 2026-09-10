import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import SearchInput from '@/Components/Table/SearchInput';
import Pagination from '@/Components/Table/Pagination';
import EmptyState from '@/Components/Table/EmptyState';
import TableActions from '@/Components/Table/TableActions';

export default function Index({ managers, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        router.get(
            route('managers.index'),
            {
                search: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (manager) => {
        if (
            confirm(
                `¿Deseas eliminar al Manager ${manager.name}?`
            )
        ) {
            router.delete(
                route('managers.destroy', manager.id)
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Managers" />

            <PageContainer>
                <PageHeader
                    title="Managers"
                    subtitle="Administración de managers"
                    buttonText="Nuevo Manager"
                    buttonHref={route('managers.create')}
                />

                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre, correo o empresa..."
                />

                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    Nombre
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Correo
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Empresa
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
                            {managers.data.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyState
                                            title="No existen managers registrados."
                                        />
                                    </td>
                                </tr>
                            )}

                            {managers.data.map((manager) => (
                                <tr
                                    key={manager.id}
                                    className="border-t"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {manager.name}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        {manager.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        {manager.company?.name ?? '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        {manager.status
                                            ? 'Activo'
                                            : 'Inactivo'}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <TableActions
                                            item={manager}
                                            showHref={route(
                                                'managers.show',
                                                manager.id
                                            )}
                                            editHref={route(
                                                'managers.edit',
                                                manager.id
                                            )}
                                            onDelete={handleDelete}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={managers.links} />
            </PageContainer>
        </AppLayout>
    );
}