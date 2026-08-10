import { Link } from '@inertiajs/react';

export default function TableActions({
    item,
    editHref,
    showHref,
    onDelete,
}) {
    return (
        <div className="flex items-center justify-end gap-2">
            {showHref && (
                <Link
                    href={showHref}
                    className="rounded bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200"
                >
                    Ver
                </Link>
            )}

            {editHref && (
                <Link
                    href={editHref}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                    Editar
                </Link>
            )}

            {onDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                    Eliminar
                </button>
            )}
        </div>
    );
}

