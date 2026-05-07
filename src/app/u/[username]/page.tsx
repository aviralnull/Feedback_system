'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function page() {
  const params = useParams<{username: string}>()
  if (!params?.username) return null
 const username = params?.username || ""
  const [message , setMessage] = useState('') 
const [isAccepting, setIsAccepting] = useState(false)
  const [suggestion ,setSuggestion] = useState<string[]>([])
  const [loadingSUggestion , setLoadingSuggestion] = useState(false) 
   const checkingAccepting = async()=>{
    try{
      const response = await axios.get<ApiResponse>(`/api/accepting-message/${username}`)
      setIsAccepting(response.data.isAcceptingMessage??false)

    }catch(error){
      setIsAccepting(false)
    }
   }  
     useEffect(()=>{
      if(username) checkingAccepting()
     }, [username])
  const handleSend = async()=>{
    try{
   const response = await axios.post(`/api/send-message` , {
      username,
      content : message
    })

    toast.success(response.data.message) ;
    setMessage('')


  }catch(error){
    const axiosError = error as AxiosError<ApiResponse>
    toast.error(axiosError.response?.data.message  || "failed to send message")
  }

  
  }

  const handleSuggestion = async()=>{
    setLoadingSuggestion(true)
    try {
      const res = await fetch('/api/suggest-messages', {
        method: 'POST'
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let text = ''
      if(reader){
        while(true){
          const {done , value} = await reader.read()
          if(done)break ;
          text +=decoder.decode(value)
        }

      }
      const splitMessages = text.split('||').map((m)=>m.trim())
      setSuggestion(splitMessages)
    } catch(error){
      toast.error("Failed to generate suggestions")
    } finally{
      setLoadingSuggestion(false)
    }
  }

  
  return (
   <>
   <div className='max-w-xl mx-auto p-4 space-y-6'>
    <h1 className='text-2xl font-bold text-center'>Send Anonymous Message to @{username}</h1>
    
     {isAccepting === false && (<p className='text-red-500 text-center font-medium'> This user is currently not accepting message</p>)}
    <Card>
      <CardHeader>Write your message</CardHeader>
      <CardContent>
        <input type="text"
        value={message}
        placeholder='Write you anonymous message...'
        onChange={(e)=>setMessage(e.target.value)}
        disabled={!isAccepting}
        className='w-full boarder p-2 rounded-md'
        />
        <Button onClick={handleSend}
        disabled= {!isAccepting || !message}
        className='w-full'
        >Send</Button>
      </CardContent>
    </Card>
     <div>
      <Button onClick={handleSuggestion} className='w-full'>{loadingSUggestion? "Generating...." : "Suggest Message"}</Button>
      <p className='text-sm text-gray-500 text-center'>Click any message to use it</p>
     
    <div className='space-y-2' >
      {suggestion.map((msg ,index)=>(
        <Card
        key={index}
        className='cursor-pointer hover:bg-gray-100 transition'
        onClick={()=>setMessage(msg)}
        >
          <CardContent className='p-3 text-sm'>{msg}</CardContent>

        </Card>
      ))}
    </div></div>
   </div>
   </>
  )
}

export default page