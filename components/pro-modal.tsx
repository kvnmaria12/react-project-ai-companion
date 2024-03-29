'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProModal } from '@/hooks/use-pro-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { tools } from '@/app/(dashboard)/(routes)/dashboard/page';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProModal = () => {
  const proModal = useProModal();

  const { isOpen, onClose } = proModal;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex justify-center items-center flex-col gap-y-4 pb-2'>
              <div className='flex items-center gap-x-2 font-bold py-1'>
                Upgrade to Genius
                <Badge variant='premium' className='uppercase text-sm py-1'>
                  Pro
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription className='text-center pt-2 space-y-2 text-zinc-900 font-medium'>
              {tools.map((tool) => (
                <Card
                  key={tool.href}
                  className='p-3 border-black/5 flex items-center justify-between'
                >
                  <div className='flex items-center gap-x-4'>
                    <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                      <tool.icon className={cn('w-6 h-6', tool.color)} />
                    </div>
                    <div className='font-semibold text-sm'>{tool.label}</div>
                  </div>
                  <Check className='text-primary w-5 h-5' />
                </Card>
              ))}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              //   disabled={loading}
              //   onClick={onSubscribe}
              size='lg'
              variant='premium'
              className='w-full'
            >
              Upgrade
              <Zap className='w-4 h-4 ml-2 fill-white' />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProModal;
