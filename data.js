// =====================================================
// TEACHTRACK — Mock Data
// Plan. Teach. Record. Track.
// =====================================================

const MOCK_DATA = {
  // Current user / Teacher Profile Data — Prof. Ishita Sharma
  user: {
    id: 'u1',
    name: 'Ishita Sharma',
    email: 'ishita.sharma@school.edu',
    role: 'Senior TGT English Literature & Language',
    initials: 'IS',
    employeeId: 'TCH-2018-0842',
    qualification: 'M.A. English Literature, B.Ed. (Gold Medalist)',
    phone: '+91 98765 43210',
    address: 'Flat 402, Lotus Orchid Enclave, Green Avenue, New Delhi',
    department: 'Department of English & Humanities',
    joinDate: '2018-07-15',
    totalExperience: '8+ Years',
    avatarUrl: 'ishita-avatar.jpg',
    subjects: ['English Literature', 'Creative Writing', 'Grammar & Composition'],
    assignedClasses: ['c1', 'c2', 'c3'],
    bio: 'Passionate English educator inspiring student voices through literature, creative writing workshops, critical text analysis, and joyful classroom discourse.',
    achievements: [
      'National Literature Educator of the Year 2024',
      'Creative Pedagogy Fellowship in Humanities',
      '100% Distinction Rate in Class 9 English Board Examinations'
    ]
  },

  // Today's Teacher Work Tasks (with progress tracking & experience reviews)
  teacherTasks: [
    {
      id: 'tk1',
      title: 'Guide Poetic Imagery & Metaphor seminar on Robert Frost with Class 8A',
      subject: 'English Literature',
      className: 'Class 8A',
      completed: true,
      timeEst: '45 mins',
      review: 'Exceptional classroom engagement! Students connected the themes of choice and individuality in Frost with personal reflections. Ananya and Rohan shared brilliant interpretations.'
    },
    {
      id: 'tk2',
      title: 'Review and provide personalized feedback on Flash Fiction stories for Class 7B',
      subject: 'Creative Writing',
      className: 'Class 7B',
      completed: true,
      timeEst: '30 mins',
      review: '24 out of 28 students demonstrated great sensory detail. Plan a 10-minute micro-lesson on dialogue punctuation tomorrow.'
    },
    {
      id: 'tk3',
      title: 'Formulate formative quiz questions on Shakespearean Drama & Character Motifs for Class 9A',
      subject: 'English Literature',
      className: 'Class 9A',
      completed: true,
      timeEst: '25 mins',
      review: 'Interactive quiz set and shared via the classroom portal. Kabir and Priya aced the soliloquy analysis.'
    },
    {
      id: 'tk4',
      title: 'Host parent discussion regarding student public speaking & debate club mentorship',
      subject: 'Student Mentorship',
      className: 'Class 8A',
      completed: false,
      timeEst: '20 mins',
      review: ''
    },
    {
      id: 'tk5',
      title: 'Prepare digital revision slides on Active-Passive Voice transformation for Class 6A',
      subject: 'Grammar',
      className: 'Class 6A',
      completed: false,
      timeEst: '35 mins',
      review: ''
    }
  ],

  // Mood Quotes library for Speedometer Mood Gauge
  moodQuotes: [
    {
      min: 1, max: 3,
      zone: 'recharge',
      zoneLabel: 'Recharging & Restorative',
      quote: "Give yourself permission to pause. Even the quietest chapters in literature hold profound strength.",
      author: "Virginia Woolf"
    },
    {
      min: 1, max: 3,
      zone: 'recharge',
      zoneLabel: 'Recharging & Restorative',
      quote: "Teaching is an act of deep heart. On heavy days, simply showing up with kindness is a monumental victory.",
      author: "Parker J. Palmer"
    },
    {
      min: 4, max: 6,
      zone: 'steady',
      zoneLabel: 'Steady & Grounded',
      quote: "Words have the power to create light in unexpected places. Take this day one steady sentence at a time.",
      author: "Emily Dickinson"
    },
    {
      min: 4, max: 6,
      zone: 'steady',
      zoneLabel: 'Steady & Grounded',
      quote: "The art of teaching is the art of assisting discovery. Steady patience turns curiosity into lasting understanding.",
      author: "Mark Van Doren"
    },
    {
      min: 7, max: 8,
      zone: 'energized',
      zoneLabel: 'Energized & Inspired',
      quote: "Literature is the immortality of speech. Your passion today sparks a lifelong love for reading in your students.",
      author: "Ralph Waldo Emerson"
    },
    {
      min: 7, max: 8,
      zone: 'energized',
      zoneLabel: 'Energized & Inspired',
      quote: "When a teacher brings enthusiasm into the room, every page of the book comes alive with vibrant possibility.",
      author: "Maya Angelou"
    },
    {
      min: 9, max: 10,
      zone: 'peak',
      zoneLabel: 'Peak Creative Flow',
      quote: "You are weaving ideas into memories that will echo for decades. Ride this radiant momentum to inspire greatness!",
      author: "Rabindranath Tagore"
    },
    {
      min: 9, max: 10,
      zone: 'peak',
      zoneLabel: 'Peak Creative Flow',
      quote: "One child, one teacher, one book, one pen can change the entire world. Celebrate your extraordinary impact.",
      author: "Malala Yousafzai"
    }
  ],

  // Classes (Schedule removed)
  classes: [
    {
      id: 'c1',
      name: 'Class 6A',
      section: 'A',
      grade: 6,
      studentCount: 32,
      subjects: ['Science', 'Mathematics', 'Social Science'],
      color: 'blue'
    },
    {
      id: 'c2',
      name: 'Class 7B',
      section: 'B',
      grade: 7,
      studentCount: 28,
      subjects: ['Science', 'Mathematics'],
      color: 'green'
    },
    {
      id: 'c3',
      name: 'Class 8A',
      section: 'A',
      grade: 8,
      studentCount: 35,
      subjects: ['Science', 'Mathematics', 'Social Science'],
      color: 'amber'
    },
    {
      id: 'c4',
      name: 'Class 9A',
      section: 'A',
      grade: 9,
      studentCount: 30,
      subjects: ['Science', 'Mathematics'],
      color: 'purple'
    }
  ],

  // Syllabus structure
  syllabus: {
    'Science': {
      'c1': [
        {
          id: 'ch1', name: 'Food: Where Does It Come From?',
          topics: [
            { id: 't1', name: 'Sources of Food', status: 'completed', completedDate: '2026-07-20', hours: 2 },
            { id: 't2', name: 'Plant Parts as Food', status: 'completed', completedDate: '2026-07-22', hours: 1.5 },
            { id: 't3', name: 'Animal Products as Food', status: 'completed', completedDate: '2026-07-25', hours: 1 }
          ]
        },
        {
          id: 'ch2', name: 'Components of Food',
          topics: [
            { id: 't4', name: 'Nutrients in Food', status: 'completed', completedDate: '2026-07-28', hours: 2 },
            { id: 't5', name: 'Balanced Diet', status: 'completed', completedDate: '2026-08-01', hours: 1.5 },
            { id: 't6', name: 'Deficiency Diseases', status: 'in-progress', completedDate: null, hours: 2 }
          ]
        },
        {
          id: 'ch3', name: 'Fibre to Fabric',
          topics: [
            { id: 't7', name: 'Types of Fibres', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't8', name: 'Spinning and Weaving', status: 'not-started', completedDate: null, hours: 1.5 },
            { id: 't9', name: 'History of Clothing', status: 'not-started', completedDate: null, hours: 1 }
          ]
        },
        {
          id: 'ch4', name: 'Sorting Materials',
          topics: [
            { id: 't10', name: 'Objects and Materials', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't11', name: 'Properties of Materials', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't12', name: 'Grouping Materials', status: 'not-started', completedDate: null, hours: 1.5 }
          ]
        }
      ],
      'c4': [
        {
          id: 'ch5', name: 'Motion',
          topics: [
            { id: 't13', name: 'Describing Motion', status: 'completed', completedDate: '2026-07-18', hours: 2 },
            { id: 't14', name: 'Speed and Velocity', status: 'completed', completedDate: '2026-07-22', hours: 2 },
            { id: 't15', name: 'Acceleration', status: 'completed', completedDate: '2026-07-25', hours: 2 },
            { id: 't16', name: 'Graphical Representation', status: 'in-progress', completedDate: null, hours: 3 },
            { id: 't17', name: 'Equations of Motion', status: 'not-started', completedDate: null, hours: 3 }
          ]
        },
        {
          id: 'ch6', name: 'Force and Laws of Motion',
          topics: [
            { id: 't18', name: 'Balanced and Unbalanced Forces', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't19', name: 'First Law of Motion', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't20', name: 'Inertia', status: 'not-started', completedDate: null, hours: 1.5 },
            { id: 't21', name: 'Second Law of Motion', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't22', name: 'Third Law of Motion', status: 'not-started', completedDate: null, hours: 2 }
          ]
        },
        {
          id: 'ch7', name: 'Gravitation',
          topics: [
            { id: 't23', name: 'Universal Law of Gravitation', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't24', name: 'Free Fall', status: 'not-started', completedDate: null, hours: 1.5 },
            { id: 't25', name: 'Mass and Weight', status: 'not-started', completedDate: null, hours: 1 }
          ]
        }
      ],
      'c2': [
        {
          id: 'ch8', name: 'Nutrition in Plants',
          topics: [
            { id: 't26', name: 'Modes of Nutrition', status: 'completed', completedDate: '2026-07-20', hours: 2 },
            { id: 't27', name: 'Photosynthesis', status: 'completed', completedDate: '2026-07-24', hours: 2.5 },
            { id: 't28', name: 'Other Modes of Nutrition', status: 'in-progress', completedDate: null, hours: 2 },
            { id: 't29', name: 'Saprotrophs', status: 'not-started', completedDate: null, hours: 1 }
          ]
        },
        {
          id: 'ch9', name: 'Nutrition in Animals',
          topics: [
            { id: 't30', name: 'Different Ways of Taking Food', status: 'not-started', completedDate: null, hours: 1.5 },
            { id: 't31', name: 'Digestion in Humans', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't32', name: 'Digestion in Grass-eating Animals', status: 'not-started', completedDate: null, hours: 1 }
          ]
        }
      ],
      'c3': [
        {
          id: 'ch10', name: 'Crop Production and Management',
          topics: [
            { id: 't33', name: 'Agricultural Practices', status: 'completed', completedDate: '2026-07-22', hours: 2 },
            { id: 't34', name: 'Preparation of Soil', status: 'completed', completedDate: '2026-07-25', hours: 1.5 },
            { id: 't35', name: 'Sowing', status: 'completed', completedDate: '2026-07-28', hours: 1.5 },
            { id: 't36', name: 'Irrigation', status: 'in-progress', completedDate: null, hours: 2 }
          ]
        },
        {
          id: 'ch11', name: 'Microorganisms',
          topics: [
            { id: 't37', name: 'Microorganisms and Where They Live', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't38', name: 'Harmful Microorganisms', status: 'not-started', completedDate: null, hours: 2 },
            { id: 't39', name: 'Food Preservation', status: 'not-started', completedDate: null, hours: 1.5 }
          ]
        }
      ]
    },
    'Mathematics': {
      'c1': [
        {
          id: 'mch1', name: 'Knowing Our Numbers',
          topics: [
            { id: 'mt1', name: 'Comparing Numbers', status: 'completed', completedDate: '2026-07-19', hours: 2 },
            { id: 'mt2', name: 'Large Numbers', status: 'completed', completedDate: '2026-07-23', hours: 2 },
            { id: 'mt3', name: 'Estimation', status: 'in-progress', completedDate: null, hours: 2 },
            { id: 'mt4', name: 'Roman Numerals', status: 'not-started', completedDate: null, hours: 1 }
          ]
        },
        {
          id: 'mch2', name: 'Whole Numbers',
          topics: [
            { id: 'mt5', name: 'Predecessor and Successor', status: 'not-started', completedDate: null, hours: 1 },
            { id: 'mt6', name: 'Number Line', status: 'not-started', completedDate: null, hours: 1.5 },
            { id: 'mt7', name: 'Properties of Whole Numbers', status: 'not-started', completedDate: null, hours: 2 }
          ]
        }
      ],
      'c4': [
        {
          id: 'mch3', name: 'Number Systems',
          topics: [
            { id: 'mt8', name: 'Rational Numbers', status: 'completed', completedDate: '2026-07-20', hours: 2 },
            { id: 'mt9', name: 'Irrational Numbers', status: 'completed', completedDate: '2026-07-24', hours: 2 },
            { id: 'mt10', name: 'Real Numbers', status: 'in-progress', completedDate: null, hours: 2 },
            { id: 'mt11', name: 'Operations on Real Numbers', status: 'not-started', completedDate: null, hours: 2 }
          ]
        },
        {
          id: 'mch4', name: 'Polynomials',
          topics: [
            { id: 'mt12', name: 'Polynomials in One Variable', status: 'not-started', completedDate: null, hours: 2 },
            { id: 'mt13', name: 'Zeroes of a Polynomial', status: 'not-started', completedDate: null, hours: 2 },
            { id: 'mt14', name: 'Remainder Theorem', status: 'not-started', completedDate: null, hours: 2 }
          ]
        }
      ],
      'c2': [
        {
          id: 'mch5', name: 'Integers',
          topics: [
            { id: 'mt15', name: 'Integers and their Properties', status: 'completed', completedDate: '2026-07-21', hours: 2 },
            { id: 'mt16', name: 'Addition of Integers', status: 'completed', completedDate: '2026-07-24', hours: 1.5 },
            { id: 'mt17', name: 'Subtraction of Integers', status: 'in-progress', completedDate: null, hours: 1.5 }
          ]
        }
      ],
      'c3': [
        {
          id: 'mch6', name: 'Rational Numbers',
          topics: [
            { id: 'mt18', name: 'Properties of Rational Numbers', status: 'completed', completedDate: '2026-07-22', hours: 2 },
            { id: 'mt19', name: 'Representation on Number Line', status: 'completed', completedDate: '2026-07-26', hours: 1.5 },
            { id: 'mt20', name: 'Rational Numbers Between Two Numbers', status: 'in-progress', completedDate: null, hours: 2 }
          ]
        }
      ]
    },
    'Social Science': {
      'c1': [
        {
          id: 'sch1', name: 'What, Where, How and When?',
          topics: [
            { id: 'st1', name: 'Sources of History', status: 'completed', completedDate: '2026-07-20', hours: 2 },
            { id: 'st2', name: 'Understanding the Past', status: 'completed', completedDate: '2026-07-24', hours: 1.5 },
            { id: 'st3', name: 'Archaeological Sources', status: 'in-progress', completedDate: null, hours: 2 }
          ]
        }
      ],
      'c3': [
        {
          id: 'sch2', name: 'Resources',
          topics: [
            { id: 'st4', name: 'Types of Resources', status: 'completed', completedDate: '2026-07-21', hours: 2 },
            { id: 'st5', name: 'Natural Resources', status: 'in-progress', completedDate: null, hours: 2 },
            { id: 'st6', name: 'Human Resources', status: 'not-started', completedDate: null, hours: 1.5 }
          ]
        }
      ]
    }
  },

  // Students (Enhanced with Roll No, Photo, Parent Info, Address, Phone, etc.)
  students: [
    // Class 6A
    {
      id: 's1',
      name: 'Aarav Patel',
      classId: 'c1',
      rollNo: 1,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      parentName: 'Vikram & Sunita Patel',
      phone: '+91 98112 34567',
      address: 'House 42, Pocket B, Mayur Vihar Phase 1, New Delhi',
      bloodGroup: 'B+',
      emergencyContact: '+91 98112 34568',
      avatarColor: 'blue',
      attendance: 94,
      avgGrade: 'A',
      scores: { Science: 88, Mathematics: 92, 'Social Science': 85 },
      remarks: ['Excellent in problem solving', 'Active class participant']
    },
    {
      id: 's2',
      name: 'Diya Gupta',
      classId: 'c1',
      rollNo: 2,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      parentName: 'Rajesh & Meenakshi Gupta',
      phone: '+91 98223 45678',
      address: 'Flat 304, Palm Grove Heights, Indirapuram, Ghaziabad',
      bloodGroup: 'O+',
      emergencyContact: '+91 98223 45679',
      avatarColor: 'cyan',
      attendance: 97,
      avgGrade: 'A+',
      scores: { Science: 95, Mathematics: 97, 'Social Science': 93 },
      remarks: ['Consistently top performer', 'Helps peers with studies']
    },
    {
      id: 's3',
      name: 'Vivaan Mehta',
      classId: 'c1',
      rollNo: 3,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      parentName: 'Sanjay Mehta',
      phone: '+91 98334 56789',
      address: 'B-12, Sector 15, Noida',
      bloodGroup: 'A+',
      emergencyContact: '+91 98334 56790',
      avatarColor: 'green',
      attendance: 88,
      avgGrade: 'B+',
      scores: { Science: 78, Mathematics: 82, 'Social Science': 80 },
      remarks: ['Good improvement this term', 'Needs more focus on Science']
    },
    {
      id: 's4',
      name: 'Ananya Reddy',
      classId: 'c1',
      rollNo: 4,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      parentName: 'Dr. K. V. Reddy',
      phone: '+91 98445 67890',
      address: 'Villa 8, Lotus Boulevard, Expressway, Noida',
      bloodGroup: 'AB+',
      emergencyContact: '+91 98445 67891',
      avatarColor: 'amber',
      attendance: 92,
      avgGrade: 'A',
      scores: { Science: 90, Mathematics: 85, 'Social Science': 88 },
      remarks: ['Strong in Science experiments']
    },
    {
      id: 's5',
      name: 'Kabir Singh',
      classId: 'c1',
      rollNo: 5,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      parentName: 'Harpreet Singh',
      phone: '+91 98556 78901',
      address: 'House 19, Model Town 2, Delhi',
      bloodGroup: 'B-',
      emergencyContact: '+91 98556 78902',
      avatarColor: 'red',
      attendance: 78,
      avgGrade: 'B',
      scores: { Science: 72, Mathematics: 68, 'Social Science': 75 },
      remarks: ['Irregular attendance', 'Needs additional support in Mathematics']
    },
    {
      id: 's6',
      name: 'Ishita Sharma',
      classId: 'c1',
      rollNo: 6,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      parentName: 'Alok & Ritu Sharma',
      phone: '+91 98667 89012',
      address: 'C-403, Express Greens, Vaishali, Ghaziabad',
      bloodGroup: 'O+',
      emergencyContact: '+91 98667 89013',
      avatarColor: 'blue',
      attendance: 96,
      avgGrade: 'A',
      scores: { Science: 91, Mathematics: 89, 'Social Science': 87 },
      remarks: ['Dedicated student']
    },
    {
      id: 's7',
      name: 'Rohan Kumar',
      classId: 'c1',
      rollNo: 7,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      parentName: 'Manoj Kumar',
      phone: '+91 98778 90123',
      address: 'Plot 78, Kaushambi, Ghaziabad',
      bloodGroup: 'A+',
      emergencyContact: '+91 98778 90124',
      avatarColor: 'green',
      attendance: 85,
      avgGrade: 'B+',
      scores: { Science: 80, Mathematics: 83, 'Social Science': 78 },
      remarks: ['Quick learner with hands-on activities']
    },
    {
      id: 's8',
      name: 'Priya Nair',
      classId: 'c1',
      rollNo: 8,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      parentName: 'Girish & Deepa Nair',
      phone: '+91 98889 01234',
      address: 'Tower 4, Apex Athena, Sector 75, Noida',
      bloodGroup: 'B+',
      emergencyContact: '+91 98889 01235',
      avatarColor: 'cyan',
      attendance: 93,
      avgGrade: 'A',
      scores: { Science: 87, Mathematics: 90, 'Social Science': 86 },
      remarks: ['Good at creative projects']
    },

    // Class 7B
    {
      id: 's9',
      name: 'Arjun Iyer',
      classId: 'c2',
      rollNo: 1,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      parentName: 'Sridhar Iyer',
      phone: '+91 98990 12345',
      address: 'Block E, Saket, New Delhi',
      bloodGroup: 'O+',
      emergencyContact: '+91 98990 12346',
      avatarColor: 'blue',
      attendance: 91,
      avgGrade: 'A',
      scores: { Science: 86, Mathematics: 90 },
      remarks: ['Strong analytical skills']
    },
    {
      id: 's10',
      name: 'Meera Joshi',
      classId: 'c2',
      rollNo: 2,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      parentName: 'Hemant Joshi',
      phone: '+91 98101 23456',
      address: 'Sector 62, Noida',
      bloodGroup: 'A+',
      emergencyContact: '+91 98101 23457',
      avatarColor: 'amber',
      attendance: 95,
      avgGrade: 'A+',
      scores: { Science: 94, Mathematics: 96 },
      remarks: ['Outstanding performance']
    },
    {
      id: 's11',
      name: 'Dev Kapoor',
      classId: 'c2',
      rollNo: 3,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      parentName: 'Karan Kapoor',
      phone: '+91 98102 34567',
      address: 'DLF Phase 2, Gurugram',
      bloodGroup: 'AB+',
      emergencyContact: '+91 98102 34568',
      avatarColor: 'green',
      attendance: 82,
      avgGrade: 'B',
      scores: { Science: 74, Mathematics: 70 },
      remarks: ['Improving steadily']
    },
    {
      id: 's12',
      name: 'Sara Khan',
      classId: 'c2',
      rollNo: 4,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
      parentName: 'Dr. Tariq Khan',
      phone: '+91 98103 45678',
      address: 'Zakir Nagar, Okhla, New Delhi',
      bloodGroup: 'B+',
      emergencyContact: '+91 98103 45679',
      avatarColor: 'red',
      attendance: 89,
      avgGrade: 'B+',
      scores: { Science: 82, Mathematics: 79 },
      remarks: []
    },
    {
      id: 's13',
      name: 'Rishi Agarwal',
      classId: 'c2',
      rollNo: 5,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      parentName: 'Amit Agarwal',
      phone: '+91 98104 56789',
      address: 'Krishna Nagar, Delhi',
      bloodGroup: 'O+',
      emergencyContact: '+91 98104 56790',
      avatarColor: 'cyan',
      attendance: 93,
      avgGrade: 'A',
      scores: { Science: 88, Mathematics: 91 },
      remarks: ['Excellent in Mathematics']
    },
    {
      id: 's14',
      name: 'Tara Deshmukh',
      classId: 'c2',
      rollNo: 6,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
      parentName: 'Prakash Deshmukh',
      phone: '+91 98105 67890',
      address: 'Sector 50, Noida',
      bloodGroup: 'A-',
      emergencyContact: '+91 98105 67891',
      avatarColor: 'blue',
      attendance: 90,
      avgGrade: 'B+',
      scores: { Science: 81, Mathematics: 84 },
      remarks: []
    },

    // Class 8A
    {
      id: 's15',
      name: 'Aditya Verma',
      classId: 'c3',
      rollNo: 1,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      parentName: 'Sunil Verma',
      phone: '+91 98106 78901',
      address: 'Greater Kailash 1, New Delhi',
      bloodGroup: 'B+',
      emergencyContact: '+91 98106 78902',
      avatarColor: 'green',
      attendance: 90,
      avgGrade: 'A',
      scores: { Science: 87, Mathematics: 89, 'Social Science': 84 },
      remarks: ['Shows leadership qualities']
    },
    {
      id: 's16',
      name: 'Kavya Bhatt',
      classId: 'c3',
      rollNo: 2,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      parentName: 'Naveen Bhatt',
      phone: '+91 98107 89012',
      address: 'Sector 128, Wish Town, Noida',
      bloodGroup: 'O+',
      emergencyContact: '+91 98107 89013',
      avatarColor: 'amber',
      attendance: 96,
      avgGrade: 'A+',
      scores: { Science: 96, Mathematics: 94, 'Social Science': 92 },
      remarks: ['Class topper', 'Exceptional work ethic']
    },
    {
      id: 's17',
      name: 'Nikhil Rao',
      classId: 'c3',
      rollNo: 3,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      parentName: 'R. K. Rao',
      phone: '+91 98108 90123',
      address: 'Lajpat Nagar 4, New Delhi',
      bloodGroup: 'AB-',
      emergencyContact: '+91 98108 90124',
      avatarColor: 'red',
      attendance: 75,
      avgGrade: 'C+',
      scores: { Science: 65, Mathematics: 62, 'Social Science': 68 },
      remarks: ['Needs improvement', 'Attendance is a concern']
    },
    {
      id: 's18',
      name: 'Pooja Mishra',
      classId: 'c3',
      rollNo: 4,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      parentName: 'Satish Mishra',
      phone: '+91 98109 01234',
      address: 'Vasundhara Sector 11, Ghaziabad',
      bloodGroup: 'A+',
      emergencyContact: '+91 98109 01235',
      avatarColor: 'blue',
      attendance: 92,
      avgGrade: 'A',
      scores: { Science: 88, Mathematics: 86, 'Social Science': 90 },
      remarks: ['Very creative']
    },
    {
      id: 's19',
      name: 'Sahil Chandra',
      classId: 'c3',
      rollNo: 5,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      parentName: 'Vipin Chandra',
      phone: '+91 98110 12345',
      address: 'Sector 93B, Noida',
      bloodGroup: 'B+',
      emergencyContact: '+91 98110 12346',
      avatarColor: 'cyan',
      attendance: 87,
      avgGrade: 'B+',
      scores: { Science: 80, Mathematics: 82, 'Social Science': 78 },
      remarks: []
    },

    // Class 9A
    {
      id: 's20',
      name: 'Arnav Saxena',
      classId: 'c4',
      rollNo: 1,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      parentName: 'Vivek Saxena',
      phone: '+91 98111 23456',
      address: 'Defence Colony, New Delhi',
      bloodGroup: 'O+',
      emergencyContact: '+91 98111 23457',
      avatarColor: 'blue',
      attendance: 92,
      avgGrade: 'A',
      scores: { Science: 89, Mathematics: 91 },
      remarks: ['Excellent in Physics concepts']
    },
    {
      id: 's21',
      name: 'Rhea Kapoor',
      classId: 'c4',
      rollNo: 2,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      parentName: 'Rohit Kapoor',
      phone: '+91 98112 34560',
      address: 'Panchsheel Park, New Delhi',
      bloodGroup: 'B+',
      emergencyContact: '+91 98112 34561',
      avatarColor: 'green',
      attendance: 98,
      avgGrade: 'A+',
      scores: { Science: 97, Mathematics: 95 },
      remarks: ['Brilliant student', 'Participates in Olympiads']
    },
    {
      id: 's22',
      name: 'Kunal Malhotra',
      classId: 'c4',
      rollNo: 3,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      parentName: 'Ajay Malhotra',
      phone: '+91 98113 45671',
      address: 'Sector 44, Noida',
      bloodGroup: 'A+',
      emergencyContact: '+91 98113 45672',
      avatarColor: 'amber',
      attendance: 80,
      avgGrade: 'B',
      scores: { Science: 73, Mathematics: 76 },
      remarks: ['Has potential', 'Needs more consistent effort']
    },
    {
      id: 's23',
      name: 'Simran Kaur',
      classId: 'c4',
      rollNo: 4,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      parentName: 'Gurpreet Singh',
      phone: '+91 98114 56782',
      address: 'Rajouri Garden, New Delhi',
      bloodGroup: 'O+',
      emergencyContact: '+91 98114 56783',
      avatarColor: 'cyan',
      attendance: 94,
      avgGrade: 'A',
      scores: { Science: 90, Mathematics: 88 },
      remarks: ['Strong in Chemistry']
    },
    {
      id: 's24',
      name: 'Yash Tandon',
      classId: 'c4',
      rollNo: 5,
      gender: 'M',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      parentName: 'Deepak Tandon',
      phone: '+91 98115 67893',
      address: 'Sector 15A, Noida',
      bloodGroup: 'B-',
      emergencyContact: '+91 98115 67894',
      avatarColor: 'red',
      attendance: 86,
      avgGrade: 'B+',
      scores: { Science: 82, Mathematics: 80 },
      remarks: []
    },
    {
      id: 's25',
      name: 'Nisha Goyal',
      classId: 'c4',
      rollNo: 6,
      gender: 'F',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      parentName: 'Mukesh Goyal',
      phone: '+91 98116 78904',
      address: 'Patparganj, New Delhi',
      bloodGroup: 'A+',
      emergencyContact: '+91 98116 78905',
      avatarColor: 'blue',
      attendance: 95,
      avgGrade: 'A',
      scores: { Science: 91, Mathematics: 87 },
      remarks: ['Diligent and hardworking']
    }
  ],

  // Student Assessment Questions (Added by teacher, shareable to students, with answers & stats)
  studentQuestions: [
    {
      id: 'q1',
      studentId: 's1',
      question: 'Which test solution is used to confirm the presence of starch in food items?',
      options: ['Benedict Solution', 'Iodine Solution', 'Copper Sulphate Solution', 'Caustic Soda'],
      correctIndex: 1,
      subject: 'Science',
      studentAnswerIndex: 1 // correct
    },
    {
      id: 'q2',
      studentId: 's1',
      question: 'What is the value of (-15) + (-28)?',
      options: ['-43', '+43', '-13', '+13'],
      correctIndex: 0,
      subject: 'Mathematics',
      studentAnswerIndex: 0 // correct
    },
    {
      id: 'q3',
      studentId: 's1',
      question: 'Which vitamin deficiency leads to Rickets in growing children?',
      options: ['Vitamin A', 'Vitamin B1', 'Vitamin C', 'Vitamin D'],
      correctIndex: 3,
      subject: 'Science',
      studentAnswerIndex: 3 // correct
    },
    {
      id: 'q4',
      studentId: 's1',
      question: 'What is the sum of angles in a quadrilateral?',
      options: ['180°', '270°', '360°', '540°'],
      correctIndex: 2,
      subject: 'Mathematics',
      studentAnswerIndex: 1 // wrong: student picked 270 instead of 360
    },
    {
      id: 'q5',
      studentId: 's1',
      question: 'Which component of blood is responsible for clotting at wounds?',
      options: ['Red Blood Cells', 'Platelets', 'White Blood Cells', 'Plasma'],
      correctIndex: 1,
      subject: 'Science',
      studentAnswerIndex: 1 // correct
    },

    // Sample questions for s2 (Diya Gupta)
    {
      id: 'q6',
      studentId: 's2',
      question: 'Which organelle is known as the powerhouse of the cell?',
      options: ['Golgi Apparatus', 'Mitochondria', 'Nucleus', 'Ribosome'],
      correctIndex: 1,
      subject: 'Science',
      studentAnswerIndex: 1
    },
    {
      id: 'q7',
      studentId: 's2',
      question: 'Solve for x: 3x - 7 = 14',
      options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
      correctIndex: 2,
      subject: 'Mathematics',
      studentAnswerIndex: 2
    }
  ],

  // Teacher Personal Diary / Safe (Personal reflections & feelings with calendar format & emoji stickers)
  teacherSafeJournal: [
    {
      id: 'tsj1',
      date: '2026-08-19',
      title: 'A joyful spark in Science 6A',
      experience: 'Today was truly fulfilling! When doing the iodine starch experiment with Class 6A, Diya gasped when the potato turned blue-black. Seeing that spark of genuine scientific awe in their eyes reminds me why I became a teacher. Feeling grateful and energized.',
      emojiStickers: ['✨', '🌟', '🔬', '❤️', '😊'],
      moodScore: 9,
      tags: ['eureka-moment', 'grateful', 'science-lab']
    },
    {
      id: 'tsj2',
      date: '2026-08-18',
      title: 'A bit drained but pushed through',
      experience: 'Back-to-back classes and grading worksheets took a toll on my voice today. But during 7B Math, Kabir came up to thank me for explaining integers on the number line. A sweet reminder that every small effort leaves an impact.',
      emojiStickers: ['😴', '💪', '☕', '🌱'],
      moodScore: 6,
      tags: ['tiring-day', 'small-wins', 'mentorship']
    },
    {
      id: 'tsj3',
      date: '2026-08-17',
      title: 'Inspiring staff brainstorming session',
      experience: 'Collaborated with the math department on visual problem solving kits. Great banter during recess over ginger tea. Excited for the upcoming inter-school science exhibition.',
      emojiStickers: ['🎯', '💡', '🤝', '😄'],
      moodScore: 8,
      tags: ['teamwork', 'new-ideas']
    },
    {
      id: 'tsj4',
      date: '2026-08-15',
      title: 'Independence Day celebrations at school',
      experience: 'The choir sang so beautifully today. The students delivered speeches on freedom and environmental responsibility that moved us all. So proud of our young generation!',
      emojiStickers: ['🇮🇳', '🏆', '🎉', '❤️', '🌟'],
      moodScore: 10,
      tags: ['celebration', 'pride', 'patriotism']
    }
  ],

  // Inspiring & Comforting Quotes Bank for Mood Tracker
  moodQuotes: [
    // Low mood (1-4): deeply comforting, calming, supportive
    {
      min: 1, max: 4,
      quote: "Breathe, dear educator. You don't have to carry the weight of the entire world in one lesson. Your presence, patience, and kindness alone make an enduring difference in a child's life.",
      author: "Heart of a Teacher"
    },
    {
      min: 1, max: 4,
      quote: "On hard days, remember: some of the best lessons happen not in the textbook, but in showing grace, resilience, and compassion to yourself. Tomorrow is a gentle, clean slate.",
      author: "Mindful Educator"
    },
    {
      min: 1, max: 4,
      quote: "Even the tallest banyan tree bends with the heavy wind. Rest if you must, but don't give up. You are deeply valued and appreciated.",
      author: "Ancient Wisdom"
    },
    {
      min: 1, max: 4,
      quote: "It's okay to feel overwhelmed. Teaching is emotional labor. Take a sip of warm tea, step back for a moment, and honor the tremendous energy you give every single day.",
      author: "Teacher Wellness"
    },

    // Medium mood (5-7): encouraging, centering, uplifting
    {
      min: 5, max: 7,
      quote: "A teacher affects eternity; they can never tell where their influence stops. Keep shining your steady light.",
      author: "Henry Adams"
    },
    {
      min: 5, max: 7,
      quote: "Small consistent steps lead to profound transformations. Today is full of quiet possibilities waiting to unfold.",
      author: "Teaching Moments"
    },
    {
      min: 5, max: 7,
      quote: "Education is not the filling of a pail, but the lighting of a fire. You have the spark in your hands today.",
      author: "William Butler Yeats"
    },

    // High mood (8-10): celebrating, electrifying, triumphant
    {
      min: 8, max: 10,
      quote: "Your vibrant energy is contagious! When an educator radiates joy and curiosity, an entire classroom of young minds is inspired to reach for the stars.",
      author: "Inspire Excellence"
    },
    {
      min: 8, max: 10,
      quote: "You are turning knowledge into wonder and curiosity into courage. Ride this wonderful momentum and celebrate your brilliance today!",
      author: "Master Educator"
    }
  ],

  // Journal entries
  journal: [
    {
      id: 'j1', date: '2026-08-19', classId: 'c4', subject: 'Science', topic: 'Graphical Representation of Motion',
      chapter: 'Motion', objectives: 'Students will learn to plot distance-time and velocity-time graphs',
      activities: 'Lecture on graph plotting, whiteboard demonstration of distance-time graph, students plotted sample data on graph paper',
      homework: 'Plot distance-time graph for the given data set (Exercise 8.2, Q3-Q5)',
      remarks: 'Students engaged well. Some students need extra practice with velocity-time graphs.',
      materials: ['m3'], status: 'completed'
    },
    {
      id: 'j2', date: '2026-08-19', classId: 'c1', subject: 'Science', topic: 'Deficiency Diseases',
      chapter: 'Components of Food', objectives: 'Students will identify major deficiency diseases and their causes',
      activities: 'PPT presentation on deficiency diseases, group discussion on balanced diet, chart activity',
      homework: 'Complete the table of diseases, deficient nutrients and symptoms',
      remarks: 'Good participation. Will continue with prevention strategies tomorrow.',
      materials: ['m1', 'm5'], status: 'completed'
    },
    {
      id: 'j3', date: '2026-08-18', classId: 'c2', subject: 'Science', topic: 'Other Modes of Nutrition',
      chapter: 'Nutrition in Plants', objectives: 'Students will learn about insectivorous and parasitic plants',
      activities: 'Video on insectivorous plants, diagram labeling activity, Q&A session',
      homework: 'Draw and label a diagram of pitcher plant',
      remarks: 'Students found the video very engaging. Good questions asked during Q&A.',
      materials: ['m8'], status: 'completed'
    },
    {
      id: 'j4', date: '2026-08-18', classId: 'c3', subject: 'Mathematics', topic: 'Rational Numbers Between Two Numbers',
      chapter: 'Rational Numbers', objectives: 'Students will learn to find rational numbers between any two given rational numbers',
      activities: 'Board explanation, worked examples, group practice problems',
      homework: 'Exercise 1.2, Q1-Q8',
      remarks: 'Most students understood the concept. Additional practice needed for weaker students.',
      materials: [], status: 'completed'
    },
    {
      id: 'j5', date: '2026-08-17', classId: 'c4', subject: 'Mathematics', topic: 'Real Numbers',
      chapter: 'Number Systems', objectives: 'Students will understand real number system and its properties',
      activities: 'Lecture on real numbers, number line activity, problem solving',
      homework: 'Exercise 1.3, Q1-Q5',
      remarks: 'Topic introduction went well. Need to cover decimal representation next class.',
      materials: ['m7'], status: 'completed'
    },
    {
      id: 'j6', date: '2026-08-17', classId: 'c1', subject: 'Mathematics', topic: 'Estimation',
      chapter: 'Knowing Our Numbers', objectives: 'Students will learn estimation and rounding off',
      activities: 'Interactive estimation game, whiteboard exercises, individual practice',
      homework: 'Worksheet on estimation (10 problems)',
      remarks: 'Students enjoyed the estimation game. Will do more problem sets tomorrow.',
      materials: ['m6'], status: 'completed'
    },
    {
      id: 'j7', date: '2026-08-16', classId: 'c3', subject: 'Science', topic: 'Irrigation',
      chapter: 'Crop Production and Management', objectives: 'Students will understand various irrigation methods',
      activities: 'PPT on irrigation systems, diagram labeling, class discussion on water conservation',
      homework: 'Compare traditional and modern irrigation methods (1 page)',
      remarks: 'Connected the topic to local agriculture practices. Students were interested.',
      materials: ['m4'], status: 'completed'
    },
    {
      id: 'j8', date: '2026-08-15', classId: 'c2', subject: 'Mathematics', topic: 'Subtraction of Integers',
      chapter: 'Integers', objectives: 'Students will learn subtraction using number line',
      activities: 'Number line demonstration, worked examples, paired practice',
      homework: 'Exercise 1.3, Q1-Q6',
      remarks: 'Some students confused by negative results. Need revision.',
      materials: [], status: 'completed'
    },
    {
      id: 'j9', date: '2026-08-14', classId: 'c4', subject: 'Science', topic: 'Acceleration',
      chapter: 'Motion', objectives: 'Students will derive and apply acceleration formula',
      activities: 'Derivation on board, numerical problem solving, real-life examples',
      homework: 'Solve 10 numerical problems on acceleration',
      remarks: 'Class participated actively in problem solving. Arnav and Rhea helped peers.',
      materials: ['m3'], status: 'completed'
    },
    {
      id: 'j10', date: '2026-08-13', classId: 'c1', subject: 'Social Science', topic: 'Archaeological Sources',
      chapter: 'What, Where, How and When?', objectives: 'Students will understand types of archaeological evidence',
      activities: 'Illustrated lecture, artifact identification activity, group discussion',
      homework: 'List 5 archaeological sites in India with their significance',
      remarks: 'Interesting discussion on local archaeological sites. Will plan a virtual tour.',
      materials: ['m9'], status: 'completed'
    },
    {
      id: 'j11', date: '2026-08-12', classId: 'c3', subject: 'Social Science', topic: 'Natural Resources',
      chapter: 'Resources', objectives: 'Students will classify natural resources',
      activities: 'Lecture with examples, classification activity, resource mapping',
      homework: 'Create a mind map of natural resources',
      remarks: 'Good understanding shown. Need to discuss conservation next.',
      materials: [], status: 'completed'
    },
    {
      id: 'j12', date: '2026-08-19', classId: 'c2', subject: 'Mathematics', topic: 'Subtraction of Integers',
      chapter: 'Integers', objectives: 'Revision and practice of integer subtraction',
      activities: 'Quick recap, additional practice problems, individual assessment',
      homework: 'Complete practice worksheet',
      remarks: 'Improvement seen after revision. Most students now comfortable with the concept.',
      materials: [], status: 'draft'
    }
  ],

  // Teaching materials
  materials: [
    { id: 'm1', name: 'Components of Food - PPT', type: 'ppt', classId: 'c1', subject: 'Science', topic: 'Components of Food', size: '2.4 MB', date: '2026-07-25', tags: ['nutrients', 'balanced diet', 'presentation'] },
    { id: 'm2', name: 'Nutrition Chart Poster', type: 'image', classId: 'c1', subject: 'Science', topic: 'Components of Food', size: '1.8 MB', date: '2026-07-26', tags: ['chart', 'visual aid', 'nutrients'] },
    { id: 'm3', name: 'Motion - Complete Notes', type: 'pdf', classId: 'c4', subject: 'Science', topic: 'Motion', size: '3.1 MB', date: '2026-07-15', tags: ['notes', 'speed', 'velocity', 'acceleration'] },
    { id: 'm4', name: 'Irrigation Systems Presentation', type: 'ppt', classId: 'c3', subject: 'Science', topic: 'Crop Production', size: '4.2 MB', date: '2026-08-10', tags: ['irrigation', 'agriculture', 'presentation'] },
    { id: 'm5', name: 'Deficiency Diseases Worksheet', type: 'doc', classId: 'c1', subject: 'Science', topic: 'Components of Food', size: '156 KB', date: '2026-08-15', tags: ['worksheet', 'diseases', 'assessment'] },
    { id: 'm6', name: 'Estimation Practice Set', type: 'pdf', classId: 'c1', subject: 'Mathematics', topic: 'Knowing Our Numbers', size: '245 KB', date: '2026-08-12', tags: ['practice', 'estimation', 'worksheet'] },
    { id: 'm7', name: 'Real Numbers Explained', type: 'pdf', classId: 'c4', subject: 'Mathematics', topic: 'Number Systems', size: '1.9 MB', date: '2026-07-18', tags: ['notes', 'real numbers', 'number system'] },
    { id: 'm8', name: 'Insectivorous Plants - Video Link', type: 'link', classId: 'c2', subject: 'Science', topic: 'Nutrition in Plants', size: '-', date: '2026-08-16', tags: ['video', 'plants', 'insectivorous'] },
    { id: 'm9', name: 'Archaeological Sites of India', type: 'pdf', classId: 'c1', subject: 'Social Science', topic: 'History', size: '5.6 MB', date: '2026-08-08', tags: ['archaeology', 'history', 'India'] },
    { id: 'm10', name: 'Photosynthesis Diagram', type: 'image', classId: 'c2', subject: 'Science', topic: 'Nutrition in Plants', size: '890 KB', date: '2026-07-22', tags: ['diagram', 'photosynthesis', 'visual'] },
    { id: 'm11', name: 'Force and Motion Formulas', type: 'doc', classId: 'c4', subject: 'Science', topic: 'Force', size: '340 KB', date: '2026-08-05', tags: ['formulas', 'reference', 'physics'] },
    { id: 'm12', name: 'Polynomial Basics Worksheet', type: 'pdf', classId: 'c4', subject: 'Mathematics', topic: 'Polynomials', size: '198 KB', date: '2026-08-01', tags: ['worksheet', 'polynomials', 'practice'] },
    { id: 'm13', name: 'Rational Numbers Activity Sheet', type: 'doc', classId: 'c3', subject: 'Mathematics', topic: 'Rational Numbers', size: '210 KB', date: '2026-07-28', tags: ['activity', 'rational numbers'] },
    { id: 'm14', name: 'Food Sources Chart', type: 'image', classId: 'c1', subject: 'Science', topic: 'Food', size: '1.2 MB', date: '2026-07-18', tags: ['chart', 'food sources', 'visual'] },
    { id: 'm15', name: 'Khan Academy - Integers', type: 'link', classId: 'c2', subject: 'Mathematics', topic: 'Integers', size: '-', date: '2026-08-14', tags: ['video', 'integers', 'online resource'] },
    { id: 'm16', name: 'Microorganisms - Notes', type: 'pdf', classId: 'c3', subject: 'Science', topic: 'Microorganisms', size: '1.5 MB', date: '2026-08-18', tags: ['notes', 'microorganisms', 'bacteria'] },
    { id: 'm17', name: 'Graph Plotting Guide', type: 'pdf', classId: 'c4', subject: 'Science', topic: 'Motion', size: '780 KB', date: '2026-08-17', tags: ['guide', 'graphs', 'plotting'] },
    { id: 'm18', name: 'Number System Revision', type: 'ppt', classId: 'c4', subject: 'Mathematics', topic: 'Number Systems', size: '3.4 MB', date: '2026-08-10', tags: ['revision', 'presentation', 'number system'] }
  ],

  // Assessments
  assessments: [
    { id: 'a1', name: 'Unit Test 1 - Science', classId: 'c4', subject: 'Science', date: '2026-08-10', maxMarks: 25, type: 'Unit Test' },
    { id: 'a2', name: 'Unit Test 1 - Mathematics', classId: 'c4', subject: 'Mathematics', date: '2026-08-08', maxMarks: 25, type: 'Unit Test' },
    { id: 'a3', name: 'Monthly Test - Science', classId: 'c1', subject: 'Science', date: '2026-08-05', maxMarks: 50, type: 'Monthly Test' },
    { id: 'a4', name: 'Quiz - Nutrition', classId: 'c2', subject: 'Science', date: '2026-08-12', maxMarks: 10, type: 'Quiz' },
    { id: 'a5', name: 'Monthly Test - Mathematics', classId: 'c1', subject: 'Mathematics', date: '2026-08-06', maxMarks: 50, type: 'Monthly Test' }
  ]
};

