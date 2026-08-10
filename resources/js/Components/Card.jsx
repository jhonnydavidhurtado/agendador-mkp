export default function Card({
    title,
    children,
    className = '',
}) {
    return (
        <div
            className={`
                rounded-xl
                bg-white
                p-6
                shadow-sm
                border
                border-gray-100
                ${className}
            `}
        >

            {title && (
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    {title}
                </h3>
            )}


            <div>
                {children}
            </div>

        </div>
    );
}