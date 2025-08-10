import React, { useState,useEffect, useRef } from 'react'
import { FaPencilAlt } from 'react-icons/fa';
import axios from 'axios'
import party from 'party-js'
import { FaTrash } from 'react-icons/fa';
function App() {
  const [todos,setTodos]=useState([])
  const [input,setInput]=useState('')
  const [desc,setDesc]=useState('')
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [comp,setComp]=useState(false);
  const congratsRef = useRef(null);
  const API_KEY_URL = import.meta.env.VITE_API_URL;
  const fetchdata = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.get(API_KEY_URL);
    setTodos(res.data);
  } catch (e) {
    setError(`Failed to fetch todos: ${e.message}`);
    console.error("Error fetching todos:", e);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchdata()
  }, [])
  const addtodo=async (e)=>{
    e.preventDefault()
    if(!input.trim()){
      alert("Empty Todo")
      return;
    }
    try{
      const res= await axios.post(API_KEY_URL,{
        title:input,
        description:desc.trim() || null
      })
      setTodos([...todos,res.data])
      setInput('')
      setDesc('')
    }
    catch(e){
      setError("Error")
    }

  }
    const toggleval= async (id,val) =>{
    try{
      const res= await axios.put(`${API_KEY_URL}/${id}`,{
        title:val
      })
      setTodos((prev)=>prev.map((todos)=>todos.id===id?res.data:todos))
      if (val){
        setInput('')
      }
    }
    catch(e){
      setError("Error Occured:",e)
    }
  }
  const togglecomplete= async (id,curr,val) =>{
    try{
      const res= await axios.put(`${API_KEY_URL}/${id}`,{
        completed:!curr
      })
      setTodos((prev)=>prev.map((todo)=> todo.id===id?res.data:todo))
      if (res.data.completed && congratsRef.current) {
        party.confetti(congratsRef.current, {
          count: party.variation.range(40, 60), 
          size: party.variation.range(0.8, 1.2),
          spread: 90,
          duration:3000
        });
      }
    }
    catch(e){
      setError("Error Has Occured:",e)
    }
  }
  const delete1= async (id) =>{
    try{
      const res= await axios.delete(`${API_KEY_URL}/delete/${id}`)
      setTodos((prev)=>prev.filter((todo)=>todo.id!==id))
    }
    catch(e){
      setError("Error has Occured:",e)
    }
  }
  // ... (Your existing code) ...

return (
  <div className='bg-gray-200 min-h-screen flex flex-col justify-center items-center'>
    <div className='max-w-3xl bg-white p-6 rounded-xl w-full min-h-[500px] shadow-lg sm:p-8 text-center'>
      <h1 className='text-2xl font-[600]'>TodoList</h1>
      <h2 className='text-2xl font-[600] mt-2 text-blue-400'>Weekly Todo List</h2>
      {/* THIS IS THE UPDATED LINE FOR RESPONSIVENESS */}
      <div className='mt-5 flex flex-col sm:flex-row items-center sm:items-start justify-around gap-8 sm:gap-4'> {/* <--- UPDATED HERE */}
        <form onSubmit={addtodo} className='flex flex-col items-center justify-center gap-3 w-full sm:w-auto'> {/* <--- ADDED w-full sm:w-auto */}
          <label className='text-xl text-blue-400 font-[400]'>Add New Todo</label>
          <input type='text' value={input} placeholder='Enter Ur Todo' onChange={(e)=>setInput(e.target.value)} className='p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full'></input> {/* <--- ADDED w-full */}
          <label className='text-xl text-blue-400 font-[400]'>Description</label>
          <textarea placeholder='Enter The Description' value={desc} onChange={(e)=>setDesc(e.target.value)} className='max-w-[200px] p-6 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400' rows="3"></textarea> {/* <--- ADDED w-full */}
          <button type="submit" className='mt-3 bg-blue-400 px-6 py-2 rounded-lg text-white'>Add</button>
        </form>
        <div className='bg-blue-400 max-w-[300px] w-full min-h-[300px] p-6 rounded-lg'>
          <h1 className='text-2xl font-[400] text-white'>Todo Lists</h1>
          <ul className='flex flex-col gap-1'>{
            todos.map((todo,index)=>{
              return <div key={index} className='flex flex-col gap-1 justify-center items-center text-center'>
                <li className={`${todo.completed?'line-through':''} text-black`}>Title:{todo.title}</li>
                <li className={`${todo.completed?'line-through':''} text-black`}>Desc:{todo.description}</li>
                <div className='flex flex-row gap-3 items-center justify-center mb-1 mt-1'>
                  {!todo.completed?<button onClick={()=>togglecomplete(todo.id,todo.completed)} className={`px-2 py-1 bg-black rounded-lg text-white`}>{!todo.completed?"Completed":"Congrats!"}</button>:<p ref={congratsRef} className='text-green-400 font-[600] text-[20px]'>Congrats!</p>}
                  <button className="bg-white px-2 py-1 rounded-lg" onClick={()=>delete1(todo.id)}><FaTrash></FaTrash></button>
                  <button onClick={()=>toggleval(todo.id,input,desc)} className="px-3 py-1 bg-white rounded-lg text-black text-sm flex items-center gap-1"><FaPencilAlt /></button>
                </div>
                <hr></hr>
              </div>
            })
          }</ul>
        </div>
      </div>
    </div>
  </div>
  )
}

export default App