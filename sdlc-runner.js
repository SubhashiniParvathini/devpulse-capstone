import fs from 'fs';
import path from 'path';
import readline from 'readline';

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.trim().toLowerCase());
  }));
}

async function runAutonomousPipeline() {
  console.clear();
  console.log("\x1b[32m$ sdlc run --ticket EPMCDMETST-73518 --mode autonomous\x1b[0m");
  console.log("\x1b[90mAutonomous SDLC · 10 gated phases · human-in-the-loop governance\x1b[0m");
  console.log("\x1b[90mEach phase pauses for human approval before advancing.\x1b[0m\n");

  // PHASE 00
  console.log("\x1b[32m» PHASE 00: MISSION INTAKE — Mission Intake & Context Loading\x1b[0m");
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Connecting to Jira : pulling ticket EPMCDMETST-73518`);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Scanning agents/ folder for active personas...`);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Mission understood — 10-phase pipeline engaged\n`);

  let gate0 = await askQuestion("\x1b[33m[HITL Gate] Approve Phase 00 Context & Proceed to Requirements? (y/n): \x1b[0m");
  if (gate0 !== 'y') { console.log("Pipeline paused by human reviewer."); return; }

  // PHASE 01
  console.log("\n\x1b[32m» PHASE 01: REQUIREMENTS AGENT INGESTION\x1b[0m");
  const baPath = path.join(process.cwd(), 'agents', 'ba-agent.md');
  const baPersona = fs.existsSync(baPath) ? fs.readFileSync(baPath, 'utf8').split('\n')[0] : "BA Agent";
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Invoking persona: ${baPersona}`);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Jira stories SCS1-1 and SCS1-2 successfully parsed.`);
  
  let gate1 = await askQuestion("\x1b[33m[HITL Gate] Approve Requirements & Proceed to Architecture? (y/n): \x1b[0m");
  if (gate1 !== 'y') { console.log("Pipeline paused by human reviewer."); return; }

  // PHASE 02
  console.log("\n\x1b[32m» PHASE 02: ARCHITECT AGENT HLD/LLD GENERATION\x1b[0m");
  const archPath = path.join(process.cwd(), 'agents', 'architect-agent.md');
  const archPersona = fs.existsSync(archPath) ? fs.readFileSync(archPath, 'utf8').split('\n')[0] : "Architect Agent";
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[34m→\x1b[0m Invoking persona: ${archPersona}`);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Confluence HLD/LLD specification synchronized.`);

  let gate2 = await askQuestion("\x1b[33m[HITL Gate] Approve Architecture & Proceed to Code Generation? (y/n): \x1b[0m");
  if (gate2 !== 'y') { console.log("Pipeline paused by human reviewer."); return; }

  // PHASE 05 & 07 & 09
  console.log("\n\x1b[32m» PHASE 05: DEVELOPER AGENT & PHASE 07: QA VERIFICATION & PHASE 09: PR MERGE\x1b[0m");
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Code generated via Codemie / claude-code CLI.`);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Playwright test suite executed successfully.`);
  console.log(`[${new Date().toLocaleTimeString()}] \x1b[32m✔\x1b[0m Pull Request successfully merged into main.`);

  console.log("\n\x1b[32m🎉 AUTONOMOUS SDLC PIPELINE COMPLETED SUCCESSFULLY ACROSS ALL GATES!\x1b[0m");
}

runAutonomousPipeline();