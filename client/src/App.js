import { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**************** SEMANTIC UI ****************/
import { Container } from 'semantic-ui-react';

/**************** REACT TOASTIFY ****************/
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**************** PAGES ****************/
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Fragment>
      <ToastContainer autoClose={3000} />
      <BrowserRouter>
        <Container>
          <Navbar />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;