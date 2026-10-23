import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import PageContainer from '@/Components/Layout/PageContainer';

const notificationTitles = {
    created: 'Nueva cita',
    updated: 'Cita actualizada',
    cancelled: 'Cita cancelada',
    deleted: 'Cita eliminada',
};

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    completed: 'Completada',
    cancelled: 'Cancelada',
};

export default function Index({ notifications, unreadCount }) {
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
        <AppLayout>
            <Head title="Notificaciones" />

            <PageContainer>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Tienes {unreadCount} notificación{unreadCount === 1 ? '' : 'es'} sin leer.
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                    {notifications.data.length === 0 ? (
                        <div className="p-10 text-center">

                            <div className="mb-3 text-4xl">🔔</div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                No tienes notificaciones
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Cuando recibas una notificación, aparecerá aquí.
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

                                                        <h2 className="font-semibold text-gray-900">
                                                            {notificationTitles[data.event] || 'Nueva cita'}
                                                        </h2>

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
                                                            {statusLabels[data.status] || data.status || '—'}
                                                        </div>

                                                    </div>

                                                    {data.appointment_id && data.event !== 'deleted' && (
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

                {notifications.links && notifications.links.length > 3 && (
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
            </PageContainer>
        </AppLayout>
    );
}