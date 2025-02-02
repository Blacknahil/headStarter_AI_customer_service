'use client'
import { Box,Button,Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {

  const [messages,setMessages]= useState([{
    role:'assistant',
    content:`Hi there! I'm here to assist you with anything you need regarding the Headstarter AI Fellowship. Whether you're looking for information about our program, need help with your application, or have technical questions, I'm here to help. 
    How can I assist you today?`
  }])

  const [message,setMessage]= useState('')

  const sendMessage= async() =>{
    setMessage('')
    setMessages((messages)=>[
      ...messages,
      {role:'user',content:message},
      {role:"assistant", content:''}
    ])

    const reponse=fetch('/api/chat',{
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify([...messages,{role:'user',content:message}])
    }).then(async (res)=>{
      const reader =res.body.getReader()
      const decoder= new TextDecoder()
      
      let result= ''
      return reader.read().then(function processText({done,value}){
        if (done){
          return result
        }

        const text= decoder.decode(value || new Int8Array(), {stream:true})

        setMessages((messages)=>{
          let lastMessage= messages[messages.length-1]
          let otherMessages = messages.slice(0,messages.length-1)

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content:lastMessage.content + text
            },
          ]
        })

        return reader.read().then(processText)
      })
    })

  }

  return <Box 
  width="100vw" height="100vh" display='flex'
  flexDirection="column" justifyContent="center"
  alignItems="center"
  >
      <Stack directions="column" width="90vw" 
        height="90vh"
        border="1px solid black"
        p={2}
        spacing={3} >

            <Stack directions="column"
            spacing ={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            >
             { messages.map((message,index)=>(
                <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role ==='assistant'? "flex-start":"flex-end"

                }>
                    <Box
                    bgcolor={message.role==='assistant'? 'primary.main': 'secondary.main'}
                    color="white"
                    borderRadius={16}
                    maxWidth='60%'
                    py={3}
                    px={10}
                    
                    >
                      {message.content}
                    </Box>
                </Box>
             ))
            }
            </Stack>

      
      <Stack
      direction="row"
      spacing={3}

      >
              <TextField
                    fullWidth
                    value={message}
                    onChange={(e)=> setMessage(e.target.value)}
              ></TextField>

              <Button
               variant="contained"
               onClick={sendMessage}
              > Send</Button>

      </Stack>

      </Stack>
  </Box>
}
