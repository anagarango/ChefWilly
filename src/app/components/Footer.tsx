import { useRouter, usePathname } from "next/navigation"
import Image from 'next/image'
// import FeedbackForm from "./FeedbackForm"
import UserForm from "./UserForm"
// import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Button, Flex, Heading, Text, Box, Img } from "@chakra-ui/react"
import Colors from "../../../public/colors.json"
import Link from "next/link"

export default function Footer(){

  const currentYear = new Date().getFullYear()

  return(
    <Flex paddingBottom={4} paddingTop={16} w="100%" maxW="1100px" alignItems="center" justifyContent="space-between">
      <Heading as='h6' size='sm'>©{currentYear} ChefWilly</Heading>
      <Flex gap={3}>
        <a href="https://www.linkedin.com/in/anagarango/" target="_blank">
          <Image src="/linkedin.png" alt="linkedin" width={25} height={25} />
        </a>
        <a href="https://github.com/anagarango" target="_blank">
          <Image src="/github.png" alt="github" width={25} height={25} />
        </a>
        <a href="https://anagarango.starbooks.ca" target="_blank">
          <Image src="/portfolio.png" alt="portfolio" width={25} height={25} />
        </a>
      </Flex>
    </Flex>
  )
}