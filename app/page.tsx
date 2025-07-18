"use client"

import { useState, useEffect } from "react"
import { Gamepad2, Zap, Star, Trophy, Cpu, Headphones, Palette, Building, Clock } from "lucide-react"
import { Card } from "./components/ui/card"
import { Button } from "./components/ui/button"

interface Curiosity {
  title: string
  content: string
  category: string
}

interface TimeRemaining {
  hours: number
  minutes: number
  seconds: number
}

const fallbackCuriosities: Curiosity[] = [
  {
    title: "El primer Easter Egg de la historia",
    content:
      "El primer Easter Egg en un videojuego fue creado por Warren Robinett en 'Adventure' (1979) para Atari 2600. Lo hizo porque Atari no acreditaba a sus programadores, así que escondió su nombre en una habitación secreta del juego.",
    category: "Historia",
  },
  {
    title: "Mario tenía otro nombre",
    content:
      "Mario originalmente se llamaba 'Jumpman' en el juego Donkey Kong (1981). Su nombre cambió a Mario en honor a Mario Segale, el propietario del almacén que Nintendo rentaba en Estados Unidos.",
    category: "Personajes",
  },
  {
    title: "El sonido más caro de la historia",
    content:
      "El sonido de 'SEGA' al inicio de los juegos de Sonic costó $500,000 dólares de producción. Fue grabado por un coro completo y procesado digitalmente para que cupiera en la memoria limitada de la consola.",
    category: "Audio",
  },
]

