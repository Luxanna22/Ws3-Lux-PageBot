const axios = require("axios");
const name = "imagine";

module.exports = {
  name,
  description: "Generate an Image.",
  async run({ api, event, send, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return send(`Please provide a prompt to generate an image.`);
    }

    try {
      // Send the prompt to the image generation API (use your API endpoint here)
      const response = await axios.get(`${api.api_josh}/api/flux`, {
        params: {
          prompt: prompt,
          model: 4
        },
        responseType: 'arraybuffer' // Ensure we get the image as a buffer
      });

      if (!response || !response.data) {
        throw new Error('Failed to generate image');
      }

      // Convert the image buffer to Base64
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');

      // Send the image as Base64 in the message
      await send({
        attachment: {
          type: "image",
          payload: {
            is_reusable: true,
            url: `data:image/png;base64,${base64Image}`  // Sending the image as Base64
          }
        }
      });

      // Send a follow-up message with a button to regenerate the image with the same prompt
      setTimeout(async () => {
        await send({
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: `✨ Image generated successfully!
Would you like to generate another image using the same prompt?`,
              buttons: [
                {
                  type: "postback",  // Postback to trigger the same prompt again
                  title: "Generate Another",
                  payload: `REGENERATE_IMAGE:${prompt}`  // Pass the original user prompt as part of the payload
                }
              ]
            }
          }
        });
      }, 2000); // 2-second delay

    } catch (err) {
      console.error("Error generating image:", err);
      // Handle any errors (e.g., API error, invalid response)
      await send({
        text: "Sorry, there was an issue generating the image. Please try again later."
      });
    }
  },

  // This is a helper to handle postback payloads like "REGENERATE_IMAGE:prompt"
  async handlePostback({ send, userId, payload }) {
    if (payload.startsWith("REGENERATE_IMAGE:")) {
      const userPrompt = payload.replace("REGENERATE_IMAGE:", "");  // Extract the original prompt
      await this.run({ api: send, send, admin: [], args: [userPrompt] });  // Re-run the image generation with the same prompt
    }
  }
};
