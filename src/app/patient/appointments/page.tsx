"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, MapPin, Phone, Mail, Edit, X } from "lucide-react"
import { mockAppointments, mockDoctors } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState(mockAppointments.filter((apt) => apt.patientId === user?.id))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDoctorInfo = (doctorId: string) => {
    return mockDoctors.find((d) => d.id === doctorId)
  }

  const cancelAppointment = (appointmentId: string) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt)))
  }

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== "cancelled",
  )

  const pastAppointments = appointments.filter((apt) => new Date(apt.date) < new Date() || apt.status === "cancelled")

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: any; showActions?: boolean }) => {
    const doctor = getDoctorInfo(appointment.doctorId)
    const isPast = new Date(appointment.date) < new Date()

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Dr. {doctor?.firstName} {doctor?.lastName}
                </h3>
                <p className="text-gray-600">{doctor?.specialization}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(appointment.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {doctor?.location}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {doctor?.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {doctor?.email}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Reason:</span> {appointment.reason}
                  </p>
                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>

              {showActions && !isPast && appointment.status !== "cancelled" && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => cancelAppointment(appointment.id)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-gray-600 mt-2">Manage your upcoming and past appointments</p>
        </div>
        <Link href="/patient/book-appointment">
          <Button>Book New Appointment</Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-600 mb-4">You don't have any upcoming appointments scheduled.</p>
                <Link href="/patient/book-appointment">
                  <Button>Book Your First Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showActions={true} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No past appointments</h3>
                <p className="text-gray-600 mb-4">Your appointment history will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
