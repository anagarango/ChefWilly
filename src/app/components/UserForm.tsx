import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Flex, FormControl, Box, Heading, Text, Button, Input, Spinner, useToast } from "@chakra-ui/react";
import Colors from "../../../public/colors.json"

export default function LogIn({showModal, closeFeedback = () => {}, currentUserId = () => {} }: { showModal: string; closeFeedback?: Function, currentUserId?: Function }){
  const toast = useToast()
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [idleEmail, setIdleEmail] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<string>("login");
  const [toastMessage, setToastMessage] = useState<any>();

  async function submitForm(e: any) {
    e.preventDefault();
    setIdleEmail(true);
    var email = emailRef?.current?.value;
    var password = passwordRef?.current?.value;
    var username = usernameRef?.current?.value;
  
  
    var response = null
  
    if (formMode == "login") {
      response = await axios({
        method: 'get',
        url: `/api/user?email=${email}&password=${password}`,
      });
    } else {
      response = await axios({
        method: 'post',
        url: "/api/user",
        data: {
          username: username,
          email: email,
          password: password
        }
      });
    }
  
    const messageData = await response.data;

    if(messageData.message){
      setToastMessage(messageData.message)
    }
  
    if (messageData[0]) {
      sessionStorage.setItem("currentUser", JSON.stringify(messageData[0]));
      currentUserId(messageData[0]);
      closeFeedback(false);
      window.location.reload();
    }
  
    emailRef.current!.value = "";
    passwordRef.current!.value = "";
    setIdleEmail(false);
    
  }

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
    <>
      {showModal == "login" &&
        <Flex id="feedback" w="100vw" h="100vh" position="absolute" zIndex="10" top="0" bgColor="rgba(0,0,0,0.6)" justifyContent="center" alignItems="center">
          <FormControl onSubmit={(e) => submitForm(e)} w="75%" display="flex" bgColor="white" borderRadius="10" p="10" maxW="1100px">
            <Box w="100%">
              <Heading>{formMode == "login" ? "Welcome Back!":"Join FictiChat!"}</Heading>
              <Text>Please enter your details</Text>
              <Box bgColor="lightgray" w="100%" p="1" borderRadius="10" marginY="4">
                <Button p="1" w="50%" fontSize="sm" transitionDuration="500" bgColor={formMode == "login" ? "white" : "lightgray"} color={formMode == "login" ? "black" : "gray"} onClick={()=>{setFormMode("login")}}>Sign In</Button>
                <Button p="1" w="50%" fontSize="sm" transitionDuration="500" bgColor={formMode !== "login" ? "white" : "lightgray"} color={formMode !== "login" ? "black" : "gray"}  onClick={()=>{setFormMode("signup")}}>Sign Up</Button>
              </Box>
              {formMode !== "login" && <Input fontSize="sm" type="text" bgColor={Colors.mediumOrange} p="2" w="100%" borderRadius="10" marginY="1" placeholder="Username:" required ref={usernameRef} />}
              <Input fontSize="sm" type="email" bgColor={Colors.mediumOrange} p="2" w="100%" borderRadius="10" marginY="1" placeholder="Email:" required ref={emailRef} />
              <Input fontSize="sm" type="password" placeholder="Password:" bgColor={Colors.mediumOrange} p="2" w="100%" borderRadius="10" marginY="1" required ref={passwordRef}></Input>
              <Flex justifyContent="flex-end" gap="3" paddingTop="5">
                <Button onClick={(e:any)=>submitForm(e)} type="submit" disabled={idleEmail} bgColor={Colors.strongOrange} color="white" p="2">{idleEmail ? <Spinner />: "Submit"}</Button>
                <Button onClick={() => closeFeedback(false)} color={Colors.strongOrange} bgColor="lightgray" p="2">Cancel</Button>
              </Flex>
            </Box>
          </FormControl>
        </Flex>
      }
    </>
  );
}