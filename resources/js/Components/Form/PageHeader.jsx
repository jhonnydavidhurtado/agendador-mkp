import { Link } from '@inertiajs/react';

export default function PageHeader({
    title,
    subtitle,
    buttonText,
    buttonHref,
}) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mt-1 text-gray-500">
                        {subtitle}
                    </p>
                )}
            </div>

            {buttonText && buttonHref && (
                <Link
                    href={buttonHref}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-700"
                >
                    {buttonText}
                </Link>
            )}
        </div>
    );
}