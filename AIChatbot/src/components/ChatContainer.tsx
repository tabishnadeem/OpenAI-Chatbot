import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setLoading } from "../redux/loaderSlice";
import { setConversation } from "../redux/conversationThreadSlice";

export default function ChatContainer(props: any) {
  const [error, setError] = useState<any>();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loader.value);
  const conversationData = useSelector((state: RootState) => state.convoThread);
  const conversationThread = useSelector(
    (state: RootState) => state.convoThread.messages
  );

  useEffect(() => {
    setError("")
    // if last data inside conversationThread is not assistant, then only fetch data
    if (
      conversationThread[conversationThread.length - 1].role !== "assistant"
    ) {
      fetchChat().then((chatData) => {
        dispatch(setLoading(false));
        const assistantMessage = {
          role: "assistant",
          content: chatData?.data.choices[0].message.content,
        };
        dispatch(setConversation([...conversationThread, assistantMessage]));
        console.log("chatData", chatData?.data.choices[0].message.content);
      });
    }
  }, [loading]);

  const fetchChat = async () => {
    try {
      return await axios.post(
        "https://api.openai.com/v1/chat/completions",
        conversationData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      dispatch(setLoading(false));
      setError(error);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-10">
        {conversationThread.slice(1).map((thread: any, index: number) => (
          <>
            {/* start */}
            <div
              key={index}
              className={`w-full chat chat-${
                thread.role === "assistant" ? "start" : "end"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              {thread.role === "assistant" && !error ? (
                <>
                  <div className="chat-header">Bot</div>
                  <div className="chat-bubble">{thread.content}</div>
                </>
              ) : (
                <>
                  <div className="chat-header">User</div>

                  <div className="chat-bubble text-start">{thread.content}</div>
                </>
              )}
            </div>
            {/* end */}
          </>
        ))}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <div className="chat-header">Bot</div>
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}

        {error && (
          <div
            id="alert-additional-content-2"
            className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <h3 className="text-md font-medium">
                There was an issue generating Response
              </h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
