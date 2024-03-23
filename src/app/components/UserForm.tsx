import { useState, useRef, use } from "react";
import Image from "next/image";
import axios from "axios";
import { Flex, FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Heading, Text, Button, Input } from "@chakra-ui/react";

export default function LogIn({showModal, closeFeedback = () => {}, currentUserId = () => {} }: { showModal: string; closeFeedback?: Function, currentUserId?: Function }){
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [idleEmail, setIdleEmail] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<string>("login");
  const [warning, setWarning] = useState<boolean>(false);

  async function submitForm(e: any) {
    e.preventDefault();
    setIdleEmail(true);
    var email = emailRef?.current?.value;
    var password = passwordRef?.current?.value;
    var username = usernameRef?.current?.value;
  
    // if (!email || !password) {
    //   setWarning(true);
    //   return;
    // }
  
    var response = null
  
    if (formMode == "login") {
      response = await axios({
        method: 'get',
        url: `/api/user?email=${email}&password=${password}`,
      });
    } else {
      response = await axios({
        method: 'post',
        url: "/api/mysql/user",
        data: {
          username: username,
          email: email,
          password: password
        }
      });
    }
  
    const messageData = await response.data;
  
    if (messageData.message) {
      sessionStorage.setItem("currentUser", JSON.stringify(messageData.message));
      currentUserId(messageData.message);
      setWarning(false);
      closeFeedback(false);
      window.location.reload();
    } else {
      setWarning(true);
    }
  
    emailRef.current!.value = "";
    passwordRef.current!.value = "";
    setIdleEmail(false);
    
  }

  return (
    <>
      {showModal == "login" &&
        <Flex id="feedback" w="100vw" h="100vh" position="absolute" zIndex="10" top="0" bgColor="rgba(0,0,0,0.6)" justifyContent="center" alignItems="center">
          <FormControl isInvalid={warning} onSubmit={(e) => submitForm(e)} w="75%" display="flex" bgColor="white" borderRadius="10" p="5" maxW="1100px">
            <Box w="100%">
              <Heading>{formMode == "login" ? "Welcome Back!":"Join FictiChat!"}</Heading>
              <Text>Please enter your details</Text>
              <Box bgColor="lightgray" w="100%" p="1" borderRadius="10" marginY="4">
                <Button p="2" w="50%" transitionDuration="500" bgColor={formMode == "login" ? "white" : "lightgray"} color={formMode == "login" ? "black" : "gray"} onClick={()=>{setFormMode("login"); setWarning(false)}}>Sign In</Button>
                <Button p="2" w="50%" transitionDuration="500" bgColor={formMode !== "login" ? "white" : "lightgray"} color={formMode !== "login" ? "black" : "gray"}  onClick={()=>{setFormMode("signup"); setWarning(false)}}>Sign Up</Button>
              </Box>
              {formMode !== "login" && <Input type="text" bgColor="#D9F3EB" p="2" w="100%" borderRadius="10" marginY="1" placeholder="Username:" required ref={usernameRef} />}
              <Input type="email" bgColor="#D9F3EB" p="2" w="100%" borderRadius="10" marginY="1" placeholder="Email:" required ref={emailRef} />
              <Input type="password" placeholder="Password:" bgColor="#D9F3EB" p="2" w="100%" borderRadius="10" marginY="1" required ref={passwordRef}></Input>
              <Text className={`text-red-600 pt-3 ${warning ? "visible" : "invisible"}`}>{warning}</Text>
              <Flex justifyContent="flex-end" gap="3" paddingTop="5">
                <Button onClick={(e:any)=>submitForm(e)} type="submit" disabled={idleEmail} bgColor="#50A98D" color="white" p="2">{idleEmail ? <Image alt="loading gif" src="/spinner.svg" width={70} height={70} className="w-[50px] h-5" /> : "Submit"}</Button>
                <Button onClick={() => {closeFeedback(false); setWarning(false)}} color="#50A98D" bgColor="lightgray" p="2">Cancel</Button>
              </Flex>
            </Box>
          </FormControl>
        </Flex>
      }
    </>
  );
}