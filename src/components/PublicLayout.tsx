import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { FloatingButtons } from './FloatingButtons'

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="grow pt-14 sm:pt-16">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
