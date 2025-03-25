import React from 'react'
import { colors, ColorKey } from '@/lib/design-system'

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color?: ColorKey
}

export default function FeatureCard({
  title,
  description,
  icon,
  color = 'primary'
}: FeatureCardProps) {
  return (
    <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`w-12 h-12 rounded-lg ${colors[color][100]} flex items-center justify-center mb-4`}>
        <span className={`text-2xl ${colors[color][800]}`}>{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
      <div className={`absolute inset-0 rounded-xl border-2 ${colors[color][200]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  )
} 