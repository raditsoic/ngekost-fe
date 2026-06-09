import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BrowseMore } from './browsemore';
import { Chat } from './chat';
import { KostDetail } from './kostdetail';
import { CompareKost } from './compare';
import { AppSidebar } from './sidebar';
import { Home } from './home';
import { Hero } from './hero';
import { NotFound } from './not-found';
import { Financial } from './financial';
import { Onboarding } from './onboarding';
import { BudgetPlans } from './budget-plans';
import { BudgetPlanDetailPage } from './budget-plans/detail';
import { AuthProvider, useAuth } from './auth/context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-svh items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!user.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-svh items-center justify-center">Loading...</div>;
  }

  if (user) {
    return <Navigate to={user.onboarding_completed ? '/chat' : '/onboarding'} replace />;
  }

  return <>{children}</>;
}

function AppLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const sidebarPaths = ['/properties', '/services', '/chat', '/financial', '/property', '/compare', '/me/budget-plans'];
  const showSidebar = sidebarPaths.some((p) => location.pathname.startsWith(p)) && !isLoading && !!user;

  return (
    <SidebarProvider>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/auth/login" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/auth/register" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/properties" element={<ProtectedRoute><BrowseMore /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><BrowseMore /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/new" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
          <Route path="/me/budget-plans" element={<ProtectedRoute><BudgetPlans /></ProtectedRoute>} />
          <Route path="/me/budget-plans/:id" element={<ProtectedRoute><BudgetPlanDetailPage /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/property/:id" element={<ProtectedRoute><KostDetail /></ProtectedRoute>} />
          <Route path="/compare/:id1/:id2" element={<ProtectedRoute><CompareKost /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <AppLayout />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
