"use client"
import Image from "next/image";
import { Button, Box, Flex, Heading, Text, Input, ScaleFade, useToast } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState, Suspense} from "react"
import { useRouter } from "next/navigation";
import IngredientList from "../../../public/ingredients.json"
import AisleList from "../../../public/filter.json"
import Header from "../components/Header";
import Colors from "../../../public/colors.json"
import { CloseIcon } from "@chakra-ui/icons";
import Footer from "../components/Footer";

interface User {
  id: number, 
  username: string, 
  email: string, 
  password: string, 
  createdAt:string
}

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
  ingredient_name: string,
  aisle: string,
  image:string
}

interface Toast {
  title: string,
  description: string,
  status: "info" | "warning" | "success" | "error" | "loading",
  duration: number,
}

function Recipe() {
  const r = useRouter()
  const toast = useToast()

  const [currentUser, setCurrentUser] = useState<User>()
  const [ingredient, setIngredient] = useState<string>("")
  const [ingredientData, setIngredientData] = useState("");
  const [ingredientArray, setIngredientArray] = useState<IngredientCard[]>([]);
  const [toastMessage, setToastMessage] = useState<Toast>();

  const handleIngredientDataShow = (id:string) => {
    if(id !== "ingredient-selection"){
      setIngredientData("")
    }
  }

  const handleGrabbingIngredients = async (user_id?:number) => {
    const response = await axios({
      method: 'get',
      url: `/api/ingredients?user_id=${user_id}`,
    });
    const result = await response.data
    setIngredientArray(result.rows[0])
  }

  const handleAddingIngredients = async (ingredientId?:number) => {
    const grabIngredientAPI = await axios.get(`https://api.spoonacular.com/food/ingredients/${ingredientId}/information?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&amount=1`)
    const grabIngredientAPIResult = await grabIngredientAPI.data
    const aisleIngredient = grabIngredientAPIResult.aisle.split(";")

    
    const response = await axios({
      method: 'post',
      url: "/api/ingredients",
      data: {
        user_id: currentUser?.id,
        ingredient: {"aisle": aisleIngredient[0], "id": grabIngredientAPIResult.id, "image": grabIngredientAPIResult.image, "name": grabIngredientAPIResult.name}
      }
    });
    const result = await response.data
    if(result.message){
      setToastMessage(result.message)
      setIngredientArray((prev) => [...prev, result.ingredient])
    } else {
      setToastMessage(result.error)
    }
  }

  
  const handleDeleteIngredient = async (user_id:number, ingredient_id:number) => {
    const response = await axios({
      method: 'delete',
      url: `/api/ingredients?user_id=${user_id}&ingredient_id=${ingredient_id}`,
    });
    const result = await response.data
    
    if(result){
      setIngredientArray((oldValues: IngredientCard[]) => {
        return oldValues.filter(object => object.ingredient_id !== ingredient_id)
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
    <main onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleIngredientDataShow((e.target as HTMLButtonElement).id)} style={{backgroundColor:Colors.lightYellow}}>
      <Flex flexDir="column" alignItems="center" position="relative" backgroundImage="url('/YellowSquiggle.svg')"  backgroundSize="auto 100%" px="3" backgroundRepeat="x-repeat" height="300px">
        <Header currentUser={currentUser ?  currentUser : ""} setCurrentUserId={(e:User) => setCurrentUser(e)} color={{"bg":Colors.lightYellow, text:Colors.strongYellow}} />
        <Flex marginY="30" width="100%" padding="3" height="fit-content" maxWidth="1100px" bgColor="white" borderRadius="10" gap="4">
          <Input id="ingredient-selection" type="text" autoComplete="off"  size='sm' variant='filled' bgColor={Colors.mediumYellow} _hover={{bgColor:Colors.mediumYellow}} placeholder='Insert Ingredients...' value={ingredient} onChange={(e)=>setIngredient(e.target.value)} onClick={()=>setIngredientData("acorn squash")} borderRadius="5px"/>
          {/* <Button size='sm' bgColor={Colors.strongYellow} _hover={{bgColor:Colors.mediumYellow}} onClick={()=>handleAddingIngredients(ingredient)}>Add</Button> */}
          <ScaleFade in={ingredientData != ""} unmountOnExit={true} initialScale={0.9} style={{position:"absolute", top:"145px", zIndex:10}}>
            <Flex flexDir="column" bgColor="white" height="fit-content" maxHeight="220px" width="222px" overflowY="scroll" boxShadow="0px 3px 3px 0px rgba(0,0,0,0.1)" borderRadius="6px" borderWidth="1px" py="10px">
              {IngredientList.map((o:any,i:number)=>{
                if(o.ingredient.includes(ingredient.toLowerCase()) )
                return(
                  <Box id="ingredient-selection" key={i + "00"} fontSize="sm" textTransform="capitalize" bgColor={ingredientData == o.ingredient ? "gray.100" : ""} onMouseOver={()=>setIngredientData(o.id)} onClick={()=>{handleAddingIngredients(o.id); setIngredientData("")}} p="5px 20px">{o.ingredient}</Box>
              )
              })}
            </Flex>
          </ScaleFade>
        </Flex>
      </Flex>

      <Flex minH={"calc(100vh - 405px)"} w="100%" justifyContent="center">
        <Box height="100%" width="100%" maxWidth="1100px">
          {AisleList.aisle.map((o:string,i:number)=>(
            <Box key={i + "11"}>
              {ingredientArray && ingredientArray.some((item:IngredientCard) => item?.aisle === o) && (
                <>
                  <Heading as='h4' size='md' color={Colors.strongYellow} paddingTop="14" paddingBottom="3">{o}</Heading>
                  <Flex flexWrap="wrap" gap="4">
                    {ingredientArray.map((ingre: IngredientCard, index) => {
                      if(ingre?.aisle === o) {
                        return (
                          <Flex key={index + "22"} gap="4" bg="white" width="fit-content" alignItems="center" borderRadius="10" py="2" px="4" boxShadow="0px 5px 20px 0px rgba(0,0,0,0.3)">
                            <Text key={index} wordBreak="normal" textAlign="center" fontSize="sm" textTransform="capitalize">{ingre.ingredient_name}</Text>
                            <CloseIcon cursor="pointer" boxSize={2} onClick={()=>handleDeleteIngredient(ingre.user_id, ingre.ingredient_id)} />
                          </Flex>
                        )
                      }
                      return null;
                    })}
                  </Flex>
                </>
              )}
            </Box>
          ))}
          {ingredientArray.length < 1 && 
            <Flex flexDirection="column" width="100%" height={"calc(100vh - 405px)"} justifyContent="center" alignItems="center" py={16}>
              <Image src="/ingredient.png" alt="No Recipes" width={120} height={120} />
              <Heading as="h4" fontSize="lg" >No Ingredients Added Yet</Heading>
            </Flex>
          }
        </Box>
      </Flex>
      <Flex flexDirection="column" width="100%" alignItems="center">
        <Footer/>
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