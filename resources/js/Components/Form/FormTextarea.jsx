import InputError from '@/Components/InputError';

export default function FormTextarea({
    label,
    name,
    value,
    onChange,
    rows = 4,
    error,
}) {
    return (
        <div className="space-y-2">

            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            />

            <InputError message={error} />

        </div>
    );
}