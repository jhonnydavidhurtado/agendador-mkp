import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CalendarForm from '@/Components/CalendarForm';
import { Head, Link } from '@inertiajs/react';

export default function Edit({
    calendar,
    companies = [],
    advisors = [],
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editar Calendario
                </h2>
            }
        >
            <Head title="Editar Calendario" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">

                        <div className="p-6 text-gray-900">

                            <div className="mb-6">
                                <h1 className="text-2xl font-bold">
                                    Editar Calendario
                                </h1>

                                <p className="text-gray-600 mt-1">
                                    Modifique la empresa, asesor o estado del calendario.
                                </p>
                            </div>

                            <CalendarForm
                                calendar={calendar}
                                companies={companies}
                                advisors={advisors}
                            />

                            <div className="mt-6">
                                <Link
                                    href={route('calendars.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Volver
                                </Link>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}