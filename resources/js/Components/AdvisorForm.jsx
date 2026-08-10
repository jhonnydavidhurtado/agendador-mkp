import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function AdvisorForm({
    advisor = null,
    companies = [],
    users = [],
}) {
    const isEditing = advisor !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        company_id: advisor?.company_id ?? '',
        user_id: advisor?.user_id ?? '',
        profession: advisor?.profession ?? '',
        description: advisor?.description ?? '',
        status: advisor?.status ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('advisors.update', advisor.id));
        } else {
            post(route('advisors.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">

            {/* Empresa */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Empresa
                </label>

                <select
                    value={data.company_id}
                    onChange={(e) => setData('company_id', e.target.value)}
                    className="w-full rounded-lg border-gray-300"
                >
                    <option value="">Seleccione una empresa</option>

                    {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>

                <InputError message={errors.company_id} />
            </div>

            {/* Usuario */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Usuario
                </label>

                <select
                    value={data.user_id}
                    onChange={(e) => setData('user_id', e.target.value)}
                    className="w-full rounded-lg border-gray-300"
                >
                    <option value="">Seleccione un usuario</option>

                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>

                <InputError message={errors.user_id} />
            </div>

            {/* Profesión */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Profesión
                </label>

                <input
                    type="text"
                    value={data.profession}
                    onChange={(e) => setData('profession', e.target.value)}
                    className="w-full rounded-lg border-gray-300"
                />

                <InputError message={errors.profession} />
            </div>

            {/* Descripción */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Descripción
                </label>

                <textarea
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full rounded-lg border-gray-300"
                />

                <InputError message={errors.description} />
            </div>

            {/* Estado */}
            <div className="flex items-center gap-2">
                <input
                    id="status"
                    type="checkbox"
                    checked={data.status}
                    onChange={(e) => setData('status', e.target.checked)}
                />

                <label htmlFor="status">
                    Activo
                </label>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
            </div>

        </form>
    );
}