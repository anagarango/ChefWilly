"use client"
import Image from "next/image";
import { Button, Box, Flex, Heading, Text, Input, ScaleFade, useToast } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState, Suspense} from "react"
import { useRouter } from "next/navigation";
import AisleList from "../../../public/filter.json"
import Header from "../components/Header";
import Colors from "../../../public/colors.json"
import { CloseIcon, ViewIcon } from "@chakra-ui/icons";


interface RecipeCard {
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

function CookBook() {
  const r = useRouter()
  const toast = useToast()

  const [currentUser, setCurrentUser] = useState<any>()
  const [ingredient, setIngredient] = useState<string | null>(null)
  const [ingredientData, setIngredientData] = useState("");
  const [cookbookArray, setCookbookArray] = useState<IngredientCard[]>([]);
  const [toastMessage, setToastMessage] = useState<any>();
  const [deleteHover, setDeleteHover] = useState<string>("")

  const handleIngredientDataShow = (id:string) => {
    if(id !== "ingredient-selection"){
      setIngredientData("")
    }
  }

  const handleGrabbingIngredients = async (user_id?:number) => {
    const response = await axios({
      method: 'get',
      url: `/api/cookbook?user_id=${user_id}`,
    });
    const result = await response.data
    setCookbookArray(result.ingredients)
  }

  const handleAddingIngredients = async (ing?:any) => {
    const grabIngredientAPI = await axios.get(`https://api.spoonacular.com/food/ingredients/search?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&query=${ing}&number=1&metaInformation=true`)
    const grabIngredientAPIResult = await grabIngredientAPI.data
    
    const response = await axios({
      method: 'post',
      url: "/api/ingredients",
      data: {
        user_id: currentUser.id,
        ingredient: grabIngredientAPIResult.results
      }
    });
    const result = await response.data
    if(result.message){
      setToastMessage(result.message)
      setCookbookArray((prev) => [...prev, result.ingredient])
    } else {
      setToastMessage(result.error)
    }
  }
  const handleRecipeInformation = async (recipe:RecipeCard, e:any) => {
    const recipeArray = []
    for(var x = 0; x < cookbookArray.length; x++){
      recipeArray.push(JSON.parse(cookbookArray[x].recipe_information))
    }
    localStorage.setItem("cookbookRecipes", JSON.stringify(recipeArray))
    r.push(`/recipe?title=${recipe.title}&id=${recipe.id}`)
  }

  
  const handleDeleteCookbook = async (user_id:number, recipe_id:number, e:any) => {
    e.stopPropagation();
    const response = await axios({
      method: 'delete',
      url: `/api/cookbook?user_id=${user_id}&recipe_id=${recipe_id}`,
    });
    const result = await response.data
    
    if(result){
      setCookbookArray((oldValues: any[]) => {
        return oldValues.filter(object => object.recipe_id !== recipe_id)
      })
    }
  }



  useEffect(()=>{

    const storedRecipesString = sessionStorage.getItem("currentUser");
    if (storedRecipesString) {
      const storedRecipes: any = JSON.parse(storedRecipesString);
      setCurrentUser(storedRecipes);
      handleGrabbingIngredients(storedRecipes.id)
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
    <main onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleIngredientDataShow((e.target as HTMLButtonElement).id)} style={{backgroundColor:Colors.lightRed}}>
      <Flex flexDir="column" alignItems="center" position="relative" backgroundImage="url('/RedSquiggle.svg')"  backgroundSize="auto 100%" px="6" backgroundRepeat="x-repeat" height="300px">
        <Header currentUser={currentUser ?  currentUser : ""} setCurrentUserId={(e:any) => setCurrentUser(e)} color={{"bg":Colors.lightRed, text:Colors.strongRed}} />
        <Flex marginY="30" width="100%" padding="3" height="fit-content" maxWidth="1100px" bgColor="white" borderRadius="10" gap="4">
          <Input id="ingredient-selection" type="text" autoComplete="off"  size='sm' variant='filled' bgColor={Colors.mediumRed} _hover={{bgColor:Colors.mediumRed}} placeholder='Insert Recipe Name...' value={ingredient || ""} onChange={(e)=>setIngredient(e.target.value)} onClick={()=>setIngredientData("acorn squash")} borderRadius="5px"/>
        </Flex>
      </Flex>
      <Flex w="100%" justifyContent="center" paddingBottom="28">
      <Flex flexWrap="wrap" gap={5} width="100%" maxW="1100px" p={6}>
        {cookbookArray.map((ingre: IngredientCard, index) => {
          const recipeInfo = JSON.parse(ingre.recipe_information)
            if(ingredient == null || recipeInfo.title.toLowerCase().includes(ingredient.toLowerCase()))
            return (
                    <Flex id="what" position="relative" bg="white" flexDir="column" width="170px" height="180px" alignItems="center" borderRadius="25px" p="15px" key={index} onMouseOver={()=>setDeleteHover(recipeInfo.title)} onMouseOut={()=>setDeleteHover("")}  marginTop="50px" boxShadow="0px 5px 20px 0px rgba(0,0,0,0.3)">
                      <Image src={recipeInfo.image} alt={recipeInfo.title} width={200} height={200} style={{width:"125px", height:"125px", borderRadius:"50%", objectFit:"cover", marginTop:"-50px"}}/>
                      <Text wordBreak="normal" textAlign="center" paddingY="15px" fontSize="sm">{recipeInfo.title}</Text>
                      {deleteHover == recipeInfo.title && 
                        <Flex position="absolute" bg="rgba(255,255,250,0.9)" flexDirection="column" width="170px" height="180px" top="0" borderRadius="25px" p="35px" justifyContent="space-between" alignItems="center">
                          <CloseIcon cursor="pointer" boxSize={5} color={Colors.strongRed} onClick={(e:any) => handleDeleteCookbook(ingre.user_id, ingre.recipe_id, e)} />
                          <ViewIcon cursor="pointer" boxSize={7} color={Colors.strongRed} onClick={(e:any)=>handleRecipeInformation(recipeInfo, e)} />
                        </Flex>
                      }
                    </Flex>
                  )
            
            return null;
          })}
      </Flex>
      </Flex>

      {/* <Flex w="100%" justifyContent="center" paddingBottom="28">
        <Box width="90%" maxWidth="1100px">
        
          {AisleList.mealType.list.map((o:string,i:number)=>{ 
            if(cookbookArray.some((item) => {
              const recipeInfo = JSON.parse(item.recipe_information);
              console.log(recipeInfo.title, ingredient, recipeInfo.title.toLowerCase().includes(ingredient?.toLowerCase()))
              return recipeInfo.title.toLowerCase().includes(ingredient?.toLowerCase());
            }))
            return(
            <Box key={i}>
              {cookbookArray.some((item) => {
                const recipeInfo = JSON.parse(item.recipe_information);
                return recipeInfo.dishTypes[0] === o;
              }) && (
                <Box width="100%" maxW="1100px">
                  <Heading as='h4' size='md' color={Colors.strongRed} paddingTop="14" textTransform="capitalize">{o}</Heading>
                  <Flex width="100%" overflowX="scroll" height="260px" gap="5" paddingX="20px" alignItems="center">
                    {cookbookArray.map((ingre: IngredientCard, index) => {
                      const recipeInfo = JSON.parse(ingre.recipe_information)
                      if(recipeInfo.dishTypes[0] === o) {
                        if(ingredient == null || recipeInfo.title.toLowerCase().includes(ingredient.toLowerCase()))
                        return (
                                <Flex id="what" position="relative" bg="white" flexDir="column" width="170px" height="180px" alignItems="center" borderRadius="25px" p="15px" key={index} onMouseOver={()=>setDeleteHover(recipeInfo.title)} onMouseOut={()=>setDeleteHover("")}  marginTop="50px" boxShadow="0px 5px 20px 0px rgba(0,0,0,0.3)">
                                  <Image src={recipeInfo.image} alt={recipeInfo.title} width={200} height={200} style={{width:"125px", height:"125px", borderRadius:"50%", objectFit:"cover", marginTop:"-50px"}}/>
                                  <Text wordBreak="normal" textAlign="center" paddingY="15px" fontSize="sm">{recipeInfo.title}</Text>
                                  {deleteHover == recipeInfo.title && 
                                    <Flex position="absolute" bg="rgba(255,255,250,0.9)" flexDirection="column" width="170px" height="180px" top="0" borderRadius="25px" p="35px" justifyContent="space-between" alignItems="center">
                                      <CloseIcon cursor="pointer" boxSize={5} color={Colors.strongRed} onClick={(e:any) => handleDeleteCookbook(ingre.user_id, ingre.recipe_id, e)} />
                                      <ViewIcon cursor="pointer" boxSize={7} color={Colors.strongRed} onClick={(e:any)=>handleRecipeInformation(recipeInfo, e)} />
                                    </Flex>
                                  }
                                </Flex>
                              )
                        }
                        return null;
                      })}
                  </Flex>
                </Box>
              )}
            </Box>
          )})}
        </Box>
      </Flex> */}
    </main>
  );
}

export default function RecipeCard(){
  return (
    <Suspense fallback={<p>Loading feed...</p>}>
      <CookBook/>
    </Suspense>
  )
}