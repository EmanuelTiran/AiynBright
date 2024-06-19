import React from 'react'

export default function Page({ params }) {

   return (
     <div>
       <h1>Post {params.recommendationId} { params.recommendationName}</h1>
    </div>
  )
}
