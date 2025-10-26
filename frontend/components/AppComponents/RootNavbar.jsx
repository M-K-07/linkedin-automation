import React from 'react'
import { TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
const RootNavbar = () => {
  return (
    <div>
      <div className='flex p-6 text-2xl justify-between shadow-2xl'>
        <h1 className='flex text-white items-center gap-2'>AutoGrow <TrendingUp/></h1>
        <Button variant='outline'>Get Started</Button>
      </div>
    </div>
  )
}

export default RootNavbar
