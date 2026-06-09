import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Building2,
  ChartNoAxesColumn,
  Calculator,
  History,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
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
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth/context';
import { api, type Conversation } from '../lib/api';
import { SearchDialog } from '../search-dialog';

const sections = [
  { label: 'New Chat', icon: Plus, to: '/chat/new' },
  { label: 'Properties', icon: Building2, to: '/properties' },
  { label: 'Financial', icon: ChartNoAxesColumn, to: '/financial' },
  { label: 'Budget Plans', icon: Calculator, to: '/me/budget-plans' },
];

function NavContent({ onSearchOpen }: { onSearchOpen: () => void }) {
  const location = useLocation();
  const { state } = useSidebar();
  const [recentOpen, setRecentOpen] = useState(true);
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

  useEffect(() => {
    if (location.pathname === '/chat/new') {
      fetchConversations();
    }
  }, [location.pathname, fetchConversations]);

  return (
    <div className="px-3 pt-2 group-data-[collapsible=icon]:px-1.5">
      {/* Search */}
      <button
        onClick={onSearchOpen}
        className="flex items-center w-full h-9 px-2 text-[11px] font-semibold uppercase text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      >
        <Search className="size-3.5 shrink-0 group-data-[collapsible=icon]:size-4" />
        <span className="ml-2 whitespace-nowrap group-data-[collapsible=icon]:hidden">Search</span>
      </button>

      {sections.map((section) => {
        const active = location.pathname === section.to || location.pathname.startsWith(section.to + '/');
        const Icon = section.icon;
        return (
          <Link
            key={section.label}
            to={section.to}
            className={`flex items-center h-9 px-2 text-[11px] font-semibold uppercase transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
              active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <Icon className="size-3.5 shrink-0 group-data-[collapsible=icon]:size-4" />
            <span className="ml-2 whitespace-nowrap group-data-[collapsible=icon]:hidden">{section.label}</span>
          </Link>
        );
      })}

      {/* Recent */}
      <Collapsible
        open={state === 'collapsed' ? false : recentOpen}
        onOpenChange={setRecentOpen}
        className="group/recent"
      >
        <CollapsibleTrigger asChild>
          <button className="flex items-center w-full h-9 px-2 text-[11px] font-semibold uppercase text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <History className="size-3.5 shrink-0 group-data-[collapsible=icon]:size-4" />
            <span className="ml-2 whitespace-nowrap group-data-[collapsible=icon]:hidden">Recent</span>
            <ChevronRight className="ml-auto size-3 shrink-0 text-muted-foreground/40 transition-transform duration-200 group-data-[state=open]/recent:rotate-90 group-data-[collapsible=icon]:hidden" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {conversations.length > 0 && (
            <div className="border-l-[1.5px] border-sidebar-border ml-0.5 group-data-[collapsible=icon]:hidden">
              {conversations.slice(0, 15).map((conv, i) => {
                const active = location.pathname === `/chat/${conv.id}`;
                return (
                  <Link
                    key={conv.id}
                    to={`/chat/${conv.id}`}
                    className={`flex items-start gap-2 py-1 px-2 transition-colors ${
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground'
                    }`}
                  >
                    <span className={`font-serif italic text-[10px] leading-[18px] shrink-0 w-3 text-right ${
                      active ? 'text-sidebar-primary-foreground/40' : 'text-muted-foreground/30'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-[10px] leading-[18px] truncate">
                      {conv.title || 'Untitled'}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
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
    <SidebarFooter className="mt-auto px-3 group-data-[collapsible=icon]:px-1.5">
      <div className="border-t border-sidebar-border" />
      <Link
        to="/settings"
        className="flex items-center h-9 px-2 text-sidebar-foreground text-[11px] font-semibold uppercase hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      >
        <Settings className="size-3.5 shrink-0 group-data-[collapsible=icon]:size-4" />
        <span className="ml-2 whitespace-nowrap group-data-[collapsible=icon]:hidden">Settings</span>
      </Link>
      <div className="border-t border-sidebar-border" />
      <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1">
          <div className="flex size-7 shrink-0 items-center justify-center border border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground text-[11px] font-semibold">
            {initial}
          </div>
          <div className="flex flex-1 items-center gap-2 overflow-hidden group-data-[collapsible=icon]:hidden min-w-0">
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-[13px] font-medium">
                {user?.display_name ?? 'User'}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {user?.email ?? ''}
              </span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon-xs" className="ml-auto rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <ChevronRight className="size-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" align="end" className="w-44 p-0 border-sidebar-border rounded-none">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start rounded-none text-destructive hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </PopoverContent>
            </Popover>
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
              <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">
                ngekost
              </span>
            </Link>
            <SidebarTrigger className="cursor-pointer rounded-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:mr-0" />
          </div>
        </SidebarHeader>

        {/* Masthead rules */}
        <div className="border-t-[2.5px] border-sidebar-foreground" />
        <div className="border-t border-sidebar-border" />

        <SidebarContent className="gap-0 py-0 group-data-[collapsible=icon]:py-1">
          <NavContent onSearchOpen={() => setSearchOpen(true)} />
        </SidebarContent>

        <UserFooter />

        <SidebarRail />
      </Sidebar>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
