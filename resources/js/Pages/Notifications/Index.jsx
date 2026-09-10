import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, notifications, unreadCount }) {
    const markAsRead = (notificationId) => {
        router.patch(
            route('notifications.read', notificationId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const markAllAsRead = () => {
        router.patch(
            route('notifications.readAll'),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Notificaciones
                    </h2>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Notificaciones" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Resumen */}
                    <div className="mb-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Mis notificaciones
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Tienes {unreadCount} notificación
                                        {unreadCount === 1 ? '' : 'es'} sin leer.
                                    </p>
                                </div>

                                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                                    {unreadCount} sin leer
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Lista */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        {notifications.data.length === 0 ? (
                            <div className="p-10 text-center">

                                <div className="text-4xl mb-3">
                                    🔔
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900">
                                    No tienes notificaciones
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Cuando recibas una nueva notificación,
                                    aparecerá aquí.
                                </p>

                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">

                                {notifications.data.map((notification) => {

                                    const data = notification.data || {};
                                    const unread = !notification.read_at;

                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-6 ${
                                                unread
                                                    ? 'bg-blue-50'
                                                    : 'bg-white'
                                            }`}
                                        >

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="flex-1">

                                                    <div className="flex items-center gap-2">

                                                        <span className="text-xl">
                                                            📅
                                                        </span>

                                                        <h4 className="font-semibold text-gray-900">
                                                            Nueva cita
                                                        </h4>

                                                        {unread && (
                                                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                                                Nueva
                                                            </span>
                                                        )}

                                                    </div>

                                                    <p className="mt-2 text-sm text-gray-700">
                                                        {data.message ||
                                                            'Se ha creado una nueva cita.'}
                                                    </p>

                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">

                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                Fecha:
                                                            </span>{' '}
                                                            {data.date || '—'}
                                                        </div>

                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                Hora:
                                                            </span>{' '}
                                                            {data.hour || '—'}
                                                        </div>

                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                Estado:
                                                            </span>{' '}
                                                            {data.status || '—'}
                                                        </div>

                                                    </div>

                                                    {data.appointment_id && (
                                                        <div className="mt-4">
                                                            <Link
                                                                href={route(
                                                                    'appointments.show',
                                                                    data.appointment_id
                                                                )}
                                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                Ver cita →
                                                            </Link>
                                                        </div>
                                                    )}

                                                </div>

                                                {unread && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
                                                    >
                                                        Marcar como leída
                                                    </button>
                                                )}

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </div>

                    {/* Paginación */}
                    {notifications.links &&
                        notifications.links.length > 3 && (
                            <div className="mt-6 flex flex-wrap justify-center gap-2">

                                {notifications.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) {
                                                router.visit(link.url, {
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        className={`px-3 py-2 text-sm rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 border hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}

                            </div>
                        )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}