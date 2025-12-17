import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { getBooks, getCategories, addBook, deleteBook } from '../services/api'

const Books = () => {
    const [books, setBooks] = useState([])
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        subTitle: '',
        author: '',
        categoryId: '',
        price: '',
        rentalPricePerDay: '',
        quantityInStock: ''
    })

    useEffect(() => {
        loadBooks()
        loadCategories()
    }, [])

    const loadBooks = async () => {
        try {
            const response = await getBooks()
            setBooks(response.data)
        } catch (error) {
            console.error('Error loading books:', error)
        }
    }

    const loadCategories = async () => {
        try {
            const response = await getCategories()
            setCategories(response.data)
        } catch (error) {
            console.error('Error loading categories:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addBook(formData)
            setShowModal(false)
            loadBooks()
            setFormData({
                title: '',
                subTitle: '',
                author: '',
                categoryId: '',
                price: '',
                rentalPricePerDay: '',
                quantityInStock: ''
            })
        } catch (error) {
            console.error('Error adding book:', error)
        }
    }

    const handleDelete = async (id, title) => {
        if (window.confirm(`هل أنت متأكد من حذف الكتاب "${title}"؟`)) {
            try {
                await deleteBook(id)
                loadBooks()
                alert('تم حذف الكتاب بنجاح!')
            } catch (error) {
                console.error('Error deleting book:', error)
                alert('حدث خطأ أثناء حذف الكتاب')
            }
        }
    }

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الكتب</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    إضافة كتاب جديد
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="relative">
                    <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ابحث عن كتاب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العنوان</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المؤلف</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الفئة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredBooks.map((book) => (
                            <tr key={book.bookID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{book.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{book.categoryName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{book.price} ج.م</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{book.quantityInStock}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.bookID, book.title)}
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

            {/* Add Book Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
                        <h2 className="text-2xl font-bold mb-6">إضافة كتاب جديد</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="عنوان الكتاب"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="العنوان الفرعي"
                                    value={formData.subTitle}
                                    onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="المؤلف"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">اختر الفئة</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryID} value={cat.categoryID}>{cat.categoryName}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="السعر"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="سعر الإيجار اليومي"
                                    value={formData.rentalPricePerDay}
                                    onChange={(e) => setFormData({ ...formData, rentalPricePerDay: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="الكمية"
                                    value={formData.quantityInStock}
                                    onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default Books
