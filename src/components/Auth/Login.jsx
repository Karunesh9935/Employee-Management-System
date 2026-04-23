import React, { useState } from 'react'

const Login = ({handleLogin}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('employee') 
    const submitHandler = (e)=>{
        e.preventDefault()
        handleLogin(email, password)
        setEmail("")
        setPassword("")
    }

    return (
        <div className='flex flex-col h-screen w-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] font-sans relative overflow-hidden'>
            
            {/* Background glowing orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

            <div className='z-10 text-center mb-8'>
                <h1 className='text-5xl md:text-6xl font-extrabold tracking-tight mb-3'>
                    <span className='bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent'>
                        Pro
                    </span>
                    <span className='text-white'>Manage</span>
                </h1>
                <p className='text-gray-400 text-lg font-medium tracking-wide'>Employee Management System</p>
            </div>

            <div className='z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300'>
                <div className='flex gap-2 p-1 bg-black/40 rounded-full mb-8 border border-white/5'>
                    <button 
                        onClick={() => { setRole('employee'); setEmail(''); setPassword(''); }}
                        className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${role === 'employee' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-gray-400 hover:text-white'}`}
                    >
                        Employee Login
                    </button>
                    <button 
                        onClick={() => { setRole('admin'); setEmail('admin@example.com'); setPassword('123'); }}
                        className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${role === 'admin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'text-gray-400 hover:text-white'}`}
                    >
                        Admin Login
                    </button>
                </div>

                <form 
                    onSubmit={submitHandler}
                    className='flex flex-col items-center justify-center space-y-5'
                >
                    <div className='w-full'>
                        <label className='block text-sm font-medium text-gray-300 mb-1.5 ml-1'>Email Address</label>
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className='w-full outline-none bg-black/30 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white font-medium text-base py-3.5 px-6 rounded-2xl placeholder:text-gray-500 transition-all duration-200' 
                            type="email" 
                            placeholder={role === 'admin' ? 'admin@example.com' : 'employee@example.com'} 
                        />
                    </div>

                    <div className='w-full'>
                        <label className='block text-sm font-medium text-gray-300 mb-1.5 ml-1'>Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className='w-full outline-none bg-black/30 border border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 text-white font-medium text-base py-3.5 px-6 rounded-2xl placeholder:text-gray-500 transition-all duration-200' 
                            type="password" 
                            placeholder='Enter your password' 
                        />
                    </div>

                    <button 
                        className={`w-full text-white font-bold text-lg py-3.5 px-8 rounded-2xl mt-4 transition-all duration-300 transform active:scale-95 shadow-xl ${
                            role === 'employee' 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-blue-500/25'
                        }`}
                    >
                        Log in Workspace
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login