"use client"
import Image from "next/image";
import styles from "../page.module.css";
import { Button, Box, Flex } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'


interface RecipeCard {
  id: number,
  title: string,
  image: string,
  imageType: string
}

export default function Home() {
  const r = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [chosenRecipe, setChosenRecipe] = useState<any>({})
  const [diet, setDiet] = useState<any>()

  const handleGrabbingRecipeInformation = async () => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const result = await response.data
    setChosenRecipe(result)
    console.log(result)
    setDiet({dairyFree: result.dairyFree, glutenFree: result.glutenFree, vegan: result.vegan, vegetarian: result.vegetarian, veryHealthy: result.veryHealthy, veryPopular: result.veryPopular})
  }

  useEffect(()=>{
    handleGrabbingRecipeInformation()
  },[])


  return (
    <main className={styles.main}>
      <Button onClick={()=>r.push("/")}>Go Back</Button>
        <Box>
          <Flex>
            <Box>
              <h1>{chosenRecipe.title}</h1>
              <h4>Ratings: {Math.floor(chosenRecipe.spoonacularScore)}/100</h4>
              <h4>Total Time: {chosenRecipe.readyInMinutes} minutes</h4>
            </Box>
            <Image src={chosenRecipe.image} alt={chosenRecipe.title} width={200} height={200}/>
          </Flex>
          <Box>
          <h4>{chosenRecipe.spoonacularSourceUrl}</h4>
          <h3>Ingredients:</h3>
          <Flex flexWrap={"wrap"} gap="8">
          {chosenRecipe.extendedIngredients && chosenRecipe.extendedIngredients.map((o:any,i:number)=>{
            console.log(o)
            return(
              <Box>
                <Image src={`https://spoonacular.com/cdn/ingredients_100x100/${o.image}`} alt={o.name} width="100" height="100" style={{width:"auto", height:"60px"}}/>
                <h2>{o.measures.metric.amount} {o.measures.metric.unitShort} {o.name} </h2>
              </Box>
            )
          })}
          </Flex>
          <div dangerouslySetInnerHTML={{ __html: chosenRecipe.summary }}></div>
          </Box>
         
         
         

         
          <div dangerouslySetInnerHTML={{ __html: chosenRecipe.instructions }}></div>
        </Box>

    </main>
  );
}
