const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs.unlink for easier async/await usage
const unlinkAsync = promisify(fs.unlink);

module.exports = {
  description: "Generate an Image",
  async run({ api, send, admin, userPrompt }) {
    // Construct the URL for the image generation API, with the user prompt
    const apiUrl = `https://joshweb.click/api/flux?prompt=${encodeURIComponent(userPrompt)}&model=4`;

    try {
      // Send request to the API to get the image (in buffer format)
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      // Convert the image buffer to Base64
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');

      // Send the generated image as Base64
      await send({
        attachment: {
          type: "image",
          payload: {
            is_reusable: true,
            url: `data:image/png;base64,${base64Image}`  // Sending the image as Base64
          }
        }
      });

      // Send a follow-up message with buttons
      setTimeout(async () => await send({
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `✨ Image generated successfully!
Would you like to generate another image?`,
            buttons: [
              {
                type: "postback",  // Postback type to trigger the same prompt again
                title: "Generate Another Image",
                payload: `REGENERATE_IMAGE:${userPrompt}`  // Pass the original user prompt as part of the payload
              }
            ]
          }
        }
      }), 2 * 1000);  // 2-second delay

    } catch (error) {
      console.error("Error generating image:", error);
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
      await this.run({ api: send, send, admin: [], userPrompt });  // Re-run the image generation with the same prompt
    }
  }
};
