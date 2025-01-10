### Setup Initial Coding Workspace
Execute this commands on your IDE on a directory you want to work on
1. ```npm init```
2. ```npm install discord.js```
3. ```npm install @google/generative-ai```

After doing this:

### Making APIs Ready

4. Get Discord API Key via : https://discord.com/developers/applications

After you create a API key then you will get to see a token once so you should copy that and keep it safely somewhere, better to use Google Keep - https://keep.google.com/ for this.

5. Get Gemini API Key via: https://makersuite.google.com/

And to view your already created API key, you can visit: https://aistudio.google.com/app/apikey

And keep both the keys at `.env` file:-
```
DISCORD_API_KEY= # Your Discord API key
GEMINI_API_KEY= # Your Gemini API key 
```
**<u>But make sure to include `.env` file to your `.gitignore` file</u>**

And finally
```js
node index.js
```
You will see this output if everthing is working fine:
```Bot is ready!```
