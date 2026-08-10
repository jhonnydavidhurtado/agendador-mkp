import { usePage } from '@inertiajs/react';

export default function FlashMessage() {

    const { flash } = usePage().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className="mb-6">

            {flash.success && (
                <div className="rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-800">
                    {flash.success}
                </div>
            )}

            {flash.error && (
                <div className="rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-800">
                    {flash.error}
                </div>
            )}

        </div>
    );
}