export default function CuriosityPage() {
  const [currentCuriosity, setCurrentCuriosity] = useState<Curiosity>()
  const [isIA ,setIsIA] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastGeneratedDay, setLastGeneratedDay] = useState<string | null>(null)
  const [timeUntilNext, setTimeUntilNext] = useState<TimeRemaining>({ hours: 0, minutes: 0, seconds: 0 })

  const calculateTimeUntilMidnight = (): TimeRemaining => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const diff = tomorrow.getTime() - now.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { hours, minutes, seconds }
  }

  const generateNewCuriosity = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-curiosity", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate curiosity")
      }

      const newCuriosity: Curiosity = await response.json()
      setCurrentCuriosity(newCuriosity)
      setIsIA(true)

      // Guardar en localStorage
      localStorage.setItem("lastCuriosity", JSON.stringify(newCuriosity))
      localStorage.setItem("lastGenerated", new Date().toISOString())
      setLastGeneratedDay(new Date().toISOString())
    } catch (error) {
      // Si falla la ia la curiosidad sera una hardcodeada aleatoria
      const randomIndex = Math.floor(Math.random() * fallbackCuriosities.length)
      const newCuriosity = fallbackCuriosities[randomIndex]
      localStorage.setItem("lastCuriosity", JSON.stringify(newCuriosity))
      localStorage.setItem("lastGenerated", new Date().toISOString())
      setCurrentCuriosity(newCuriosity)
      setIsIA(false)
      
    } finally {
      setIsLoading(false)
    }
  }

  const checkDailyCuriosity = async () => {
    const lastGenerated = localStorage.getItem("lastGenerated")
    const today = new Date().toDateString()

    if (!lastGenerated || new Date(lastGenerated).toDateString() !== today) {
      // Generar nueva curiosidad para hoy
      await generateNewCuriosity()
    } else {
      // Cargar curiosidad guardada del día
      const savedCuriosity = localStorage.getItem("lastCuriosity")
      if (savedCuriosity) {
        setCurrentCuriosity(JSON.parse(savedCuriosity))
        setLastGeneratedDay(lastGenerated)
      }
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Historia":
        return <Trophy className="w-5 h-5" />
      case "Personajes":
        return <Star className="w-5 h-5" />
      case "Audio":
        return <Headphones className="w-5 h-5" />
      case "Tecnología":
        return <Cpu className="w-5 h-5" />
      case "Diseño":
        return <Palette className="w-5 h-5" />
      case "Industria":
        return <Building className="w-5 h-5" />
      case "Desarrollo":
        return <Zap className="w-5 h-5" />
      default:
        return <Gamepad2 className="w-5 h-5" />
    }
  }

   useEffect(() => {
    checkDailyCuriosity()

    const countdownInterval = setInterval(() => {
      const timeRemaining = calculateTimeUntilMidnight()
      setTimeUntilNext(timeRemaining)
      if (timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
        generateNewCuriosity()
      }
    }, 1000)

    setTimeUntilNext(calculateTimeUntilMidnight())

    return () => {
      clearInterval(countdownInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-pink-500 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-green-500 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-gaming-title bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              GameCurious
            </h1>
          </div>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-gaming-subtitle">
            Descubre datos fascinantes del mundo de los videojuegos generados por IA cada día
          </p>
          {lastGeneratedDay && (
            <p className="text-slate-400 text-sm mt-2">
              Última actualización: {new Date(lastGeneratedDay).toLocaleDateString("es-ES")}
            </p>
          )}
        </header>

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-3 bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 rounded-xl px-4 py-2">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span className="text-xs font-gaming-subtitle text-cyan-300">Próxima en:</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center justify-center gap-x-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded px-2 py-1 border border-cyan-500/30">
                <div className="text-sm font-gaming-title text-white font-bold">
                  {timeUntilNext.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-slate-400 font-gaming-content mt-1">H</div>
              </div>
              <div className="flex items-center justify-center gap-x-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded px-2 py-1 border border-cyan-500/30">
                <div className="text-sm font-gaming-title text-white font-bold">
                  {timeUntilNext.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-slate-400 font-gaming-content mt-1">M</div>
              </div>
              <div className="flex items-center justify-center gap-x-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded px-2 py-1 border border-cyan-500/30">
                <div className="text-sm font-gaming-title text-white font-bold animate-pulse">
                  {timeUntilNext.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-xs text-slate-400 font-gaming-content mt-1">S</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          <Card
            className={`max-w-4xl w-full bg-slate-800/50 backdrop-blur-lg border-slate-700 shadow-2xl transition-all duration-300 ${
              isLoading || !currentCuriosity ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            {
              !currentCuriosity || isLoading ? (
                <div className="p-8 md:p-12 flex flex-col items-center justify-center h-96">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-t-4 border-t-cyan-400 border-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-2 border-t-2 border-t-pink-400 border-yellow-500 rounded-full animate-spin-slow"></div>
                    <Gamepad2 className="absolute inset-0 m-auto w-12 h-12 text-white animate-pulse-fast" />
                  </div>
                  <p className="text-white text-xl md:text-2xl font-gaming-title animate-pulse">
                    Generando curiosidad...
                  </p>
                  <p className="text-slate-400 text-sm mt-2 font-gaming-content">
                    Esto puede tardar unos segundos.
                  </p>
                </div>
              ) : (
                <div className="p-8 md:p-12">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30">
                      {currentCuriosity && getCategoryIcon(currentCuriosity.category)}
                      <span className="text-cyan-300 font-gaming-subtitle font-medium">{currentCuriosity && currentCuriosity.category}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-500/30">
                      <div className={`size-2 rounded-full animate-pulse${lastGeneratedDay ? " bg-green-500" : " bg-red-500"}`}></div>
                      <span className="text-green-300 text-xs font-medium">{isIA ? "IA Generated" : "No IA Generated"}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-4xl font-gaming-title text-white mb-6 leading-tight text-glow">
                    {currentCuriosity && currentCuriosity.title}
                  </h2>

                  {/* Content */}
                  <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 font-gaming-content">
                    {currentCuriosity && currentCuriosity.content}
                  </p>

                  {/* Generar nueva curiosidad */}
                  <div className="flex justify-center">
                    <Button
                      onClick={generateNewCuriosity}
                      disabled={true}
                      // disabled={isLoading}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white xs:px-6 xs:text-xs font-gaming-subtitle md:px-8 py-3 rounded-xl md:text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      {true ? "Deshabilitado por el bien de mi cartera" : "Nueva Curiosidad IA"}
                    </Button>
                  </div>
                </div>
              )
            }
          </Card>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <p>Curiosidades generadas por IA • Actualizadas diariamente</p>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
        </footer>
      </div>
    </div>
  )
}
