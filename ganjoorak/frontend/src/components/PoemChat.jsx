import { useState, useRef, useEffect } from 'react'
import { chatWithPoem } from '../api'

export default function PoemChat({ poemId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || streaming) return
    const userMsg = input.trim()
    setInput('')
    const history = messages.map(m => ({ role: m.role, content: m.content }))
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setStreaming(true)
    let content = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    try {
      await chatWithPoem(poemId, userMsg, history, chunk => {
        content += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content }
          return updated
        })
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        }
        return updated
      })
    }
    setStreaming(false)
  }

  return (
    <div className="h-full flex flex-col rounded-2xl border border-stone-200 dark:border-stone-700/50 bg-white dark:bg-stone-800/30 overflow-hidden lg:sticky lg:top-20">
      <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-700/50">
        <h3 className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          گفتگو درباره این شعر
        </h3>
      </div>

      <div className={`overflow-y-auto p-4 space-y-4 ${messages.length > 0 ? 'min-h-32 max-h-[60vh]' : ''}`}>
        {messages.length === 0 && (
          <p className="text-center text-stone-400 dark:text-stone-500 text-sm py-2">
            درباره معنی، زمینه تاریخی، یا آرایه‌های ادبی این شعر بپرسید
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-700/50 text-stone-800 dark:text-stone-200'
              }`}
            >
              {msg.content || (streaming && i === messages.length - 1 ? (
                <span className="inline-flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              ) : '')}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-stone-200 dark:border-stone-700/50 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          disabled={streaming}
          className="flex-1 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200
                     dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500
                     focus:border-transparent transition-all placeholder:text-stone-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium
                     hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ارسال
        </button>
      </form>
    </div>
  )
}
