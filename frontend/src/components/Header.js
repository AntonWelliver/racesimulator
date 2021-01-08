import React from 'react'
import { Navbar } from 'react-bootstrap'

const Header = () => {
    return (
        <header>
            <Navbar expand="lg" style={{ paddingTop: '2rem', paddingBottom: '2rem', background: '#1E1E1E' }} >
                <h1 className='mx-auto' style={{ color: 'white' }}>Race Simulator</h1>
            </Navbar>
        </header>
    )
}

export default Header
