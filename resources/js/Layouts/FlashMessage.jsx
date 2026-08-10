import { usePage } from '@inertiajs/react';

export default function FlashMessage() {

    const { flash } = usePage().props;

    if (!flash?.success) {
        return null;
    }

    return (
        <div className="mb-6 rounded-lg bg-green-100 border border-green-300 px-4 py-3 text-green-800">
            {flash.success}
        </div>
    );
}