import { AppProvider } from "@/context/AppContext";
import { HomeContainer } from "./components/Container/Container";
import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation";

export default function Home() {
  return (
    <AppProvider>
      <div className="relative w-full h-screen">
        <div className="pointer-events-none absolute inset-0 z-0">
        <BackgroundGradientAnimation className="absolute inset-0 z-0" />
        </div>
        <div className="relative z-10 w-full h-full">
          <HomeContainer />
        </div>
      </div>
    </AppProvider>
  );
}