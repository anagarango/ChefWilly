"use client"
import Image from "next/image";
import { Box, Flex, Checkbox, Heading, Text, Skeleton, SkeletonText, useToast  } from '@chakra-ui/react'
import axios from "axios";
import Colors from "../../../public/colors.json"
import React, {useEffect, useState, Suspense} from "react"
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import Header from "../components/Header";
import RecipeCard from "../components/Recipe"


interface RecipeInfo {
  id: number,
  title: string,
  image: string,
  imageType: string
}

function RecipePage() {
  const r = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()

  const search = searchParams.get('id')
  const [currentUser, setCurrentUser] = useState<any>();
  const [chosenRecipe, setChosenRecipe] = useState<any>({})
  const [relatedRecipes, setRelatedRecipes] = useState<object[]>([])
  const [cookbookRecipes, setCookbookRecipes] = useState<object[]>([])
  const [equipment, setEquipment] = useState<any>()
  const [diet, setDiet] = useState<any>()
  const [cookbookSaved, setCookbookSaved] = useState<boolean>(true)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<any>();

  const handleGrabbingRecipeInformation = async (user_id?:number) => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${search}/information?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const equipmentResponse = await axios.get(`https://api.spoonacular.com/recipes/${search}/equipmentWidget.json?apiKey=${process.env.NEXT_PUBLIC_API_KEY}`)
    const result = await response.data
    const equipmentResult = await equipmentResponse.data

    const cookbookResponse = await axios({
      method: 'get',
      url: `/api/cookbook/${user_id}?recipe_id=${search}`,
    });

    const cookbookResult = await cookbookResponse.data

    setCookbookSaved(cookbookResult.cookbookExists.length)
    setChosenRecipe(result)
    setEquipment(equipmentResult.equipment)
    setDiet([{result: result.dairyFree, name: "dairy-free"}, {result: result.glutenFree, name: "gluten-free"}, {result: result.vegan, name: "vegan"}, {result: result.vegetarian, name: "vegetarian"}, {result: result.veryHealthy, name: "healthy"}, {result: result.veryPopular, name: "very-popular"}])
    setIsLoaded(true)
  }


  const handleAddingCookbook  = async (recipe:RecipeInfo) => {
    const apiResponse = await axios({
      method: 'post',
      url: "/api/cookbook",
      data: {
        user_id: currentUser.id,
        cookbook: recipe
      }
    });
    const result = await apiResponse.data
    setCookbookSaved(result.addedCookbook)
    setToastMessage(result.message)
  }

  useEffect(()=>{
    const storedUser = sessionStorage.getItem("currentUser")

    if(storedUser){
      const parsedUser = JSON.parse(storedUser)
      setCurrentUser(parsedUser)
      handleGrabbingRecipeInformation(parsedUser.id)
    } else {
      handleGrabbingRecipeInformation()
    }

    const storedRecipesString = localStorage.getItem("relatedRecipes");
    const storedCookbookString = localStorage.getItem("cookbookRecipes");
    if (storedCookbookString) {
      const storedRecipes: object[] = JSON.parse(storedCookbookString);
      setCookbookRecipes(storedRecipes);
    } else if (storedRecipesString) {
      const storedRecipes: object[] = JSON.parse(storedRecipesString);
      setRelatedRecipes(storedRecipes);
    }
  },[])

  useEffect(() => {
    if (toastMessage?.title) {
      toast({
        title: toastMessage.title,
        description: toastMessage.description,
        status: toastMessage.status,
        duration: toastMessage.duration,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  }, [toastMessage]); 

  return (
    <main style={{backgroundColor:Colors.lightOrange, height:"fit-content"}}>
      <Flex flexDir="column" alignItems="center" backgroundImage="url('/OrangeSquiggle.svg')" backgroundSize="clamp(100px, 60%, 1100px) clamp(100px, 56vw, 800px)" backgroundPosition="100% 0%" backgroundRepeat="no-repeat" width="100vw" px="6">
        <Header currentUser={currentUser ?  currentUser : ""} setCurrentUserId={(e:any) => setCurrentUser(e)} color={{"bg":Colors.lightOrange, text:Colors.strongOrange}}/>
        <Flex justifyContent="center" width="100%" height="100%" paddingX={7} paddingY={10}>
          <Flex flexDir="column" p="10px" marginBottom={14} width="100%" maxW="1000px" border={`2px solid ${Colors.mediumOrange}`}>
            <Flex flexDir="column" p="40px" bg={Colors.mediumOrange}>
            <Flex>
              <Box width="50%" paddingRight={5}>
                <SkeletonText as='h2' fontSize='3xl' fontWeight="bold" startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1} noOfLines={1} skeletonHeight='5' paddingBottom="10px">{chosenRecipe.title}</SkeletonText>
                <SkeletonText as='h5' fontWeight="medium" startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1} noOfLines={1} spacing='4' skeletonHeight='2' height='20px' >Ratings: <span>{Math.floor(chosenRecipe.spoonacularScore)}/100</span></SkeletonText>
                <SkeletonText as='h5' fontWeight="medium" startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1} noOfLines={1} spacing='4' skeletonHeight='2' height='20px' >Total Time: {chosenRecipe.readyInMinutes} minutes</SkeletonText>
                <SkeletonText as='h5' fontWeight="medium" startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1} noOfLines={1} spacing='4' skeletonHeight='2' height='20px' >Servings: {chosenRecipe.servings}</SkeletonText>
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
              <Skeleton startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1}  height="100%" width="50%" >
                <Image src={chosenRecipe.image} alt={chosenRecipe.title} width={200} height={200} style={{width:"100%", height:"fit-content"}}/>
              </Skeleton>
            </Flex>
            <Box>
              <SkeletonText startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1}  mt='4' noOfLines={7} spacing='4' skeletonHeight='2' />
              <Text dangerouslySetInnerHTML={{ __html: chosenRecipe.summary }} paddingY="25px"></Text>
              <Heading as='h4' size='md'>Equipment:</Heading>
              <SkeletonText w={12} startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1}  mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
              <Flex id="checkbox" flexDirection="column" paddingBottom="25px" marginTop={-3}>
                {equipment && equipment.map((o:any,i:number)=>(
                  <Checkbox key={i} _checked={{ textDecoration: "line-through", color: Colors.strongOrange}} colorScheme='orange' style={{transitionDuration:"0.3s"}}>{o.name}</Checkbox>
                ))}
              </Flex>
              <Heading as='h4' size='md'>Ingredients:</Heading>
              <SkeletonText w={12} startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1}  mt='4' noOfLines={7} spacing='4' skeletonHeight='2' />
              <Flex id="checkbox" flexDirection="column" paddingBottom="25px" marginTop={-3}>
                {chosenRecipe.extendedIngredients && chosenRecipe.extendedIngredients.map((o:any,i:number)=>(
                  <Checkbox key={i} _checked={{ textDecoration: "line-through", color: Colors.strongOrange}} colorScheme='orange' style={{transitionDuration:"0.3s"}}>{o.measures.metric.amount} {o.measures.metric.unitShort} {o.name}</Checkbox>
                ))}
              </Flex>
              <Heading as='h4' size='md' paddingBottom="5px">Instructions:</Heading>
              <SkeletonText w={12} startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1}  mt='4' noOfLines={10} spacing='4' skeletonHeight='2' />
              <ol style={{padding:"0 0 0 35px"}}>
                {chosenRecipe.analyzedInstructions?.length > 0 && chosenRecipe.analyzedInstructions[0].steps.map((o:any,i:number)=>(
                  <li key={i} style={{transitionDuration:"0.3s"}}>{o.step}</li>
                ))}
              </ol>
              <Skeleton startColor={Colors.strongOrange} endColor={Colors.skeletonOrange} isLoaded={isLoaded} fadeDuration={1}  fontWeight="bold" borderRadius="10" width="100%" backgroundColor={cookbookSaved ? "gray" : Colors.strongOrange} color={cookbookSaved ? "lightgray" : "white" } _hover={{backgroundColor:cookbookSaved ? "gray" :Colors.strongOrange}} padding="10px 0" textAlign='center' marginTop="20px" cursor={cookbookSaved ? "not-allowed" : "pointer"} onClick={()=>{cookbookSaved ? console.log("Nope") : handleAddingCookbook(chosenRecipe)}}>{cookbookSaved ? "Already Saved to Cookbook" : "Add to Cookbook"}</Skeleton>
            </Box>
            {(relatedRecipes.length > 1 || cookbookRecipes.length > 1) && 
              <>
                <hr style={{margin:"30px 0", borderColor:Colors.strongOrange}}/>
                <Box>
                <Heading as='h4' size='md' paddingBottom="5px">Other Results:</Heading>
                  <Flex overflowX="scroll" height="275px" gap="5" paddingX="20px" alignItems="center">
                    {cookbookRecipes.map((o:any,i:number)=> {
                      if(o.title !== chosenRecipe.title){
                        return(
                          <RecipeCard arrayKey={i} arrayObject={o} cookbookRecipes={JSON.stringify(cookbookRecipes)} typeHover={false}/>
                        )
                      }
                    })}
                    {relatedRecipes.map((o:any,i:number)=> {
                      if(o.title !== chosenRecipe.title){
                        return(
                          <RecipeCard arrayKey={i} arrayObject={o} relatedRecipes={JSON.stringify(relatedRecipes)}/>
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

export default function Recipe(){
  return (
    <Suspense fallback={<p>Loading feed...</p>}>
      <RecipePage/>
    </Suspense>
  )
}