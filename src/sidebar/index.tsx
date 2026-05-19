import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Building2,
  ChartNoAxesColumn,
  Settings,
  LogOut,
  ChevronRight,
  History,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth/context';
import { api, type Conversation } from '../lib/api';
import { SearchDialog } from '../search-dialog';

const mainNav = [
  { label: 'New Chat', icon: Plus, to: '/chat/new' },
  { label: 'Properties', icon: Building2, to: '/properties' },
];

function NavContent({ onSearchOpen }: { onSearchOpen: () => void }) {
  const location = useLocation();
  const { state } = useSidebar();
  const [historyOpen, setHistoryOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = useCallback(() => {
    api.listConversations({ limit: 20 })
      .then(res => {
        const list = Array.isArray(res) ? res : res.data ?? [];
        setConversations(list);
      })
      .catch(() => setConversations([]));
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Refresh when navigating to a new chat
  useEffect(() => {
    if (location.pathname === '/chat/new') {
      fetchConversations();
    }
  }, [location.pathname, fetchConversations]);

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:p-1">
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Search"
                onClick={onSearchOpen}
                className="h-10 rounded-lg group-data-[collapsible=icon]:mx-auto"
              >
                <Search />
                <span>Search</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.to}
                  tooltip={item.label}
                  className="h-10 rounded-lg group-data-[collapsible=icon]:mx-auto data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                >
                  <Link to={item.to}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/financial'}
                tooltip="Financial"
                className="h-10 rounded-lg group-data-[collapsible=icon]:mx-auto data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
              >
                <Link to="/financial">
                  <ChartNoAxesColumn />
                  <span>Financial</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Collapsible
                open={state === 'collapsed' ? false : historyOpen}
                onOpenChange={setHistoryOpen}
                className="group/collapsible group-data-[collapsible=icon]:hidden"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="h-10 rounded-lg group-data-[collapsible=icon]:mx-auto">
                    <History />
                    <span>History</span>
                    <ChevronRight className="ml-auto size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu className="pl-4">
                    {conversations.length === 0 && (
                      <span className="px-2 text-xs text-muted-foreground/60">No conversations yet</span>
                    )}
                    {conversations.map((conv) => (
                      <SidebarMenuItem key={conv.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === `/chat/${conv.id}`}
                          tooltip={conv.title || 'Untitled'}
                          className="h-8 text-xs text-muted-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                        >
                          <Link to={`/chat/${conv.id}`}>
                            <span className="truncate">{conv.title || 'Untitled'}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      
    </>
  );
}

function UserFooter() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initial = user?.display_name?.charAt(0).toUpperCase() ?? 'U';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <SidebarFooter className="mt-auto">
      <SidebarSeparator />
      <div className="flex flex-col gap-1 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" className="h-9 group-data-[collapsible=icon]:mx-auto">
              <Link to="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center gap-2 overflow-hidden group-data-[collapsible=icon]:hidden">
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">
                {user?.display_name ?? 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email ?? ''}
              </span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon-xs" className="ml-auto rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <ChevronRight className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" align="end" className="w-44 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start rounded-md text-destructive hover:bg-sidebar-accent hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </SidebarFooter>
  );
}

export function AppSidebar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-4 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
          <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:justify-center">
            <Link to="/properties" className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden">
              <img
                src="/ngekost-logo.svg"
                alt="ngekost"
                className="size-7 shrink-0"
              />
              <span className="text-md font-semibold tracking-tight text-sidebar-foreground">
                ngekost
              </span>
            </Link>
            <SidebarTrigger className="cursor-pointer rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:mr-0" />
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent className="gap-2 px-2 group-data-[collapsible=icon]:px-0">
          <NavContent onSearchOpen={() => setSearchOpen(true)} />
        </SidebarContent>

        <UserFooter />

        <SidebarRail />
      </Sidebar>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
