"use client"
import Image from "next/image";
import { Button, Box, Flex, Checkbox, Heading, Text } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState, Suspense} from "react"
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'


interface RecipeCard {
  id: number,
  title: string,
  image: string,
  imageType: string
}

export default function Recipe() {
  const r = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('id')
  const [chosenRecipe, setChosenRecipe] = useState<any>({})
  const [relatedRecipes, setRelatedRecipes] = useState<object[]>([])
  const [equipment, setEquipment] = useState<any>()
  const [diet, setDiet] = useState<any>()
  const [missingHover, setMissingHover] = useState<string>("")

  const handleGrabbingRecipeInformation = async () => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${search}/information?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const equipmentResponse = await axios.get(`https://api.spoonacular.com/recipes/${search}/equipmentWidget.json?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const result = await response.data
    const equipmentResult = await equipmentResponse.data
    setChosenRecipe(result)
    setEquipment(equipmentResult.equipment)
    setDiet([{result: result.dairyFree, name: "dairy-free"}, {result: result.glutenFree, name: "gluten-free"}, {result: result.vegan, name: "vegan"}, {result: result.vegetarian, name: "vegetarian"}, {result: result.veryHealthy, name: "very-healthy"}, {result: result.veryPopular, name: "very-popular"}])
  }

  const handleRecipeInformation = async (recipe:RecipeCard) => {
    r.push(`/recipe?title=${recipe.title}&id=${recipe.id}`)
    window.location.reload();
  }

  useEffect(()=>{
    handleGrabbingRecipeInformation()

    const storedRecipesString = localStorage.getItem("relatedRecipes");
    if (storedRecipesString) {
      const storedRecipes: object[] = JSON.parse(storedRecipesString);
      setRelatedRecipes(storedRecipes);
    }
  },[])

  return (
    <main>
      <Suspense fallback={<p>Loading feed...</p>}>
       <Box bg="#E7E2DF" px="20px" py="7px" cursor="pointer">
        <Heading as='h4' size='md' onClick={()=>r.push("/")}>Chef Willy</Heading>
      </Box>
      <Flex justifyContent="center" p="3rem 3rem">
        <Flex flexDir="column" p="10px" width="100%" maxW="1000px"  border="2px solid #D69E2E">
          <Flex flexDir="column" p="40px" bg="#FCE1AB">
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
            <Flex id="checkbox" flexDirection="column" paddingBottom="20px">
              {equipment && equipment.map((o:any,i:number)=>(
                <Checkbox key={i} _checked={{ textDecoration: "line-through", color: "#D69E2E"}} colorScheme='yellow' style={{transitionDuration:"0.3s"}}>{o.name}</Checkbox>
              ))}
            </Flex>
            <Heading as='h4' size='md' paddingBottom="5px">Ingredients:</Heading>
            <Flex id="checkbox" flexDirection="column" paddingBottom="20px">
              {chosenRecipe.extendedIngredients && chosenRecipe.extendedIngredients.map((o:any,i:number)=>(
                <Checkbox key={i} _checked={{ textDecoration: "line-through", color: "#D69E2E"}} colorScheme='yellow' style={{transitionDuration:"0.3s"}}>{o.measures.metric.amount.toFixed(2)} {o.measures.metric.unitShort} {o.name}</Checkbox>
              ))}
            </Flex>
            <Heading as='h4' size='md' paddingBottom="5px">Instructions:</Heading>
            <ol style={{padding:"0 0 0 35px"}}>
              {chosenRecipe.analyzedInstructions?.length > 0 && chosenRecipe.analyzedInstructions[0].steps.map((o:any,i:number)=>(
                <li key={i} style={{transitionDuration:"0.3s"}}>{o.step}</li>
              ))}
            </ol>
          </Box>
          <hr style={{margin:"30px 0", borderColor:"#D69E2E"}}/>
          <Box>
          <Heading as='h4' size='md' paddingBottom="5px">Other Results:</Heading>
            <Flex overflowX="scroll" height="320px" gap="5" padding="20px" alignItems="center">
              {relatedRecipes.map((o:any,i:number)=> {
                if(o.title !== chosenRecipe.title){
                  return(
                    <Flex id="what" position="relative" onMouseOver={()=>setMissingHover(o.title)} onMouseOut={()=>setMissingHover("")} bg="white" flexDir="column" width="170px" height="180px" alignItems="center" borderRadius="25px" p="15px" key={i} onClick={()=>handleRecipeInformation(o)} marginTop="50px" boxShadow="0px 5px 10px 0px rgba(0,0,0,0.3)" cursor="pointer">
                      <Image src={o.image} alt={o.title} width={200} height={200} style={{width:"125px", height:"125px", borderRadius:"50%", objectFit:"cover", marginTop:"-50px"}}/>
                      <Text wordBreak="normal" textAlign="center" paddingY="15px" fontSize="sm">{o.title}</Text>
                      {missingHover == o.title && 
                        <Box position="absolute" bg="rgba(255,255,250,0.9)" width="170px" height="180px" top="0" borderRadius="25px" p="15px" overflowY="scroll">
                          <Text fontWeight="bold" wordBreak="normal" textAlign="center" fontSize="sm">Missing Ingredients:</Text>
                          <ol style={{padding:"0 0 0 35px"}}>
                            {o.missedIngredients.map((o:any,i:number)=>(
                              <li key={i} style={{fontWeight:"500", fontSize:"13px"}}>{o.name}</li>
                            ))}
                          </ol>
                        </Box>
                      }
                    </Flex>
                  )
                }
              })}
            </Flex>
          </Box>
        </Flex>
        </Flex>
      </Flex>
      </Suspense>
    </main>
  );
}
