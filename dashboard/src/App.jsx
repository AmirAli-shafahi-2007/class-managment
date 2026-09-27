import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { connectSocket, disconnectSocket, onNotification } from "./services/socket";
import { toast } from "./components/Toast";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LockedOverlay from "./components/LockedOverlay";

// Pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import CompaniesPage from "./pages/companies/CompaniesPage";
import ClassesPage from "./pages/class/ClassesPage";
import LoginPage from "./pages/LoginPage";
import ContractPage from "./pages/contract/ContractPage";
import FinancePage from "./pages/financeRecord/FinanceRecordPage";
import TodoPage from "./pages/todo/TodoPage";
import RegisterPage from "./pages/RegisterPage";
import ReportPage from "./pages/report/ReportsPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import SettingsPage from "./pages/setting/SettingsPage";
import NotificationsPage from "./pages/notification/NotificationsPage";
import InvoicesPage from "./pages/invoice/InvoicesPage";
import PricingPage from "./pages/price/PricingPage";
import ToastContainer from "./components/Toast";
import { HelmetProvider } from "react-helmet-async";

function App() {
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      // اتصال به WebSocket
      connectSocket(token);

      // گوش دادن به نوتیفیکیشن‌های Real-time
      const unsubscribe = onNotification((notif) => {
        if (notif.priority === "high") {
          toast.warning(`${notif.title}: ${notif.message}`, 5000);
        } else if (notif.priority === "medium") {
          toast.info(`${notif.title}`, 3000);
        }
        setNotifCount((prev) => prev + 1);
      });

      return () => {
        unsubscribe();
        disconnectSocket();
      };
    }
  }, []);

  return (
    <HelmetProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <Routes>
            {/* Routeهای عمومی - بدون نیاز به لاگین */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Routeهای محافظت شده */}
            <Route path="/" element={<AppLayout />}>
              
              {/* Pricing - همیشه در دسترس (حتی بدون اشتراک) */}
              <Route path="pricing" element={<PricingPage />} />
              
              {/* Settings - همیشه در دسترس */}
              <Route path="settings" element={<SettingsPage />} />
              
              {/* Notifications - همیشه در دسترس */}
              <Route path="notifications" element={<NotificationsPage />} />

              {/* Dashboard - نیاز به اشتراک فعال */}
              <Route index element={
                <ProtectedRoute page="dashboard">
                  <DashboardPage />
                </ProtectedRoute>
              } />

              {/* Companies - نیاز به پلن حرفه‌ای */}
              <Route path="companies" element={
                <ProtectedRoute page="companies">
                  <LockedOverlay page="companies">
                    <CompaniesPage />
                  </LockedOverlay>
                </ProtectedRoute>
              } />

              {/* Contracts */}
              <Route path="contract" element={
                <ProtectedRoute page="contracts">
                  <LockedOverlay page="contracts">
                    <ContractPage />
                  </LockedOverlay>
                </ProtectedRoute>
              } />

              {/* Classes */}
              <Route path="classes" element={
                <ProtectedRoute page="classes">
                  <LockedOverlay page="classes">
                    <ClassesPage />
                  </LockedOverlay>
                </ProtectedRoute>
              } />

              {/* Finance */}
              <Route path="finance" element={
                <ProtectedRoute page="finance">
                  <LockedOverlay page="finance">
                    <FinancePage />
                  </LockedOverlay>
                </ProtectedRoute>
              } />

              {/* Todo - پلن رایگان هم دسترسی داره */}
              <Route path="todo" element={
                <ProtectedRoute page="todo">
                  <TodoPage />
                </ProtectedRoute>
              } />

              {/* Calendar */}
              <Route path="calendar" element={
                <ProtectedRoute page="calendar">
                  <LockedOverlay page="calendar">
                    <CalendarPage />
                  </LockedOverlay>
                </ProtectedRoute>
              } />

              {/* Reports */}
              <Route path="reports" element={
                <ProtectedRoute page="reports">
                  <LockedOverlay page="reports">
                    <ReportPage />
                  </LockedOverlay>
                </ProtectedRoute>
              } />

              {/* Invoices */}
              <Route path="invoices" element={
                <ProtectedRoute page="invoices">
                  <LockedOverlay page="invoices">
                    <InvoicesPage />
                  </LockedOverlay>
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </SubscriptionProvider>
    </HelmetProvider>
  );
}

export default App;