export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
}) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>


                    <h3 className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </h3>


                    {description && (
                        <p className="mt-2 text-sm text-gray-500">
                            {description}
                        </p>
                    )}

                </div>


                {Icon && (
                    <div className="rounded-lg bg-indigo-100 p-3">

                        <Icon className="h-7 w-7 text-indigo-600" />

                    </div>
                )}

            </div>

        </div>
    );
}