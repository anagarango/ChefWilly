import { useRouter, usePathname } from "next/navigation"
import Image from 'next/image'
// import FeedbackForm from "./FeedbackForm"
import UserForm from "./UserForm"
// import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Button, Flex, Heading, Text, Box } from "@chakra-ui/react"
import Colors from "../../../public/colors.json"
import Link from "next/link"

interface SessionStorage {
  id:number,
  username:string,
  password:string,
  createdAt:string,
  email:string
}

interface ColorHeader {
  bg: string,
  text: string
}

export default function Header({currentUser, setCurrentUserId=()=>{}, setCurrentHomeTheme, color}:{currentUser:SessionStorage | string, setCurrentUserId:Function, setCurrentHomeTheme?:Function, color:ColorHeader}){
  const r = useRouter()
  const p = usePathname()

  // const { resolvedTheme, setTheme } = useTheme()
  const [switchTheme, setSwitchTheme] = useState<string | undefined>("")
  const [currentPage, setCurrentPage] = useState<string>()
  const [viewModal, setViewModal] = useState<string>("")
  const [showMenu, setShowMenu] = useState<string>("0")

  // useEffect(() => {
  //   setSwitchTheme(resolvedTheme)
  //   if(setCurrentHomeTheme){
  //     setCurrentHomeTheme(resolvedTheme)
  //   }
  // }, [resolvedTheme, setCurrentHomeTheme])

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedUser = sessionStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUserId(JSON.parse(storedUser));

        }
        if(!storedUser && p == "/chat"){
          setViewModal("login")
        }
      } catch (error) {
        console.log(error)
      }
    };

    const fetchCurrentPage = async () => {
      try {
        if (p == "/chat") {
          setCurrentPage("/characters");
        } else {
          setCurrentPage(p)
        }
      } catch (error) {
        console.log(error)
      }
    };
  
    fetchCurrentUser();
    fetchCurrentPage();
  }, [])

  // const toggleTheme = () => {
  //   if(switchTheme == "light"){
  //     setSwitchTheme("dark")
  //     setTheme("dark")
  //     if (setCurrentHomeTheme) {
  //       setCurrentHomeTheme("dark");
  //     }
  //   } else {
  //     setSwitchTheme("light")
  //     setTheme("light")
  //     if (setCurrentHomeTheme) {
  //       setCurrentHomeTheme("dark");
  //     }
  //   }
  // }

  const logOut = () => {
    localStorage.removeItem("relatedRecipes")
    localStorage.removeItem("cookbookRecipes")
    sessionStorage.removeItem("currentUser")
    
    r.push("/")
    window.location.reload();
  }

  const GrabAllUsersChats = async (e:SessionStorage) =>{
    setCurrentUserId(e)
    sessionStorage.getItem("currentUser")
  }

  const handleCurrentPage = (page:string) => {
    setCurrentPage(page)
    r.push(page)
  }

  return(
    <>
    <Flex id="header"py={3} w="100%" maxW="1100px" justifyContent="space-between">
      <Flex alignItems="center" gap="4">
        <Image alt="fictichat logo" width={100} height={100} onClick={()=>handleCurrentPage("/")} style={{width:"125px", cursor:"pointer"}} src="/ChefWilly.svg"/>
        {currentUser && <>
          <Link id="header-desktop" href={{ pathname: '/cookbook'}} onClick={()=>setCurrentPage("/cookbook")} style={{fontWeight:"bold", color:currentPage == "/cookbook" ? "black" : "#989898", fontSize:"14px"}}>Cookbook</Link>
          <Link id="header-desktop" href={{ pathname: '/ingredients'}} onClick={()=>setCurrentPage("/ingredients")} style={{fontWeight:"bold", color:currentPage == "/ingredients" ? "black" : "#989898", fontSize:"14px"}}>Ingredients</Link>
        </>}
      </Flex>
      
      <Flex id="header-desktop" className='flex gap-4 items-center'>
        {/* <Image alt={switchTheme || "icon"} onClick={()=>{toggleTheme()}} src={switchTheme == "light" ? "/dark.png" : "/light.png"} width={10} height={10} className="flex w-auto h-[25px] cursor-pointer"/> */}
        <Button size={"sm"} bg={color.bg} color={color.text} _hover={{bgColor:"white"}} onClick={()=>{currentUser ? logOut() : setViewModal("login")}}>{currentUser ? "Sign Out": "Sign In"}</Button>
      </Flex>

      <div id="header-mobile" className='flex gap-4 items-center'>
        {/* <Image alt={switchTheme || "icon"} onClick={()=>{toggleTheme()}} src={switchTheme == "light" ? "/dark.png" : "/light.png"} width={10} height={10} className="flex w-auto h-[25px] cursor-pointer"/> */}
        <Image alt="menu icon" onClick={()=>{setShowMenu(showMenu == "0" ? "100" : "0" )}} src="/menu.png" width={22} height={22} style={{cursor:"pointer"}} />
      </div>
      
          <Box id="header-mobile" flexDirection="column" position="absolute" right={0} bg="lightgray" transitionDuration="0.15s" top="10" zIndex="10" borderRadius={5} opacity={showMenu}>
          {currentUser && 
            <>
              <Link href={{ pathname: '/cookbook'}} onClick={()=>setCurrentPage("/cookbook")} style={{fontWeight:"bold", color:"black", fontSize:"14px", padding:"6px"}}>Cookbook</Link>
              <Link href={{ pathname: '/ingredients'}} onClick={()=>setCurrentPage("/ingredients")} style={{fontWeight:"bold", color:"black", fontSize:"14px", padding:"6px"}}>Ingredients</Link>
            </>
          }
          <Box borderTop="2px solid black" bg="lightgray" color="black" padding="6px" fontWeight="bolder" fontSize="14px" cursor="pointer" onClick={()=>{currentUser ? logOut() : setViewModal("login")}}>{currentUser ? "Sign Out": "Sign In"}</Box>
        </Box>
          
      
      
    </Flex>
    
    {/* {viewModal == "feedback" && <FeedbackForm showModal={viewModal} closeFeedback={setViewModal}/>} */}
    {viewModal == "login" && <UserForm showModal={viewModal} closeFeedback={setViewModal} currentUserId={(e:SessionStorage)=>GrabAllUsersChats(e)}/>}
    </>
  )
}