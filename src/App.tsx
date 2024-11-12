import "./App.css";
import { definePespectiveCarousel, PerspectiveCarouselElement } from "./perspective-carousel/perspective-carousel";

import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useRef, useState } from "react";
import { aoai } from "./aoai";
import backdropImg from "./assets/xbox/backdrop.jpg";
import sBlackImg from "./assets/xbox/s-black.webp";
import sWhiteImg from "./assets/xbox/s-white.webp";
import xBlackImg from "./assets/xbox/x-black.webp";
import xGalaxyImg from "./assets/xbox/x-galaxy.webp";
import xWhiteImg from "./assets/xbox/x-white.webp";
import { consoleCarouselTools, consoleCustomizationSystemMessage, getSceneDescription } from "./prompt";

definePespectiveCarousel();

function App() {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    {
      role: "system",
      content: consoleCustomizationSystemMessage,
    },
  ]);

  const [utterances, setUtterances] = useState<string[]>([]);
  const carouselRef = useRef<PerspectiveCarouselElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector("input")!;
    handePrompt(input.value);
    input.value = "";
  };

  const handePrompt = async (promt: string) => {
    abortControllerRef.current?.abort();

    const scene = getSceneDescription(carouselRef.current!);
    console.log(`[scene]`, scene);

    const newMessages: ChatCompletionMessageParam[] = [
      ...messages,
      {
        role: "user",
        content: `
Here is what I see
"""
${scene}
"""

${promt}
      `.trim(),
      },
    ];

    setMessages(newMessages);

    const response = await aoai.chat.completions.create({
      messages: newMessages,
      tools: consoleCarouselTools,
      tool_choice: "required",
      model: "gpt-4o",
    });

    const toolResponse =
      response.choices.at(0)?.message.tool_calls?.map((toolCall) => ({
        role: "tool" as const,
        content: "success", // we are injecting scene description into user message, so there is no need to have return value from the tool
        tool_call_id: toolCall.id,
      })) ?? [];

    // update the thread to include assistant response
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response.choices.at(0)?.message.content ?? null,
        tool_calls: response.choices.at(0)?.message.tool_calls,
      },
      ...toolResponse,
    ]);

    response.choices.at(0)?.message.tool_calls?.forEach((toolCall) => {
      const parsedArgs = JSON.parse(toolCall.function.arguments);
      switch (toolCall.function.name) {
        case "talk":
          // pipe into tts
          console.log(`[utterance]: ${parsedArgs.utterance}`);
          setUtterances((prev) => [parsedArgs.utterance, ...prev]);
          break;

        case "wrap_up":
          // pipe into tts
          console.log(`[utterance]: ${parsedArgs.compliment}`);
          setUtterances((prev) => [parsedArgs.compliment, ...prev]);
          console.log(`[utterance]: ${parsedArgs.nextStep}`);
          setUtterances((prev) => [parsedArgs.nextStep, ...prev]);
          window.alert("The carousel demo has ended successfully");
          break;

        case "change_focus":
          // pipe into tts
          carouselRef.current?.rotateToElement(document.getElementById(parsedArgs.newFocusId)!);
          console.log(`[utterance]: ${parsedArgs.introduction}`);
          setUtterances((prev) => [parsedArgs.introduction, ...prev]);
          console.log(`[new id]: ${parsedArgs.newFocusId}`);
          break;
      }
    });
  };

  return (
    <div>
      <div>
        <b>General interest</b>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>Show me the black one in the back</button>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>Which one is the Galaxy?</button>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>I want to see the next one</button>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>I want a low budget option</button>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>Give me super fancy ultra premium model please</button>
        <br />
        <b>Intent to buy</b>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>Yep, I want to buy this one</button>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>I'll take this one home!</button>
        <br />
        <b>Accept deal</b>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>Yes, I'd like to add a controller</button>
        <button onClick={(e) => handePrompt((e.target as HTMLButtonElement).textContent!)}>Sure, thanks for the offer</button>
        <br />
        <b>Free form input</b>
        <form onSubmit={handleFormSubmit} className="input-form">
          <input type="text" placeholder="How would you compare it with Play Station?" />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="container">
        <img className="backdrop" src={backdropImg} alt="" />
        <perspective-carousel ref={carouselRef} fade-mode="darken">
          <carousel-item>
            <img src={sBlackImg} id="x-black" alt="Xbox Series S - Black (Certified Refurbished)" data-price="$299.99" />
          </carousel-item>
          <carousel-item>
            <img src={sWhiteImg} id="s-white" alt="Xbox Series S - All-Digital - White" data-price="$349.99" />
          </carousel-item>
          <carousel-item>
            <img src={xBlackImg} id="x-black" alt="Xbox Series X - Disc Drive - Black" data-price="$499.99" />
          </carousel-item>
          <carousel-item>
            <img src={xGalaxyImg} id="x-galaxy" alt="Xbox Series X - Disc Drive - Galaxy Black Special Edition" data-price="$599.99" />
          </carousel-item>
          <carousel-item>
            <img src={xWhiteImg} id="x-white" alt="Xbox Series X - All-Digital - White" data-price="$449.99" />
          </carousel-item>
        </perspective-carousel>
      </div>
      <div>
        {utterances.map((u, i) => (
          <div key={i}>{u}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
