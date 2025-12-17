import { useEffect, useState } from 'react'
import { Plus, ShoppingCart, Calendar, User, BookOpen } from 'lucide-react'
import { getBooks, getCustomers, getEmployees, createSale, getSales } from '../services/api'

const Sales = () => {
    const [sales, setSales] = useState([])
    const [books, setBooks] = useState([])
    const [customers, setCustomers] = useState([])
    const [employees, setEmployees] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        customerId: '',
        employeeId: '',
        bookId: '',
        quantity: 1
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [salesRes, booksRes, customersRes, employeesRes] = await Promise.all([
                getSales(),
                getBooks(),
                getCustomers(),
                getEmployees()
            ])
            setSales(salesRes.data)
            setBooks(booksRes.data)
            setCustomers(customersRes.data)
            setEmployees(employeesRes.data)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createSale(formData)
            setShowModal(false)
            setFormData({ customerId: '', employeeId: '', bookId: '', quantity: 1 })
            alert('تمت عملية البيع بنجاح!')
            loadData()
        } catch (error) {
            console.error('Error creating sale:', error)
            alert('حدث خطأ أثناء عملية البيع')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إدارة المبيعات</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    عملية بيع جديدة
                </button>
            </div>

            {/* Sales List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم العملية</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموظف</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكتاب</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sales.map((sale) => (
                            <tr key={sale.saleID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{sale.saleID}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        {sale.customerName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{sale.employeeName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-purple-500" />
                                        {sale.bookTitle}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{sale.quantity}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{sale.unitPrice} ج.م</td>
                                <td className="px-6 py-4 text-sm font-semibold text-purple-600">{sale.totalPrice} ج.م</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date(sale.saleDate).toLocaleDateString('ar-EG')}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Sale Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">عملية بيع جديدة</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
                                <select
                                    value={formData.customerId}
                                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">اختر العميل</option>
                                    {customers.map(customer => (
                                        <option key={customer.customerID} value={customer.customerID}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الموظف</label>
                                <select
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">اختر الموظف</option>
                                    {employees.map(employee => (
                                        <option key={employee.employeeID} value={employee.employeeID}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الكتاب</label>
                                <select
                                    value={formData.bookId}
                                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">اختر الكتاب</option>
                                    {books.map(book => (
                                        <option key={book.bookID} value={book.bookID}>
                                            {book.title} - {book.price} ج.م
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                                <input
                                    type="number"
                                    placeholder="الكمية"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                                >
                                    تأكيد البيع
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Sales
