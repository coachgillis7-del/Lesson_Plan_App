/*
 * Lesson Plan Generator
 * This client-side script collects form data from the teacher, then
 * synthesizes a detailed lesson plan aligned to the T‑TESS
 * distinguished rating. It integrates Amplify Reading or Bluebonnet
 * Math resources, embeds the Fundamental Five instructional practices,
 * and incorporates PAX Good Behavior Game strategies. Each plan
 * section is rendered in markdown-like HTML so that teachers can
 * internalize and print the plan easily.
 */

// Wait for the DOM to load before attaching event handlers
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lesson-form');
  const output = document.getElementById('plan-output');
  const printBtn = document.getElementById('print-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const grade = form.grade.value;
    const subject = form.subject.value;
    const program = form.program.value;
    const unit = form.unit.value;
    const lesson = form.lesson.value;
    const standard = form.standard.value.trim();
    // Always auto‑generate the kid‑friendly lesson frame based on unit and lesson
    const objective = generateKidFriendlyObjective({ program, subject, unit, lesson, standard });
    const product = generateKidFriendlyProduct({ program, subject, unit, lesson, standard });

    // Generate the lesson plan content
    const planHtml = generatePlan({ grade, subject, standard, objective, product, program, unit, lesson });
    output.innerHTML = planHtml;
    output.style.display = 'block';
    printBtn.style.display = 'inline-block';
  });

  // Automatically set program based on subject
  form.subject.addEventListener('change', (e) => {
    const subj = e.target.value;
    if (subj === 'Reading') {
      form.program.value = 'Amplify';
    } else if (subj === 'Math') {
      form.program.value = 'Bluebonnet';
    }
  });
});

/**
 * Build a lesson plan given form inputs. This function
 * assembles sections of the plan and returns a string of
 * HTML. Content is drawn from Texas TEKS standards, Amplify
 * Reading games, Bluebonnet Math routines, Fundamental Five,
 * and PAX GBG guidelines.
 * @param {Object} data
 */
