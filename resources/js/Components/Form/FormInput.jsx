import InputError from '@/Components/InputError';

export default function FormInput({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder = '',
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

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            />

            <InputError message={error} />
        </div>
    );
}