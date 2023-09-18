import { useUser } from "@clerk/nextjs";
import { Content, Overlay, Portal, Root, Title, Trigger } from "@radix-ui/react-dialog"
import { type ChangeEventHandler, useState } from "react";

import { ProfileImage } from "./profile-image";
import { api } from "~/utils/api";

export const CreatePostWizard = () => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useUser()
  const ctx = api.useContext()
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setValue("")
      setOpen(false)
      void ctx.posts.getAll.invalidate()
    }
  });

  const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setValue(event.target.value)
  }

  const handleOpenChange = () => {
    setValue('');
    setOpen((value) => !value);
  }

  const handleSubmit = () => {
    mutate({ content: value })
  }

  if (!user) return null;
  const { imageUrl, username } = user;

  return (
    <Root open={open} onOpenChange={handleOpenChange} >
      <div className="flex w-full gap-2">
        <ProfileImage src={imageUrl} />
        <Trigger className="cursor-text w-full text-slate-500 text-start focus:outline-none">
          Type some emojis!! <span className="font-['Apple_Color_Emoji']">☺</span>️
        </Trigger>
        <button className="ml-auto rounded border border-slate-600 text-slate-500 px-4 py-1" disabled type="button">Post</button>
      </div>
      <Portal>
        <Overlay className="fixed inset-0 bg-opacity-60 bg-slate-800" />
        <Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[calc(100vw-32px)] w-[620px] p-8 bg-slate-700 border border-slate-600 rounded-lg shadow-lg">
          <Title className="font-bold text-lg text-center">New Chirp</Title>
          <div className="flex items-start gap-2">
            <ProfileImage src={imageUrl} className="mt-2" />
            <div className="flex flex-col w-full">
              <p className="col-start-2 font-bold">{username}</p>
              <textarea
                className="col-start-2 w-full bg-transparent focus:outline-none resize-none font-['Apple_Color_Emoji'] text-2xl"
                placeholder="Type some emojis!!"
                rows={6}
                onChange={handleTextAreaChange}
                value={value}
                disabled={isPosting}
              />
            </div>
          </div>
          <button
            className="block ml-auto mt-4 rounded border px-4 py-1 border-slate-500 disabled:text-slate-500"
            type="button"
            disabled={value.length === 0 || isPosting}
            onClick={handleSubmit}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </Content>
      </Portal>
    </Root>
  )
}