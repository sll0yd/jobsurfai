import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to truncate HTML content while preserving structure
function truncateHTML(html: string, maxLength: number = 8000): string {
  // Remove script and style elements
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  // Remove extra whitespace
  html = html.replace(/\s+/g, ' ').trim()

  // If content is still too long, truncate it
  if (html.length > maxLength) {
    // Find the last complete sentence before maxLength
    const truncated = html.substring(0, maxLength)
    const lastPeriod = truncated.lastIndexOf('.')
    const lastSpace = truncated.lastIndexOf(' ')
    
    // Cut at the last period or space, whichever is closer to maxLength
    const cutPoint = lastPeriod > lastSpace ? lastPeriod + 1 : lastSpace
    html = truncated.substring(0, cutPoint) + '...'
  }

  return html
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Fetch the job posting content
    let response
    try {
      response = await fetch(url)
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.statusText}` },
          { status: response.status }
        )
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Failed to fetch URL. The website might be blocking automated requests.' },
        { status: 500 }
      )
    }

    const html = await response.text()
    if (!html) {
      return NextResponse.json(
        { error: 'No content found at the provided URL' },
        { status: 400 }
      )
    }

    // Truncate the HTML content
    const truncatedHtml = truncateHTML(html)

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
            content: "You are a job posting parser. Extract the following information from the job posting HTML: position title, company name, location, job description, requirements, and salary range (if available). Return the information in a structured JSON format with these exact keys: position, company, location, description, requirements, salary_range. If any field cannot be found, return an empty string for that field."
          },
          {
            role: "user",
            content: truncatedHtml
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
        { error: 'Could not extract job details. The content might not be a job posting or might be in an unsupported format.' },
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