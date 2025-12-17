import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'
import { getSalesSummary, getRecentTransactions } from '../services/api'

const Reports = () => {
    const [salesSummary, setSalesSummary] = useState([])
    const [recentTransactions, setRecentTransactions] = useState([])

    useEffect(() => {
        loadReports()
    }, [])

    const loadReports = async () => {
        try {
            const [salesRes, transactionsRes] = await Promise.all([
                getSalesSummary(),
                getRecentTransactions()
            ])
            setSalesSummary(salesRes.data)
            setRecentTransactions(transactionsRes.data)
        } catch (error) {
            console.error('Error loading reports:', error)
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">التقارير والإحصائيات</h1>

            {/* Sales Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">ملخص المبيعات اليومية</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي المبيعات</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عدد العمليات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {salesSummary.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {new Date(item.saleDay).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                        {item.totalSales} ج.م
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.numberOfSales}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-800">العمليات الأخيرة</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم العملية</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentTransactions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">#{transaction.id}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'Sale'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {transaction.type === 'Sale' ? 'بيع' : 'إيجار'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(transaction.date).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                        {transaction.amount} ج.م
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Reports
