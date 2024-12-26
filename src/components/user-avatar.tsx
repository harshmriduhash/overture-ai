import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar() {
  const { user } = useUser();

  return (
    <Avatar className="h-7 w-7">
      <AvatarImage src={user?.imageUrl} />
    </Avatar>
  );
}
