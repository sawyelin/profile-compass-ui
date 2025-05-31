
import { Home, Users, FileText, Search, Settings, User, Calendar, Trees } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "People",
    url: "/people",
    icon: Users,
  },
  {
    title: "Family",
    url: "/family",
    icon: Trees,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "ID Cards",
    url: "/id-cards",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r bg-background">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Identity
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Management System
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`
                      transition-all duration-200 group rounded-xl h-11
                      hover:bg-accent/50 hover:text-accent-foreground
                      data-[active=true]:bg-primary data-[active=true]:text-primary-foreground
                      data-[active=true]:shadow-md data-[active=true]:font-semibold
                    `}
                  >
                    <Link to={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center font-medium">
          © 2024 Identity System
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
