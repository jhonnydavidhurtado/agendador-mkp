import { useForm } from '@inertiajs/react';

export default function AdvisorForm({
    advisor = null,
    companies = [],
    users = [],
}) {

    const { data, setData, post, put, processing, errors } = useForm({

        company_id: advisor?.company_id ?? '',
        user_id: advisor?.user_id ?? '',
        profession: advisor?.profession ?? '',
        description: advisor?.description ?? '',
        status: advisor?.status ?? true,

    });

    const submit = (e) => {

        e.preventDefault();

        if (advisor) {

            put(route('advisors.update', advisor.id));

        } else {

            post(route('advisors.store'));

        }

    };

    return (

        <form onSubmit={submit} className="space-y-6">

            <div>

                <label className="block text-sm font-medium mb-1">
                    Empresa
                </label>

                <select
                    className="w-full rounded-lg border-gray-300"
                    value={data.company_id}
                    onChange={(e) =>
                        setData('company_id', e.target.value)
                    }
                >
                    <option value="">Seleccione...</option>

                    {companies.map(company => (

                        <option
                            key={company.id}
                            value={company.id}
                        >
                            {company.name}
                        </option>

                    ))}

                </select>

                {errors.company_id && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.company_id}
                    </div>
                )}

            </div>

            <div>

                <label className="block text-sm font-medium mb-1">
                    Usuario
                </label>

                <select
                    className="w-full rounded-lg border-gray-300"
                    value={data.user_id}
                    onChange={(e) =>
                        setData('user_id', e.target.value)
                    }
                >
                    <option value="">Seleccione...</option>

                    {users.map(user => (

                        <option
                            key={user.id}
                            value={user.id}
                        >
                            {user.name}
                        </option>

                    ))}

                </select>

                {errors.user_id && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.user_id}
                    </div>
                )}

            </div>

            <div>

                <label className="block text-sm font-medium mb-1">
                    Profesión
                </label>

                <input
                    type="text"
                    className="w-full rounded-lg border-gray-300"
                    value={data.profession}
                    onChange={(e) =>
                        setData('profession', e.target.value)
                    }
                />

                {errors.profession && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.profession}
                    </div>
                )}

            </div>

            <div>

                <label className="block text-sm font-medium mb-1">
                    Descripción
                </label>

                <textarea
                    rows="4"
                    className="w-full rounded-lg border-gray-300"
                    value={data.description}
                    onChange={(e) =>
                        setData('description', e.target.value)
                    }
                />

                {errors.description && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.description}
                    </div>
                )}

            </div>

            <div className="flex items-center gap-2">

                <input
                    type="checkbox"
                    checked={data.status}
                    onChange={(e) =>
                        setData('status', e.target.checked)
                    }
                />

                <span>Activo</span>

            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
            >
                {advisor ? 'Actualizar' : 'Guardar'}
            </button>

        </form>

    );

}