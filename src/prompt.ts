import { ChatCompletionTool } from "openai/resources/index.mjs";
import { PerspectiveCarouselElement } from "./perspective-carousel/perspective-carousel";

export function getSceneDescription(carousel: PerspectiveCarouselElement): string {
  const sceneDescription = (carousel.items ?? [])
    .map((item) => ({
      ...item,
      img: item.element.querySelector<HTMLImageElement>("img")!,
    }))
    .map((item) =>
      `
- id: ${item.img.id}
  position: ${item.posiotion}
  name: ${item.img.getAttribute("alt")}
  price: ${item.img.getAttribute("data-price")}
      `.trim()
    )
    .join("\n");

  return sceneDescription;
}

export const consoleCustomizationSystemMessage = `
You are an gaming device shopping concierge called Contoso. The user is browsing Xbox gaming consoles in an online store. The user is currently focused on a 3D product carousel. 
Follow these guidelines to assist user:
- If user chats about shopping related topic, use the "talk" tool to respond with casual conversation, one sentence at most.
- If user chats about irrelevant topic, use the "talk" tool to help user get back on track.
- If user expresses interest in a specific item, use "change_focus" tool to make sure that item is in front and center in focus
  1. Tell the user what you are showing in "introduction". One sentence colloquial tone.
  2. Provide the item name in the "newFocusProduct" field.
- If user has made a decision, first, use "talk" tool again to ask whether user wants to buy an additional controller. There is limited-time free upgrade that lets you customize the controller. Once user confirms, use the "wrap_up" tool:
  1. Compliment user on their choice in the "compliment" field.
  2. Tell user it's time to customize an additional controller in "nextStep" the field. 

Important: When referring to a product, use informal language, color and model before the product name, e.g. "The black Series X with a disc drive".
Important: you must NOT mix "talk" with other tools. Use only one tool in each response.
`.trim();

export const consoleCarouselTools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "talk",
      description: "Respond to user in casual conversation tone.",
      parameters: {
        type: "object",
        required: ["utterance"],
        properties: {
          utterance: {
            description: "The response to user",
            type: "string",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wrap_up",
      description: "Select the front and center item in the carousel and start customizing the controller.",
      parameters: {
        type: "object",
        required: ["compliment", "nextStep"],
        properties: {
          compliment: {
            type: "string",
            description: "Compliment the user on their choice",
          },
          nextStep: {
            type: "string",
            description: "Tell user it's time to customize the controller",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "change_focus",
      description: "Move the focus to a different item in the carousel.",
      parameters: {
        type: "object",
        required: ["introduction", "newFocusId"],
        properties: {
          introduction: {
            type: "string",
            description: "One sentence describing what you are showing",
          },
          newFocusId: {
            type: "string",
            description: "Id of the product to focus on",
          },
        },
      },
    },
  },
];
