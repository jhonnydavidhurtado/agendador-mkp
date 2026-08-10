export default function FormSection({
    title,
    children,
}) {
    return (
        <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-6 text-xl font-semibold text-gray-800">
                {title}
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
                {children}
            </div>

        </div>
    );
}