"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { mockAppointments, mockDoctors } from "@/lib/mock-data"
import Link from "next/link"

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState(mockAppointments.filter((apt) => apt.patientId === user?.id))
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])

  useEffect(() => {
    const upcoming = appointments
      .filter((apt) => new Date(apt.date) >= new Date() && apt.status !== "cancelled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
    setUpcomingAppointments(upcoming)
  }, [appointments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDoctorName = (doctorId: string) => {
    const doctor = mockDoctors.find((d) => d.id === doctorId)
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Unknown Doctor"
  }

  const getDoctorSpecialization = (doctorId: string) => {
    const doctor = mockDoctors.find((d) => d.id === doctorId)
    return doctor?.specialization || "General"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-blue-100">Manage your appointments and health journey from your dashboard.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">All time appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDoctors.length}</div>
            <p className="text-xs text-muted-foreground">Available doctors</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/patient/book-appointment">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>Book Appointment</span>
              </Button>
            </Link>
            <Link href="/patient/doctors">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <User className="h-6 w-6" />
                <span>Browse Doctors</span>
              </Button>
            </Link>
            <Link href="/patient/appointments">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>My Appointments</span>
              </Button>
            </Link>
            <Link href="/patient/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <User className="h-6 w-6" />
                <span>My Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next scheduled appointments</CardDescription>
          </div>
          <Link href="/patient/appointments">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <Link href="/patient/book-appointment">
                <Button>Book Your First Appointment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{getDoctorName(appointment.doctorId)}</h4>
                      <p className="text-sm text-gray-600">{getDoctorSpecialization(appointment.doctorId)}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
