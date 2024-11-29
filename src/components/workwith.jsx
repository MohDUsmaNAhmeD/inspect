import React, { useState } from 'react';
import { Car, Flag, Building2 } from 'lucide-react';


const partners = [
  { 
    code: 'IT', 
    image: 'https://i.ibb.co/NLQ26xh/NHTSA-logo2-removebg-preview.png'
  },
  { 
    code: 'DE', 
    image: 'https://i.ibb.co/4sn8PtF/national-insurance-crime-bureau-nicb-vector-logo-removebg-preview.png'
  },
  { 
    code: 'FR', 
    image: 'https://i.ibb.co/TY6Mwwj/NMVTIS-Logo-removebg-preview.png'
  },
  { 
    code: 'US', 
    image: 'https://i.ibb.co/jLWsGGS/4c-removebg-preview.png'
  },
  { 
    code: 'CN', 
    image: 'https://i.ibb.co/swHDY7p/2c-removebg-preview.png'
  },
  { 
    code: 'US', 
    image: 'https://i.ibb.co/qp9fP4n/dvlabg-1-removebg-preview.png'
  }
 
];

const countries = [
  { 
    code: 'IT', 
    name: 'Italy',
    image: 'https://th.bing.com/th/id/R.3d1393d0f0a27b777c6cad21c9ffa97f?rik=6tVjxt8u5P3iDg&pid=ImgRaw&r=0'
  },
  { 
    code: 'DE', 
    name: 'Germany',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEACwsLCwvLDI3NzJFS0JLRWZeVlZeZptvd293b5vrk6yTk6yT69D8zb/N/ND///////////////////////////8BLCwsLC8sMjc3MkVLQktFZl5WVl5mm293b3dvm+uTrJOTrJPr0PzNv8380P/////////////////////////////CABEIAFsAmAMBIgACEQEDEQH/xAAYAAEBAAMAAAAAAAAAAAAAAAAABAECBf/aAAgBAQAAAADkAAAAAAAAAGwAAFQAAAAAAAABSAABcAAAAAAAAAZAAA//xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIEAwX/2gAKAgIQAxAAAAAAAAiwAAHH0gAAK0AABOTIAAAAAAf/xAAbEAACAwEBAQAAAAAAAAAAAAAAAhIUUVJQYP/aAAgBAQABPwD2YPhB8IPhB8IPhB8IPhB8IPhB8IPhB8IPhB8IPhB8IPhB8IPntVX1Sq+qVX6Uqv0pVfVKr9KVX6Uqv0pVfVKr6pVfVKr9KVX6Uqv0pVfVKr9KVX6Uqv0pVfV+N//EABsRAAIDAQEBAAAAAAAAAAAAAABRAQIREjBA/9oACAECAQE/APLYZsM2GbDNhmwzYZsM2GbD8+6M7ozujO6M7ozujO6M7ozujO6P5f/EABsRAAIDAQEBAAAAAAAAAAAAAAISAAFRUjBA/9oACAEDAQE/APJD5uIfNxD5uIfNxD5uIfNxD5uIfNxD5uIfN+bhscNjhscNjhscNjhscNjhscN+X//Z'
  },
  { 
    code: 'FR', 
    name: 'France',
    image: 'https://th.bing.com/th/id/OIP.mO2EfRE-TxiZgZ20kE6aOwHaE7?w=296&h=197&c=7&r=0&o=5&pid=1.7'
  },
  { 
    code: 'US', 
    name: 'United States',
    image: 'https://th.bing.com/th/id/OIP.bNM6BI7X9AotYV74-pufdgHaEZ?w=261&h=180&c=7&r=0&o=5&pid=1.7'
  },
  { 
    code: 'CN', 
    name: 'Canada',
    image: 'data:image/jpeg;base64,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'
  },
  { 
    code: 'UK', 
    name: 'United Kingdom',
    image: 'https://th.bing.com/th/id/OIP.YMOZI-eYNMGLsKvGOfDSLgHaDt?w=333&h=174&c=7&r=0&o=5&pid=1.7'
  },
  { 
    code: 'ES', 
    name: 'Spain',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAMwBMgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAgMEAQUG/9oACAEBAAAAAPKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB64AAAAABvAAAAAAAAIyAAAAAArpaJAAAAAHOYZR7vAAAAAMN+Vsuo5eAAAABZ5Fw1X1gAAAArzU34rLr6dwAAAAI1efbllro9KwAAAAFPa6p5Xp5dgAAAAOIU20tKQAAAAOR7IQTAAAAAAAAAA+eAAAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADvAAAAAAO//xAAZAQEAAwEBAAAAAAAAAAAAAAAAAQIDBAX/2gAKAgIQAxAAAADD2wAAAAAAAAAAAAAAAAAAA8zlAAAAAARlABrTZzzSwAAAhIGlehtXBz3pIAACEgddNJ7K0jzr4WAAAQAd8TpvnnbljmkAABCQOrGmm9MZhhdIAAI69gAAAAAId24AAAAAAAAAAAAAAAAAAAf/xAAyEAACAQIGAQIFAQgDAAAAAAABAgMAEQQTFVJTkRIhMUBBUFFhoQUQFCIyRXBxcrHB/9oACAEBAAE/AP8ANWnxb3rT4t71p8W960+Le9afFvetPi3vWnxb3rT4t71p8W960+Le9afFvetPi3vWnxb3rT4t71p8W960+Le9afFvetPi3vWnxb3rT4t71p8W960+Le9afFvetPi3vWnxb3rT4t71p8W960+Le9afFvetPi3vWnxb3rT4t71p8W960+Le9afFvetPi3vWnxb3rT4t71p8O9/qhNvo2bH4yNcEILkA1DNHivMMhHipqHFrLKsXgReldXNgQT+D9DdS6MnlYN7moECxOpDnyv7L8qgXJ8wI5CTc3qONFmMuXIL+w21FFfEtLcj2YAj6E0EhLH7m9/KpZ44fEOT60cWpVgscrDcPSlxWe6RJCbk76/h8WbHI6kFRwym5sPtbyBqZXYAL+b+tqhR0uG/7v9A8Y1gLu4X3tepZUnxEQj9bA0IX8ZRcL5XsP0qJWXGYO629TWNJwXnEArrNdxf3Wv2azqkR8wIzOfOlmhacoz+NnYetSoEewN/QH4+ZykUjj3C1HhZsQhm/pUrcE+pNSQrFiILXJJJYmi7R+Cf1XVrt/oUsmKvFOq38WsptUC4kSyxIlpSh9VIH6moIcrGxxBlckWmH6k02DzZW8GsWZj6+ooCbD4hImFg3yvcW+PYKVIa3jb1vWoYaHDCFLuQhWlXzwMjv6lWUKTU0ESnHWQDwy/GkIiZ45kNhf0/NYeSbOzAzAsbEilxE/wA5pAxvb+aoMW0OJEsvk48KafDYmVHRrsEsAfj8QpeCRQLkioP2bh8nMe7N41ivTCyD/j+hrE/3H/cVSxh5cd/ICVRDVlVmA8V8zZbe5vXozeQAPoRf539gKjw8UmXHIgYBbVJglgxMOWWI9zf48kAXNDERgeGe1v0o+EistwfvUkMkn8UBa8pj8amJjLuiyK7uoYsLVJh/QSxoxQH7eJU/i/uKgg8bFlt8wP8A00JUVr5viR9vejMjm+aWP5+PIBrLTbQVV9h+65+5om/qf3FEJv414Je9vr2fPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3WfPyv3/kQixP0f/8QAKREAAQMEAQQBAwUAAAAAAAAAAQACUgMRExQSBCExYUAiQVAgMDIzUf/aAAgBAgEBPwD85mqzKzVZlZqsys1WZWarMrNVmVmqzKzVZlZqsys1WZWarMrNVmVmqzKzVZlZqsys1WZWarMrNVmVmqzKzVZn9TKLn29rXu1tj3TmFnwabA+/eyo8y21jb7FcHm/0qq15c1rgWtT28XEXv8DpWX5m1xZDw0M8W+6pgtaLqsG3p3l2XUN41T2tf4HR+HWKY/kLj/UapLf42NgslnsHkkrqv7fPwKD6LAeXO/pZGsf9Fy32j1LONgwplRhfyqF3riq7qTnXZy93/c1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSC1XSH53/8QAKREAAgEFAAECBAcAAAAAAAAAAQIAERITUVIhMUADIFCBIiMwMmFxwf/aAAgBAwEBPwD65e3Rl7dGXt0Ze3Rl7dGXt0Ze3Rl7dGXt0Ze3Rl7dGXt0Ze3Rl7dGXt0Ze3Rl7dGXt0Ze3Rl79H5i38Ez8wF6oaKPMBr7EmkIehtBoY7OpN3qw3LwfNamkBqPYOAQCWoKz4hpZSNQn9wJUeRPwln80BEUUUea+wbGAC9fXwBAST9/9ECoCzeaken9yqKDVfBHmAIFWwkj2Dq7UtpFup5pWKrq1bo9xFFp94gcCjU/UwnYmE7EwnYmE7EwnYmE7EwnYmE7EwnYmE7EwnYmE7EwnYmE7EwnYmE7EwnYmE7EwnYmE7H13//Z'
  }
];

