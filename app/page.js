import { AppProvider } from "@/context/AppContext";
import { HomeContainer } from "./components/Container/Container";
import { UploadPage } from "./components/UploadPage/Upload";
import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation";
import { TypewriterEffectSmoothDemo } from "./components/Test/Test";

export default function Home() {
  return (
    <AppProvider>
      <BackgroundGradientAnimation>
        <HomeContainer />
        {/* <TypewriterEffectSmoothDemo /> */}
      </BackgroundGradientAnimation>
    </AppProvider>
  );
}
