import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Books
export const getBooks = () => api.get('/books')
export const getBook = (id) => api.get(`/books/${id}`)
export const addBook = (book) => api.post('/books', book)
export const deleteBook = (id) => api.delete(`/books/${id}`)

// Categories
export const getCategories = () => api.get('/categories')
export const addCategory = (category) => api.post('/categories', category)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// Customers
export const getCustomers = () => api.get('/customers')
export const addCustomer = (customer) => api.post('/customers', customer)
export const deleteCustomer = (id) => api.delete(`/customers/${id}`)

// Employees
export const getEmployees = () => api.get('/employees')

// Sales
export const getSales = () => api.get('/sales')
export const createSale = (sale) => api.post('/sales', sale)

// Rentals
export const getRentals = () => api.get('/rentals')
export const createRental = (rental) => api.post('/rentals', rental)
export const returnRental = (id) => api.put(`/rentals/${id}/return`)

// Reports
export const getSalesSummary = () => api.get('/reports/sales-summary')
export const getRecentTransactions = () => api.get('/reports/recent-transactions')

// Database
export const initializeDatabase = () => api.post('/database/initialize')

export default api
