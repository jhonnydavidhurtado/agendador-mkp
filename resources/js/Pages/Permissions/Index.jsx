import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import PageHeader from '@/Components/Form/PageHeader';
import FormSection from '@/Components/Form/FormSection';
import FormInput from '@/Components/Form/FormInput';
import EmptyState from '@/Components/Table/EmptyState';

export default function Index({ permissions, roles }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
    });
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            put(route('permissions.update', editingId), {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                },
            });
            return;
        }

        post(route('permissions.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleEdit = (permission) => {
        setEditingId(permission.id);
        setData({ name: permission.name });
    };

    const handleDelete = (permission) => {
        if (confirm(`¿Deseas eliminar el permiso ${permission.name}?`)) {
            router.delete(route('permissions.destroy', permission.id));
        }
    };

    return (
        <AppLayout>
            <Head title="Permisos" />

            <div className="space-y-6">
                <PageHeader
                    title="Permisos"
                    subtitle="Gestión de permisos del sistema"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormSection title={editingId ? 'Editar permiso' : 'Crear permiso'}>
                        <div className="md:col-span-2 space-y-6">
                            <FormInput
                                label="Nombre del permiso"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                required
                            />
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
                            {processing ? 'Guardando...' : editingId ? 'Actualizar permiso' : 'Guardar permiso'}
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Permiso</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Roles</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(permissions || []).length === 0 && (
                                <tr>
                                    <td colSpan={3}>
                                        <EmptyState title="No hay permisos registrados." />
                                    </td>
                                </tr>
                            )}

                            {(permissions || []).map((permission) => (
                                <tr key={permission.id} className="border-t">
                                    <td className="px-6 py-4 font-medium text-gray-800">{permission.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {(permission.roles || []).map((role) => (
                                                <span
                                                    key={`${permission.id}-${role}`}
                                                    className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                            {(permission.roles || []).length === 0 && (
                                                <span className="text-sm text-gray-500">Sin roles</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!['manage companies', 'manage advisors', 'manage calendars', 'manage clients', 'manage appointments', 'manage roles', 'manage permissions'].includes(permission.name) && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(permission)}
                                                    className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(permission)}
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
