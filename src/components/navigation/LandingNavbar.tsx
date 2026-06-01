import React from 'react'
import { AppProviders } from '../providers/AppProviders'
import { Navbar } from './Navbar'

export const LandingNavbar: React.FC = () => {
  return (
    <AppProviders>
      <Navbar isLanding />
    </AppProviders>
  )
}
