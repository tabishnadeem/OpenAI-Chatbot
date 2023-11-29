
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IMessage{
    role:string,
    content?:string
}
interface IConvoThread {
    model?:string,
    messages:IMessage[]
}



const initialState = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      }
    ],
  };

export const conversationThread = createSlice({
    name: 'convoThreadSlice',
    initialState,
    reducers: {
        setConversation: (state:IConvoThread, action:PayloadAction<IMessage[]>) => {
            state.messages = action.payload;
        }
       
    }
});

export const {setConversation} = conversationThread.actions;
export default conversationThread.reducer;