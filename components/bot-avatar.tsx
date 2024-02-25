import { Avatar, AvatarImage } from '@/components/ui/avatar';

const BotAvatar = () => {
  return (
    <Avatar>
      <AvatarImage className='p-1' src='/logo.png' />
    </Avatar>
  );
};

export default BotAvatar;
