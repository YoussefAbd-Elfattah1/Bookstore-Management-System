import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { getCustomers, addCustomer, deleteCustomer } from '../services/api'

const Customers = () => {
    const [customers, setCustomers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    })

    useEffect(() => {
        loadCustomers()
    }, [])

    const loadCustomers = async () => {
        try {
            const response = await getCustomers()
            setCustomers(response.data)
        } catch (error) {
            console.error('Error loading customers:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addCustomer(formData)
            setShowModal(false)
            loadCustomers()
            setFormData({ name: '', phone: '', email: '', address: '' })
        } catch (error) {
            console.error('Error adding customer:', error)
        }
    }

    const handleDelete = async (id, name) => {
        if (window.confirm(`هل أنت متأكد من حذف العميل "${name}"؟`)) {
            try {
                await deleteCustomer(id)
                loadCustomers()
                alert('تم حذف العميل بنجاح!')
            } catch (error) {
                console.error('Error deleting customer:', error)
                alert('حدث خطأ أثناء حذف العميل')
            }
        }
    }

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إدارة العملاء</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    إضافة عميل جديد
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="relative">
                    <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ابحث عن عميل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الهاتف</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البريد الإلكتروني</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العنوان</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.customerID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{customer.address}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.customerID, customer.name)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
                        <h2 className="text-2xl font-bold mb-6">إضافة عميل جديد</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="الاسم"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="الهاتف"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                            <textarea
                                placeholder="العنوان"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                                rows="3"
                            />
                            <div className="flex gap-4 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Customers
