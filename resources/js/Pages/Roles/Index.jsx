import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import PageHeader from '@/Components/Form/PageHeader';
import FormSection from '@/Components/Form/FormSection';
import FormInput from '@/Components/Form/FormInput';
import EmptyState from '@/Components/Table/EmptyState';

export default function Index({ roles, permissions }) {
    const initialForm = { name: '', permissions: [] };

    const { data, setData, post, put, processing, errors, reset } = useForm(initialForm);
    const [editingId, setEditingId] = useState(null);

    const permissionMap = useMemo(
        () => Object.fromEntries((permissions || []).map((permission) => [permission.name, permission.name])),
        [permissions]
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            permissions: (data.permissions || []).filter(
                (permission) => permissionMap[permission] || permission
            ),
        };

        if (editingId) {
            put(route('roles.update', editingId), {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                },
            });
            return;
        }

        post(route('roles.store'), {
            onSuccess: () => reset(),
        });
    };

    const togglePermission = (permissionName) => {
        const currentPermissions = Array.isArray(data.permissions)
            ? data.permissions
            : [];

        setData('permissions', currentPermissions.includes(permissionName)
            ? currentPermissions.filter((name) => name !== permissionName)
            : [...currentPermissions, permissionName]
        );
    };

    const handleEdit = (role) => {
        setEditingId(role.id);
        setData({
            name: role.name,
            permissions: role.permissions || [],
        });
    };

    const handleDelete = (role) => {
        if (confirm(`¿Deseas eliminar el rol ${role.name}?`)) {
            router.delete(route('roles.destroy', role.id));
        }
    };

    return (
        <AppLayout>
            <Head title="Roles" />

            <div className="space-y-6">
                <PageHeader
                    title="Roles"
                    subtitle="Gestión de roles del sistema"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormSection title={editingId ? 'Editar rol' : 'Crear rol'}>
                        <div className="md:col-span-2 space-y-6">
                            <FormInput
                                label="Nombre del rol"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />

                            <div>
                                <label className="mb-3 block text-sm font-medium text-gray-700">
                                    Permisos
                                </label>

                                <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-3">
                                    {(permissions || []).map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes(permission.name)}
                                                onChange={() => togglePermission(permission.name)}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            {permission.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    <div className="flex justify-end gap-3">
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    setEditingId(null);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : editingId ? 'Actualizar rol' : 'Guardar rol'}
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Permisos</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(roles || []).length === 0 && (
                                <tr>
                                    <td colSpan={3}>
                                        <EmptyState title="No hay roles registrados." />
                                    </td>
                                </tr>
                            )}

                            {(roles || []).map((role) => (
                                <tr
                                    id={role.name === 'Super Admin' ? 'super-admin' : role.name === 'Super Usuario' ? 'super-usuario' : undefined}
                                    key={role.id}
                                    className="border-t"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">{role.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {(role.permissions || []).map((permission) => (
                                                <span
                                                    key={`${role.id}-${permission}`}
                                                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                                                >
                                                    {permission}
                                                </span>
                                            ))}
                                            {(role.permissions || []).length === 0 && (
                                                <span className="text-sm text-gray-500">Sin permisos</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {role.name !== 'Super Usuario' && role.name !== 'Manager' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(role)}
                                                    className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(role)}
                                                    className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
