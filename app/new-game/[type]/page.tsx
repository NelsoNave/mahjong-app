import Navigation from '@/components/Navigation'
import RecordForm from '@/components/RecordForm'
import React from 'react'

// type Props = {

// }

const page = () => {
  return (
    <>
      <section className="flex flex-1 flex-col overflow-auto min-h-0">
        <div className="flex flex-col justify-center gap-8 p-6">
          <RecordForm />
        </div>
      </section>
      <Navigation />
    </>
  )
}

export default page