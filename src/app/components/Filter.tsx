"use client"
import Image from "next/image";
import { Button, Menu, MenuList, MenuButton, MenuOptionGroup, MenuItemOption } from '@chakra-ui/react'
import React from "react"
import FilterData from "../../../public/filter.json"
import { ChevronDownIcon } from '@chakra-ui/icons'

interface Filter {
  [key: string]: {
    title: string;
    list: string[];
  };
}

const Filter: Filter = FilterData;

export default function FilterCard({type="mealType", stateArray, handleSelected=()=>{}, settingState}:{type:string, stateArray:any, handleSelected:Function, settingState:any}) {

  return (
    <Menu>
      <MenuButton size='sm' as={Button} rightIcon={<ChevronDownIcon />}>{Filter[type].title}</MenuButton>
      <MenuList height="245px" overflowY="scroll">
        <MenuOptionGroup type="checkbox">
          {Filter[type].list.map((o,i)=>(
            <MenuItemOption key={i} value={o} isChecked={stateArray.includes(o)} onClick={() => handleSelected(o, settingState, stateArray)} closeOnSelect={false} textTransform="capitalize">{o}</MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
