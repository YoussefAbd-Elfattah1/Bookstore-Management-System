import { useEffect, useState } from 'react'
import { BookOpen, Users, ShoppingCart, Package } from 'lucide-react'
import { getBooks, getCustomers, getSalesSummary } from '../services/api'

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalCustomers: 0,
        todaySales: 0,
        activeRentals: 0
    })

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const [booksRes, customersRes, salesRes] = await Promise.all([
                getBooks(),
                getCustomers(),
                getSalesSummary()
            ])

            setStats({
                totalBooks: booksRes.data.length,
                totalCustomers: customersRes.data.length,
                todaySales: salesRes.data[0]?.totalSales || 0,
                activeRentals: 0
            })
        } catch (error) {
            console.error('Error loading stats:', error)
        }
    }

    const statCards = [
        { icon: BookOpen, label: 'إجمالي الكتب', value: stats.totalBooks, color: 'bg-blue-500' },
        { icon: Users, label: 'إجمالي العملاء', value: stats.totalCustomers, color: 'bg-green-500' },
        { icon: ShoppingCart, label: 'مبيعات اليوم', value: `${stats.todaySales} ج.م`, color: 'bg-purple-500' },
        { icon: Package, label: 'إيجارات نشطة', value: stats.activeRentals, color: 'bg-orange-500' },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">لوحة التحكم</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">{card.label}</p>
                                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Dashboard
