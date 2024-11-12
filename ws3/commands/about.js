module.exports = {
  description: "About Lux",
  async run({ api, send, admin }){
    await send({
      attachment: {
        type: "image",
        payload: {
          url: "https://64.media.tumblr.com/7ee0609d246eea263ff4fae986d34beb/263c7411d8d2e79a-82/s540x810/76b4304ad362222a3d273ce77b556a870fca0c5e.png",
          is_reusable: true
        }
      }
    });
    setTimeout(async () => await send({
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `✨ About Lux:
Lux is your friendly, helpful, and 24/7 personal assistant.

❓ Contact the admin if you have encountered issues. \n\nThis page is still in development test. Thank you for using me as your chatbot!`,
          buttons: [
            {
              type: "web_url",
              url: "https://www.facebook.com/profile.php?id=61568425980993",
              title: "Like/Follow our Page"
                },
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
    }), 2*1000);
  }
}
