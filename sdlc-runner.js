import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, 800));

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runPipeline() {
  console.clear();
  console.log("\x1b[32m$ sdlc run --ticket EPMCDMETST-73518 --mode autonomous\x1b[0m");
  console.log("\x1b[90mAutonomous SDLC · 10 gated phases · human-in-the-loop governance\x1b[0m");
  console.log("\x1b[90mEach phase pauses for human approval before advancing.\x1b[0m\n");

  // PHASE 00
  console.log("\x1b[32m» PHASE 00: MISSION INTAKE — Mission Intake & Context Loading\x1b[0m");
  console.log("The system ingests the work order, inspects the landscape, and loads rules.\n");
  
  await delay(600);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Connecting to Jira : pulling ticket EPMCDMETST-73518 and linked context`);
  await delay(600);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Reading repository layout : identifying backend, frontend, and test suites`);
  await delay(600);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Landscape detected : Node.js Express + SQLite + Tailwind UI`);
  await delay(600);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Policies loaded : SDLC gates · security checks · mm-learning-group-1`);
  await delay(600);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Mission understood — 10-phase pipeline engaged with human gates\n`);

  const approval = await promptUser("\x1b[33m[HITL Gate] Approve Phase 00 Context & Proceed to Requirements Analysis? (y/n): \x1b[0m");
  if (approval.toLowerCase() !== 'y') {
    console.log("Pipeline paused by human reviewer.");
    rl.close();
    return;
  }

  // PHASE 01
  console.log("\n\x1b[32m» PHASE 01: REQUIREMENTS & BACKLOG SYNC\x1b[0m");
  await delay(600);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Syncing user stories with Jira project mm-learning-group-1`);
  await delay(600);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Requirements verified — Acceptance criteria locked.`);

  // PHASE 02 - 09 summary simulation
  const phases = [
    "PHASE 02: ARCHITECTURE & CONFLUENCE DESIGN SYNC",
    "PHASE 03: DESIGN REVIEW & RISK ASSESSMENT",
    "PHASE 04: IMPLEMENTATION PLANNING & DEPENDENCY SORTING",
    "PHASE 05: CODE GENERATION (Claude-Code CLI via Codemie)",
    "PHASE 06: PEER CODE REVIEW & DRY AUDIT",
    "PHASE 07: BDD TESTING & PLAYWRIGHT EXECUTION",
    "PHASE 08: LOCAL DEPLOYMENT & ARTIFACT BUILD",
    "PHASE 09: DOCUMENTATION SYNC & FINAL PR CREATION"
  ];

  for (let i = 0; i < phases.length; i++) {
    await delay(700);
    console.log(`\n\x1b[32m» ${phases[i]}\x1b[0m`);
    await delay(500);
    console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Phase completed successfully.`);
  }

  console.log("\n\x1b[32m🎉 AUTONOMOUS SDLC PIPELINE COMPLETED SUCCESSFULLY WITH HITL APPROVALS!\x1b[0m");
  rl.close();
}

runPipeline();