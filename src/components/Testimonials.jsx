import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'

export default function TestimonialSection() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const scrollContainer = containerRef.current
    if (!scrollContainer) return

    const scroll = () => {
      setScrollPosition(prev => {
        const newPosition = prev + 1
        if (newPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          return 0
        }
        return newPosition
      })
    }

    const timer = setInterval(scroll, 30)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollPosition
    }
  }, [scrollPosition])

  const testimonials = [
    {
      content: "How do I find special meaning when celebrating birthdays? I'm looking for ways to make it meaningful.",
      author: "Seo Joo-young",
      role: "University Student",
      age: "24",
      avatar: "/placeholder.svg?height=96&width=96",
      tilt: "-3deg"
    },
    {
      content: "In this remote environment, I'm finding it challenging to express my heart properly.",
      author: "Lee Joo-won",
      role: "Housewife",
      age: "33",
      avatar: "/placeholder.svg?height=96&width=96",
      tilt: "2deg"
    },
    {
      content: "Are there any good gift recommendations for someone who has everything?",
      author: "Lee Jin-young",
      role: "High School Student",
      age: "17",
      avatar: "/placeholder.svg?height=96&width=96",
      tilt: "-2deg"
    },
    {
      content: "When celebrating an anniversary, I'm having trouble gathering in one place.",
      author: "Kim Dae-hyun",
      role: "Office Worker",
      age: "28",
      avatar: "/placeholder.svg?height=96&width=96",
      tilt: "3deg"
    },
    {
      content: "When SNS messages pile up, it's hard to keep track of who to respond to.",
      author: "Han Na-rae",
      role: "Office Worker",
      age: "40",
      avatar: "/placeholder.svg?height=96&width=96",
      tilt: "-2deg"
    }
  ]

  return (
    <div className="min-h-screen bg-black px-4 md:px-0">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="py-12">
          <h2 className="text-3xl font-bold text-white mb-8">User Stories</h2>
          <div ref={containerRef} className="overflow-x-hidden">
            <div className="inline-flex gap-4 pb-4">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-72 inline-block"
                  style={{ transform: `rotate(${testimonial.tilt})` }}
                >
                  <Card className="bg-zinc-900 border-zinc-800 shadow-lg rounded-xl p-6 transform transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800">
                    <CardContent className="p-0">
                      <div className="flex flex-col items-start space-y-4">
                        <Avatar className="w-16 h-16 border-2 border-red-600">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                          <AvatarFallback className="bg-red-900 text-red-100">{testimonial.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <p className="font-medium text-base text-zinc-300">
                            {testimonial.content}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {testimonial.author} {testimonial.age} | {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Bottom Section */}
          <div className="mt-16 space-y-8">
            <div className="bg-red-950 rounded-xl p-6 border border-red-800">
              <h3 className="text-xl font-bold text-white mb-3">Share Your Story</h3>
              <p className="text-red-200">Have a unique celebration story or challenge? Join our community and share your experience.</p>
              <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Share Now
              </button>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-xl font-bold text-white mb-3">Weekly Highlights</h3>
              <div className="space-y-3">
                <p className="text-zinc-400 text-sm">• Most discussed topic: Birthday Celebrations</p>
                <p className="text-zinc-400 text-sm">• Active community members: 2,340</p>
                <p className="text-zinc-400 text-sm">• Stories shared this week: 156</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Desktop Layout */}
      <div className="hidden md:block ">
        <div className="max-w-7xl mx-auto px-8 ">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl  mb-4  sm:text-5xl lg:text-7xl font-serif font-black tracking-tight text-white">
                User Stories
              </h2>
              <p className="text-zinc-400">
                We listen to our users' experiences and constantly improve our service based on their feedback.
              </p>
            </div>
            <div className="text-right">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors">
                Share Your Story
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`bg-zinc-900 border-zinc-800 transform transition-all duration-300 hover:-translate-y-2 hover:bg-zinc-800 ${
                  index % 3 === 1 ? 'lg:mt-12' : index % 3 === 2 ? 'lg:mt-24' : ''
                }`}
              >
                <CardContent className="p-6">
                  <p className="text-zinc-300 mb-6">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-red-600">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback className="bg-red-900 text-red-100">{testimonial.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-zinc-400">{testimonial.age} | {testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-red-950 rounded-xl p-8 border border-red-800">
              <h3 className="text-2xl font-bold text-white mb-2">2,340+</h3>
              <p className="text-red-200">Active Community Members</p>
            </div>
            <div className="bg-red-950 rounded-xl p-8 border border-red-800">
              <h3 className="text-2xl font-bold text-white mb-2">156</h3>
              <p className="text-red-200">Stories Shared This Week</p>
            </div>
            <div className="bg-red-950 rounded-xl p-8 border border-red-800">
              <h3 className="text-2xl font-bold text-white mb-2">94%</h3>
              <p className="text-red-200">Positive Feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
