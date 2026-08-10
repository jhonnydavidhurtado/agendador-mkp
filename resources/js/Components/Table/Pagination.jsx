import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    return (
        <div className="mt-6 flex flex-wrap gap-2">

            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`rounded-lg px-4 py-2 text-sm ${
                        link.active
                            ? 'bg-indigo-600 text-white'
                            : 'border bg-white hover:bg-gray-100'
                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                />
            ))}

        </div>
    );
}