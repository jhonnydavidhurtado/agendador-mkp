import Logo from '@/Components/Layout/Logo';
import NavItem from '@/Components/Layout/NavItem';

import {
    HomeIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    BriefcaseIcon,
    CalendarDaysIcon,
    ClockIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ShieldCheckIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

import { usePage } from '@inertiajs/react';

export default function Sidebar() {
    const { auth } = usePage().props;
    const navigation = auth?.navigation || {};

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white px-4 py-6">

            <div className="mb-8 px-2">
                <Logo />
            </div>

            <nav className="space-y-2">

                <NavItem
                    href="/dashboard"
                    icon={HomeIcon}
                    label="Dashboard"
                />

                {navigation.companies && (
                    <NavItem href="/companies" icon={BuildingOfficeIcon} label="Empresas" />
                )}

                {navigation.systemAdmin && (
                    <>
                        <NavItem href="/managers" icon={UserCircleIcon} label="Managers" />
                        <NavItem href="/roles" icon={ShieldCheckIcon} label="Roles" />
                        <NavItem href="/users" icon={UserCircleIcon} label="Usuarios" />
                        <NavItem href="/permissions" icon={Cog6ToothIcon} label="Permisos" />
                    </>
                )}

                {navigation.advisors && (
                    <NavItem href="/advisors" icon={UserGroupIcon} label="Asesores" />
                )}

                {navigation.clients && (
                    <NavItem href="/clients" icon={UserGroupIcon} label="Clientes" />
                )}

                {navigation.services && (
                    <NavItem href="/services" icon={BriefcaseIcon} label="Servicios" />
                )}

                {navigation.calendars && (
                    <NavItem href="/calendars" icon={CalendarDaysIcon} label="Calendarios" />
                )}

                {navigation.appointments && (
                    <NavItem href="/appointments" icon={ClockIcon} label="Citas" />
                )}

                {navigation.reports && (
                    <NavItem href="/reports" icon={ChartBarIcon} label="Reportes" />
                )}

                {navigation.settings && (
                    <NavItem href="/settings" icon={Cog6ToothIcon} label="Configuración" />
                )}

            </nav>

        </aside>
    );
}