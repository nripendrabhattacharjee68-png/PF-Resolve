import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TransferProvider } from "@/context/TransferContext";
import { AppLayout } from "@/components/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import Overview from "@/pages/Overview";
import Diagnostic from "@/pages/Diagnostic";
import Resolution from "@/pages/Resolution";
import Ready from "@/pages/Ready";
import Review from "@/pages/Review";
import Confirmation from "@/pages/Confirmation";
import Tracking from "@/pages/Tracking";
import Help from "@/pages/Help";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TransferProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/transfer" element={<AppLayout />}>
              <Route index element={<Overview />} />
              <Route path="diagnostic" element={<Diagnostic />} />
              <Route path="resolution" element={<Resolution />} />
              <Route path="ready" element={<Ready />} />
              <Route path="review" element={<Review />} />
              <Route path="confirmation" element={<Confirmation />} />
              <Route path="tracking" element={<Tracking />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </TransferProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
