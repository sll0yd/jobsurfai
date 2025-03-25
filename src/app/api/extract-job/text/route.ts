import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to truncate text content
function truncateText(text: string, maxLength: number = 8000): string {
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim()

  // If content is still too long, truncate it
  if (text.length > maxLength) {
    // Find the last complete sentence before maxLength
    const truncated = text.substring(0, maxLength)
    const lastPeriod = truncated.lastIndexOf('.')
    const lastSpace = truncated.lastIndexOf(' ')
    
    // Cut at the last period or space, whichever is closer to maxLength
    const cutPoint = lastPeriod > lastSpace ? lastPeriod + 1 : lastSpace
    text = truncated.substring(0, cutPoint) + '...'
  }

  return text
}

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

    // Truncate the text content
    const truncatedText = truncateText(text)

    // Extract the main content using GPT
    let completion
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured')
      }

      completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a job posting parser. Extract the following information from the job posting text: position title, company name, location, job description, requirements, and salary range (if available). Return the information in a structured JSON format with these exact keys: position, company, location, description, requirements, salary_range. If any field cannot be found, return an empty string for that field."
          },
          {
            role: "user",
            content: truncatedText
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      })
    } catch (e) {
      console.error('OpenAI API error:', e)
      if (e instanceof Error) {
        return NextResponse.json(
          { error: `Failed to process job posting with AI: ${e.message}` },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to process job posting with AI. Please check your OpenAI API key and try again.' },
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
      { error: error instanceof Error ? error.message : 'An unexpected error occurred while processing the job posting.' },
      { status: 500 }
    )
  }
} 