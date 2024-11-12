const axios = require("axios");
const name = "lux" ;

module.exports = {
  name,
  description: "Interact with ChatGPT-4o",
  async run ({ api, event, send, args }){
    const prompt = args.join(" ");
    if (!prompt) return send(`Greetings! how can I help you?`);
    send("Please wait... 🔎");
    try {
    const gpt = await axios.get(`https://joshweb.click/api/gpt-4o`, {
      params: {
        q: prompt,
        uid: event.sender.id
      }
    });
    if (!gpt || !gpt.data.status)
    throw new Error();
    send(`${gpt.data.result}`);
    } catch(err){
      send(err.message || err);
      return;
    }
  }
}
