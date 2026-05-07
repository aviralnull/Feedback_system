'use client'
import React, { useState } from 'react'
import { Card , CardContent, CardHeader } from '@/components/ui/card'
import { Carousel , CarouselContent , CarouselItem , CarouselNext , CarouselPrevious } from '@/components/ui/carousel'
import messages from "@/messages.json"
import  Autoplay from "embla-carousel-autoplay"
import { Copyright } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
function Home() {
  const [username ,setUsername] = useState('')

  

  return (
    <>
   <main className='grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
    <section className='text-center mb-8 md:mb-12'>
      <h1 className='text-3xl md:text-5xl font-bold'>Dive into the World of Anonymous Conversations</h1>
      <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message - Where your identity remains a secret.</p>
      </section> 

      <section className='text-center mb-8 md:mb-12'>
        <input type="text" 
        onChange={(e)=>setUsername(e.target.value)}
        className='w-full'

        placeholder='Enter username to start sending anonymous messages'
        />
      <Link href={`/u/${username}`}> <Button>Start Sending</Button></Link> 
      </section>
     <Carousel 
     plugins={[Autoplay({delay:2000})]}
     className='w-full max-w-xs' >
      <CarouselContent>
      {
        messages.map((message ,index)=>(
          <CarouselItem key={index}>
            <div className='p-1'>
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                <span className='text-lg font-semibold'> {message.content} </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))
      }
      </CarouselContent>
     </Carousel>


   </main>
   <footer className='text-center p-4 md:p-6'>
<p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-6">
  <Copyright className="w-4 h-4" />
  {new Date().getFullYear()} Mystery Message. All rights reserved.
</p>
   </footer> 
   </>
  )
}

export default Home