 import Login from './components/Login'; // or './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Keep existing routes */}
      </Routes>
    </BrowserRouter>
  );
}

