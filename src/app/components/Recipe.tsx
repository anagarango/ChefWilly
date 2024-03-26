import { Flex,Image, Text, Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ViewIcon, CloseIcon } from "@chakra-ui/icons";
import { MouseEventHandler } from "react";
import axios from "axios";
import Colors from "../../../public/colors.json"

interface Recipe {
  id: number,
  title: string,
  image: string,
  imageType: string,
  missedIngredients: any[]
}

export default function RecipeCard({arrayObject, relatedRecipes, arrayKey, typeHover="missingIngredients", viewRecipe, deleteRecipe}:{arrayObject:Recipe, relatedRecipes?:string, arrayKey:number, typeHover?:string, viewRecipe?:MouseEventHandler<SVGElement>, deleteRecipe?:MouseEventHandler<SVGElement>}){
  const r = useRouter()
  const [missingHover, setMissingHover] = useState("")


  const handleRecipeInformation = async (recipe:Recipe) => {
    if(relatedRecipes){
      localStorage.setItem("relatedRecipes", relatedRecipes)
    }
    
    r.push(`/recipe?title=${recipe.title}&id=${recipe.id}`)
  }

  return (
    <Flex id="what" position="relative" onMouseOver={()=>setMissingHover(arrayObject.title)} onMouseOut={()=>setMissingHover("")} bg="white" flexDir="column" width="170px" height="180px" alignItems="center" borderRadius="25px" p="15px" key={arrayKey} onClick={()=>typeHover=="missingIngredients" &&  handleRecipeInformation(arrayObject)} marginTop="50px" boxShadow="0px 5px 10px 0px rgba(0,0,0,0.3)" cursor={typeHover=="missingIngredients" ? "pointer" : ""}>
      <Image src={arrayObject.image} alt={arrayObject.title} width={200} height={200} style={{width:"125px", height:"125px", borderRadius:"50%", objectFit:"cover", marginTop:"-50px"}}/>
      <Text wordBreak="normal" textAlign="center" paddingY="15px" fontSize="sm">{arrayObject.title}</Text>
      {missingHover == arrayObject.title && 
        <Box position="absolute" bg="rgba(255,255,250,0.9)" width="170px" height="180px" top="0" borderRadius="25px" p="15px" overflowY="scroll">
          {typeHover == "missingIngredients" && <>
            <Text fontWeight="bold" wordBreak="normal" textAlign="center" fontSize="sm">Missing Ingredients:</Text>
            <ol style={{padding:"0 0 0 35px"}}>
              {arrayObject.missedIngredients && arrayObject.missedIngredients.map((o:any,i:number)=>(
                <li key={i} style={{fontWeight:"500", fontSize:"13px"}}>{o.name}</li>
              ))}
            </ol>
          </>}
          {typeHover == "cookbookView" && <>
            <Flex flexDirection="column" width="100%" height="100%" p="15px" justifyContent="space-between" alignItems="center">
              <ViewIcon cursor="pointer" boxSize={7} color={Colors.strongRed} onClick={viewRecipe} />
              <CloseIcon cursor="pointer" boxSize={5} color={Colors.strongRed} onClick={deleteRecipe} />
            </Flex>
          </>}
         
        </Box>
      }
    </Flex>
  )
}