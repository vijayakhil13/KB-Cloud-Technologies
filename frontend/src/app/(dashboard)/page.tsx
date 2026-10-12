export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard Overview
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Create New VM
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Virtual Machines
          </div>
          <div className="text-3xl font-bold text-blue-600">
            3
          </div>
          <p className="text-sm text-gray-500">
            2 running, 1 stopped
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            CPU Usage
          </div>
          <div className="text-3xl font-bold text-orange-500">
            45%
          </div>
          <p className="text-sm text-gray-500">
            Average across all VMs
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Memory Usage
          </div>
          <div className="text-3xl font-bold text-purple-500">
            62%
          </div>
          <p className="text-sm text-gray-500">
            8.2 GB / 13.2 GB
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Storage Used
          </div>
          <div className="text-3xl font-bold text-teal-500">
            120 GB
          </div>
          <p className="text-sm text-gray-500">
            of 500 GB allocated
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">VM 'web-server' started</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Backup completed for 'database-vm'</p>
                <p className="text-sm text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Alert triggered: High memory usage</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </div>
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Monitoring Settings</p>
                <p className="text-sm text-gray-500">Configure alerts and notifications</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Billing & Usage</p>
                <p className="text-sm text-gray-500">View current month's charges</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Support Center</p>
                <p className="text-sm text-gray-500">Open a ticket or check status</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}