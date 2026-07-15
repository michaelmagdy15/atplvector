import { View } from '../types';

export interface PPLVideoLesson {
  index: number;
  videoId: string;
  title: string;
  duration: string;
  subjectId: string;
  category: string;
  summary: string[];
  notes: string;
  relatedView?: View;
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

export const PPL_GROUND_COURSE: PPLVideoLesson[] = [
  {
    index: 1,
    videoId: 'pe5Fx6QxSc4',
    title: "YouTube's ONLY Complete Private Pilot Ground Course (Lesson 1)",
    duration: '7:50',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on YouTube's ONLY Complete Private Pilot Ground Course.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### YouTube's ONLY Complete Private Pilot Ground Course (Lesson 1)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "What is the primary purpose of a Private Pilot ground school course?",
        options: ["To practice flight maneuvers", "To prepare for the FAA written exam and build theoretical knowledge", "To get a medical certificate", "To practice radio communications only"],
        answerIndex: 1,
        explanation: "Ground school provides the theoretical foundation for flight training and prepares candidates for the written knowledge test."
      },
      {
        question: "Which regulation governs Private Pilot certification and privileges in the US?",
        options: ["FAR Part 121", "FAR Part 135", "FAR Part 61", "FAR Part 91"],
        answerIndex: 2,
        explanation: "Part 61 covers the certification of pilots, flight instructors, and ground instructors."
      },
      {
        question: "What are the four fundamental forces acting on an airplane in flight?",
        options: ["Lift, Weight, Gravity, Drag", "Lift, Weight, Thrust, Drag", "Lift, Gravity, Friction, Propulsion", "Pitch, Roll, Yaw, Lift"],
        answerIndex: 1,
        explanation: "The four fundamental forces of flight are Lift, Weight, Thrust, and Drag."
      },
    ]
  },
  {
    index: 2,
    videoId: '-FmHg04rleg',
    title: "How an Airplane Creates Lift | Complete PPL Ground Course (Lesson 2)",
    duration: '7:37',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on How an Airplane Creates Lift.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How an Airplane Creates Lift | Complete PPL Ground Course (Lesson 2)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "According to Bernoulli's Principle, how does velocity affect pressure in a moving fluid?",
        options: ["An increase in velocity causes an increase in pressure", "An increase in velocity causes a decrease in pressure", "Velocity has no effect on pressure", "Pressure becomes negative as velocity increases"],
        answerIndex: 1,
        explanation: "Bernoulli's principle states that as the velocity of a fluid increases, its static pressure decreases."
      },
      {
        question: "How does the upper surface curvature (camber) of a wing help generate lift?",
        options: ["It slows down air flowing over the top", "It forces air underneath to flow faster", "It accelerates air flowing over the top, creating lower pressure above", "It increases gravity's pull on the wing"],
        answerIndex: 2,
        explanation: "The upper camber forces air to travel faster over the top surface, creating a low-pressure area relative to the bottom surface, which generates lift."
      },
      {
        question: "What is Newton's Third Law of Motion's role in lift generation?",
        options: ["Air deflected downward creates an equal and opposite upward force", "Friction on the wing surface pulls the plane forward", "Heavy air sinks faster than light air", "Every force is countered by friction"],
        answerIndex: 0,
        explanation: "Newton's Third Law explains that downwash (deflecting air downwards) produces an equal and opposite upward reaction (lift) on the wing."
      },
    ]
  },
  {
    index: 3,
    videoId: 'hIv-BLf6PoE',
    title: "What Causes an Airplane to STALL? | Complete PPL Ground Course (Lesson 3)",
    duration: '9:03',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on What Causes an Airplane to STALL?.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### What Causes an Airplane to STALL? | Complete PPL Ground Course (Lesson 3)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "What is the definition of an airplane stall?",
        options: ["When the engine stops running in flight", "A rapid decrease in lift caused by exceeding the critical angle of attack", "When the plane flies too fast and structural damage occurs", "When the tail rotor fails"],
        answerIndex: 1,
        explanation: "A stall is an aerodynamic condition where the angle of attack exceeds its critical limit, causing airflow separation and a rapid loss of lift."
      },
      {
        question: "What determines when a wing will stall?",
        options: ["Airspeed only", "Weight and density altitude", "Exceeding the critical angle of attack", "Pitch attitude relative to the horizon"],
        answerIndex: 2,
        explanation: "A wing can stall at any airspeed or attitude; it stalls *only* when the critical angle of attack is exceeded."
      },
      {
        question: "What is the correct primary action to recover from a stall?",
        options: ["Increase pitch to climb out", "Apply full power and raise the nose", "Reduce the angle of attack (lower the nose)", "Roll into a steep turn to dump lift"],
        answerIndex: 2,
        explanation: "The primary stall recovery action is to reduce the angle of attack by lowering the nose to re-establish smooth airflow over the wings."
      },
    ]
  },
  {
    index: 4,
    videoId: 'jAFgYWqvfuA',
    title: "How to Avoid a SPIN! (Private Pilot Ground Lesson 4)",
    duration: '9:34',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on How to Avoid a SPIN!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Avoid a SPIN! (Private Pilot Ground Lesson 4)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'How to Avoid a SPIN! (Private Pilot Ground Lesson 4)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 5,
    videoId: 'aOxFKDOn5dY',
    title: "How to Control an Airplane (PPL Lesson 5)",
    duration: '8:15',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on How to Control an Airplane.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Control an Airplane (PPL Lesson 5)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'How to Control an Airplane (PPL Lesson 5)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 6,
    videoId: '2t6tT77QFW4',
    title: "Aircraft Stability Explained (PPL Lesson 6)",
    duration: '16:35',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on Aircraft Stability Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Aircraft Stability Explained (PPL Lesson 6)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'Aircraft Stability Explained (PPL Lesson 6)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 7,
    videoId: 'dEJqNcEI8tI',
    title: "Aircraft Controllability EXPLAINED (Private Pilot Ground Lesson 7)",
    duration: '9:52',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on Aircraft Controllability EXPLAINED.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Aircraft Controllability EXPLAINED (Private Pilot Ground Lesson 7)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'Aircraft Controllability EXPLAINED (Private Pilot Ground Lesson 7)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 8,
    videoId: '7S8yxrlulSA',
    title: "WHY do Airplanes have FLAPS?  (FREE PPL Ground Lesson 8)",
    duration: '8:56',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on WHY do Airplanes have FLAPS? .", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### WHY do Airplanes have FLAPS?  (FREE PPL Ground Lesson 8)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'WHY do Airplanes have FLAPS?  (FREE PPL Ground Lesson 8)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 9,
    videoId: 'xz8x9e6t1SA',
    title: "How to Turn an Airplane (FREE PPL Ground Lesson 9)",
    duration: '6:15',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on How to Turn an Airplane.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Turn an Airplane (FREE PPL Ground Lesson 9)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_POF_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'How to Turn an Airplane (FREE PPL Ground Lesson 9)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 10,
    videoId: 'F-umUhlp4n4',
    title: "Load Factor BASICS explained (EASY to Understand)",
    duration: '14:58',
    subjectId: 'ppl-perf',
    category: 'Performance & Planning',
    summary: ["Master the core operational guidelines presented in this lesson on Load Factor BASICS explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Load Factor BASICS explained (EASY to Understand)\n\nThis lesson covers the fundamental concepts of **Performance & Planning**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.CONCEPT_TURN_PERF,
    quiz: [
      {
        question: "What is Load Factor defined as?",
        options: ["The total weight of cargo divided by passenger weight", "The ratio of aerodynamic lift generated by the wings to the total weight of the aircraft", "The structural weight limit of the fuselage", "The amount of drag generated in a turn"],
        answerIndex: 1,
        explanation: "Load factor (expressed in Gs) is the ratio of lift produced by the wings to the total weight of the aircraft."
      },
      {
        question: "What happens to the load factor of an airplane in a constant-altitude, coordinated 60-degree bank turn?",
        options: ["It remains 1.0 G", "It increases to 1.5 G", "It increases to 2.0 G", "It decreases to 0.5 G"],
        answerIndex: 2,
        explanation: "In a 60-degree bank coordinated level turn, the load factor is exactly 2.0 G (formula: 1 / cos(60) = 2)."
      },
      {
        question: "How does an increase in load factor affect the stall speed of an aircraft?",
        options: ["Stall speed decreases", "Stall speed increases", "Stall speed remains unchanged", "Stall speed drops to zero"],
        answerIndex: 1,
        explanation: "Stall speed increases in proportion to the square root of the load factor (Gs)."
      },
    ]
  },
  {
    index: 11,
    videoId: 'UoqHq9YC6Rk',
    title: "How to Calculate Load Factor (Easy for Pilots)",
    duration: '6:57',
    subjectId: 'ppl-perf',
    category: 'Performance & Planning',
    summary: ["Master the core operational guidelines presented in this lesson on How to Calculate Load Factor.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Calculate Load Factor (Easy for Pilots)\n\nThis lesson covers the fundamental concepts of **Performance & Planning**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.CONCEPT_TURN_PERF,
    quiz: [
      {
        question: "Which subject area does the video 'How to Calculate Load Factor (Easy for Pilots)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Performance & Planning"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Performance & Planning syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 12,
    videoId: 'TX5eFcLlE1o',
    title: "You WILL Understand V-Speeds after Watching This! (EASY)",
    duration: '19:16',
    subjectId: 'ppl-perf',
    category: 'Performance & Planning',
    summary: ["Master the core operational guidelines presented in this lesson on You WILL Understand V-Speeds after Watching This!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### You WILL Understand V-Speeds after Watching This! (EASY)\n\nThis lesson covers the fundamental concepts of **Performance & Planning**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_PERF_HOME,
    quiz: [
      {
        question: "What does Vso represent in aviation speeds?",
        options: ["Stall speed in a clean configuration", "Stall speed in the landing configuration (flaps and gear down)", "Design maneuvering speed", "Never-exceed speed"],
        answerIndex: 1,
        explanation: "Vso is the stalling speed or minimum steady flight speed in the landing configuration."
      },
      {
        question: "What is Va (Design Maneuvering Speed) and why is it important?",
        options: ["The maximum speed in turbulent air to avoid structural damage before a stall occurs", "The speed at which the landing gear must be retracted", "The speed for best angle of climb", "The maximum speed with flaps extended"],
        answerIndex: 0,
        explanation: "Va is the speed at which full control deflection will stall the aircraft before exceeding its structural load limits, protecting it from structural damage."
      },
      {
        question: "Which V-speed represents the 'Never Exceed Speed', marked by a red line on the airspeed indicator?",
        options: ["Vne", "Vno", "Vfe", "Vy"],
        answerIndex: 0,
        explanation: "Vne is the Never Exceed Speed, represented by the red radial line on the airspeed indicator."
      },
    ]
  },
  {
    index: 13,
    videoId: 'dsnKmXeSPqk',
    title: "Left Turning Tendencies EXPLAINED",
    duration: '9:22',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on Left Turning Tendencies EXPLAINED.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Left Turning Tendencies EXPLAINED\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Left Turning Tendencies EXPLAINED' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 14,
    videoId: '-34-Igi5UMc',
    title: "Ground Effect & Wake Turbulence Explained (EASY)",
    duration: '15:46',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on Ground Effect & Wake Turbulence Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Ground Effect & Wake Turbulence Explained (EASY)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Ground Effect & Wake Turbulence Explained (EASY)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 15,
    videoId: 'ba5MTbfy5Ck',
    title: "Types of Airspace (Explained for Pilots)",
    duration: '11:17',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Types of Airspace.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Types of Airspace (Explained for Pilots)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_LAYERS,
    quiz: [
      {
        question: "Which of the following is considered 'Uncontrolled Airspace' in the United States?",
        options: ["Class A", "Class B", "Class E", "Class G"],
        answerIndex: 3,
        explanation: "Class G airspace is the only uncontrolled airspace category, meaning ATC does not exercise active control over VFR flights."
      },
      {
        question: "Which airspace is strictly reserved for Instrument Flight Rules (IFR) only and spans from 18,000 feet MSL up to FL600?",
        options: ["Class B", "Class A", "Class C", "Class E"],
        answerIndex: 1,
        explanation: "Class A airspace covers the US from 18,000 feet MSL up to and including FL600, and is strictly IFR-only."
      },
      {
        question: "What is the standard VFR visibility requirement in Class G airspace below 1,200 feet AGL during the day?",
        options: ["3 statute miles", "1 statute mile, clear of clouds", "5 statute miles", "3 statute miles, 1,000 ft above clouds"],
        answerIndex: 1,
        explanation: "During daytime below 1,200 ft AGL in Class G airspace, the VFR minimum is 1 statute mile visibility and clear of clouds."
      },
    ]
  },
  {
    index: 16,
    videoId: 'gS9RgkRIPZ4',
    title: "Class B Airspace {What You NEED to know} PPL Ground lesson 16",
    duration: '6:40',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Class B Airspace {What You NEED to know} PPL Ground lesson 16.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Class B Airspace {What You NEED to know} PPL Ground lesson 16\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_LAYERS,
    quiz: [
      {
        question: "Which subject area does the video 'Class B Airspace {What You NEED to know} PPL Ground lesson 16' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 17,
    videoId: 'M-2VWNQ2Ukk',
    title: "Private Pilot Lesson on Class C Airspace (Lesson 17)",
    duration: '9:05',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Private Pilot Lesson on Class C Airspace.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Private Pilot Lesson on Class C Airspace (Lesson 17)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_LAYERS,
    quiz: [
      {
        question: "Which subject area does the video 'Private Pilot Lesson on Class C Airspace (Lesson 17)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 18,
    videoId: 'wYH4gQ-pOmE',
    title: "Class D Airspace (What you need to know) Private Pilot Ground Lesson 18",
    duration: '4:58',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Class D Airspace.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Class D Airspace (What you need to know) Private Pilot Ground Lesson 18\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_LAYERS,
    quiz: [
      {
        question: "Which subject area does the video 'Class D Airspace (What you need to know) Private Pilot Ground Lesson 18' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 19,
    videoId: 'PEeUvw1i9hs',
    title: "Class E Airspace Made Easy (Private Pilot Ground Lesson 19)",
    duration: '4:58',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Class E Airspace Made Easy.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Class E Airspace Made Easy (Private Pilot Ground Lesson 19)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_LAYERS,
    quiz: [
      {
        question: "Which subject area does the video 'Class E Airspace Made Easy (Private Pilot Ground Lesson 19)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 20,
    videoId: '0Liq4ZB5m6U',
    title: "Class G Airspace Explained (Private Pilot Ground Lesson 20)",
    duration: '5:31',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Class G Airspace Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Class G Airspace Explained (Private Pilot Ground Lesson 20)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_LAYERS,
    quiz: [
      {
        question: "Which subject area does the video 'Class G Airspace Explained (Private Pilot Ground Lesson 20)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 21,
    videoId: 'doKwv3ylx8E',
    title: "Can I fly in a RESTRICTED AREA? (and other SUA) Private Pilot Ground Lesson 21",
    duration: '7:35',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Can I fly in a RESTRICTED AREA?.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Can I fly in a RESTRICTED AREA? (and other SUA) Private Pilot Ground Lesson 21\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Can I fly in a RESTRICTED AREA? (and other SUA) Private Pilot Ground Lesson 21' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 22,
    videoId: 'MOqtfy45qKQ',
    title: "All the “Other Airspace” Private Pilots MUST Know! (Private Pilot Ground Lesson 22)",
    duration: '10:10',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on All the “Other Airspace” Private Pilots MUST Know!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### All the “Other Airspace” Private Pilots MUST Know! (Private Pilot Ground Lesson 22)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'All the “Other Airspace” Private Pilots MUST Know! (Private Pilot Ground Lesson 22)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 23,
    videoId: 'a7KYDQOAeFk',
    title: "What is ZULU Time? (Private Pilot Ground Lesson 23)",
    duration: '5:47',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on What is ZULU Time?.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### What is ZULU Time? (Private Pilot Ground Lesson 23)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'What is ZULU Time? (Private Pilot Ground Lesson 23)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 24,
    videoId: 'AaI_DjRwnhk',
    title: "Latitude and Longitude Explained (Aviation) Private Pilot Ground Lesson 24",
    duration: '7:31',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on Latitude and Longitude Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Latitude and Longitude Explained (Aviation) Private Pilot Ground Lesson 24\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Latitude and Longitude Explained (Aviation) Private Pilot Ground Lesson 24' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 25,
    videoId: 'TMkqcorBcdU',
    title: "VFR Sectional Explained! (All About Airports) Private Pilot Ground Lesson 25",
    duration: '7:16',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on VFR Sectional Explained!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### VFR Sectional Explained! (All About Airports) Private Pilot Ground Lesson 25\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_NAV_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'VFR Sectional Explained! (All About Airports) Private Pilot Ground Lesson 25' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 26,
    videoId: '5KpJzNHLe-M',
    title: "How to Use the VFR sectional to pick SAFE Altitudes. (Private Pilot Ground Lesson 26)",
    duration: '5:44',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on How to Use the VFR sectional to pick SAFE Altitudes..", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Use the VFR sectional to pick SAFE Altitudes. (Private Pilot Ground Lesson 26)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_NAV_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'How to Use the VFR sectional to pick SAFE Altitudes. (Private Pilot Ground Lesson 26)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 27,
    videoId: 'Kohx5s6BCRQ',
    title: "VFR Navigational Symbols Explained (Private Pilot Ground Lesson 27)",
    duration: '6:07',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on VFR Navigational Symbols Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### VFR Navigational Symbols Explained (Private Pilot Ground Lesson 27)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PPL_NAV_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'VFR Navigational Symbols Explained (Private Pilot Ground Lesson 27)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 28,
    videoId: 'JySkSwAnwos',
    title: "Heading Indicator (How It Works) Private Pilot Ground Lesson 28",
    duration: '6:25',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on Heading Indicator.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Heading Indicator (How It Works) Private Pilot Ground Lesson 28\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.INST_DG,
    quiz: [
      {
        question: "Which subject area does the video 'Heading Indicator (How It Works) Private Pilot Ground Lesson 28' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 29,
    videoId: 'ZBU55yIje-Y',
    title: "How the Attitude Indicator Works (Private Pilot Ground Lesson 29)",
    duration: '6:52',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on How the Attitude Indicator Works.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How the Attitude Indicator Works (Private Pilot Ground Lesson 29)\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.INST_ATTITUDE,
    quiz: [
      {
        question: "Which subject area does the video 'How the Attitude Indicator Works (Private Pilot Ground Lesson 29)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 30,
    videoId: '_SvHsQZdMZ8',
    title: "Turn Coordinator VS Turn and Slip Indicator (AND How they Work) Private Pilot Ground Lesson 30",
    duration: '7:39',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on Turn Coordinator VS Turn and Slip Indicator.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Turn Coordinator VS Turn and Slip Indicator (AND How they Work) Private Pilot Ground Lesson 30\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.INST_TURN_INDICATOR,
    quiz: [
      {
        question: "Which subject area does the video 'Turn Coordinator VS Turn and Slip Indicator (AND How they Work) Private Pilot Ground Lesson 30' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 31,
    videoId: 'QkfC43VTZaE',
    title: "How the PITOT - STATIC system works (Private Pilot Ground Lesson 31)",
    duration: '8:25',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on How the PITOT - STATIC system works.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How the PITOT - STATIC system works (Private Pilot Ground Lesson 31)\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.INST_PITOT_STATIC,
    quiz: [
      {
        question: "Which instruments are connected to the static port?",
        options: ["Airspeed Indicator, Altimeter, and Vertical Speed Indicator", "Attitude Indicator, DG, and Turn Coordinator", "Airspeed Indicator only", "Altimeter and VSI only"],
        answerIndex: 0,
        explanation: "The static port provides reference pressure to the ASI, Altimeter, and VSI."
      },
      {
        question: "If the pitot tube's inlet hole is blocked but the drain hole remains open, what will the airspeed indicator read?",
        options: ["It will freeze on its current reading", "It will drop to zero", "It will read excessively high in a climb", "It will remain normal"],
        answerIndex: 1,
        explanation: "If the inlet is blocked but the drain is open, the pressure inside the pitot lines leaks out the drain hole, causing the ASI to read zero."
      },
      {
        question: "If the static port freezes completely during a climb, how will the altimeter behave?",
        options: ["It will continue to climb normally", "It will freeze at the altitude where the blockage occurred", "It will drop to zero", "It will read lower than actual altitude"],
        answerIndex: 1,
        explanation: "The altimeter relies on changing static pressure. If the port is blocked, the trapped static pressure causes it to freeze at the blocked altitude."
      },
    ]
  },
  {
    index: 32,
    videoId: 'q27N5EFWmpM',
    title: "Every Pilot Should Know THIS About the Altimeter (Private Pilot Ground Lesson 32)",
    duration: '10:11',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on Every Pilot Should Know THIS About the Altimeter.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Every Pilot Should Know THIS About the Altimeter (Private Pilot Ground Lesson 32)\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.INST_ALTIMETER,
    quiz: [
      {
        question: "Which subject area does the video 'Every Pilot Should Know THIS About the Altimeter (Private Pilot Ground Lesson 32)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 33,
    videoId: 'WC-iOlckdf4',
    title: "There’s MORE to know than you think! (Private Pilot Ground Lesson 33)",
    duration: '12:28',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on There’s MORE to know than you think!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### There’s MORE to know than you think! (Private Pilot Ground Lesson 33)\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.INST_VSI,
    quiz: [
      {
        question: "Which subject area does the video 'There’s MORE to know than you think! (Private Pilot Ground Lesson 33)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 34,
    videoId: 'oWxeAqcNSJU',
    title: "Do I need SPECIAL TRAINING to Fly with DIGITAL Instruments? (Private Pilot Ground Lesson 34)",
    duration: '6:29',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on Do I need SPECIAL TRAINING to Fly with DIGITAL Instruments?.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Do I need SPECIAL TRAINING to Fly with DIGITAL Instruments? (Private Pilot Ground Lesson 34)\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Do I need SPECIAL TRAINING to Fly with DIGITAL Instruments? (Private Pilot Ground Lesson 34)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 35,
    videoId: 'ndHyt1fbBcM',
    title: "Don't be Afraid of ATC   Here's Why! (Private Pilot Ground Lesson 35)",
    duration: '16:01',
    subjectId: 'ppl-comms',
    category: 'Radio Communications',
    summary: ["Master the core operational guidelines presented in this lesson on Don't be Afraid of ATC   Here's Why!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Don't be Afraid of ATC   Here's Why! (Private Pilot Ground Lesson 35)\n\nThis lesson covers the fundamental concepts of **Radio Communications**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.VFR_COMMS_SIM,
    quiz: [
      {
        question: "Which subject area does the video 'Don't be Afraid of ATC   Here's Why! (Private Pilot Ground Lesson 35)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Radio Communications"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Radio Communications syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 36,
    videoId: '-_xBS6vTO9E',
    title: "Non-Towered Radio Calls Made Easy",
    duration: '11:14',
    subjectId: 'ppl-comms',
    category: 'Radio Communications',
    summary: ["Master the core operational guidelines presented in this lesson on Non-Towered Radio Calls Made Easy.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Non-Towered Radio Calls Made Easy\n\nThis lesson covers the fundamental concepts of **Radio Communications**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.VFR_COMMS_SIM,
    quiz: [
      {
        question: "Which subject area does the video 'Non-Towered Radio Calls Made Easy' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Radio Communications"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Radio Communications syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 37,
    videoId: '0JRVTlLJ7hk',
    title: "What is ATIS (AND How to USE it) Private Pilot Ground Lesson 36",
    duration: '9:10',
    subjectId: 'ppl-comms',
    category: 'Radio Communications',
    summary: ["Master the core operational guidelines presented in this lesson on What is ATIS.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### What is ATIS (AND How to USE it) Private Pilot Ground Lesson 36\n\nThis lesson covers the fundamental concepts of **Radio Communications**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'What is ATIS (AND How to USE it) Private Pilot Ground Lesson 36' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Radio Communications"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Radio Communications syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 38,
    videoId: '6S95qXQNTzM',
    title: "You WILL Understand VORs after Watching This! (PPL Lesson 37)",
    duration: '19:18',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on You WILL Understand VORs after Watching This!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### You WILL Understand VORs after Watching This! (PPL Lesson 37)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.RAD_NAV_VOR,
    quiz: [
      {
        question: "What does VOR stand for in aviation navigation?",
        options: ["Variable Omnidirectional Radar", "VHF Omnidirectional Range", "Vertical Orientation Receiver", "Vector Omnidirectional Range"],
        answerIndex: 1,
        explanation: "VOR stands for VHF Omnidirectional Range, a ground-based radio navigation aid operating in the VHF band."
      },
      {
        question: "If your VOR receiver has an OBS selected to 360, a FROM flag, and the CDI needle is deflected to the left, which radial are you on?",
        options: ["To the east of the VOR (090 radial)", "To the west of the VOR (270 radial)", "To the east (045 radial)", "On the 010 radial"],
        answerIndex: 0,
        explanation: "With a 360 OBS selection and FROM flag, the CDI needle behaves directly. A needle to the left indicates you are east of the course, meaning you are on an easterly radial (e.g. 010-090)."
      },
      {
        question: "What is the angular width of one dot of deflection on a standard VOR CDI?",
        options: ["1 degree", "2 degrees", "5 degrees", "10 degrees"],
        answerIndex: 1,
        explanation: "Each dot of deflection on a standard VOR indicator represents 2 degrees of deviation from the selected radial course."
      },
    ]
  },
  {
    index: 39,
    videoId: 'yh73ip84M4I',
    title: "GPS Navigation Explained (Private Pilot Ground Lesson 38)",
    duration: '7:54',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on GPS Navigation Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### GPS Navigation Explained (Private Pilot Ground Lesson 38)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'GPS Navigation Explained (Private Pilot Ground Lesson 38)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 40,
    videoId: 'A4eIGJrntXg',
    title: "Weather BASICS explained (EASY to Understand) PPL Lesson 39",
    duration: '27:33',
    subjectId: 'ppl-met',
    category: 'Aviation Meteorology',
    summary: ["Master the core operational guidelines presented in this lesson on Weather BASICS explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Weather BASICS explained (EASY to Understand) PPL Lesson 39\n\nThis lesson covers the fundamental concepts of **Aviation Meteorology**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Weather BASICS explained (EASY to Understand) PPL Lesson 39' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aviation Meteorology"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aviation Meteorology syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 41,
    videoId: 'DCJ7HbF1zWQ',
    title: "Breaking the WEATHER CODE! (PPL Lesson 40)",
    duration: '19:58',
    subjectId: 'ppl-met',
    category: 'Aviation Meteorology',
    summary: ["Master the core operational guidelines presented in this lesson on Breaking the WEATHER CODE!.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Breaking the WEATHER CODE! (PPL Lesson 40)\n\nThis lesson covers the fundamental concepts of **Aviation Meteorology**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.MET_METAR_TAF,
    quiz: [
      {
        question: "Which subject area does the video 'Breaking the WEATHER CODE! (PPL Lesson 40)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aviation Meteorology"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aviation Meteorology syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 42,
    videoId: 'aMsLBdnxiWg',
    title: "WINDS ALOFT and Other XC Weather Charts EXPLAINED (PPL Lesson 41)",
    duration: '18:18',
    subjectId: 'ppl-met',
    category: 'Aviation Meteorology',
    summary: ["Master the core operational guidelines presented in this lesson on WINDS ALOFT and Other XC Weather Charts EXPLAINED.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### WINDS ALOFT and Other XC Weather Charts EXPLAINED (PPL Lesson 41)\n\nThis lesson covers the fundamental concepts of **Aviation Meteorology**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.MET_CHARTS,
    quiz: [
      {
        question: "Which subject area does the video 'WINDS ALOFT and Other XC Weather Charts EXPLAINED (PPL Lesson 41)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aviation Meteorology"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aviation Meteorology syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 43,
    videoId: 'BHIPomiLvYg',
    title: "Don't Trust the Weatherman? Check these before you go FLY (PPL Lesson 42)",
    duration: '13:45',
    subjectId: 'ppl-met',
    category: 'Aviation Meteorology',
    summary: ["Master the core operational guidelines presented in this lesson on Don't Trust the Weatherman? Check these before you go FLY.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Don't Trust the Weatherman? Check these before you go FLY (PPL Lesson 42)\n\nThis lesson covers the fundamental concepts of **Aviation Meteorology**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Don't Trust the Weatherman? Check these before you go FLY (PPL Lesson 42)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aviation Meteorology"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aviation Meteorology syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 44,
    videoId: 'D2gBdygxgW0',
    title: "Prog Charts EXPLAINED (PPL Lesson 43)",
    duration: '6:27',
    subjectId: 'ppl-met',
    category: 'Aviation Meteorology',
    summary: ["Master the core operational guidelines presented in this lesson on Prog Charts EXPLAINED.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Prog Charts EXPLAINED (PPL Lesson 43)\n\nThis lesson covers the fundamental concepts of **Aviation Meteorology**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Prog Charts EXPLAINED (PPL Lesson 43)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aviation Meteorology"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aviation Meteorology syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 45,
    videoId: 'pvBNaSMaFd8',
    title: "Flight Service Stations MADE EASY (PPL Lesson 44)",
    duration: '11:34',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on Flight Service Stations MADE EASY.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Flight Service Stations MADE EASY (PPL Lesson 44)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Flight Service Stations MADE EASY (PPL Lesson 44)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 46,
    videoId: 'FoGmomeNVb8',
    title: "6 BIG Weather Hazards and TIPS to Avoid Them (PPL Lesson 45)",
    duration: '24:13',
    subjectId: 'ppl-met',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on 6 BIG Weather Hazards and TIPS to Avoid Them.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### 6 BIG Weather Hazards and TIPS to Avoid Them (PPL Lesson 45)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video '6 BIG Weather Hazards and TIPS to Avoid Them (PPL Lesson 45)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 47,
    videoId: 'Ydvev6B7IaY',
    title: "X/C Navigation Log Explained (WITH Calculations) PPL Lesson 46",
    duration: '37:43',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on X/C Navigation Log Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### X/C Navigation Log Explained (WITH Calculations) PPL Lesson 46\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.FLIGHT_PLAN_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'X/C Navigation Log Explained (WITH Calculations) PPL Lesson 46' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 48,
    videoId: 'L8ORGN6zZog',
    title: "The COMPLETE Guide on the E6B Flight Computer (PPL Lesson 47)",
    duration: '43:39',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on The COMPLETE Guide on the E6B Flight Computer.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### The COMPLETE Guide on the E6B Flight Computer (PPL Lesson 47)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.KSA_MENTAL_MATHS,
    quiz: [
      {
        question: "Which subject area does the video 'The COMPLETE Guide on the E6B Flight Computer (PPL Lesson 47)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 49,
    videoId: 'QXz9sMUdbZ0',
    title: "You DON'T Need an E6B Flight Computer (PPL Lesson 48)",
    duration: '23:51',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on You DON'T Need an E6B Flight Computer.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### You DON'T Need an E6B Flight Computer (PPL Lesson 48)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'You DON'T Need an E6B Flight Computer (PPL Lesson 48)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 50,
    videoId: '2tIYJyRldzM',
    title: "How to Fly a Cross Country with a NAV LOG (PPL Lesson 49)",
    duration: '43:58',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on How to Fly a Cross Country with a NAV LOG.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Fly a Cross Country with a NAV LOG (PPL Lesson 49)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.FLIGHT_PLAN_HOME,
    quiz: [
      {
        question: "Which subject area does the video 'How to Fly a Cross Country with a NAV LOG (PPL Lesson 49)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 51,
    videoId: 'ix_BShDvvts',
    title: "The Complete Guide to Weight and Balance (PPL Lesson 50)",
    duration: '38:07',
    subjectId: 'ppl-perf',
    category: 'Performance & Planning',
    summary: ["Master the core operational guidelines presented in this lesson on The Complete Guide to Weight and Balance.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### The Complete Guide to Weight and Balance (PPL Lesson 50)\n\nThis lesson covers the fundamental concepts of **Performance & Planning**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.MASS_BAL_CG_CALC,
    quiz: [
      {
        question: "How is the Center of Gravity (CG) calculated?",
        options: ["Total Weight / Total Moment", "Total Moment / Total Weight", "Total Arm * Total Weight", "Front Seat Arm - Rear Seat Arm"],
        answerIndex: 1,
        explanation: "CG is calculated by dividing the sum of all moments by the sum of all weights (CG = Total Moment / Total Weight)."
      },
      {
        question: "What are the flight characteristics of an airplane loaded with an extremely aft Center of Gravity (CG)?",
        options: ["High stability and easy stall recovery", "Less stable, pitch up tendencies, and difficult stall recovery", "Stall speed increases significantly", "Rudimentary control forces become heavy"],
        answerIndex: 1,
        explanation: "An aft CG reduces longitudinal stability and pitching moment authority, making the aircraft prone to pitch-up tendencies and extremely difficult to recover from stalls and spins."
      },
      {
        question: "What is the weight of one gallon of standard aviation gasoline (Avgas)?",
        options: ["6.0 lbs", "7.5 lbs", "8.3 lbs", "6.7 lbs"],
        answerIndex: 0,
        explanation: "For aviation weight and balance calculations, Avgas is calculated at a standard weight of 6.0 pounds per U.S. gallon."
      },
    ]
  },
  {
    index: 52,
    videoId: 'RMitIgzeSgo',
    title: "Aircraft Performance EXPLAINED (PPL Lesson 51)",
    duration: '50:46',
    subjectId: 'ppl-perf',
    category: 'Performance & Planning',
    summary: ["Master the core operational guidelines presented in this lesson on Aircraft Performance EXPLAINED.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Aircraft Performance EXPLAINED (PPL Lesson 51)\n\nThis lesson covers the fundamental concepts of **Performance & Planning**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.PERF_TAKEOFF,
    quiz: [
      {
        question: "Which subject area does the video 'Aircraft Performance EXPLAINED (PPL Lesson 51)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Performance & Planning"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Performance & Planning syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 53,
    videoId: 'AKFVSq94_Cg',
    title: "Which Documents are REQUIRED to Fly Legally? ( FREE Private Pilot Lesson 52)",
    duration: '24:05',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Which Documents are REQUIRED to Fly Legally?.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Which Documents are REQUIRED to Fly Legally? ( FREE Private Pilot Lesson 52)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_DOCS,
    quiz: [
      {
        question: "Which subject area does the video 'Which Documents are REQUIRED to Fly Legally? ( FREE Private Pilot Lesson 52)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 54,
    videoId: 'pzAqxNSqv8w',
    title: "Basic Med Explained | How to Use Basic Med Instead of an FAA Medical (Easy to Use)",
    duration: '14:12',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Basic Med Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Basic Med Explained | How to Use Basic Med Instead of an FAA Medical (Easy to Use)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Basic Med Explained' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 55,
    videoId: 'n0KrBfRJD0A',
    title: "What Can I Do With My Pilots License? (PPL Lesson 54)",
    duration: '25:14',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on What Can I Do With My Pilots License?.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### What Can I Do With My Pilots License? (PPL Lesson 54)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'What Can I Do With My Pilots License? (PPL Lesson 54)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 56,
    videoId: 'uowNUuqzVyY',
    title: "These Regulations Can Prevent a Mid-Air Collision (PPL Lesson 55)",
    duration: '50:02',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on These Regulations Can Prevent a Mid-Air Collision.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### These Regulations Can Prevent a Mid-Air Collision (PPL Lesson 55)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'These Regulations Can Prevent a Mid-Air Collision (PPL Lesson 55)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 57,
    videoId: 'v1ARrbrbkaI',
    title: "Aircraft Seatbelts and Safety Regulations Explained (PPL Lesson 56)",
    duration: '27:10',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Aircraft Seatbelts and Safety Regulations Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Aircraft Seatbelts and Safety Regulations Explained (PPL Lesson 56)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Aircraft Seatbelts and Safety Regulations Explained (PPL Lesson 56)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 58,
    videoId: 'EfJspfZfjKM',
    title: "Maintenance BASICS Explained (EASY to Understand) PPL Lesson 57",
    duration: '41:17',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on Maintenance BASICS Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Maintenance BASICS Explained (EASY to Understand) PPL Lesson 57\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Maintenance BASICS Explained (EASY to Understand) PPL Lesson 57' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 59,
    videoId: 'LC9-PgdDFmo',
    title: "NOTAMS & The Chart Supplement EXPLAINED (PPL Lesson 58)",
    duration: '44:45',
    subjectId: 'ppl-nav',
    category: 'Navigation & Charts',
    summary: ["Master the core operational guidelines presented in this lesson on NOTAMS & The Chart Supplement EXPLAINED.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### NOTAMS & The Chart Supplement EXPLAINED (PPL Lesson 58)\n\nThis lesson covers the fundamental concepts of **Navigation & Charts**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'NOTAMS & The Chart Supplement EXPLAINED (PPL Lesson 58)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Navigation & Charts"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Navigation & Charts syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 60,
    videoId: '1J5g3G7A4N8',
    title: "Physiology BASICS and RISK Management Explained (PPL Lesson 59)",
    duration: '26:04',
    subjectId: 'ppl-hpl',
    category: 'Human Factors',
    summary: ["Master the core operational guidelines presented in this lesson on Physiology BASICS and RISK Management Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Physiology BASICS and RISK Management Explained (PPL Lesson 59)\n\nThis lesson covers the fundamental concepts of **Human Factors**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Physiology BASICS and RISK Management Explained (PPL Lesson 59)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Human Factors"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Human Factors syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 61,
    videoId: 'sxeBngtzvz0',
    title: "How to Operate an Airplane | The Basics! (PPL Lesson 60)",
    duration: '30:12',
    subjectId: 'ppl-agk',
    category: 'Aircraft Systems & Instruments',
    summary: ["Master the core operational guidelines presented in this lesson on How to Operate an Airplane.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Operate an Airplane | The Basics! (PPL Lesson 60)\n\nThis lesson covers the fundamental concepts of **Aircraft Systems & Instruments**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'How to Operate an Airplane' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aircraft Systems & Instruments"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aircraft Systems & Instruments syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 62,
    videoId: 'Yacx4jNQlgo',
    title: "Airport Signs, Markings, and Lighting Explained (Simple and Fun) PPL Ground Lesson 61",
    duration: '21:34',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Airport Signs, Markings, and Lighting Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Airport Signs, Markings, and Lighting Explained (Simple and Fun) PPL Ground Lesson 61\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    relatedView: View.AIR_LAW_SIGNS,
    quiz: [
      {
        question: "Which subject area does the video 'Airport Signs, Markings, and Lighting Explained (Simple and Fun) PPL Ground Lesson 61' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 63,
    videoId: 'OvR3VQKEIr0',
    title: "Airport Traffic Patterns Explained (PPL Ground Lesson 62)",
    duration: '33:39',
    subjectId: 'ppl-airlaw',
    category: 'Regulations & Airspace',
    summary: ["Master the core operational guidelines presented in this lesson on Airport Traffic Patterns Explained.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### Airport Traffic Patterns Explained (PPL Ground Lesson 62)\n\nThis lesson covers the fundamental concepts of **Regulations & Airspace**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'Airport Traffic Patterns Explained (PPL Ground Lesson 62)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Regulations & Airspace"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Regulations & Airspace syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
  {
    index: 64,
    videoId: 'tPiBZMRxU3o',
    title: "How to Taxi in Strong Winds (PPL Ground Lesson 63)",
    duration: '9:12',
    subjectId: 'ppl-pof',
    category: 'Aerodynamics',
    summary: ["Master the core operational guidelines presented in this lesson on How to Taxi in Strong Winds.", "Learn key FAA regulatory requirements and EASA equivalent learning objectives.", "Apply these principles to build critical flight planning skills and safe operational habits."],
    notes: "### How to Taxi in Strong Winds (PPL Ground Lesson 63)\n\nThis lesson covers the fundamental concepts of **Aerodynamics**. \n\n#### Key Technical Principles:\n1. **System Components**: Understand the specific parts, terminology, and operation of the topic discussed.\n2. **Regulatory Standards**: Review the applicable Part 91/61 regulations or EASA equivalents.\n3. **Safety & Decision Making**: Apply single-pilot resource management (SRM) to identify limitations and prevent common errors.\n\n*Refer to the interactive simulator on the right to practice these concepts in real time!*",
    quiz: [
      {
        question: "Which subject area does the video 'How to Taxi in Strong Winds (PPL Ground Lesson 63)' relate to?",
        options: ["Principles of Flight", "Meteorology", "Air Law & Regulations", "Aerodynamics"],
        answerIndex: 3,
        explanation: "This video covers core objectives matching the Aerodynamics syllabus."
      },
      {
        question: "Why is preflight planning and knowledge of this topic essential for a private pilot?",
        options: ["It is required to pass the FAA exam only", "It ensures flight safety and regulatory compliance", "It reduces fuel costs by 50%", "It allows flying without a medical certificate"],
        answerIndex: 1,
        explanation: "A complete understanding of flight systems, rules, and navigation is essential for ensuring safety of flight."
      },
      {
        question: "How should a pilot apply the principles taught in this lesson during an flight diversion?",
        options: ["Ignore them and fly straight", "Follow SRM guidelines to prioritize safety, analyze options, and execute", "Immediately land in a field", "Consult ATC before taking any action"],
        answerIndex: 1,
        explanation: "In any abnormal situation or diversion, pilots must apply single-pilot resource management (SRM) to maintain safety."
      },
    ]
  },
];
