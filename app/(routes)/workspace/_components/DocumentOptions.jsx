import { Link2Icon, MoreVertical, PenBox, Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  
function DocumentOptions({doc,deleteDocument}) {

  const shareDocument = () => {
    // Generate the document URL using the current workspace and document ID
    const baseUrl = window.location.origin;
    const documentUrl = `${baseUrl}/workspace/${doc.workspaceId}/${doc.id}`;
    
    navigator.clipboard.writeText(documentUrl)
      .then(() => {
        toast.success('Document link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  return (
    <div>
       
        <DropdownMenu>
        <DropdownMenuTrigger>
            <MoreVertical className='h-4 w-4'/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            
            <DropdownMenuItem onClick={shareDocument} className="flex gap-2"> 
            <Link2Icon className='h-4 w-4'/> Share Link</DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2"> 
            <PenBox className='h-4 w-4'/>Rename</DropdownMenuItem>
            <DropdownMenuItem 
            onClick={()=>deleteDocument(doc?.id)}
            className="flex gap-2 text-red-500"> 
            <Trash2 className='h-4 w-4'/>Delete</DropdownMenuItem>
            
        </DropdownMenuContent>
        </DropdownMenu>

    </div>
  )
}

export default DocumentOptions