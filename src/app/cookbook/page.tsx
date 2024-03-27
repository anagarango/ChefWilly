"use client"
import { Flex, Heading, Input, useToast } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState, Suspense} from "react"
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Colors from "../../../public/colors.json"
import RecipeCard from "../components/Recipe"
import Image from 'next/image';


interface RecipeInfo {
  id: number,
  title: string,
  image: string,
  imageType: string
}

interface IngredientCard {
  id: number,
  user_id: number,
  ingredient_id: number,
  recipe_id: number,
  recipe_information: string,
}

interface User {
  id: number, 
  username: string, 
  email: string, 
  password: string, 
  createdAt: string
}

interface ToastMessage {
  title: string,
  description: string,
  status: "success" | "info" | "warning" | "error" | "loading",
  duration: number,
  isClosable: boolean,
  position: string
}


function CookBookPage() {
  const r = useRouter()
  const toast = useToast()

  const [currentUser, setCurrentUser] = useState<User>()
  const [recipeSearch, setRecipeSearch] = useState<string>("")
  const [cookbookArray, setCookbookArray] = useState<IngredientCard[]>([]);
  const [toastMessage, setToastMessage] = useState<ToastMessage>();


  const handleGrabbingIngredients = async (user_id?:number) => {
    const response = await axios({
      method: 'get',
      url: `/api/cookbook?user_id=${user_id}`,
    });
    const result = await response.data
    setCookbookArray(result.rows[0])
  }

  const handleRecipeInformation = async (recipe:RecipeInfo) => {
    const recipeArray = []
    for(var x = 0; x < cookbookArray.length; x++){
      recipeArray.push(JSON.parse(cookbookArray[x].recipe_information))
    }
    localStorage.setItem("cookbookRecipes", JSON.stringify(recipeArray))
    r.push(`/recipe?title=${recipe.title}&id=${recipe.id}`)
  }
  
  const handleDeleteCookbook = async (user_id:number, recipe_id:number) => {
    const response = await axios({
      method: 'delete',
      url: `/api/cookbook?user_id=${user_id}&recipe_id=${recipe_id}`,
    });
    const result = await response.data
    if(result){
      setToastMessage({"title": "Recipe Removed!", "description":"We've removed the recipe from your cookbook.", "status": "success", "duration":6000, "isClosable":true, "position":"bottom-right"})
      setCookbookArray((oldValues: IngredientCard[]) => {
        return oldValues.filter(object => object.recipe_id !== recipe_id)
      })
    }
  }



  useEffect(()=>{
    const storedRecipesString = sessionStorage.getItem("currentUser");
    if (storedRecipesString) {
      const storedRecipes: User = JSON.parse(storedRecipesString);
      setCurrentUser(storedRecipes);
      handleGrabbingIngredients(storedRecipes.id)
    } else {
      r.push("/")
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
    <main style={{backgroundColor:Colors.lightRed}}>
      <Flex flexDir="column" alignItems="center" position="relative" backgroundImage="url('/RedSquiggle.svg')"  backgroundSize="auto 100%" px="3" backgroundRepeat="x-repeat" height="300px">
        <Header currentUser={currentUser ?  currentUser : ""} setCurrentUserId={(e:User) => setCurrentUser(e)} color={{"bg":Colors.lightRed, text:Colors.strongRed}} />
        <Flex marginY="30" width="100%" padding="3" height="fit-content" maxWidth="1100px" bgColor="white" borderRadius="10">
          <Input type="text" autoComplete="off" size='sm' variant='filled' placeholder='Insert Recipe Name...' bgColor={Colors.mediumRed} _hover={{bgColor:Colors.mediumRed}} value={recipeSearch} onChange={(e)=>setRecipeSearch(e.target.value)} borderRadius="5px"/>
        </Flex>
      </Flex>
      <Flex flexDirection="column" width="100%" height="100%" alignItems="center" justifyContent="center" paddingBottom="28">
        <Flex flexWrap="wrap" gap={5} width="100%" maxW="1100px" p={6}>
          {cookbookArray.map((ingre: IngredientCard, index) => {
            const recipeInfo = JSON.parse(ingre.recipe_information)
              if(recipeSearch == null || recipeInfo.title.toLowerCase().includes(recipeSearch.toLowerCase())){
                return <RecipeCard arrayKey={index} arrayObject={recipeInfo} typeHover="cookbookView" viewRecipe={()=>handleRecipeInformation(recipeInfo)} deleteRecipe={()=>handleDeleteCookbook(ingre.user_id, ingre.recipe_id)} />
              }
          })}
        </Flex>
        {!cookbookArray.length && 
          <Flex flexDirection="column" width="100%" height="100%" alignItems="center">
            <Image src="/recipe.png" alt="No Recipes" width={120} height={120} />
            <Heading as="h4" fontSize="lg" >No Recipes Added Yet</Heading>
          </Flex>
        }
      </Flex>
    </main>
  );
}

export default function Cookbook(){
  return (
    <Suspense fallback={<p>Loading feed...</p>}>
      <CookBookPage/>
    </Suspense>
  )
}