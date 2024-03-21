"use client"
import Image from "next/image";
import { Button, Box, Flex, Checkbox, Heading, Text } from '@chakra-ui/react'
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
  const [equipment, setEquipment] = useState<any>()
  const [diet, setDiet] = useState<any>()

  const handleGrabbingRecipeInformation = async () => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const equipmentResponse = await axios.get(`https://api.spoonacular.com/recipes/${id}/equipmentWidget.json?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const result = await response.data
    const equipmentResult = await equipmentResponse.data
    setChosenRecipe(result)
    setEquipment(equipmentResult.equipment)
    setDiet([{result: result.dairyFree, name: "dairy-free"}, {result: result.glutenFree, name: "gluten-free"}, {result: result.vegan, name: "vegan"}, {result: result.vegetarian, name: "vegetarian"}, {result: result.veryHealthy, name: "very-healthy"}, {result: result.veryPopular, name: "very-popular"}])
  }

  useEffect(()=>{
    handleGrabbingRecipeInformation()
  },[])

  return (
    <main>
      <Button onClick={()=>r.push("/")}>Go Back</Button>
        <Box bg="white" p="40px">
          <Flex>
            <Box width="50%">
              <Heading as='h2' size='xl' paddingBottom="10px">{chosenRecipe.title}</Heading>
              <Heading as='h5' size='sm'>Ratings: <span>{Math.floor(chosenRecipe.spoonacularScore)}/100</span></Heading>
              <Heading as='h5' size='sm'>Total Time: {chosenRecipe.readyInMinutes} minutes</Heading>
              <Heading as='h5' size='sm'>Servings: {chosenRecipe.servings}</Heading>
              <Flex flexWrap="wrap" gap="4" paddingY="20px">
                {diet && diet.map((o:any,i: number) => {
                  if(o.result){
                    return (
                      <Flex flexDir="column" alignItems="center">
                        <Image src={`https://spoonacular.com/application/frontend/images/badges/${o.name}.svg`} alt={o.name} width={200} height={200} style={{width:"40px", height:"auto"}}/>
                        <Text fontSize='xs'>{o.name}</Text>
                      </Flex>
                    )
                  }
                })}
              </Flex>
            </Box>
            <Image src={chosenRecipe.image} alt={chosenRecipe.title} width={200} height={200} style={{width:"50%", height:"auto"}}/>
          </Flex>
          <Box>
            <Text dangerouslySetInnerHTML={{ __html: chosenRecipe.summary }} paddingY="25px"></Text>
            <Heading as='h4' size='md' paddingBottom="5px">Equipment:</Heading>
            <Flex flexDirection="column" paddingBottom="20px">
              {equipment && equipment.map((o:any,i:number)=>(
                <Checkbox key={i} _checked={{ textDecoration: "line-through", color: "gray.400"}} style={{transitionDuration:"0.3s"}}>{o.name}</Checkbox>
              ))}
            </Flex>
            <Heading as='h4' size='md' paddingBottom="5px">Ingredients:</Heading>
            <Flex flexDirection="column" paddingBottom="20px">
              {chosenRecipe.extendedIngredients && chosenRecipe.extendedIngredients.map((o:any,i:number)=>(
                <Checkbox key={i} _checked={{ textDecoration: "line-through", color: "gray.400"}} style={{transitionDuration:"0.3s"}}>{o.measures.metric.amount} {o.measures.metric.unitShort} {o.name}</Checkbox>
              ))}
            </Flex>
            <Heading as='h4' size='md' paddingBottom="5px">Instructions:</Heading>
            <ol style={{padding:"0 0 0 35px"}}>
              {chosenRecipe.analyzedInstructions && chosenRecipe.analyzedInstructions[0].steps.map((o:any,i:number)=>(
                <li key={i} style={{transitionDuration:"0.3s"}}>{o.step}</li>
              ))}
            </ol>
          </Box>
        </Box>
    </main>
  );
}
