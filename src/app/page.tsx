"use client"
import Image from "next/image";
import { Button, Box } from '@chakra-ui/react'
import axios from "axios";
import React, {useState} from "react"
import {useRouter} from "next/navigation"


interface RecipeCard {
  id: number,
  title: string,
  image: string,
  imageType: string
}

export default function Home() {
  const [recipes, setRecipes] = useState<RecipeCard[]>([])
  const r = useRouter()

  const handleRecipeSearch = async () => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&query=chicken`)
    const result = await response.data
    setRecipes(result.results)
  }

  const handleRecipeInformation = async (recipe:RecipeCard) => {
    r.push(`/recipe?title=${recipe.title}&id=${recipe.id}`)
  }

  return (
    <main>
      <Button colorScheme='blue' onClick={()=>handleRecipeSearch()}>Search Recipes</Button>
      {recipes.map((o,i)=>(
        <div key={i} onClick={()=>handleRecipeInformation(o)}>
          <h3>{o.title}</h3>
          <Image src={o.image} alt={o.title} width={200} height={200}/>
        </div>
      ))}
    </main>
  );
}
