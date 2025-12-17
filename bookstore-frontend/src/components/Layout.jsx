import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Users, ShoppingCart, Package, BarChart3, Home, FolderOpen } from 'lucide-react'

const Layout = ({ children }) => {
    const location = useLocation()

    const navItems = [
        { path: '/', icon: Home, label: 'الرئيسية' },
        { path: '/books', icon: BookOpen, label: 'الكتب' },
        { path: '/categories', icon: FolderOpen, label: 'الفئات' },
        { path: '/customers', icon: Users, label: 'العملاء' },
        { path: '/sales', icon: ShoppingCart, label: 'المبيعات' },
        { path: '/rentals', icon: Package, label: 'الإيجارات' },
        { path: '/reports', icon: BarChart3, label: 'التقارير' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">إدارة المكتبة</h1>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-white text-blue-600 shadow-md'
                                        : 'hover:bg-blue-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="mr-64 p-8">
                {children}
            </main>
        </div>
    )
}

export default Layout
