import { Flex,Image, Text, Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ViewIcon, CloseIcon } from "@chakra-ui/icons";
import { MouseEventHandler } from "react";
import Colors from "../../../public/colors.json"
import Link from 'next/link'

interface Recipe {
  id: number,
  title: string,
  image: string,
  imageType: string,
  missedIngredients: any[]
}

export default function RecipeCard({arrayObject, relatedRecipes, cookbookRecipes, arrayKey, typeHover="missingIngredients", viewRecipe, deleteRecipe}:{arrayObject:Recipe, relatedRecipes?:string, cookbookRecipes?: string, arrayKey:number, typeHover?:string | boolean, viewRecipe?:MouseEventHandler<SVGElement>, deleteRecipe?:MouseEventHandler<SVGElement>}){
  const r = useRouter()
  const [missingHover, setMissingHover] = useState("")


  const handleRecipeInformation = async () => {
    if(relatedRecipes){
      localStorage.setItem("relatedRecipes", relatedRecipes)
    } else if(cookbookRecipes){
      localStorage.setItem("cookbookRecipes", cookbookRecipes)
    }
  }

  return (
    <Link id="recipe-card" key={arrayKey} href={{
      pathname: typeHover == "cookbookView" ? "/cookbook" : '/recipe',
      query: typeHover == "cookbookView" ? {} :  { title: arrayObject.title, id: arrayObject.id }
    }} onMouseOver={()=>setMissingHover(arrayObject.title)} onMouseOut={()=>setMissingHover("")} onClick={()=>{typeHover=="cookbookView" ? console.log("Hey") : handleRecipeInformation()}} style={{display:"flex", position:"relative", backgroundColor:"white", flexDirection:"column", width:"145px", height:"145px", alignItems:"center", borderRadius:"25px", padding:"12px", marginTop:"50px", boxShadow:"0px 5px 10px 0px rgba(0,0,0,0.3)", cursor:(typeHover=="missingIngredients" || typeHover==false) ? "pointer" : "default"}}>
      <Image id="recipe-card-image" src={arrayObject.image} alt={arrayObject.title} width={200} height={200} style={{width:"115px", height:"115px", borderRadius:"50%", objectFit:"cover", marginTop:"-50px"}}/>
      <Text fontWeight="600" wordBreak="normal" textAlign="center" paddingY="15px" fontSize="xs">{arrayObject.title}</Text>
      {(typeHover && missingHover == arrayObject.title) && 
        <Box position="absolute" bg="rgba(255,255,250,0.9)" width="145px" height="145px" zIndex="50" top="0" borderRadius="25px" p="12px" overflowY="scroll">
          {typeHover == "missingIngredients" && <>
            <Text fontWeight="bold" wordBreak="normal" textAlign="center" fontSize="xs">Missing Ingredients:</Text>
            <ol style={{padding:"0 0 0 20px"}}>
              {arrayObject.missedIngredients && arrayObject.missedIngredients.map((o:any,i:number)=>(
                <li key={i} style={{fontWeight:"500", fontSize:"12px"}}>{o.name}</li>
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
    </Link>
  )
}