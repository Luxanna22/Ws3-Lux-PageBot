module.exports = {
  description: "See available commands",
  async run({ api, send, admin }) {
  const quick_replies = [];
  api.commands.forEach((name) => {
    quick_replies.push({
        content_type: "text",
        title: api.prefix + name,
        payload: name.toUpperCase()
    });
  });
    try {
    send({
      quick_replies,
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `Greetings! I'm Lux. \n\nThis page is still in development test, kindly contact the admin below: `,
          buttons: [
            {
              type: "web_url",
              url: "https://www.facebook.com/Lux.SG.22",
              title: "Contact Admin"
            },/*
            {
              type: "web_url",
              url: "https://www.facebook.com/wieginesalpocialechavez",
              title: "Contact Admin 2"
            }*/
         ]
        }
      }
    });
    } catch(err){
     return send(err.message || err);
    }
  }
};
