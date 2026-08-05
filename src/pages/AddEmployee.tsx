import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { User, Phone, Award, Save, X } from 'lucide-react'
import type { Employee } from '@/lib/data'
import { database } from '@/lib/database'

export default function AddEmployee() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Production',
    email: '',
    phone: '',
    performance: 75,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'performance' ? Number(value) : value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.role || !formData.email || !formData.phone) {
      setError('Please fill in all required fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Create new employee
    const newEmployee: Employee = {
      id: `EMP-${Date.now()}`,
      name: formData.name.trim(),
      role: formData.role.trim(),
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      status: 'Active',
      performance: formData.performance,
      assignedJobs: 0,
      avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      completedJobs: 0,
      joinDate: new Date().toISOString().slice(0, 10),
    }

    try {
      await database.create('employees', newEmployee)
    } catch {
      setError('Unable to save the employee. Check the database connection and try again.')
      return
    }

    setSuccess(true)
    setTimeout(() => {
      navigate('/employees')
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/employees')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <X className="w-4 h-4" />
            Back to Employees
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Add New Employee
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Register a new team member to your workshop
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-emerald-700 text-sm font-medium"
          >
            ✓ Employee added successfully! Redirecting...
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50/80 border border-red-200/70 text-red-700 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200/70 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      placeholder="Machine Operator"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200/70 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200/70 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="Production">Production</option>
                    <option value="Quality">Quality Assurance</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@workshop.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200/70 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-200/70 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Performance */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Performance Assessment
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Performance Score
                  </label>
                  <span className="text-sm font-bold text-blue-600">{formData.performance}%</span>
                </div>
                <input
                  type="range"
                  name="performance"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.performance}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-slate-200/70 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Needs Improvement</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/employees')}
                className="flex-1 px-6 py-3 rounded-xl bg-slate-100/70 text-slate-700 font-semibold hover:bg-slate-200/70 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={success}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{success ? 'Employee Added!' : 'Add Employee'}</span>
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}
