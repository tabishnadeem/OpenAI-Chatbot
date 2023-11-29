
import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/loaderSlice";
import { RootState } from "../store";
import { setConversation } from "../redux/conversationThreadSlice";

export default function InputContainer(props:any){
    const [message, setMessage] = useState("");

    const inputRef = useRef<HTMLInputElement | null>(null)

    const dispatch = useDispatch()

    const initialConvo = useSelector((state:RootState) => state.convoThread.messages)
    


    const handleSend = () => {
        dispatch(setLoading(true));
        const inputMessage = { role: "user", content: message };
        dispatch(setConversation([...initialConvo,inputMessage]))
        setMessage("");
    }

    const handleFileChange = (event:any) => {
        const file = event.target.files[0];
    
        // Check if the file is a PDF
        if (file && file.type === 'application/pdf') {
          alert(`Uploaded PDF: ${file.name}`);
        } else {
          alert('Please upload a PDF file.');
        }
      };

    const handleFileSelect = () => {
        inputRef.current?.click();
    }

    const handleKeyDown = (keyEvent:any) => {
        if(keyEvent.key === "Enter"){
            handleSend();
        }
    }

    return(
        <>
        <div className="w-full flex gap-5 px-5">

            <input type="text" placeholder="Type here" onKeyDown={handleKeyDown} value={message} onChange={(e)=>setMessage(e.target.value)} className="input input-bordered w-full " />
            <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} ref={inputRef}/>
            <button className="btn btn-primary" onClick={handleFileSelect}>PDF</button>
            <button className="btn btn-accent" onClick={handleSend}>Send</button>

        </div>
        </>
    )
}