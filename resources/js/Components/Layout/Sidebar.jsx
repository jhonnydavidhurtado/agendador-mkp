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
} from '@heroicons/react/24/outline';

export default function Sidebar() {
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
                    active
                />


                <NavItem
                    href="/companies"
                    icon={BuildingOfficeIcon}
                    label="Empresas"
                />


                <NavItem
                    href="/advisors"
                    icon={UserGroupIcon}
                    label="Asesores"
                />


                <NavItem
                    href="/clients"
                    icon={UserGroupIcon}
                    label="Clientes"
                />


                <NavItem
                    href="/services"
                    icon={BriefcaseIcon}
                    label="Servicios"
                />


                <NavItem
                    href="/calendars"
                    icon={CalendarDaysIcon}
                    label="Calendarios"
                />


                <NavItem
                    href="/appointments"
                    icon={ClockIcon}
                    label="Citas"
                />


                <NavItem
                    href="/reports"
                    icon={ChartBarIcon}
                    label="Reportes"
                />


                <NavItem
                    href="/settings"
                    icon={Cog6ToothIcon}
                    label="Configuración"
                />

            </nav>

        </aside>
    );
}