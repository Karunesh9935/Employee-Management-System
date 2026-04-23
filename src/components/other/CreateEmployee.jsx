import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import axios from 'axios'

const CreateEmployee = () => {

    const [userData, setUserData] = useContext(AuthContext)

    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/api/employees', {
                firstName,
                email,
                password
            })
            
            // Add backend response object locally to avoid refetching everything
            const data = [...(userData || []), response.data]
            setUserData(data)

            setFirstName('')
            setEmail('')
            setPassword('')
        } catch (error) {
            console.error("Failed to create new employee", error)
            alert("Error creating employee. Is the backend running?")
        }
    }

    return (
        <div className='p-5 bg-[#1c1c1c] mt-5 rounded mb-5'>
            <h2 className='text-xl mb-4 font-semibold text-white'>Create New Employee</h2>
            <form onSubmit={(e) => {
                submitHandler(e)
            }}
                className='flex flex-wrap w-full items-start justify-between'
            >
                <div className='w-full flex gap-5'>
                    <div className='w-1/3'>
                        <h3 className='text-sm text-gray-300 mb-0.5'>First Name</h3>
                        <input
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value)
                            }}
                            required
                            className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="text" placeholder='Employee Name'
                        />
                    </div>
                    <div className='w-1/3'>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Email</h3>
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            required
                            className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="email" placeholder='employee@example.com' />
                    </div>
                    <div className='w-1/3'>
                        <h3 className='text-sm text-gray-300 mb-0.5'>Password</h3>
                        <input
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            required
                            className='text-sm py-1 px-2 w-full rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="password" placeholder='Password' />
                    </div>
                </div>

                <button className='bg-blue-500 py-3 hover:bg-blue-600 px-5 rounded text-sm mt-4 w-full font-medium'>Create Employee</button>

            </form>
        </div>
    )
}

export default CreateEmployee
