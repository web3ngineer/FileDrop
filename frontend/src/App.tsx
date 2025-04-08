
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  
  
  return (
    <>
    <div className='flex flex-wrap content-center min-h-screen bg-gray-100'>
      <div className='block w-full'>
        <Header/>
        <main>
          <Outlet/>
        </main>
        <Footer/>
      </div>
    </div>
    </>
  )
}

export default App
