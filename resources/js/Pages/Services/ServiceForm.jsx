import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ServiceForm({
    service = null,
    companies = [],
}) {
    const initialPrice =
        service?.price !== null &&
        service?.price !== undefined
            ? String(Math.round(Number(service.price)))
            : '';

    const [preview, setPreview] = useState(
        service?.photo
            ? `/storage/${service.photo}`
            : null
    );

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        company_id: service?.company_id ?? '',
        name: service?.name ?? '',
        description: service?.description ?? '',
        duration: service?.duration ?? 30,
        price: initialPrice,
        photo: null,
        color: service?.color ?? '#0d6efd',
        status: service?.status ?? true,
        _method: service ? 'put' : null,
    });

    useEffect(() => {
        return () => {
            if (
                preview &&
                preview.startsWith('blob:')
            ) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const formatPrice = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ''
        ) {
            return '';
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return '';
        }

        return new Intl.NumberFormat('es-CO').format(number);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setData('photo', file);

        if (
            preview &&
            preview.startsWith('blob:')
        ) {
            URL.revokeObjectURL(preview);
        }

        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();

        post(
            service
                ? route(
                      'services.update',
                      service.id
                  )
                : route('services.store'),
            {
                forceFormData: true,
            }
        );
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-6"
        >
            {/* Empresa */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Empresa
                </label>

                <select
                    className="w-full rounded-lg border-gray-300"
                    value={data.company_id}
                    onChange={(e) =>
                        setData(
                            'company_id',
                            e.target.value
                        )
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
                    Nombre del servicio
                </label>

                <input
                    type="text"
                    className="w-full rounded-lg border-gray-300"
                    value={data.name}
                    onChange={(e) =>
                        setData(
                            'name',
                            e.target.value
                        )
                    }
                    placeholder="Ej. Corte de cabello"
                />

                {errors.name && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.name}
                    </div>
                )}
            </div>

            {/* Foto */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Foto del servicio
                </label>

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                />

                <p className="mt-1 text-sm text-gray-500">
                    Formatos permitidos: JPG, PNG o WEBP.
                </p>

                {preview && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm text-gray-500">
                            Vista previa
                        </p>

                        <img
                            src={preview}
                            alt="Vista previa del servicio"
                            className="h-32 w-32 rounded-lg object-cover border"
                        />
                    </div>
                )}

                {errors.photo && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.photo}
                    </div>
                )}
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Descripción
                </label>

                <textarea
                    rows="4"
                    className="w-full rounded-lg border-gray-300"
                    value={data.description}
                    onChange={(e) =>
                        setData(
                            'description',
                            e.target.value
                        )
                    }
                    placeholder="Descripción del servicio..."
                />

                {errors.description && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.description}
                    </div>
                )}
            </div>

            {/* Duración */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Duración (minutos)
                </label>

                <input
                    type="number"
                    min="1"
                    className="w-full rounded-lg border-gray-300"
                    value={data.duration}
                    onChange={(e) =>
                        setData(
                            'duration',
                            e.target.value
                        )
                    }
                />

                {errors.duration && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.duration}
                    </div>
                )}
            </div>

            {/* Precio */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Precio
                </label>

                <input
                    type="text"
                    inputMode="numeric"
                    className="w-full rounded-lg border-gray-300"
                    value={formatPrice(data.price)}
                    onChange={(e) => {
                        const numericValue =
                            e.target.value.replace(
                                /\D/g,
                                ''
                            );

                        setData(
                            'price',
                            numericValue
                        );
                    }}
                    placeholder="Ej. 20.000"
                />

                <p className="mt-1 text-sm text-gray-500">
                    Escribe el valor en pesos. Ejemplo:
                    20.000
                </p>

                {errors.price && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.price}
                    </div>
                )}
            </div>

            {/* Color */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Color del servicio
                </label>

                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={data.color}
                        onChange={(e) =>
                            setData(
                                'color',
                                e.target.value
                            )
                        }
                        className="h-10 w-16 rounded border"
                    />

                    <input
                        type="text"
                        value={data.color}
                        onChange={(e) =>
                            setData(
                                'color',
                                e.target.value
                            )
                        }
                        className="flex-1 rounded-lg border-gray-300"
                        placeholder="#0d6efd"
                    />
                </div>

                {errors.color && (
                    <div className="text-red-600 text-sm mt-1">
                        {errors.color}
                    </div>
                )}
            </div>

            {/* Estado */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={data.status}
                    onChange={(e) =>
                        setData(
                            'status',
                            e.target.checked
                        )
                    }
                />

                <span>
                    Activo
                </span>
            </div>

            {/* Botón */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {processing
                        ? 'Guardando...'
                        : service
                            ? 'Actualizar'
                            : 'Guardar'}
                </button>
            </div>
        </form>
    );
}