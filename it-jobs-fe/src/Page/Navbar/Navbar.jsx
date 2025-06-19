import { Avatar } from '@mui/material'
import "./Navbar.css";
import { useSelector } from 'react-redux';

const Navbar = () => {

  const auth = useSelector((state) => state.auth);

  return (
    <div className='container z-10 sticky left-0 right-0 top-0 py-3 px-5 lg:px-10 flex justify-between items-center max-w-full'>
        <h1 className="text-xl font-bold">It Jobs Manager</h1>
        <div className='flex items-center gap-5'>
            <span className='text-sm'>{auth.user?.fullName}</span>
            <Avatar src='https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/40377/square_thumb%402x.jpg'
            className='bg-#4d7fd0'>C</Avatar>
        </div>
    </div>
  )
}

export default Navbar;