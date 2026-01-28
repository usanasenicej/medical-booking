"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Star, MapPin, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"
import { mockDoctors } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function BookAppointmentPage() {
  const searchParams = useSearchParams()
  const preselectedDoctorId = searchParams.get("doctorId")

  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [currentWeek, setCurrentWeek] = useState(new Date())

  useEffect(() => {
    if (preselectedDoctorId) {
      const doctor = mockDoctors.find((d) => d.id === preselectedDoctorId)
      if (doctor) {
        setSelectedDoctor(doctor)
        setStep(2)
      }
    }
  }, [preselectedDoctorId])

  const getWeekDates = (startDate: Date) => {
    const dates = []
    const start = new Date(startDate)
    start.setDate(start.getDate() - start.getDay()) // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates(currentWeek)

  const getAvailableSlots = (doctorId: string, date: string) => {
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const doctorAvailability = mockDoctors.find((d) => d.id === doctorId)?.availability
    return doctorAvailability?.[dayName as keyof typeof doctorAvailability] || []
  }

  const handleBookAppointment = () => {
    // Mock booking logic
    const newAppointment = {
      id: `apt${Date.now()}`,
      patientId: user?.id,
      doctorId: selectedDoctor.id,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
      reason,
      notes,
    }

    // In a real app, this would make an API call
    console.log("Booking appointment:", newAppointment)
    alert("Appointment booked successfully!")

    // Reset form
    setStep(1)
    setSelectedDoctor(null)
    setSelectedDate("")
    setSelectedTime("")
    setReason("")
    setNotes("")
  }

  const nextWeek = () => {
    const next = new Date(currentWeek)
    next.setDate(next.getDate() + 7)
    setCurrentWeek(next)
  }

  const prevWeek = () => {
    const prev = new Date(currentWeek)
    prev.setDate(prev.getDate() - 7)
    setCurrentWeek(prev)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book Appointment</h1>
        <p className="text-gray-600 mt-2">Schedule your appointment in a few simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 4 && <div className={`w-12 h-0.5 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select a Doctor</CardTitle>
            <CardDescription>Choose from our available healthcare professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`cursor-pointer transition-all ${
                    selectedDoctor?.id === doctor.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <Badge variant="secondary" className="mt-1">
                          {doctor.specialization}
                        </Badge>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {doctor.rating}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {doctor.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />${doctor.consultationFee}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep(2)} disabled={!selectedDoctor}>
                Next: Select Date & Time
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && selectedDoctor && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Select Date & Time</CardTitle>
            <CardDescription>
              Choose your preferred appointment slot with Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Calendar Week View */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select Date</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={prevWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0]
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isPast = date < new Date() && !isToday
                  const availableSlots = getAvailableSlots(selectedDoctor.id, dateStr)
                  const hasSlots = availableSlots.length > 0

                  return (
                    <Button
                      key={dateStr}
                      variant={selectedDate === dateStr ? "default" : "outline"}
                      className={`h-16 flex flex-col ${isPast || !hasSlots ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => (hasSlots && !isPast ? setSelectedDate(dateStr) : null)}
                      disabled={isPast || !hasSlots}
                    >
                      <span className="text-xs">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span className="text-lg font-semibold">{date.getDate()}</span>
                      {hasSlots && !isPast && (
                        <span className="text-xs text-green-600">{availableSlots.length} slots</span>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {getAvailableSlots(selectedDoctor.id, selectedDate).map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="h-12"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back: Select Doctor
              </Button>
              <Button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}>
                Next: Appointment Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Appointment Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Appointment Details</CardTitle>
            <CardDescription>Provide details about your appointment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason for visit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">General Consultation</SelectItem>
                  <SelectItem value="checkup">Regular Checkup</SelectItem>
                  <SelectItem value="followup">Follow-up Visit</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="screening">Health Screening</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Describe your symptoms or any additional information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back: Select Date & Time
              </Button>
              <Button onClick={() => setStep(4)} disabled={!reason}>
                Next: Review & Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && selectedDoctor && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Review & Confirm</CardTitle>
            <CardDescription>Please review your appointment details before confirming</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Doctor Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedDoctor.specialization}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {selectedDoctor.rating}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedDoctor.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Time</Label>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Reason</Label>
                    <p className="font-medium mt-1">{reason}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Consultation Fee</Label>
                    <p className="font-medium mt-1">${selectedDoctor.consultationFee}</p>
                  </div>
                </div>
              </div>

              {notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Additional Notes</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{notes}</p>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back: Edit Details
                </Button>
                <Button onClick={handleBookAppointment} className="bg-green-600 hover:bg-green-700">
                  Confirm Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
