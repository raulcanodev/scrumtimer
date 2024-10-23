'use client'

import { useState } from 'react'
import ParticipantForm from './components/ParticipantForm'
import Timer from './components/Timer'

export default function Home() {
  const [participants, setParticipants] = useState<string[]>([])
  const [totalTime, setTotalTime] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [randomOrder, setRandomOrder] = useState<boolean>(false)

  const handleStart = (names: string[], time: number) => {

    if(randomOrder) {
      names = names.sort(() => Math.random() - 0.5)
    }

    setParticipants(names)
    setTotalTime(time)
    setIsStarted(true)
  }

  const handleReset = () => {
    setParticipants([])
    setTotalTime(0)
    setIsStarted(false)
  }

  const handleRandomOrder = (value: boolean) => {
    setRandomOrder(value)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {!isStarted ? (
        <ParticipantForm 
          onStart={handleStart} 
          onRandomOrderChange={handleRandomOrder} 
          randomOrder={randomOrder} 
        />
      ) : (
        <Timer
          participants={participants}
          totalTime={totalTime}
          onReset={handleReset}
        />
      )}
    </main>
  )
}