function generatePlan(data) {
  const { grade, subject, standard, objective, product, program, unit, lesson } = data;

  // Determine subject‑specific details
  const subjectDetails = subject === 'Reading' ? getReadingDetails() : getMathDetails();

  /*
   * Assemble a comprehensive lesson plan aligned to the TTESS Distinguished
   * Lesson Plan Template. The output mimics the sections of the template:
   * Lesson information, objectives and success criteria, formative
   * assessments, materials, classroom culture (PAX + Fundamental Five),
   * lesson frame, lesson procedures (with sub‑sections), differentiation,
   * teacher reflection, administrator look‑fors, and an internalization
   * guide. When available, the unit and lesson numbers drive the
   * kid‑friendly objective and product; the optional TEKS concept
   * supplements descriptions. Teachers can fill in blank areas of the plan.
   */

  // Format standard display
  const standardDisplay = standard ? `${standard}` : '';
  const unitLessonDisplay = unit || lesson ? `${unit || ''}${unit && lesson ? '/' : ''}${lesson || ''}` : '';

  // Build the plan sections
  // Section 1: Lesson Information
  const infoSection = `
    <h2>Section 1 — Lesson Information</h2>
    <table style="width:100%; border-collapse: collapse;">
      <tr><td style="font-weight:bold; width:30%;">Teacher</td><td>__________________________</td></tr>
      <tr><td style="font-weight:bold;">Grade / Subject</td><td>${grade || 'K–2'} ${subject}</td></tr>
      <tr><td style="font-weight:bold;">Lesson Date</td><td>__________________________</td></tr>
      <tr><td style="font-weight:bold;">Unit / Lesson #</td><td>${unitLessonDisplay || '___/___'}</td></tr>
      <tr><td style="font-weight:bold;">TEKS</td><td>${standardDisplay || '__________________________'}</td></tr>
      <tr><td style="font-weight:bold;">Lesson Duration</td><td>__________________________</td></tr>
    </table>
  `;

  // Section 2: Objective, Learning Goals, Success Criteria
  const successCriteria = subject === 'Reading'
    ? [
        'Use phonological or phonics skills (e.g., blend and segment sounds, decode high‑frequency words).',
        'Demonstrate comprehension by answering text‑dependent questions and summarizing key ideas.',
        'Apply new vocabulary in speaking and writing activities.',
      ]
    : [
        'Demonstrate conceptual understanding by solving problems using appropriate strategies or models.',
        'Explain mathematical reasoning verbally or in writing.',
        'Apply new vocabulary and use manipulatives or visuals to justify solutions.',
      ];
  const objSection = `
    <h2>Section 2 — Objective, Learning Goals & Success Criteria</h2>
    <p><strong>Lesson Objective:</strong> ${objective.replace('We will', 'Students will')} (include decoding, comprehension, vocabulary, skills as appropriate).</p>
    <p><strong>Student‑Friendly Learning Goal:</strong> "${objective.replace('We will', 'Today I will')}"</p>
    <p><strong>Success Criteria (Distinguished):</strong></p>
    <ul>
      ${successCriteria.map(c => `<li>${c}</li>`).join('')}
    </ul>
  `;

  // Section 3: Formative Assessment & Exit Ticket
  const assessmentSection = `
    <h2>Section 3 — Formative Assessment & Exit Ticket</h2>
    <p><strong>Checks for Understanding Throughout Lesson:</strong></p>
    <ul style="list-style-type:none;">
      <li><input type="checkbox"/> Whiteboard responses</li>
      <li><input type="checkbox"/> Turn & Talk</li>
      <li><input type="checkbox"/> Cold call</li>
      <li><input type="checkbox"/> Partner reading checks</li>
      ${subject === 'Reading' ? '<li><input type="checkbox"/> Choral read accuracy</li>' : ''}
      <li><input type="checkbox"/> Vocabulary application</li>
    </ul>
    <p><strong>Exit Ticket:</strong> _________________________________________________</p>
  `;

  // Section 4: Materials & Resources
  const materialsSection = `
    <h2>Section 4 — Materials & Resources</h2>
    <ul>
      <li>${program} Teacher Guide / Slides</li>
      ${subject === 'Reading' ? '<li>Vocabulary Cards</li><li>Decodables / Knowledge Text</li>' : '<li>Manipulatives / Math Tools</li><li>Eureka Math/Bluebonnet Materials</li>'}
      <li>Whiteboards / Markers</li>
      <li>Anchor Charts</li>
      <li>PAX GBG Team Board</li>
      <li>Fundamental Five Frame‑the‑Lesson Board</li>
      <li>Other: _____________________________________</li>
    </ul>
  `;

  // Section 5: Classroom Culture (PAX + Fundamental Five)
  const cultureSection = `
    <h2>Section 5 — Classroom Culture (PAX + Fundamental Five)</h2>
    <table style="width:100%; border-collapse: collapse;">
      <tr><td style="font-weight:bold; width:30%;">PAX Vision for Lesson</td><td>More of: ________ | Less of: ________</td></tr>
      <tr><td style="font-weight:bold;">PAX Signals & Routines</td><td>Harmonicas, PAX Quiet, PAX Hands/Eyes/Heart</td></tr>
      <tr><td style="font-weight:bold;">Good Behavior Game Rounds</td><td>
        <label><input type="checkbox"/> Whole Group Reading / Instruction</label>
        <label><input type="checkbox"/> Partner Work</label>
        <label><input type="checkbox"/> Independent Practice</label>
      </td></tr>
      <tr><td style="font-weight:bold;">PAX Kernels</td><td>
        <label><input type="checkbox"/> Tootles</label>
        <label><input type="checkbox"/> Beat the Timer</label>
        <label><input type="checkbox"/> Random Sticks</label>
        <label><input type="checkbox"/> Wacky Prizes</label>
      </td></tr>
      <tr><td style="font-weight:bold;">Fundamental Five Elements</td><td>Frame the Lesson, Power Zone, Frequent Talk, Recognize & Reinforce, Critical Writing</td></tr>
    </table>
  `;

  // Section 6: Lesson Frame (Fundamental Five)
  const frameSection = `
    <h2>Section 6 — Lesson Frame (Fundamental Five)</h2>
    <table style="width:100%; border-collapse: collapse;">
      <tr><td style="font-weight:bold; width:30%;">Frame the Lesson (Beginning)</td><td>
        <p><strong>Today we will...</strong> ${objective.replace('We will', '').trim()}.</p>
        <p><strong>You will know you are successful when...</strong> ${successCriteria[0]}</p>
      </td></tr>
      <tr><td style="font-weight:bold;">Frame the Lesson (End)</td><td>
        <p>Review the objective and success criteria. Provide a reflective prompt or exit question for students to connect learning back to the goal.</p>
      </td></tr>
    </table>
  `;

  // Section 7: Lesson Procedures (Amplify/Bluebonnet + T‑TESS Distinguished)
  const proceduresSection = `
    <h2>Section 7 — Lesson Procedures (${program} + TTESS Distinguished)</h2>
    <h3>A. Opening Routine (3–5 min)</h3>
    <ul>
      <li>PAX Quiet signal and attention getter</li>
      <li>Review objective and success criteria with students</li>
      <li>Engage prior knowledge or connection to previous lesson</li>
    </ul>
    <h3>B. Vocabulary & Knowledge Building (5–8 min)</h3>
    <ul>
      <li>Introduce new vocabulary with student‑friendly definitions</li>
      <li>Use gestures, images or realia to reinforce understanding</li>
      <li>Have students Turn & Talk using the vocabulary in context</li>
      <li>Begin a PAX GBG mini‑round to reinforce focus and cooperation</li>
    </ul>
    <h3>C. ${subject === 'Reading' ? 'Read‑Aloud / Decodable Reading' : 'Concept Instruction / Guided Practice'} (10–15 min)</h3>
    <ul>
      <li>Teacher modeling of ${subject === 'Reading' ? 'fluency and comprehension strategies' : 'mathematical concept or problem‑solving strategy'}</li>
      <li>Pose text‑dependent or concept questions to check understanding</li>
      <li>Incorporate Turn & Talk and other CFUs (Cold call, whiteboard responses)</li>
      <li>Record student evidence responses to gauge progress</li>
    </ul>
    <h3>D. Skills Practice / Word Work (10–12 min)</h3>
    <ul>
      ${subject === 'Reading'
        ? '<li>Blending and segmenting sounds; dictation or spelling patterns</li><li>Small‑group adjustments based on student needs</li><li>PAX reinforcement (e.g., tootles)</li>'
        : '<li>Problem sets using manipulatives; fact fluency games</li><li>Small‑group adjustments to differentiate for skill levels</li><li>PAX reinforcement for on‑task math discussion</li>'}
    </ul>
    <h3>E. Partner Practice (5–8 min)</h3>
    <ul>
      <li>Students engage in purposeful talk tasks</li>
      <li>${subject === 'Reading' ? 'Rereading, retelling or comprehension tasks' : 'Pair‑problem solving and explanation'}</li>
      <li>Conduct GBG mini‑round #2 to maintain focus</li>
    </ul>
    <h3>F. Independent Practice / Stations (8–12 min)</h3>
    <p>Set up stations with tasks aligned to the lesson objective:</p>
    <ul>
      ${subject === 'Reading'
        ? '<li>Station 1: Decodable practice using Amplify games</li><li>Station 2: Vocabulary activity or graphic organizer</li><li>Station 3: Writing response to reading</li>'
        : '<li>Station 1: Problem solving with manipulatives</li><li>Station 2: Math games (e.g., number bonds, math facts)</li><li>Station 3: Application problems using Bluebonnet digital tools</li>'}
      <li>Teacher small‑group: Provide guided instruction and feedback to targeted learners</li>
    </ul>
    <h3>G. Closure & Exit Ticket (5 min)</h3>
    <ul>
      <li>Review the learning goal and success criteria</li>
      <li>Ask students to reflect on how they met the goal; incorporate FSGPT</li>
      <li>Administer exit ticket aligned to the objective</li>
      <li>Celebrate with PAX tootles or quick recognition</li>
    </ul>
  `;

  // Section 8: Differentiation
  const differentiationSection = `
    <h2>Section 8 — Differentiation</h2>
    <table style="width:100%; border-collapse: collapse;">
      <tr><th style="text-align:left; width:30%;">Student Group</th><th style="text-align:left;">Supports Planned</th></tr>
      <tr><td>Struggling Learners</td><td>Provide concrete supports (e.g., manipulatives, additional phonics practice), scaffolded questioning, and more frequent check‑ins.</td></tr>
      <tr><td>On‑Level Learners</td><td>Offer guided practice with gradual release, peer collaboration, and feedback opportunities.</td></tr>
      <tr><td>Advanced Learners</td><td>Challenge with extension tasks, open‑ended problems or enrichment texts, and opportunities to teach peers.</td></tr>
      <tr><td>Students Needing Behavior Support</td><td>Use PAX kernels and clear expectations, positive recognition, and structured choices to encourage engagement.</td></tr>
    </table>
  `;

  // Section 9: Teacher Reflection
  const reflectionSection = `
    <h2>Section 9 — Teacher Reflection (Distinguished Requirement)</h2>
    <p>After the lesson, reflect on the following prompts. Document your responses in the space provided:</p>
    <ul>
      <li>What evidence showed mastery?</li>
      <li>What misunderstandings appeared?</li>
      <li>How will I adjust instruction tomorrow?</li>
      <li>How did PAX & Fundamental Five improve engagement?</li>
    </ul>
    <p>Notes: ________________________________________________</p>
  `;

  // Section 10: Administrator Look‑Fors
  const adminSection = `
    <h2>Section 10 — Administrator Look‑Fors (Distinguished Alignment)</h2>
    <p>This lesson is designed to produce evidence in:</p>
    <ul>
      <li><strong>Domain 1 (Planning)</strong>: alignment to TEKS/standards, intentional strategies, differentiation for varied learners.</li>
      <li><strong>Domain 2 (Instruction)</strong>: student engagement, effective questioning, checks for understanding, student thinking and discourse.</li>
      <li><strong>Domain 3 (Classroom Culture)</strong>: PAX routines and kernels, respectful interactions, classroom management, joy in learning.</li>
    </ul>
  `;

  // Lesson Internalization Guide (new section for teacher to fill in)
  const internalizationGuide = `
    <h2>Lesson Internalization Guide</h2>
    <p>Prior to teaching, use this guide to internalize the lesson:</p>
    <ul>
      <li><strong>Key Concepts & Vocabulary:</strong> Identify essential ideas and words students must understand.</li>
      <li><strong>Anticipated Misconceptions:</strong> What errors or misunderstandings might occur? Plan strategies to address them.</li>
      <li><strong>Differentiation & Scaffolds:</strong> How will you adjust for struggling and advanced learners? What supports will you provide?</li>
      <li><strong>Cross‑Curricular Connections:</strong> How does this lesson connect to other subjects or real‑world experiences?</li>
      <li><strong>Fundamental Five Strategies:</strong> Plan for framing the lesson, positioning in the power zone, frequent purposeful talk, recognition and reinforcement, and critical writing.</li>
      <li><strong>PAX Integration:</strong> How will you use PAX GBG rounds and kernels to support a positive culture?</li>
      <li><strong>Assessment & Evidence:</strong> What specific evidence will show that students met the success criteria?</li>
    </ul>
    <p><em>Use these prompts to jot down notes and ensure you are fully prepared for high‑quality instruction.</em></p>
  `;

  // Compose full plan
  const fullPlan = `
    <h2>Overview</h2>
    <p><strong>Grade:</strong> ${grade} | <strong>Subject:</strong> ${subject} | <strong>Program:</strong> ${program} | <strong>Unit/Lesson:</strong> ${unitLessonDisplay || '-'}${standardDisplay ? ` | <strong>Standard/Concept:</strong> ${standardDisplay}` : ''}</p>
    ${infoSection}
    ${objSection}
    ${assessmentSection}
    ${materialsSection}
    ${cultureSection}
    ${frameSection}
    ${proceduresSection}
    ${differentiationSection}
    ${reflectionSection}
    ${adminSection}
    ${internalizationGuide}
  `;
  return fullPlan;
}

