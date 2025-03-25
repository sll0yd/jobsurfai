import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Text is too short to be a job posting. Please provide more content.' },
        { status: 400 }
      )
    }

    // Extract the main content using GPT
    let completion
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a job posting parser. Extract the following information from the job posting text: position title, company name, location, job description, requirements, and salary range (if available). Return the information in a structured JSON format with these exact keys: position, company, location, description, requirements, salary_range. If any field cannot be found, return an empty string for that field."
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      })
    } catch (e) {
      console.error('OpenAI API error:', e)
      return NextResponse.json(
        { error: 'Failed to process job posting with AI. Please try again or enter details manually.' },
        { status: 500 }
      )
    }

    const extractedData = JSON.parse(completion.choices[0].message.content || '{}')

    // Validate extracted data
    if (!extractedData.position && !extractedData.company) {
      return NextResponse.json(
        { error: 'Could not extract job details. The text might not be a job posting or might be in an unsupported format.' },
        { status: 400 }
      )
    }

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('Error extracting job details:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the job posting.' },
      { status: 500 }
    )
  }
} 