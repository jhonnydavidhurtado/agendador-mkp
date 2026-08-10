import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import SearchInput from '@/Components/Table/SearchInput';
import Pagination from '@/Components/Table/Pagination';
import EmptyState from '@/Components/Table/EmptyState';
import TableActions from '@/Components/Table/TableActions';

export default function Index({ companies, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;
    
        setSearch(value);
    
        router.get(
            route('companies.index'),
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };
    
    
    const handleDelete = (company) => {
    
        if (confirm(`¿Deseas eliminar la empresa ${company.name}?`)) {
    
            router.delete(
                route('companies.destroy', company.id)
            );
    
        }
    
    };

    return (
        <AppLayout>
            <Head title="Empresas" />

            <PageContainer>
                <PageHeader
                    title="Empresas"
                    subtitle="Administración de empresas"
                    buttonText="Nueva Empresa"
                    buttonHref={route('companies.create')}
                />

                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre o NIT..."
                />

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    Nombre
                                </th>

                                <th className="px-6 py-3 text-left">
                                    NIT
                                </th>

                                <th className="px-6 py-3 text-left">
                                    Email
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
                            {companies.data.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyState title="No existen empresas registradas." />
                                    </td>
                                </tr>
                            )}

                            {companies.data.map((company) => (
                                <tr
                                    key={company.id}
                                    className="border-t"
                                >
                                    <td className="px-6 py-4">
                                        {company.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.nit}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        {company.status ? 'Activo' : 'Inactivo'}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                       
                                    <TableActions
                                       item={company}
                                       showHref={route('companies.show', company.id)}
                                       editHref={route('companies.edit', company.id)}
                                       onDelete={handleDelete}
                                    />
                                    
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={companies.links} />
            </PageContainer>
        </AppLayout>
    );
}