import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CreateRequest from "@/pages/CreateRequest";
import RequestDetails from "@/pages/RequestDetails";
import MediaBuyerDashboard from "@/pages/MediaBuyerDashboard";
import BriefBoard from "@/pages/BriefBoard";
import ActivityLog from "@/pages/ActivityLog";
import NotFound from "@/pages/NotFound";

function Router() {
  // Check if user is logged in
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/create"} component={CreateRequest} />
      <Route path={"/request/:requestId"}>
        {(params) => <RequestDetails requestId={params.requestId} />}
      </Route>
      <Route path={"/media-buyer"} component={MediaBuyerDashboard} />
      <Route path={"/briefs"} component={BriefBoard} />
      <Route path={"/activity"} component={ActivityLog} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
