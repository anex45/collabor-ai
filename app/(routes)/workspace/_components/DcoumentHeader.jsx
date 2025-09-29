import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React from 'react'
import { toast } from 'sonner'

function DcoumentHeader() {

  const shareDocument = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        toast.success('Document link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  return (
    <div className='flex justify-between items-center p-3 px-7 shadow-md'>
        <div></div>
        <OrganizationSwitcher/>
        <div className='flex gap-2'>
            <Button onClick={shareDocument}>Share</Button>
            <UserButton/>
        </div>
    </div>
  )
}

export default DcoumentHeader