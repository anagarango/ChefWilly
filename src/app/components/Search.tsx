import { Flex, Box, Input, ScaleFade, Button, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import IngredientList from "../../../public/ingredients.json"
import Colors from "../../../public/colors.json"

export default function Search({ingredient, ingredientData, setIngredientData, setIngredient, handleAddingIngredients, selectedIngredients, children, handleRecipeSearch, setSelectedIngredients}:{ingredient:string, ingredientData:string, setIngredientData:Function, setIngredient:Function, handleAddingIngredients:Function, selectedIngredients:string[], children?:any, handleRecipeSearch:Function, setSelectedIngredients:Function}){
  return (
    <Flex flexDirection="column" bg="white" p="4" borderRadius="25px" boxShadow="0px 5px 10px 0px rgba(0,0,0,0.3)">
      <Box width="100%">
        <Flex marginBottom={5} gap="3" position="relative">
          <Input id="ingredient-selection" type="text" autoComplete="off" size='sm' variant='filled' bgColor={Colors.mediumOrange} placeholder='Insert Ingredients...' value={ingredient} onChange={(e)=>setIngredient(e.target.value)} onClick={()=>setIngredientData("acorn squash")} borderRadius="5px"/>
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
        <Flex id="filter-card-box-outer" gap="5" justifyContent="space-between">
          {children}
          <Button size='sm' color="white" bgColor={Colors.strongOrange} _hover={{bgColor:Colors.mediumOrange, color:"black"}}  onClick={()=>handleRecipeSearch("NewRecipes")}>Search Recipes</Button>
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
  )
}