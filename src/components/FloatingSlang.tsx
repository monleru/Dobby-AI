import React, { useState, useEffect } from 'react'

const FloatingSlang: React.FC = () => {
  const [slangWords, setSlangWords] = useState<Array<{
    id: number
    word: string
    x: number
    y: number
    opacity: number
    rotation: number
  }>>([])

  const slangList = [
    'Nah', 'Bruh', 'Yo', 'Fam', 'G', 'Sup', 'Aight', 'Wassup', 
    'Chill', 'Whatever', 'Meh', 'Nope', 'Yikes', 'Oof', 'Lol',
    'Dude', 'Man', 'Hey', 'Bro', 'Yeah right', '2 + 2 = 5', 'pump',
  ]

  useEffect(() => {
    const addRandomSlang = () => {
      const newWord = {
        id: Date.now() + Math.random(),
        word: slangList[Math.floor(Math.random() * slangList.length)],
        x: Math.random() * 100, // 0-100% от ширины экрана
        y: Math.random() * 100, // 0-100% от высоты экрана
        opacity: 0.1 + Math.random() * 0.2, // 0.1-0.3
        rotation: Math.random() * 360 // 0-360 градусов
      }
      
      setSlangWords(prev => [...prev, newWord])
      
      // Удаляем слово через 6 секунд для более плавного эффекта
      setTimeout(() => {
        setSlangWords(prev => prev.filter(word => word.id !== newWord.id))
      }, 6000)
    }

    // Добавляем новое слово каждые 0.8 секунды для большего количества
    const interval = setInterval(addRandomSlang, 800)

    // Добавляем первые 3 слова сразу
    addRandomSlang()
    setTimeout(addRandomSlang, 200)
    setTimeout(addRandomSlang, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {slangWords.map((word) => (
        <div
          key={word.id}
          className="absolute text-purple-400/50 font-bold text-2xl floating-slang"
          style={{
            left: `${word.x}%`,
            top: `${word.y}%`,
            transform: `rotate(${word.rotation}deg)`,
          }}
        >
          {word.word}
        </div>
      ))}

    </div>
  )
}

export default FloatingSlang 