const fs = require('fs');

const configPath = './src/config/moduleConfigs.ts';
let configContent = fs.readFileSync(configPath, 'utf8');

const newQuestions = fs.readFileSync('temp_output.ts', 'utf8');

const updatedContent = configContent.replace(
  /      \/\/ Evaluation Questions[\s\S]*?(?=    \]\r?\n  \},\r?\n\r?\n  customerComplaints: \{)/,
  newQuestions
);

if (updatedContent !== configContent) {
    fs.writeFileSync(configPath, updatedContent);
    console.log("Configs updated successfully.");
} else {
    console.log("Could not find markers via regex.");
}
