import { Link } from '@inertiajs/react';

export default function NavItem({
    href,
    icon: Icon,
    label,
    active = false,
}) {
    return (
        <Link
            href={href}
            className={`
                group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition
                ${
                    active
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
            `}
        >
            {Icon && (
                <Icon
                    className={`
                        h-5 w-5
                        ${
                            active
                                ? 'text-white'
                                : 'text-gray-400 group-hover:text-indigo-600'
                        }
                    `}
                />
            )}

            <span>
                {label}
            </span>
        </Link>
    );
}