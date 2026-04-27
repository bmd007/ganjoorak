import { VerseDivider } from './PersianOrnament'

export default function VerseDisplay({ verses }) {
  if (!verses || verses.length === 0) return null

  const couplets = []
  for (let i = 0; i < verses.length; i++) {
    const v = verses[i]
    if (v.position === 0) {
      const next = verses[i + 1]
      if (next && next.position === 1) {
        couplets.push({ first: v.text, second: next.text, key: v.vorder })
        i++
      } else {
        couplets.push({ first: v.text, second: null, key: v.vorder })
      }
    } else {
      couplets.push({ first: null, second: v.text, key: v.vorder })
    }
  }

  return (
    <div className="space-y-1">
      {couplets.map((c, idx) => (
        <div key={c.key}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-16 gap-1">
            {c.first && (
              <p className="verse-text text-center md:text-left md:flex-1 md:text-end">
                {c.first}
              </p>
            )}
            {c.second && (
              <p className="verse-text text-center md:text-right md:flex-1 md:text-start">
                {c.second}
              </p>
            )}
          </div>
          {idx < couplets.length - 1 && <VerseDivider />}
        </div>
      ))}
    </div>
  )
}
