import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Categories from './pages/Categories'
import Customers from './pages/Customers'
import Sales from './pages/Sales'
import Rentals from './pages/Rentals'
import Reports from './pages/Reports'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/rentals" element={<Rentals />} />
                    <Route path="/reports" element={<Reports />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
