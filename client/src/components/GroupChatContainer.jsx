import React, { useEffect } from 'react'
import GroupChatHeader from './GroupChatHeader'
import { useChatStore } from '../store/useChatStore'

const GroupChatContainer = () => {
    const {getGroupMembers,selectedGroup}=useChatStore()
    useEffect(()=>{
    selectedGroup && getGroupMembers()
    },[])
  return (
    <div className='flex-1 flex flex-col overflow-auto sm:mx-15 mt-20'>
      <GroupChatHeader/>
    </div>
  )
}

export default GroupChatContainer
