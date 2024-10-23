'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { X } from 'lucide-react'
import Logo from '../scrumtimer-logo.png'
import Image from 'next/image'

interface ParticipantFormProps {
  onStart: (names: string[], time: number) => void
  onRandomOrderChange: (value: boolean) => void
  randomOrder: boolean
}

export default function ParticipantForm({ onStart, onRandomOrderChange, randomOrder }: ParticipantFormProps) {
  const [names, setNames] = useState<string[]>([''])
  const [totalTime, setTotalTime] = useState('')

  useEffect(() => {
    const savedNames = localStorage.getItem('scrumParticipants')
    if (savedNames) {
      setNames(JSON.parse(savedNames))
    }
  }, [])

  const handleAddParticipant = () => {
    setNames([...names, ''])
  }

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names]
    newNames[index] = value
    setNames(newNames)
    localStorage.setItem('scrumParticipants', JSON.stringify(newNames))
  }

  const handleRemoveParticipant = (index: number) => {
    if (names.length > 1) {
      const newNames = names.filter((_, i) => i !== index)
      setNames(newNames)
      localStorage.setItem('scrumParticipants', JSON.stringify(newNames))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const filteredNames = names.filter(name => name.trim() !== '')
    localStorage.setItem('scrumParticipants', JSON.stringify(filteredNames))
    onStart(filteredNames, parseInt(totalTime) * 60) // Convert minutes to seconds
  }

  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <Image src={Logo} alt="Scrum Timer Logo" width={50} height={50} />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Scrum Timer Online</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 mb-10">
        {names.map((name, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Participant ${index + 1}`}
              required
            />
            {names.length > 1 && (
              <Button 
                type="button"  
                size="icon"
                onClick={() => handleRemoveParticipant(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button type="button" onClick={handleAddParticipant} variant="outline" className="w-full">
          Add Participant
        </Button>

        <div className='flex items-center justify-between'>
          <label className="block text-sm text-gray-300">Random order</label>
          <Switch
            checked={randomOrder}
            onCheckedChange={onRandomOrderChange}
            className="ml-2"
          />
        </div>

        <Input
          type="number"
          value={totalTime}
          onChange={(e) => setTotalTime(e.target.value)}
          placeholder="Total meeting time (minutes)"
          required
          min="1"
        />
        
        <Button type="submit" className="w-full">Start Meeting</Button>
      </form>
    </>
  )
}