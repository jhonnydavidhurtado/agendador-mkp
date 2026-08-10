import { useForm } from '@inertiajs/react';

export default function ClientForm({
    client = null,
    companies = [],
}) {

    const { data, setData, post, put, processing, errors } = useForm({

        company_id: client?.company_id ?? '',
        name: client?.name ?? '',
        phone: client?.phone ?? '',
        email: client?.email ?? '',
        birthdate: client?.birthdate
            ? client.birthdate.substring(0, 10)
            : '',
        photo: client?.photo ?? '',
        notes: client?.notes ?? '',
        status: client?.status ?? true,

    });

    const submit = (e) => {

        e.preventDefault();

        if (client) {

            put(route('clients.update', client.id));

        } else {

            post(route('clients.store'));

        }

    };

    return (

        <form onSubmit={submit} className="space-y-6">

            {/* Empresa */}
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

                    <option value="">
                        Seleccione...
                    </option>

                    {companies.map((company) => (

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

            {/* Nombre */}
            <div>

                <label className="block text-sm font-medium mb-1">
                    Nombre
                </label>

                <input
                    type="text"
                    className="w-full rounded-lg border-gray-300"
                    value={data.name}
                    onChange={(e) =>
                        setData('name', e.target.value)
                    }
                />

                {errors.name && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.name}
                    </div>
                )}

            </div>

            {/* Teléfono */}
            <div>

                <label className="block text-sm font-medium mb-1">
                    Teléfono
                </label>

                <input
                    type="text"
                    className="w-full rounded-lg border-gray-300"
                    value={data.phone}
                    onChange={(e) =>
                        setData('phone', e.target.value)
                    }
                />

                {errors.phone && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.phone}
                    </div>
                )}

            </div>

            {/* Email */}
            <div>

                <label className="block text-sm font-medium mb-1">
                    Correo electrónico
                </label>

                <input
                    type="email"
                    className="w-full rounded-lg border-gray-300"
                    value={data.email}
                    onChange={(e) =>
                        setData('email', e.target.value)
                    }
                />

                {errors.email && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.email}
                    </div>
                )}

            </div>

            {/* Fecha de nacimiento */}
            <div>

                <label className="block text-sm font-medium mb-1">
                    Fecha de nacimiento
                </label>

                <input
                    type="date"
                    className="w-full rounded-lg border-gray-300"
                    value={data.birthdate}
                    onChange={(e) =>
                        setData('birthdate', e.target.value)
                    }
                />

                {errors.birthdate && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.birthdate}
                    </div>
                )}

            </div>

            {/* Foto */}
            <div>

                <label className="block text-sm font-medium mb-1">
                    Foto
                </label>

                <input
                    type="text"
                    className="w-full rounded-lg border-gray-300"
                    value={data.photo}
                    onChange={(e) =>
                        setData('photo', e.target.value)
                    }
                    placeholder="Ruta o URL de la foto"
                />

                {errors.photo && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.photo}
                    </div>
                )}

            </div>

            {/* Observaciones */}
            <div>

                <label className="block text-sm font-medium mb-1">
                    Observaciones
                </label>

                <textarea
                    rows="4"
                    className="w-full rounded-lg border-gray-300"
                    value={data.notes}
                    onChange={(e) =>
                        setData('notes', e.target.value)
                    }
                />

                {errors.notes && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.notes}
                    </div>
                )}

            </div>

            {/* Estado */}
            <div className="flex items-center gap-2">

                <input
                    type="checkbox"
                    checked={data.status}
                    onChange={(e) =>
                        setData('status', e.target.checked)
                    }
                />

                <span>
                    Activo
                </span>

            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                {processing
                    ? 'Guardando...'
                    : client
                        ? 'Actualizar'
                        : 'Guardar'}
            </button>

        </form>

    );
}