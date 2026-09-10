import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import PageContainer from '@/Components/Layout/PageContainer';
import PageHeader from '@/Components/Form/PageHeader';
import SearchInput from '@/Components/Table/SearchInput';
import Pagination from '@/Components/Table/Pagination';
import EmptyState from '@/Components/Table/EmptyState';

export default function Index({ users, roles, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        router.get(
            route('users.index'),
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleRoleChange = (user, roleName) => {
        if (!roleName) return;

        router.patch(
            route('users.assignRole', user.id),
            { role: roleName },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['users'] });
                },
            }
        );
    };

    const handleDelete = (user) => {
        if (window.confirm(`¿Deseas eliminar el usuario ${user.name}?`)) {
            router.delete(route('users.destroy', user.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Usuarios" />

            <PageContainer>
                <PageHeader
                    title="Usuarios"
                    subtitle="Gestión de accesos y roles del sistema"
                    buttonText="Nuevo Usuario"
                    buttonHref={route('users.create')}
                />

                <SearchInput
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre o correo..."
                />

                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Empresa</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyState title="No hay usuarios registrados." />
                                    </td>
                                </tr>
                            )}

                            {users.data.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">{user.name}</div>
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">{user.email}</td>

                                    <td className="px-6 py-4 text-gray-700">{user.company?.name ?? '-'}</td>

                                    <td className="px-6 py-4">
                                        <select
                                            value={user.roles?.[0]?.name ?? ''}
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            className="rounded-lg border-gray-300 text-sm"
                                        >
                                            <option value="">Sin rol</option>
                                            {(roles || []).map((role) => (
                                                <option key={role.id} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(user)}
                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={users.links} />
            </PageContainer>
        </AppLayout>
    );
}
