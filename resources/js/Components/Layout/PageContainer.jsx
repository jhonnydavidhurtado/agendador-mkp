export default function PageContainer({ children }) {
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {children}
        </div>
    );
}