const companies = [
  { 
    name: 'Lamborghini',
    image: 'https://th.bing.com/th/id/R.767f32ceea9866bdda390bc353e2cf5d?rik=uzR%2b7XB3QtZe2A&pid=ImgRaw&r=0',
    dark: true 
  },
  { 
    name: 'Land Rover',
    image: 'https://th.bing.com/th/id/R.de1f5d2a1193edc76eddeb23ef219d90?rik=Msl0M2IgMB1tmQ&pid=ImgRaw&r=0',
    dark: false 
  },
  { 
    name: 'Nissan',
    image: 'https://th.bing.com/th/id/R.54f889943e4302b1221059bf637ce7d5?rik=cExbCODv5kzNTA&riu=http%3a%2f%2fpngimg.com%2fuploads%2fnissan%2fnissan_PNG77.png&ehk=EW9P07O2a1527k1vdQBjboClrsV17JYhRjWzH4m03%2f0%3d&risl=&pid=ImgRaw&r=0',
    dark: true 
  },
  { 
    name: 'Ferrari',
    image: 'https://th.bing.com/th/id/R.fdf73726681950078cf87bef7dacd10d?rik=KzjCSaZPQDPlwg&pid=ImgRaw&r=0',
    dark: true 
  },
  { 
    name: 'BMW',
    image: 'https://pngimg.com/d/bmw_PNG99553.png',
    dark: false 
  },
  { 
    name: 'Bugatti',
    image: 'https://th.bing.com/th/id/R.51fb5696aff2285eb04a9671baa03ca6?rik=BTIJcTZcfHIoMg&pid=ImgRaw&r=0',
    dark: true 
  },
  { 
    name: 'Volkswagen',
    image: 'https://th.bing.com/th/id/R.8412bc5243fb3027aab8ba706d484fab?rik=7cbBat5cF2pKHw&pid=ImgRaw&r=0',
    dark: false 
  }
];

