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

  // Compose the lesson frame using Fundamental Five
  const frameSection = `
    <h2>Lesson Frame</h2>
    <p><strong>We will...</strong> ${objective || `learn about ${standard}.`}</p>
    <p><strong>I will...</strong> ${product || `show my understanding by completing the task aligned to our objective.`}</p>
    <p><em>Framing the Lesson</em>: display the objective and product visibly in the classroom and revisit them at the beginning and end of the lesson. Use kid‑friendly language and ensure the objective is attainable within a single class period.</p>
  `;

  // Activities and resources section
  const activitiesSection = `
    <h2>Activities & Resources</h2>
    <p>The learning activities should be logically sequenced, connected to prior knowledge, and aligned to the TEKS and lesson objective. Provide appropriate time for student work, reflection, and closure. Integrate technology where it enhances mastery.</p>
    ${subjectDetails.activities}
    <p>During each activity, plan opportunities for students to engage in <em>Frequent, Small‑Group, Purposeful Talk (FSGPT)</em>. Every 10–15 minutes of teacher talk, give students 30 seconds to 3 minutes to discuss with partners (groups of 2–4) using pre‑planned seed questions. Circulate in the <em>Power Zone</em>—teaching in close proximity—to monitor and provide feedback.</p>
  `;

  // PAX Good Behavior Game section
  const paxSection = `
    <h2>PAX Good Behavior Game Integration</h2>
    <p>Use PAX GBG strategies to build self‑regulation and a productive learning environment. Organize students into teams and set clear expectations for on‑task behavior. When teams refrain from disruptive or inattentive behavior, award points or brief rewards. Research shows that PAX reduces classroom disruptions by 50–90% and increases time for teaching and learning【77095242993184†L0-L14】.</p>
    <ul>
      <li>Introduce the game’s expectations and model desired behaviors.</li>
      <li>Explain that teams are “competing” to earn rewards for staying focused and cooperative.</li>
      <li>Track each team’s behavior and celebrate successes with small rewards or recognition.</li>
      <li>Use the game daily in short bursts, gradually increasing stamina for focused work.</li>
    </ul>
  `;

  // Recognition and writing
  const recognitionWritingSection = `
    <h2>Recognize, Reinforce & Write</h2>
    <p>Provide positive, specific recognition for academic and behavioral growth. Acknowledge improvements, not just high grades or perfect behavior. Recognition should be personable and tailored to individual students’ efforts【597725777175985†L199-L218】.</p>
    <p>Incorporate <em>critical writing</em> to help students organize, clarify, analyze, and connect ideas【597725777175985†L277-L306】. Examples include:</p>
    <ul>
      <li>Journaling about what they learned or questions they still have.</li>
      <li>Creating bubble charts or graphic organizers.</li>
      <li>Writing sentences or paragraphs explaining their reasoning.</li>
    </ul>
  `;

  // Assessment & data section
  const assessmentSection = `
    <h2>Assessment & Reflection</h2>
    <p>Use formal and informal assessments to monitor every student’s progress. Share formative and summative data with students so they can engage in self‑assessment and track their own progress, a key component of the T‑TESS distinguished rating【465862501687436†L130-L160】.</p>
    <p>Suggested assessments:</p>
    <ul>
      <li>Exit tickets aligned to the day’s objective.</li>
      <li>Observations during small‑group discussions.</li>
      <li>Student self‑reflections or goal‑setting sheets.</li>
      <li>For math, short quizzes based on Bluebonnet readiness standards; for reading, comprehension checks connected to Amplify story quests.</li>
    </ul>
    <p>After the lesson, reflect on what worked, what didn’t, and plan next steps. Use student data to adapt instruction and share insights with colleagues as part of continuous improvement.</p>
  `;

  // Compose the final plan
  const plan = `
    <h2>Overview</h2>
    <p><strong>Grade:</strong> ${grade} | <strong>Subject:</strong> ${subject} | <strong>Program:</strong> ${program} | <strong>Unit/Lesson:</strong> ${unit || '-'} / ${lesson || '-'}${standard ? ` | <strong>Standard/Concept:</strong> ${standard}` : ''}</p>
    ${frameSection}
    ${activitiesSection}
    ${paxSection}
    ${recognitionWritingSection}
    ${assessmentSection}
    <h2>Teacher Internalization</h2>
    <p>Spend time reviewing the plan before teaching. Anticipate student misconceptions and prepare scaffolds. Consider how each activity supports the objective and the T‑TESS dimensions—planning, instruction, learning environment, and professional practices. Identify opportunities to integrate other disciplines and real‑world connections. Use the reflection prompts to guide a brief internalization session.</p>
  `;
  return plan;
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