import React from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import CreateEmployee from '../other/CreateEmployee'
import AllTask from '../other/AllTask'

const AdminDashboard = (props) => {
    return (
        <div className='min-h-screen w-full p-7'>
            <Header changeUser={props.changeUser} />
            <CreateEmployee />
            <CreateTask />
            <AllTask />
        </div>
    )
}
export default AdminDashboard