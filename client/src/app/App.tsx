import { Providers } from "./providers";
import { StudentRegisterPage } from "../features/students/components/StudentRegisterPage";

export function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-ground">
        <StudentRegisterPage />
      </div>
    </Providers>
  );
}
