'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import DcoumentHeader from './DcoumentHeader'
import DocumentInfo from './DocumentInfo'
import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import CommentBox from './CommentBox'

// Dynamically import RichDocumentEditor to prevent SSR issues
const RichDocumentEditor = dynamic(() => import('./RichDocumentEditor'), {
  ssr: false,
  loading: () => <div className="p-4">Loading editor...</div>
})

function DocumentEditorSection({ params }) {

  const [openComment, setOpenComment] = useState(false);
  return (
    <div className='relative'>
      {/* Header  */}
      <DcoumentHeader />

      {/* Document Info  */}
      <DocumentInfo params={params} />

      {/* Rich Text Editor  */}
 
        <RichDocumentEditor params={params} />
 
      <div className='fixed right-10 bottom-10 '>
        <Button onClick={() => setOpenComment(!openComment)}>
          {openComment ? <X /> : <MessageCircle />} </Button>
        {openComment && <CommentBox />}
      </div>
    
    </div>
  )
}

export default DocumentEditorSection