import AppRoutes from "./routes/AppRoutes.tsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import ChatWindow from "./chat-module/component/ChatWindow.tsx";
import ChatSocketHandler from "./chat-module/handler/ChatSocketHandler.tsx";
import { useChatStore } from "./store/useChatStore.ts";
import { useEffect } from "react";
import { useAuth } from "./store/useAuth.ts";
import NotificationSocketHandler from "./chat-module/handler/NotificationSocketHandler.tsx";
import GigHubAIAssistant from "./components/features/GigHubAIAssistant.tsx";
function App() {
  const { email } = useAuth();
  const { sender, recipient, messages, setUnreadCount } = useChatStore();

  useEffect(() => {
    async function storeClientSessionInfo() {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();

        const ip = data.ip;
        const ua = navigator.userAgent;
        if (ip) localStorage.setItem('current_ip', ip);
        if (ua) localStorage.setItem('current_ua', ua);
      } catch (err) {
        console.error('Failed to store client session info:', err);
      }
    }

    storeClientSessionInfo().then(r=>r);
  }, []);


  useEffect(() => {
    if (messages) {
      setUnreadCount(
        messages.filter((c) => c.sender !== email && !c.viewed).length,
      );
    }
  }, [email, messages, setUnreadCount]);

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer
        pauseOnFocusLoss={false}
        autoClose={2000}
        hideProgressBar={true}
        pauseOnHover={false}
      />
      <ChatSocketHandler userId={sender || ""} recipientId={recipient || ""} />
      <NotificationSocketHandler userId={email || ""} />
      <ChatWindow />
      <GigHubAIAssistant />
    </>
  );
}

export default App;
