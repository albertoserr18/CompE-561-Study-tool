# COMPE 561 Final Study App

A modern, interactive study application built with Next.js to help you prepare for your COMPE 561 final exam.

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, make sure you have **Node.js** installed on your computer.

**Check if Node.js is installed:**
- Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux)
- Type: `node --version`
- If you see a version number (like `v18.0.0` or higher), you're good to go!
- If you get an error, download and install Node.js from [nodejs.org](https://nodejs.org/)

### Step 1: Download/Clone the Project

If you received this as a ZIP file:
1. Extract the ZIP file to a folder on your computer
2. Open a terminal/command prompt
3. Navigate to the project folder:
   ```bash
   cd path/to/561FinalStudy
   ```
   (Replace `path/to/561FinalStudy` with the actual path to your folder)

### Step 2: Install Dependencies

In the project folder, run:
```bash
npm install
```

This will install all required packages. Wait for it to finish (it may take 1-2 minutes).

**What you should see:**
- A `node_modules` folder will be created
- The terminal will show "added X packages" when complete

### Step 3: Start the Application

Run this command:
```bash
npm run dev
```

**What you should see:**
- The terminal will show: `✓ Ready in X seconds`
- It will say: `○ Local: http://localhost:3000`

### Step 4: Open in Your Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:3000**
3. You should see the study app!

**To stop the server:** Press `Ctrl + C` in the terminal

---

## 📚 Features

### Study Mode
- 📖 Browse through questions and answers
- 👁️ Show/hide answers with a single click
- 🔀 Shuffle questions for randomized study sessions
- 🎲 Jump to random questions
- 📊 Progress tracking with visual progress bar
- 📑 Study by section (HTML, CSS, JavaScript, Bootstrap, React, Django, etc.)

### Quiz Mode
- ✏️ Test yourself with multiple-choice questions
- ✅ Select answers by clicking on options
- 📊 Get your score at the end
- 📝 See detailed results for each question
- 🔄 Retake quizzes anytime
- 🎯 **For "All" section**: Select how many random questions you want (10, 20, 30, 50, 75, 100, or All)

---

## 🎮 How to Use

### Switching Between Modes

1. **Study Mode** (📚): Browse questions and reveal answers when ready
2. **Quiz Mode** (✏️): Test yourself by selecting answers

Click the mode buttons at the top to switch between them.

### Selecting Sections

- Click section buttons at the top to filter questions by topic:
  - **All**: All questions from all sections
  - **HTML**: HTML questions only
  - **CSS**: CSS questions only
  - **JavaScript**: JavaScript questions only
  - **Bootstrap**: Bootstrap questions only
  - **React**: React questions only
  - **Django**: Django questions only
  - **Tri practice test 1/2/3**: Practice test questions

### Study Mode Features

1. **Navigate Questions**:
   - Click "← Previous" to go back
   - Click "Next →" to advance
   - Click "🎲 Random" to jump to a random question

2. **View Answers**:
   - Click "Show Answer" to reveal the correct answer
   - Click "Hide Answer" to hide it again

3. **Shuffle Questions**:
   - Click "🔀 Shuffle All" to randomize the order
   - Click "↻ Reset Order" to return to original order

### Quiz Mode Features

1. **Selecting Answers**:
   - Click on any option (A, B, C, or D) to select your answer
   - Your selection will be highlighted in blue
   - You can change your answer by clicking a different option

2. **Submitting the Quiz**:
   - Answer as many questions as you want
   - Click "Submit Quiz" when ready (available at any time)
   - View your score and detailed results

3. **Question Count Selector (All Section Only)**:
   - When in Quiz Mode with "All" section selected
   - Use the dropdown to select: 10, 20, 30, 50, 75, 100, or All questions
   - Questions will be randomly selected from all available questions

4. **Viewing Results**:
   - See your percentage score
   - Review each question with:
     - Your answer vs. correct answer
     - Whether you got it right (✓) or wrong (✗)
     - Explanation for each answer

---

## 🛠️ Troubleshooting

### "npm: command not found" or "npm is not recognized"

**Solution:** Node.js is not installed or not in your PATH. 
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### "Port 3000 is already in use"

**Solution:** Another application is using port 3000.
- Close the other application, OR
- Stop the previous instance of this app (press `Ctrl + C` in the terminal where it's running)

### "Cannot find module" errors

**Solution:** Dependencies are not installed.
```bash
npm install
```

### The page is blank or shows errors

**Solution:** 
1. Check the terminal for error messages
2. Make sure you're in the correct directory
3. Try stopping the server (`Ctrl + C`) and restarting:
   ```bash
   npm run dev
   ```

### Questions not showing

**Solution:** 
- Check that `data/questions.json` exists and has valid JSON
- Make sure the JSON file is properly formatted (no syntax errors)

---

## 📁 Project Structure

```
561FinalStudy/
├── app/
│   ├── page.tsx          # Main study/quiz interface
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── data/
│   └── questions.json     # All questions and answers
├── package.json           # Project dependencies
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

---

## 🔧 Advanced: Building for Production

If you want to create a production build:

```bash
npm run build
npm start
```

This creates an optimized version of the app.

---

## 💡 Tips for Studying

1. **Start with Study Mode**: Review all questions in a section first
2. **Use Quiz Mode**: Test your knowledge after studying
3. **Mix It Up**: Use the "All" section with random question counts to simulate exam conditions
4. **Review Mistakes**: After quizzes, focus on questions you got wrong
5. **Use Shuffle**: Randomize questions to avoid memorizing order

---

## 📝 Questions Format

Questions are stored in `data/questions.json`. Each question follows this format:

```json
{
  "id": 1,
  "question": "What does HTML stand for?\nA. Hyper Text Markup Language\nB. Home Tool Markup Language\nC. Hyperlinks and Text Markup Language",
  "answer": "A. Hyper Text Markup Language - HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
  "category": "HTML"
}
```

- **id**: Unique number for each question
- **question**: The question text with options (A, B, C, D) on separate lines
- **answer**: The correct answer with explanation (starts with the letter, e.g., "A.")
- **category**: The section name (HTML, CSS, JavaScript, etc.)

---

## 🎓 Good Luck!

Study hard and good luck with your final exam! You've got this! 💪

---

## 📞 Need Help?

If you encounter any issues:
1. Check the Troubleshooting section above
2. Make sure all prerequisites are installed
3. Verify you're in the correct directory when running commands
4. Check that the terminal/command prompt shows no errors
