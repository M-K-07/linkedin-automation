import React from 'react'
import Navbar from './AppComponents/Navbar'

const layout = ({children}) => {
  return (
    <div>
      <Navbar/>
        <main>{children}</main>
    </div>
  )
}

export default layout
