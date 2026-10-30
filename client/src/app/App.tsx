import { Providers } from "./providers";
import { PrimitivesPreview } from "../components/ui/PrimitivesPreview";

export function App() {
  return (
    <Providers>
      <main className="min-h-screen bg-ground py-8 px-4 sm:px-6 lg:px-8">
        <PrimitivesPreview />
      </main>
    </Providers>
  );
}
