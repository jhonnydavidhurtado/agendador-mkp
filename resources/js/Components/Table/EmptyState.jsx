export default function EmptyState({
    title = 'Sin registros',
}) {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">

            <p className="text-lg font-semibold text-gray-700">
                {title}
            </p>

        </div>
    );
}