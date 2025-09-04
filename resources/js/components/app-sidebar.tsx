import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	conferencias,
	dashboard,
	destinatarios,
	emitentes,
	fornecedores,
	relatorios,
	requisicoes,
} from "@/routes";
import type { NavItem } from "@/types";
import { Link } from "@inertiajs/react";
import {
	BarChart3,
	BookOpen,
	Building,
	CheckSquare,
	FileText,
	LayoutGrid,
	MapPin,
	Users,
} from "lucide-react";
import AppLogo from "./app-logo";

const mainNavItems: NavItem[] = [
	{
		title: "Dashboard",
		href: dashboard(),
		icon: LayoutGrid,
	},
	{
		title: "Fornecedores",
		href: fornecedores.index(),
		icon: Users,
	},
	{
		title: "Requisições",
		href: requisicoes.index(),
		icon: FileText,
	},
	{
		title: "Conferências",
		href: conferencias.index(),
		icon: CheckSquare,
	},
	{
		title: "Emitentes",
		href: emitentes.index(),
		icon: Building,
	},
	{
		title: "Destinatários",
		href: destinatarios.index(),
		icon: MapPin,
	},
	{
		title: "Relatórios",
		href: relatorios.index(),
		icon: BarChart3,
	},
];

const footerNavItems: NavItem[] = [
	{
		title: "Site da Prefeitura",
		href: "https://www.paubrasil.ba.gov.br/",
		icon: BookOpen,
	},
];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href={dashboard()} prefetch>
								<AppLogo />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={mainNavItems} />
			</SidebarContent>

			<SidebarFooter>
				<NavFooter items={footerNavItems} className="mt-auto" />
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
