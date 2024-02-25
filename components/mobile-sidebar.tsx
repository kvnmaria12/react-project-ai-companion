'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import SideBar from '@/components/sidebar';
import { useState, useEffect } from 'react';

const wait = () => new Promise((resolve) => setTimeout(resolve, 1500));

interface Props {
  apiLimitCount: number;
  // isPro: boolean;
}

const MobileSidebar = ({ apiLimitCount = 0 }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden'
          onClick={(e) => {
            wait().then(() => setOpen(false));
          }}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0'>
        <SideBar apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
