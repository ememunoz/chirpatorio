import { useUser } from "@clerk/nextjs";
import {
  Content,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import { useState } from "react";
import type { ChangeEventHandler, KeyboardEventHandler } from "react";

import { ProfileImage } from "./profile-image";
import { Toast } from "./toast";

export const CreatePostWizard = () => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [inputError, setInputError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setValue("");
      setInputError("");
      setOpen(false);
      void ctx.posts.getAll.invalidate();
    },
    onError: (error) => {
      const errorCode = error.data?.code;
      const errorMessage = error.data?.zodError?.fieldErrors.content;
      if (!errorCode || !errorMessage) {
        return setShowToast(true);
      }
      if (
        errorCode === "BAD_REQUEST" &&
        errorMessage.includes("Invalid emoji")
      ) {
        return setInputError(
          "Hey there! 😊 Please use only emojis in this input. 🚀",
        );
      }
      if (
        errorCode === "BAD_REQUEST" &&
        errorMessage.includes("String must contain at most")
      ) {
        return setInputError(
          "Oops! 😅 Your emoji message is too long. Please keep it under 280 characters. 📝",
        );
      }
      if (errorCode === "TOO_MANY_REQUESTS") {
        return setInputError(
          "Whoa! 😅 Slow down a bit! You've sent too many emoji requests in a short time. Please try again in a moment. 🕒",
        );
      }
      return setShowToast(true);
    },
  });

  const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setValue(event.target.value);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (value.length <= 0) return;
    if (event.key === "Enter") {
      event.preventDefault();
      mutate({ content: value });
    }
  };

  const handleOpenChange = () => {
    setValue("");
    setInputError("");
    setOpen((value) => !value);
  };

  const handleSubmit = () => {
    mutate({ content: value });
  };

  if (!user) return null;
  const { imageUrl, username } = user;

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <div className="flex w-full gap-2">
        <ProfileImage src={imageUrl} />
        <Trigger className="w-full cursor-text text-start text-slate-500 focus:outline-none">
          Type some emojis!!{" "}
          <span className="font-['Apple_Color_Emoji']">☺</span>️
        </Trigger>
        <button
          className="ml-auto rounded border border-slate-600 px-4 py-1 text-slate-500"
          disabled
          type="button"
        >
          Post
        </button>
      </div>
      <Portal>
        <Overlay className="fixed inset-0 bg-slate-800 bg-opacity-60" />
        <Content className="fixed left-1/2 top-1/2 w-[620px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-600 bg-slate-700 p-8 shadow-lg">
          <Title className="text-center text-lg font-bold">New Chirp</Title>
          <div className="flex items-start gap-2">
            <ProfileImage src={imageUrl} className="mt-2" />
            <div className="flex w-full flex-col">
              <p className="col-start-2 font-bold">{username}</p>
              <textarea
                className="col-start-2 w-full resize-none bg-transparent font-['Apple_Color_Emoji','Helvetica',Arial,sans-serif] text-2xl focus:outline-none"
                placeholder="Type some emojis!!"
                rows={6}
                onChange={handleTextAreaChange}
                onKeyDown={handleKeyDown}
                value={value}
                disabled={isPosting}
              />
              {inputError && <p>{inputError}</p>}
            </div>
          </div>
          <button
            className="ml-auto mt-4 block rounded border border-slate-500 px-4 py-1 disabled:text-slate-500"
            type="button"
            disabled={value.length === 0 || isPosting}
            onClick={handleSubmit}
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </Content>
      </Portal>
      <Toast
        open={showToast}
        onOpenChange={setShowToast}
        title="Error"
        bodySlot="Something unexpected happened. Please try again later"
      />
    </Root>
  );
};
