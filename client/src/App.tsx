import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Chakras from "@/pages/Chakras";
import ChakraTest from "@/pages/ChakraTest";
import Crystals from "@/pages/Crystals";
import CrystalDetail from "@/pages/CrystalDetail";
import Meditation from "@/pages/Meditation";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chakras" component={Chakras} />
          <Route path="/test" component={ChakraTest} />
          <Route path="/crystals" component={Crystals} />
          <Route path="/crystals/:id" component={CrystalDetail} />
          <Route path="/meditation" component={Meditation} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
