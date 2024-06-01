import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/header";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./components/footer";



const App = () => {
  const location = useLocation();
  const isAdminPanel = location.pathname.startsWith("/admin"); // Replace with your admin panel path

  return (
    <>
      {!isAdminPanel && (
        <>
          <Header style={{ marginBottom: '20px' }} />
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            theme="light"
          />
        </>
      )}
        <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            theme="light"
          />
      <Container className="my-2">
        <Outlet />
        {!isAdminPanel && <Footer />}
      </Container>
    </>
  );
};

export default App;
