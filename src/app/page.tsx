"use client"
import Image from "next/image";
import { Button, Box, Heading, Flex, Text, Input, Tag, TagLabel, TagCloseButton, Menu, MenuList, MenuOptionGroup, MenuItemOption, MenuButton, MenuItem, SlideFade, ScaleFade  } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import FilterCard from "./components/Filter"
import IngredientList from "../../public/ingredients.json"


interface RecipeCard {
  id: number,
  title: string,
  image: string,
  imageType: string
}

export default function Home() {
  const r = useRouter()

  const storedRecipesString = localStorage.getItem("relatedRecipes");
  const storedRecipes: object[] = storedRecipesString ? JSON.parse(storedRecipesString) : [];
  const [recipes, setRecipes] = useState<object[]>(storedRecipes);
  const [missingHover, setMissingHover] = useState<string>("")
  const [ingredient, setIngredient] = useState<string>("")
  const [recipeResults, setRecipeResults] = useState<number>(20)
  const [ingredientData, setIngredientData] = useState("");

  
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])



  const handleRecipeSearch = async (type: string) => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&includeIngredients=${selectedIngredients.join(",")}&type=${selectedMealTypes.join(",")}&cuisine=${selectedCuisines.join(",")}&intolerances=${selectedIntolerances.join(",")}&number=${type === "MoreResults" ? recipeResults + 20 : 20}&sort=min-missing-ingredients&fillIngredients=true`);
    const result = await response.data;
    type === "MoreResults" ? setRecipeResults(prevPage => prevPage + 20) : setRecipeResults(20);
    setRecipes(result.results);
};


  const handleRecipeInformation = async (recipe:RecipeCard) => {
    localStorage.setItem("relatedRecipes", JSON.stringify(recipes))
    r.push(`/recipe?title=${recipe.title}&id=${recipe.id}`)
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
    }
    setIngredient("")
  }

  const handleIngredientDataShow = (id:string) => {
    if(id !== "ingredient-selection"){
      setIngredientData("")
    }
  }


  return (
    <main onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleIngredientDataShow((e.target as HTMLButtonElement).id)}>
      <Box bg="#E7E2DF" px="20px" py="7px" >
        <Heading as='h4' size='md' cursor="pointer">Chef Willy</Heading>
      </Box>
      <Box p="0rem 3rem">
        <Box p="40px">
          <Box bg="white" p="4" borderRadius="25px" boxShadow="0px 5px 10px 0px rgba(0,0,0,0.3)">
            <Flex width="100%" justifyContent="space-between">
              <Flex gap="3" position="relative">
                <Input id="ingredient-selection"  size='sm' variant='filled' placeholder='Insert Ingredients...' value={ingredient} onChange={(e)=>setIngredient(e.target.value)} onClick={()=>setIngredientData("acorn squash")} borderRadius="5px"/>
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
                
                <Button size='sm' colorScheme="green" onClick={()=>handleAddingIngredients(ingredient)}>Add</Button>
              </Flex>
              <Flex gap="3">
                <FilterCard type="mealType" stateArray={selectedMealTypes} handleSelected={handleMenuSelect} settingState={setSelectedMealTypes}/>
                <FilterCard type="cuisines" stateArray={selectedCuisines} handleSelected={handleMenuSelect} settingState={setSelectedCuisines}/>
                <FilterCard type="intolerances" stateArray={selectedIntolerances} handleSelected={handleMenuSelect} settingState={setSelectedIntolerances}/>
                <Button size='sm' colorScheme='blue' onClick={()=>handleRecipeSearch("NewRecipes")}>Search Recipes</Button>
              </Flex>
            </Flex>
            {selectedIngredients.length > 0 && <>
              <hr style={{margin:"10px 0"}}/>
              <Flex gap="2">
                {selectedIngredients.map((o,i)=>(
                  <Tag size="sm" borderRadius='full' variant='solid' colorScheme='green' padding="3px 10px">
                    <TagLabel>{o}</TagLabel>
                    <TagCloseButton onClick={()=>setSelectedIngredients(selectedIngredients.filter(item => item !== o))} />
                  </Tag>
                ))}
              </Flex>
            </>}
          </Box>
          <Flex flexWrap="wrap" gap="4" justifyContent="space-between">
            {recipes && recipes.map((o:any,i:number)=>(
              <Flex position="relative" onMouseOver={()=>setMissingHover(o.title)} onMouseOut={()=>setMissingHover("")} bg="white" flexDir="column" width="170px" height="180px" alignItems="center" borderRadius="25px" p="15px" key={i} onClick={()=>handleRecipeInformation(o)} marginTop="50px" boxShadow="0px 5px 20px 0px rgba(0,0,0,0.3)" cursor="pointer">
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
            ))}
            {recipes.length < 1 && 
              <Flex flexDir="column" justifyContent="center" alignItems="center" width="100%" height="60vh">
                <Image src="/cart.png" alt="empty cart" width={200} height={200}/>
                <Heading as='h5' size='sm' paddingTop="15px">No Results ATM</Heading>
              </Flex>
            }
            {(recipeResults < 101 && recipes.length > 0) && <Button width="100%" backgroundColor="green.300" _hover={{backgroundColor:"green.400"}} padding="20px 0" textAlign='center' marginTop="20px" cursor="pointer" onClick={()=>handleRecipeSearch("MoreResults")}>Show More Results</Button>}
          </Flex>
        </Box>
      </Box>
    </main>
  );
}
