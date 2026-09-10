import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import SearchInput from '@/Components/Table/SearchInput';
import Pagination from '@/Components/Table/Pagination';
import EmptyState from '@/Components/Table/EmptyState';
import TableActions from '@/Components/Table/TableActions';

export default function Index({ advisors, filters }) {

    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {

        const value = e.target.value;

        setSearch(value);

        router.get(
            route('advisors.index'),
            {
                search: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );

    };

    const handleDelete = (advisor) => {

        if (confirm(`¿Deseas eliminar el asesor ${advisor.user?.name}?`)) {

            router.delete(
                route('advisors.destroy', advisor.id)
            );

        }

    };

    return (
        <AppLayout>

            <Head title="Asesores" />

            <PageContainer>

                <PageHeader
                    title="Asesores"
                    subtitle="Administración de asesores"
                    buttonText="Nuevo Asesor"
                    buttonHref={route('advisors.create')}
                />

                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por usuario, empresa o profesión..."
                />

                <div className="overflow-hidden rounded-xl bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-6 py-3 text-left">
                                    Usuario
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Empresa
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Profesión
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

                            {advisors.data.length === 0 && (

                                <tr>

                                    <td colSpan={5}>

                                        <EmptyState
                                            title="No existen asesores registrados."
                                        />

                                    </td>

                                </tr>

                            )}

                            {advisors.data.map((advisor) => (

                                <tr
                                    key={advisor.id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-4">
    <div className="flex items-center gap-3">
        {advisor.photo ? (
            <img
                src={`/storage/${advisor.photo}`}
                alt={advisor.user?.name ?? 'Asesor'}
                className="h-12 w-12 rounded-full border object-cover shadow-sm"
            />
        ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-gray-100 text-xs text-gray-500">
                Sin foto
            </div>
        )}

        <div>
            <p className="font-medium text-gray-800">
                {advisor.user?.name ?? '-'}
            </p>

            <p className="text-sm text-gray-500">
                {advisor.user?.email ?? '-'}
            </p>
        </div>
    </div>
</td>

                                    <td className="px-6 py-4">
                                       {advisor.company?.name ?? '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                       {advisor.profession ?? '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        {advisor.status
                                            ? 'Activo'
                                            : 'Inactivo'}
                                    </td>

                                    <td className="px-6 py-4 text-right">

                                        <TableActions
                                            item={advisor}
                                            showHref={route(
                                                'advisors.show',
                                                advisor.id
                                            )}
                                            editHref={route(
                                                'advisors.edit',
                                                advisor.id
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
                    links={advisors.links}
                />

            </PageContainer>

        </AppLayout>
    );

}