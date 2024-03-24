"use client"
import Image from "next/image";
import { Button, Box, Flex, Checkbox, Heading, Text } from '@chakra-ui/react'
import axios from "axios";
import Colors from "../../../public/colors.json"
import React, {useEffect, useState, Suspense} from "react"
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import Header from "../components/Header";


interface RecipeCard {
  id: number,
  title: string,
  image: string,
  imageType: string
}

function Recipe() {
  const r = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('id')
  const [currentUser, setCurrentUser] = useState<any>();
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

  const handleAddingCookbook  = async (recipe:RecipeCard) => {
    console.log(recipe)
    const apiResponse = await axios({
      method: 'post',
      url: "/api/cookbook",
      data: {
        user_id: currentUser.id,
        cookbook: recipe
      }
    });
    const result = await apiResponse.data
    console.log(result)
  }

  useEffect(()=>{
    handleGrabbingRecipeInformation()

    const storedRecipesString = localStorage.getItem("relatedRecipes");
    const storedCookbookString = localStorage.getItem("cookbookRecipes");
    if (storedCookbookString) {
      const storedRecipes: object[] = JSON.parse(storedCookbookString);
      setRelatedRecipes(storedRecipes);
    } else if (storedRecipesString) {
      const storedRecipes: object[] = JSON.parse(storedRecipesString);
      setRelatedRecipes(storedRecipes);
    }

    const storedUser = sessionStorage.getItem("currentUser")

    if(storedUser){
      setCurrentUser(JSON.parse(storedUser))
    }
  },[])

  return (
    <main>
      <Flex flexDir="column" alignItems="center" backgroundImage="url('/OrangeSquiggle.svg')" backgroundSize="clamp(100px, 60%, 1100px) auto" backgroundPosition="100% 0%" backgroundRepeat="no-repeat" width="100vw" height="60vw" px="6">
      <Header currentUser={currentUser ?  currentUser : ""} setCurrentUserId={(e:any) => setCurrentUser(e)} color={{"bg":Colors.lightOrange, text:Colors.strongOrange}}/>
      <Flex justifyContent="center" width="100%" paddingTop={10}>
        <Flex flexDir="column" p="10px" width="100%" maxW="1000px"  border={`2px solid ${Colors.mediumOrange}`}>
          <Flex flexDir="column" p="40px" bg={Colors.mediumOrange}>
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
            <Image src={chosenRecipe.image} alt={chosenRecipe.title} width={200} height={200} style={{width:"50%", height:"fit-content"}}/>
          </Flex>
          <Box>
            <Text dangerouslySetInnerHTML={{ __html: chosenRecipe.summary }} paddingY="25px"></Text>
            <Heading as='h4' size='md' paddingBottom="5px">Equipment:</Heading>
            <Flex id="checkbox" flexDirection="column" paddingBottom="20px">
              {equipment && equipment.map((o:any,i:number)=>(
                <Checkbox key={i} _checked={{ textDecoration: "line-through", color: Colors.strongOrange}} colorScheme='orange' style={{transitionDuration:"0.3s"}}>{o.name}</Checkbox>
              ))}
            </Flex>
            <Heading as='h4' size='md' paddingBottom="5px">Ingredients:</Heading>
            <Flex id="checkbox" flexDirection="column" paddingBottom="20px">
              {chosenRecipe.extendedIngredients && chosenRecipe.extendedIngredients.map((o:any,i:number)=>(
                <Checkbox key={i} _checked={{ textDecoration: "line-through", color: Colors.strongOrange}} colorScheme='orange' style={{transitionDuration:"0.3s"}}>{o.measures.metric.amount.toFixed(2)} {o.measures.metric.unitShort} {o.name}</Checkbox>
              ))}
            </Flex>
            <Heading as='h4' size='md' paddingBottom="5px">Instructions:</Heading>
            <ol style={{padding:"0 0 0 35px"}}>
              {chosenRecipe.analyzedInstructions?.length > 0 && chosenRecipe.analyzedInstructions[0].steps.map((o:any,i:number)=>(
                <li key={i} style={{transitionDuration:"0.3s"}}>{o.step}</li>
              ))}
            </ol>
            <Box fontWeight="bold" borderRadius="10" width="100%" backgroundColor={Colors.strongOrange} color="white" _hover={{backgroundColor:Colors.strongOrange}} padding="10px 0" textAlign='center' marginTop="20px" cursor="pointer" onClick={()=>handleAddingCookbook(chosenRecipe)}>Add to Cookbook</Box>
          </Box>
          {relatedRecipes.length > 1 && 
            <>
              <hr style={{margin:"30px 0", borderColor:Colors.strongOrange}}/>
              <Box>
              <Heading as='h4' size='md' paddingBottom="5px">Other Results:</Heading>
                <Flex overflowX="scroll" height="275px" gap="5" paddingX="20px" alignItems="center">
                  {relatedRecipes.map((o:any,i:number)=> {
                    if(o.title !== chosenRecipe.title){
                      return(
                        <Flex id="what" position="relative" onMouseOver={()=>setMissingHover(o.title)} onMouseOut={()=>setMissingHover("")} bg="white" flexDir="column" width="170px" height="180px" alignItems="center" borderRadius="25px" p="15px" key={i} onClick={()=>handleRecipeInformation(o)} marginTop="50px" boxShadow="0px 5px 10px 0px rgba(0,0,0,0.3)" cursor="pointer">
                          <Image src={o.image} alt={o.title} width={200} height={200} style={{width:"125px", height:"125px", borderRadius:"50%", objectFit:"cover", marginTop:"-50px"}}/>
                          <Text wordBreak="normal" textAlign="center" paddingY="15px" fontSize="sm">{o.title}</Text>
                          {(o.missedIngredients && missingHover == o.title) && 
                            <Box position="absolute" bg="rgba(255,255,250,0.9)" width="170px" height="180px" top="0" borderRadius="25px" p="15px" overflowY="scroll">
                              <Text fontWeight="bold" wordBreak="normal" textAlign="center" fontSize="sm">Missing Ingredients:</Text>
                              <ol style={{padding:"0 0 0 35px"}}>
                                {o.missedIngredients && o.missedIngredients?.map((o:any,i:number)=>(
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
            </>}
          </Flex>
        </Flex>
      </Flex>
      </Flex>
    </main>
  );
}

export default function RecipeCard(){
  return (
    <Suspense fallback={<p>Loading feed...</p>}>
      <Recipe/>
    </Suspense>
  )
}