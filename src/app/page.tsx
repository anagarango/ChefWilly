"use client"
import Image from "next/image";
import { Button, Box, Heading, Flex, Text, Input, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react'
import axios from "axios";
import React, {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import FilterCard from "./components/Filter"


interface RecipeCard {
  id: number,
  title: string,
  image: string,
  imageType: string
}

export default function Home() {
  const r = useRouter()

  const [recipes, setRecipes] = useState<object[]>([])
  const [missingHover, setMissingHover] = useState<string>("")
  const [ingredient, setIngredient] = useState<string>("")
  const [recipeResults, setRecipeResults] = useState<number>(20)
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])



  const handleRecipeSearch = async () => {
    setIsLoading(true);
    const response = await axios.get(` https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&includeIngredients=${selectedIngredients.join(",")}&type=${selectedMealTypes.join(",")}&cuisine=${selectedCuisines.join(",")}&intolerances=${selectedIntolerances.join(",")}&number=${recipeResults}&sort=min-missing-ingredients&fillIngredients=true`)
    const result = await response.data
    setRecipes(prevItems => [...prevItems, ...result.results]);
    setRecipeResults(prevPage => prevPage + 20);
    setIsLoading(false);
  }

  const handleRecipeInformation = async (recipe:RecipeCard) => {
    r.push(`/recipe?title=${recipe.title}&id=${recipe.id}`)
  }

  const handleMenuSelect = (option:string, settingState:any, state:any) => {
    if (state.includes(option)) {
      settingState(selectedMealTypes.filter(item => item !== option));
    } else {
      settingState([...state, option]);
    }
  };

  const handleAddingIngredients = () => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
    setIngredient("")
  }





  const handleScroll = () => {
    if ((window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) && recipes.length > 1) {
      return;
    }
    if(recipeResults < 101){
      handleRecipeSearch();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);


  return (
    <main>
      <Box bg="#E7E2DF" px="20px" py="7px" >
        <Heading as='h4' size='md' onClick={()=>console.log(recipes)}>Chef Willy</Heading>
      </Box>
      <Box p="0rem 3rem">
        <Box p="40px">
          <Box bg="white" p="4" borderRadius="25px" boxShadow="0px 5px 20px 0px rgba(0,0,0,0.3)">
            <Flex width="100%" justifyContent="space-between">
              <Flex gap="3">
                <Input size='sm' variant='filled' placeholder='Insert Ingredients...' value={ingredient} onChange={(e)=>setIngredient(e.target.value)} borderRadius="5px"/>
                <Button size='sm' colorScheme="green" onClick={()=>handleAddingIngredients()}>Add</Button>
              </Flex>
              <Flex gap="3">
                <FilterCard type="mealType" stateArray={selectedMealTypes} handleSelected={handleMenuSelect} settingState={setSelectedMealTypes}/>
                <FilterCard type="cuisines" stateArray={selectedCuisines} handleSelected={handleMenuSelect} settingState={setSelectedCuisines}/>
                <FilterCard type="intolerances" stateArray={selectedIntolerances} handleSelected={handleMenuSelect} settingState={setSelectedIntolerances}/>
                <Button size='sm' colorScheme='blue' onClick={()=>handleRecipeSearch()}>Search Recipes</Button>
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
              <Flex position="relative" onMouseOver={()=>setMissingHover(o.title)} onMouseOut={()=>setMissingHover("")} bg="white" flexDir="column" width="170px" height="180px" alignItems="center" borderRadius="25px" p="15px" key={i} onClick={()=>handleRecipeInformation(o)} marginTop="50px" boxShadow="0px 5px 20px 0px rgba(0,0,0,0.3)">
                <Image src={o.image} alt={o.title} width={200} height={200} style={{width:"125px", height:"125px", borderRadius:"50%", objectFit:"cover", marginTop:"-50px"}}/>
                <Text wordBreak="normal" textAlign="center" paddingY="15px" fontSize="sm">{o.title}</Text>
                {missingHover == o.title && 
                  <Box position="absolute" bg="rgba(255,255,255,0.9)" width="170px" height="180px" top="0" borderRadius="25px" p="15px" overflowY="scroll">
                    <Text fontWeight="bold" wordBreak="normal" textAlign="center">Missing Ingredients:</Text>
                    <ol style={{padding:"0 0 0 35px"}}>
                      {o.missedIngredients.map((o:any,i:number)=>(
                        <li key={i} style={{transitionDuration:"0.3s", fontWeight:"500"}}>{o.name}</li>
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
            {isLoading && <Heading style={{width:"100%", backgroundColor:"lightgreen", padding:"20px 0", position:'fixed', bottom:0, left:0, textAlign: 'center'}}>Loading...</Heading>}
          </Flex>
        </Box>
      </Box>
    </main>
  );
}