const Cloud = ({ className = '', style = {} }) => (
  <svg 
    viewBox="0 0 100 40" 
    className={className} 
    style={style}
    fill="currentColor"
  >
    <path d="M10 30 C5 30 0 25 0 20 C0 10 10 10 15 15 C15 5 30 5 35 15 C40 5 50 5 55 15 C60 10 70 10 70 20 C70 25 65 30 60 30 Z" />
  </svg>
);

const MarqueeGroup = ({ items, type, direction = 'left', speed = 20 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const duplicatedItems = [...items.map((item, i) => ({...item, key: `first-${i}`})), 
                          ...items.map((item, i) => ({...item, key: `second-${i}`}))];

  return (
    <div className="relative flex overflow-hidden py-6">
      <div 
        className={`
          flex items-center
          ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}
          ${isHovered ? 'animate-paused' : ''}
        `}
        style={{ animationDuration: `${speed}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-16 px-8">
          {duplicatedItems.map((item) => (
            <div 
              key={item.key}
              className={`
                flex-shrink-0 flex-grow-0 basis-auto
                ${type === 'flag' ? 'w-40' : 'w-56'}
              `}
            >
              <div className="p-4 rounded-xl">
                <div className={`
                  relative rounded-lg overflow-hidden
                  ${type === 'flag' ? 'h-24' : 'h-32'}
                `}>
                  <img
                    src={item.image}
                    alt={`${item.name}  ${type === 'partners' ? 'h-34' : 'w-34'}`}
                    className="w-full h-[10vh] object-contain p-2"
                  />
                </div>
                <p className=" text-center text-sm font-medium text-white">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnimatedShowcase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#191919] text-white">
      <div className="relative w-full pt-16 pb-10 overflow-hidden">
        <div className="bg-red-500 absolute"></div>

        <main>
          <section className="mb-24">
            <header className="flex items-center justify-center gap-4 mb-12">
              <Building2 className="w-14 h-14 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-semibold text-center sm:text-5xl lg:text-7xl font-serif tracking-tight text-white">
                Partner Companies
              </h2>
            </header>
            <div className="w-full overflow-hidden">
              <MarqueeGroup items={partners} type="company" direction="right" speed={40} />
            </div>
          </section>

          <section className="mb-24">
            <header className="flex items-center justify-center gap-4 mb-12">
              <Flag className="w-14 h-14 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-semibold text-center sm:text-5xl lg:text-7xl font-serif tracking-tight text-white">
                Countries we serve's
              </h2>
            </header>
            <div className="w-full overflow-hidden">
              <MarqueeGroup items={countries} type="flag" direction="left" speed={30} />
            </div>
          </section>

          <section className="mb-10">
            <header className="flex items-center justify-center gap-4 mb-12">
              <Car className="w-14 h-14 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-semibold text-center sm:text-5xl lg:text-7xl font-serif tracking-tight text-white">
               Already Worked With
              </h2>
            </header>
            <div className="w-full overflow-hidden">
              <MarqueeGroup items={companies} type="company" direction="right" speed={40} />
            </div>
          </section>
        </main>
      </div>
      <style jsx="true" global="true">{`
        // global styles
      `}</style>
    </div>
  );
};

export default AnimatedShowcase;