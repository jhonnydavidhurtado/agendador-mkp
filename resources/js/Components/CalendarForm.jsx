import { useForm } from '@inertiajs/react';

export default function CalendarForm({
    calendar = null,
    companies = [],
    advisors = [],
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        company_id: calendar?.company_id ?? '',
        advisor_id: calendar?.advisor_id ?? '',
        status: calendar?.status ?? true,
    });

    /*
     * Mostrar solamente los asesores
     * pertenecientes a la empresa seleccionada.
     */
    const filteredAdvisors = advisors.filter(
        (advisor) =>
            String(advisor.company_id) === String(data.company_id)
    );

    const submit = (e) => {
        e.preventDefault();

        if (calendar) {
            put(route('calendars.update', calendar.id));
        } else {
            post(route('calendars.store'));
        }
    };

    const handleCompanyChange = (e) => {
        const companyId = e.target.value;

        setData((currentData) => ({
            ...currentData,
            company_id: companyId,
            advisor_id: '',
        }));
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
                    onChange={handleCompanyChange}
                >
                    <option value="">
                        Seleccione una empresa...
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

            {/* Asesor */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Asesor
                </label>

                <select
                    className="w-full rounded-lg border-gray-300"
                    value={data.advisor_id}
                    onChange={(e) =>
                        setData('advisor_id', e.target.value)
                    }
                    disabled={!data.company_id}
                >
                    <option value="">
                        {!data.company_id
                            ? 'Primero seleccione una empresa...'
                            : 'Seleccione un asesor...'}
                    </option>

                    {filteredAdvisors.map((advisor) => (
                        <option
                            key={advisor.id}
                            value={advisor.id}
                        >
                            {advisor.user?.name ?? 'Asesor sin usuario'}
                        </option>
                    ))}
                </select>

                {data.company_id && filteredAdvisors.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                        No hay asesores activos para esta empresa.
                    </p>
                )}

                {errors.advisor_id && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.advisor_id}
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

            {/* Botón */}
            <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                {processing
                    ? 'Guardando...'
                    : calendar
                        ? 'Actualizar'
                        : 'Guardar'}
            </button>

        </form>
    );
}