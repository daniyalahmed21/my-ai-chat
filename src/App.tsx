import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import ChatHeader from './components/ChatHeader'
import { mockChatStream } from './mock-api'

interface Message {
  content: string
  isUser: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_messages')
    if (saved) {
      return JSON.parse(saved)
    }
    return [{ content: "Hello! I'm your AI assistant powered by Cloudflare Workers AI. How can I help you today?", isUser: false }]
  })
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = useRef(`user-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    const validMessages = messages.filter(msg => msg.content.trim() !== '')
    localStorage.setItem('chat_messages', JSON.stringify(validMessages))
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  const sendMessage = async (message: string) => {
    setMessages(prev => [...prev, { content: message, isUser: true }])

    let fullText = ''

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId.current
        },
        body: JSON.stringify({ message })
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        fullText += decoder.decode(value, { stream: true })
        setStreamingMessage(fullText)
      }
    } catch (error) {
      for await (const chunk of mockChatStream(message)) {
        fullText += chunk
        setStreamingMessage(fullText)
      }
    }

    setMessages(prev => [...prev, { content: fullText, isUser: false }])
    setStreamingMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <ChatHeader />

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-5xl h-[calc(100vh-140px)] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage key={index} content={msg.content} isUser={msg.isUser} />
            ))}

            {streamingMessage && (
              <ChatMessage content={streamingMessage} isUser={false} />
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={sendMessage} disabled={!!streamingMessage} />
        </div>
      </div>
    </div>
  )
}

export default App
