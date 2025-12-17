import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, FolderOpen } from 'lucide-react'
import { getCategories, addCategory, deleteCategory } from '../services/api'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        categoryName: ''
    })

    useEffect(() => {
        loadCategories()
    }, [])

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
            await addCategory(formData)
            setShowModal(false)
            loadCategories()
            setFormData({ categoryName: '' })
            alert('تمت إضافة الفئة بنجاح!')
        } catch (error) {
            console.error('Error adding category:', error)
            alert('حدث خطأ أثناء إضافة الفئة')
        }
    }

    const handleDelete = async (id, name) => {
        if (window.confirm(`هل أنت متأكد من حذف الفئة "${name}"؟`)) {
            try {
                await deleteCategory(id)
                loadCategories()
                alert('تم حذف الفئة بنجاح!')
            } catch (error) {
                console.error('Error deleting category:', error)
                alert('حدث خطأ أثناء حذف الفئة')
            }
        }
    }

    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    إضافة فئة جديدة
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="relative">
                    <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ابحث عن فئة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.categoryID}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border-t-4 border-indigo-500"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-3 rounded-lg">
                                        <FolderOpen className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {category.categoryName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            رقم: {category.categoryID}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t">
                                <button className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                    <span className="text-sm">تعديل</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(category.categoryID, category.categoryName)}
                                    className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm">حذف</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد فئات</p>
                    <p className="text-gray-400 text-sm mt-2">
                        اضغط على "إضافة فئة جديدة" لإنشاء فئة
                    </p>
                </div>
            )}

            {/* Add Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <FolderOpen className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">إضافة فئة جديدة</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم الفئة
                                </label>
                                <input
                                    type="text"
                                    placeholder="مثال: روايات، علوم، تاريخ..."
                                    value={formData.categoryName}
                                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                    autoFocus
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
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                                >
                                    حفظ الفئة
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories
