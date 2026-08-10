import InputError from '@/Components/InputError';

export default function FormSelect({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    required = false,
}) {
    return (
        <div className="space-y-2">

            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            <InputError message={error} />

        </div>
    );
}