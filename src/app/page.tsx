"use client"
import Image from "next/image";
import { Button, Box, Heading, Flex, Text, Input, useToast, ScaleFade, Spinner  } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import FilterCard from "./components/Filter"
import IngredientList from "../../public/ingredients.json"
import Header from "./components/Header";
import Colors from "../../public/colors.json"
import PopularRecipes from "../../public/popularFoods.json"
import RecipeCard from "./components/Recipe";
import { CloseIcon } from "@chakra-ui/icons";


interface RecipeCard {
  id: number,
  title: string,
  image: string,
  imageType: string
}

export default function Home() {
  const r = useRouter()
  const toast = useToast()

  const [currentUser, setCurrentUser] = useState<any>();
  const [recipes, setRecipes] = useState<object[]>([]);
  const [ingredient, setIngredient] = useState<string>("")
  const [recipeResults, setRecipeResults] = useState<number>(20)
  const [ingredientData, setIngredientData] = useState("");
  const [toastMessage, setToastMessage] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])



  const handleRecipeSearch = async (type: string) => {
    setLoading(true)
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&includeIngredients=${selectedIngredients.join(",")}&type=${selectedMealTypes.join(",")}&cuisine=${selectedCuisines.join(",")}&intolerances=${selectedIntolerances.join(",")}&number=${type === "MoreResults" ? recipeResults + 20 : 20}&sort=min-missing-ingredients&fillIngredients=true`);
    const result = await response.data;
    type === "MoreResults" ? setRecipeResults(prevPage => prevPage + 20) : setRecipeResults(20);
    setRecipes(result.results);
    localStorage.setItem("relatedRecipes", JSON.stringify(result.results))
    setLoading(false)
  };

  const handleGrabbingIngredients = async (user_id:number) => {
    const response = await axios({
      method: 'get',
      url: `/api/ingredients?user_id=${user_id}`,
    });
    const result = await response.data
    
    const recipeArray = []
    for(var x = 0; x < result.rows[0].length; x++){
      recipeArray.push(result.rows[0][x].ingredient_name)
    }
    
    setSelectedIngredients(recipeArray)
  }

  

  const handleMenuSelect = (option:string, settingState:any, state:any) => {
    if (state.includes(option)) {
      settingState(selectedMealTypes.filter(item => item !== option));
    } else {
      settingState([...state, option]);
    }
  };

  const handleAddingIngredients = (newIngredient:string) => {
    if (!selectedIngredients.includes(newIngredient) && newIngredient.trim() !== "") {
      setSelectedIngredients([...selectedIngredients, newIngredient])
      setToastMessage({"title": "Ingredient Added!", "description":"We've added your ingredient for you.", "status": "success", "duration":5000})
    } else if(selectedIngredients.includes(newIngredient)){
      setToastMessage({"title": "Ingredient Already Exists!", "description":"This ingrdient has already been added", "status": "error", "duration":5000})
    } else if(newIngredient.trim() == ""){
      setToastMessage({"title": "Input can't be empty!", "description":"Fill in the input to add ingredient", "status": "error", "duration":5000})
    }
    
    setIngredient("")
  }

  const handleIngredientDataShow = (id:string) => {
    if(id !== "ingredient-selection"){
      setIngredientData("")
    }
  }

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser")
    if(storedUser){
      const storedUserInfo: any = JSON.parse(storedUser);
      console.log(storedUserInfo)
      setCurrentUser(storedUserInfo)
      handleGrabbingIngredients(storedUserInfo.id)
    }

    const storedRecipesString = localStorage.getItem("relatedRecipes");
    if (storedRecipesString) {
      setRecipes(JSON.parse(storedRecipesString));
    }
    
    localStorage.setItem("cookbookRecipes", "")
  }, []);

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
    <main onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleIngredientDataShow((e.target as HTMLButtonElement).id)} style={{backgroundColor:Colors.lightOrange}}>
      <Flex flexDir="column" alignItems="center" backgroundImage="url('/OrangeSquiggleFood.svg')" backgroundSize="clamp(100px, 60%, 1100px) auto" backgroundPosition="100% 0%" backgroundRepeat="no-repeat" width="100vw" height="60vw" px="6">
        <Header currentUser={currentUser ?  currentUser : ""} setCurrentUserId={(e:any) => setCurrentUser(e)} color={{"bg":Colors.lightOrange, text:Colors.strongOrange}}/>
        <Flex position="relative" width="100%" height="100%" maxW="1100px" >
          <Flex id="homepage-image"  position="absolute" top="25%" left="0" flexDir="column" w="clamp(100px, 50%, 900px)" justifyContent="center" paddingLeft={5}>
            <Text fontSize="lg">{currentUser ?  `Welcome Back, ${currentUser.username}` : ""}</Text>
            <Heading as='h3' size='lg' fontWeight="black" color={Colors.strongOrange}>{currentUser ?  "Ready to Roll Up Your Sleeves Again? Let's Plan Your Next Dish!" : "No More Guessing: Get Personalized Recipes Based on Your Ingredients"}</Heading>
          </Flex>
        </Flex>
      </Flex>
      <Flex justifyContent="center">
        <Box width="100%" maxW="1100px" p="40px">
          <Heading as='h4' size='md' paddingBottom="5px">Popular Recipes</Heading>
          <Flex width="100%" overflowX="scroll" height="275px" gap="5" paddingX="20px" alignItems="center">
            {PopularRecipes.results.map((o:any,i:number)=> (
              <RecipeCard arrayKey={i} arrayObject={o} relatedRecipes={JSON.stringify(recipes)}/>
            ))}
          </Flex>
          <hr style={{margin:"75px 0", border:`1px solid ${Colors.strongOrange}`}}/>

          <Flex flexDirection="column" bg="white" p="4" borderRadius="25px" boxShadow="0px 5px 10px 0px rgba(0,0,0,0.3)">
            <Box width="100%">
              <Flex marginBottom={5} gap="3" position="relative">
                <Input id="ingredient-selection" autoComplete="off" size='sm' variant='filled' bgColor={Colors.mediumOrange} placeholder='Insert Ingredients...' value={ingredient} onChange={(e)=>setIngredient(e.target.value)} onClick={()=>setIngredientData("acorn squash")} borderRadius="5px"/>
                <ScaleFade in={ingredientData != ""} unmountOnExit={true} initialScale={0.9} style={{position:"absolute", top:"40px", zIndex:10}}>
                  <Flex flexDir="column" bgColor="white" height="fit-content" maxHeight="220px" width="222px" overflowY="scroll" boxShadow="0px 3px 3px 0px rgba(0,0,0,0.1)" borderRadius="6px" borderWidth="1px" py="10px">
                    {IngredientList.map((o,i)=>{
                      if(o.ingredient.includes(ingredient.toLowerCase()) )
                      return(
                        <Box id="ingredient-selection" key={i} fontSize="sm" textTransform="capitalize" bgColor={ingredientData == o.ingredient ? "gray.100" : ""} onMouseOver={()=>setIngredientData(o.ingredient)} onClick={()=>{handleAddingIngredients(o.ingredient); setIngredientData("")}} p="5px 20px">{o.ingredient}</Box>
                    )
                    })}
                  </Flex>
                </ScaleFade>
                <Button size='sm' color="white" bgColor={Colors.strongOrange} _hover={{bgColor:Colors.mediumOrange, color:"black"}} onClick={()=>handleAddingIngredients(ingredient)}>Add</Button>
              </Flex>
              <Flex gap="7" justifyContent="space-between">
                <Flex gap="3">
                  <FilterCard type="mealType" stateArray={selectedMealTypes} handleSelected={handleMenuSelect} settingState={setSelectedMealTypes}/>
                  <FilterCard type="cuisines" stateArray={selectedCuisines} handleSelected={handleMenuSelect} settingState={setSelectedCuisines}/>
                  <FilterCard type="intolerances" stateArray={selectedIntolerances} handleSelected={handleMenuSelect} settingState={setSelectedIntolerances}/>
                </Flex>
                <Button size='sm' color="white" bgColor={Colors.strongOrange} _hover={{bgColor:Colors.mediumOrange, color:"black"}}  onClick={()=>handleRecipeSearch("NewRecipes")}>{loading ? <Spinner boxSize={3}/> : "Search Recipes"}</Button>
              </Flex>
            </Box>

            {selectedIngredients.length > 0 && <>
              <hr style={{margin:"25px 0", border:`1px solid ${Colors.strongOrange}`}}/>
              <Flex gap="2" flexWrap="wrap">
                {selectedIngredients.map((o,i)=>(
                  <Flex key={i} borderRadius='10px' border={`1px solid ${Colors.strongOrange}`} alignItems="center" padding="3px 10px">
                    <Text color={Colors.strongOrange} fontSize="sm">{o}</Text>
                    <CloseIcon color={Colors.strongOrange} cursor="pointer" boxSize="6" paddingLeft={3.5} onClick={()=>setSelectedIngredients(selectedIngredients.filter(item => item !== o))} />
                  </Flex>
                ))}
              </Flex>
            </>}
          </Flex>

          <Flex marginTop={10} flexWrap="wrap" gap="4" justifyContent={loading ? "center" : "space-between"}>
            {loading && <Spinner color={Colors.strongOrange} boxSize={28} />}
            {(recipes && !loading) && recipes.map((o:any,i:number)=>(
              <RecipeCard arrayKey={i} arrayObject={o} relatedRecipes={JSON.stringify(recipes)}/>
            ))}
            {recipes.length < 1 && 
              <Flex flexDir="column" justifyContent="center" alignItems="center" width="100%" height="60vh">
                <Image src="/cart.png" alt="empty cart" width={200} height={200}/>
                <Heading as='h5' size='sm' paddingTop="15px">No Results ATM</Heading>
              </Flex>
            }
            {(recipeResults < 101 && recipes.length > 0) && <Box fontWeight="bold" borderRadius="10" width="100%" backgroundColor={Colors.strongOrange} color="white" _hover={{backgroundColor:Colors.strongOrange}} padding="10px 0" textAlign='center' marginTop="20px" cursor="pointer" onClick={()=>handleRecipeSearch("MoreResults")}>{loading ? <Spinner/> : "Show More Results"}</Box>}
          </Flex>
        </Box>
      </Flex>
    </main>
  );
}