/**
 * Provide subject‑specific activity recommendations for reading.
 */
function getReadingDetails() {
  return {
    activities: `
      <p><strong>Amplify Reading Integration:</strong> Create reading stations using Amplify’s adaptive games to target foundational skills. For example:</p>
      <ul>
        <li><em>Phonological awareness:</em> Use games like <strong>Cut It Out</strong> or <strong>Gem &amp; Nye</strong> where students isolate and blend sounds; these align with standards such as CCSS.ELA-LITERACY.RF.K.2.D【597195531784893†L350-L368】.</li>
        <li><em>Phonics decoding:</em> Use <strong>Curioso Crossing</strong> or <strong>Food Truck</strong> to practice reading high‑frequency words, decoding multi‑syllabic words, and spelling patterns【597195531784893†L424-L456】.</li>
        <li><em>Comprehension:</em> After reading a story in Amplify’s eReader, have students discuss characters and events, then write about the main idea or create graphic organizers.</li>
      </ul>
      <p>Include read‑alouds and guided practice to model fluent reading. Encourage students to set reading goals and self‑monitor their progress, aligning with T‑TESS expectations of goal‑setting and self‑regulation【465862501687436†L446-L468】.</p>
    `
  };
}

/**
 * Provide subject‑specific activity recommendations for math.
 */
