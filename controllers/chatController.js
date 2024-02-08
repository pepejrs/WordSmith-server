
import { GoogleGenerativeAI } from "@google/generative-ai";
import Router from "express"


const router =Router()

const genAI = new GoogleGenerativeAI("AIzaSyCa5arEZ5HhdRL-UZGgdXzB1xJj9hu6RWc");

router.post("/generateResponse",async (req,res)=>{

try{



// Prints chunks of generated text to the console as they become available
 async function streamToStdout(stream) {
   let resLines=""
  for await (const chunk of stream) {
    // Get first candidate's current text chunk
    const chunkText = chunk.text();
    // 
    resLines+="\n"+chunkText;
  }
  return resLines

}

 async function displayTokenCount(model, request) {
  const { totalTokens } = await model.countTokens(request);
  console.log("Token count: ", totalTokens);
}

 async function displayChatTokenCount(model, chat, msg) {
  const history = await chat.getHistory();
  const msgContent = { role: "user", parts: [{ text: msg }] };
  await displayTokenCount(model, { contents: [...history, msgContent] });
}



    // For dialog language tasks (like chat), use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const quillText =req.body.quillText
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: `Hello, I want you to do some modifications or answer the question for the given text: ${quillText} according to my next prompt .`,
        },
        {
          role: "model",
          parts: "Great! how can i help?",
        },
      ],
      generationConfig: {
        maxOutputTokens: 400,
      },
    });
  
    const userPrompt= req.body.prompt;
    displayChatTokenCount(model, chat, userPrompt);
    const result1 = await chat.sendMessageStream(userPrompt);
    const modelResponse =await streamToStdout(result1.stream);
    res.status(200).send({modelResponse:modelResponse})
      // Display the last aggregated response
    // const response = await result1.response;
    // console.log(JSON.stringify(response, null, 2));
}
catch(error){
    console.log(error);
    res.status(500).send({message:"could not generate response"})
}
  
  
  
  
  
})
export default router;