import { useEffect, useState } from 'react'
import { Plus, Package, Calendar, User, BookOpen, CheckCircle } from 'lucide-react'
import { getBooks, getCustomers, getEmployees, createRental, getRentals } from '../services/api'

const Rentals = () => {
    const [rentals, setRentals] = useState([])
    const [books, setBooks] = useState([])
    const [customers, setCustomers] = useState([])
    const [employees, setEmployees] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        customerId: '',
        employeeId: '',
        bookId: '',
        days: 1,
        quantity: 1
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [rentalsRes, booksRes, customersRes, employeesRes] = await Promise.all([
                getRentals(),
                getBooks(),
                getCustomers(),
                getEmployees()
            ])
            setRentals(rentalsRes.data)
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
            await createRental(formData)
            setShowModal(false)
            setFormData({ customerId: '', employeeId: '', bookId: '', days: 1, quantity: 1 })
            alert('تمت عملية الإيجار بنجاح!')
            loadData()
        } catch (error) {
            console.error('Error creating rental:', error)
            alert('حدث خطأ أثناء عملية الإيجار')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الإيجارات</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    عملية إيجار جديدة
                </button>
            </div>

            {/* Rentals List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم العملية</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموظف</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكتاب</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الأيام</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التكلفة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإيجار</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإرجاع</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rentals.map((rental) => (
                            <tr key={rental.rentalID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{rental.rentalID}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        {rental.customerName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{rental.employeeName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-orange-500" />
                                        {rental.bookTitle}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{rental.days} يوم</td>
                                <td className="px-6 py-4 text-sm font-semibold text-orange-600">{rental.totalCost} ج.م</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date(rental.rentalDate).toLocaleDateString('ar-EG')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(rental.expectedReturnDate).toLocaleDateString('ar-EG')}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${rental.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {rental.status === 'Active' && <Package className="w-3 h-3" />}
                                        {rental.status === 'Returned' && <CheckCircle className="w-3 h-3" />}
                                        {rental.status === 'Active' ? 'نشط' : 'تم الإرجاع'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Rental Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Package className="w-6 h-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">عملية إيجار جديدة</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
                                <select
                                    value={formData.customerId}
                                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
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
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
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
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    required
                                >
                                    <option value="">اختر الكتاب</option>
                                    {books.map(book => (
                                        <option key={book.bookID} value={book.bookID}>
                                            {book.title} - {book.rentalPricePerDay} ج.م/يوم
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">عدد الأيام</label>
                                <input
                                    type="number"
                                    placeholder="عدد الأيام"
                                    min="1"
                                    value={formData.days}
                                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                                <input
                                    type="number"
                                    placeholder="الكمية"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
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
                                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                                >
                                    تأكيد الإيجار
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Rentals