// Helper functions
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getClassName(classId) {
  const cls = MOCK_DATA.classes.find(c => c.id === classId);
  return cls ? cls.name : '';
}

function getClassColor(classId) {
  const cls = MOCK_DATA.classes.find(c => c.id === classId);
  return cls ? cls.color : 'blue';
}

function getStudentsByClass(classId) {
  return MOCK_DATA.students.filter(s => s.classId === classId);
}

function getJournalByClass(classId) {
  return MOCK_DATA.journal.filter(j => j.classId === classId);
}

function getMaterialsByClass(classId) {
  return MOCK_DATA.materials.filter(m => m.classId === classId);
}

function getSyllabusProgress(subject, classId) {
  const chapters = MOCK_DATA.syllabus[subject]?.[classId] || [];
  let total = 0, completed = 0;
  chapters.forEach(ch => {
    ch.topics.forEach(t => {
      total++;
      if (t.status === 'completed') completed++;
    });
  });
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function getOverallSyllabusProgress() {
  let total = 0, completed = 0;
  Object.keys(MOCK_DATA.syllabus).forEach(subject => {
    Object.keys(MOCK_DATA.syllabus[subject]).forEach(classId => {
      MOCK_DATA.syllabus[subject][classId].forEach(ch => {
        ch.topics.forEach(t => {
          total++;
          if (t.status === 'completed') completed++;
        });
      });
    });
  });
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function getMaterialIcon(type) {
  const icons = {
    pdf: '📄', ppt: '📊', doc: '📝', image: '🖼️', video: '🎬', link: '🔗'
  };
  return icons[type] || '📁';
}

function getGradeColor(grade) {
  if (grade.includes('A+')) return 'green';
  if (grade.includes('A')) return 'blue';
  if (grade.includes('B+')) return 'cyan';
  if (grade.includes('B')) return 'amber';
  return 'red';
}

function getAttendanceColor(att) {
  if (att >= 90) return 'green';
  if (att >= 80) return 'amber';
  return 'red';
}
