import React from 'react'

export const generateStaticParams = async () => {
   const res = await fetch(`https://jsonplaceholder.typicode.com/posts`)
   const recommendations = await res.json()
   return recommendations.filter((recommendation, i) => i <= 10).map((recommendation) => ({ recommendationId: String(recommendation.id) }))
}


export default async function Page({ params }) {
   const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.recommendationId}`)
   const recommendation = await res.json()

   return (
      <div>
         <h1>{recommendation.title}</h1>
         <p>
            {recommendation.body}
         </p>
      </div>
   )
}
