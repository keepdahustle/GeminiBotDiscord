require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Handler global untuk mencegah aplikasi crash
client.on("error", (error) => {
  console.error("Unhandled error in Discord client:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});

// Event 'ready'
client.on("ready", () => {
  console.log("Bot is ready!");
});

// Event 'messageCreate'
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    const userMessage = message.content
      .replace(`<@!${client.user.id}>`, "")
      .trim();

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };

      const parts = [
        {
          text: `input: ${userMessage}`,
        },
      ];

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings: [
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      });

      const reply = await result.response.text();
      // Memecah pesan jika panjangnya lebih dari 2000 karakter
      if (reply.length > 2000) {
        const replyArray = reply.match(/[\s\S]{1,2000}/g);
        for (const msg of replyArray) {
          await message.reply(msg);
        }
        return;
      }

      message.reply(reply);
    } catch (error) {
      console.error("Error handling messageCreate event:", error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
});

// Login ke Discord
client.login(process.env.DISCORD_API_KEY);
