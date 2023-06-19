import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

//GET (read)
export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const prompts = await Prompt.findById(params.id).populate("creator");

    if (!prompts)
      return new Response(JSON.stringify("Prompt not found"), { status: 404 });

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify("Failed to fetch all prompts"), {
      status: 500,
    });
  }
};

//PATCH (update)
export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);
    //check if the prompt is inside mongodb
    if (!existingPrompt)
      return new Response(JSON.stringify("Prompt not found"), { status: 404 });

    //if there is existing prompt, then edit and save it
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify("Failed to edit prompts"), {
      status: 500,
    });
  }
};
//DELETE (delete)
export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    // findByIdAndRemove will find the id pass by and delete the data
    await Prompt.findByIdAndRemove(params.id);

    return new Response(JSON.stringify("Prompt delete successfully"), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify("Failed to delete prompt"), {
      status: 500,
    });
  }
};