function getMathDetails() {
  return {
    activities: `
      <p><strong>Bluebonnet Math Integration:</strong> Design lessons around the TEKS readiness standards using Bluebonnet Learning materials. Key features include routines, models, digital tools, and student agency【885786470742668†L124-L130】.</p>
      <ul>
        <li>Begin with a concrete experience using manipulatives or visual models from Bluebonnet’s margin notes, then transition to pictorial and abstract representations.</li>
        <li>Use problem‑based learning tasks that promote reasoning and perseverance. Encourage students to explain their thinking and connect concepts horizontally and vertically across grade levels【885786470742668†L194-L206】.</li>
        <li>Incorporate digital assessments from Bluebonnet’s platform to provide immediate feedback and prepare students for STAAR‑aligned questions【885786470742668†L174-L176】.</li>
      </ul>
      <p>Promote student ownership by having students set math goals and monitor their progress. Provide opportunities for peer teaching and collaborative problem solving.</p>
    `
  };
}

/**
 * Generate a kid‑friendly objective when the teacher does not supply one.
 * The objective references the selected program, unit, lesson and standard.
 */
function generateKidFriendlyObjective({ program, subject, unit, lesson, standard }) {
  const prog = program || (subject === 'Reading' ? 'Amplify' : 'Bluebonnet');
  let unitLessonPart = '';
  if (unit) {
    unitLessonPart += `Unit ${unit}`;
  }
  if (lesson) {
    unitLessonPart += unitLessonPart ? `, Lesson ${lesson}` : `Lesson ${lesson}`;
  }
  // Build a generic description of the subject
  const skillPhrase = subject === 'Reading' ? 'our reading skills' : 'our math skills';
  const conceptPart = standard ? ` about ${standard.toLowerCase()}` : '';
  const objective = `We will explore ${unitLessonPart || 'our lesson'} from the ${prog} ${subject} program${conceptPart} to develop ${skillPhrase}.`;
  return objective;
}

/**
 * Generate a kid‑friendly evidence statement when the teacher does not supply one.
 * This describes how students will show mastery in a general way.
 */
function generateKidFriendlyProduct({ program, subject, unit, lesson, standard }) {
  const prog = program || (subject === 'Reading' ? 'Amplify' : 'Bluebonnet');
  const action = subject === 'Reading' ? 'reading stories and playing learning games' : 'solving problems and explaining our thinking';
  const product = `I will show what I learned in ${prog} by ${action}.`;
  return product;
}