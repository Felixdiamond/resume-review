import { AppProvider } from "@/context/AppContext";
import { HomeContainer } from "./components/Container/Container";
import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation";
export default function Home() {
  return (
    <AppProvider>
      <BackgroundGradientAnimation>
        <HomeContainer />
      </BackgroundGradientAnimation>
    </AppProvider>
  );
}
