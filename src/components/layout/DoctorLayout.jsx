import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DoctorSidebar from './DoctorSidebar'
import DoctorHeader from './DoctorHeader'

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="doctor-layout relative min-h-dvh w-full overflow-x-hidden bg-[#f4f7fb]">
      <DoctorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-dvh w-full min-w-0 flex-col lg:pl-[260px]">
        <DoctorHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
