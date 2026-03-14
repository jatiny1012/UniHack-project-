export const SEED_PROFILES = [
  {
    id: "a1b2c3d4-1111-4000-a000-000000000001",
    name: "Mrs Chen",
    lat: -37.7982, lng: 144.8992,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["Mandarin", "English"],
    approximate_location: "near Barkly St",
    capabilities: [
      { tag: "can_cook_bulk", category: "food", detail: "Can cook large meals for 20+ people, specialises in Chinese cuisine" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 1 },
      { tag: "mobility_impaired", category: "physical_help", priority: 1 },
      { tag: "limited_english", category: "language", priority: 2 },
      { tag: "needs_checkins", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000002",
    name: "Raj",
    lat: -37.7988, lng: 144.8998,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["Hindi", "English"],
    approximate_location: "near Leeds St",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "Sedan, seats 5" },
      { tag: "IT_skills", category: "communication", detail: "Software engineer, can set up comms" },
      { tag: "has_tools", category: "equipment", detail: "Full toolkit and power tools" }
    ],
    needs: [
      { tag: "pet_care_2_dogs", category: "care", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000003",
    name: "Maria",
    lat: -37.7990, lng: 144.8985,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["Vietnamese", "English"],
    approximate_location: "near Nicholson St",
    capabilities: [
      { tag: "registered_nurse", category: "medical", detail: "Final year nursing student, trauma trained" },
      { tag: "first_aid", category: "medical", detail: "Advanced first aid certification" },
      { tag: "spare_bedroom", category: "shelter", detail: "Can host 2 people" }
    ],
    needs: [
      { tag: "no_generator", category: "power", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000004",
    name: "Omar",
    lat: -37.7995, lng: 144.8988,
    suburb: "Footscray", postcode: "3011",
    household_size: 5,
    languages: ["Arabic", "French", "English"],
    approximate_location: "near Paisley St",
    capabilities: [
      { tag: "has_vehicle_van", category: "transport", detail: "Van, seats 8, used for taxi service" },
      { tag: "can_cook_bulk", category: "food", detail: "Can prepare meals for large groups" }
    ],
    needs: [
      { tag: "evacuation_shelter", category: "shelter", priority: 2 },
      { tag: "wife_limited_english", category: "language", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000005",
    name: "Sarah",
    lat: -37.7985, lng: 144.8995,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["English", "Auslan"],
    approximate_location: "near Barkly St",
    capabilities: [
      { tag: "elderly_care_experience", category: "care", detail: "30 years teaching, experienced with elderly and disabilities" },
      { tag: "large_house_ground_floor", category: "shelter", detail: "4-bedroom house, all ground floor, wheelchair accessible" },
      { tag: "has_generator", category: "power", detail: "Portable generator, can power essential appliances" }
    ],
    needs: [
      { tag: "hearing_impaired", category: "communication", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000006",
    name: "Priya",
    lat: -37.7991, lng: 144.8991,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["Hindi", "Tamil", "English"],
    approximate_location: "near Hopkins St",
    capabilities: [
      { tag: "IT_skills", category: "communication", detail: "Full-stack developer, can build apps quickly" },
      { tag: "multilingual_translator", category: "language", detail: "Fluent in Hindi, Tamil, and English" }
    ],
    needs: [
      { tag: "new_to_area", category: "care", priority: 3 },
      { tag: "no_vehicle", category: "transport", priority: 2 },
      { tag: "no_local_network", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000007",
    name: "Thanh",
    lat: -37.7978, lng: 144.8980,
    suburb: "Footscray", postcode: "3011",
    household_size: 4,
    languages: ["Vietnamese", "English"],
    approximate_location: "near Irving St",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "4WD SUV, seats 7" },
      { tag: "speaks_vietnamese", category: "language", detail: "Native Vietnamese speaker" },
      { tag: "can_cook_bulk", category: "food", detail: "Vietnamese restaurant owner" }
    ],
    needs: [
      { tag: "elderly_parent", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000008",
    name: "Abdi",
    lat: -37.8005, lng: 144.8970,
    suburb: "Footscray", postcode: "3011",
    household_size: 6,
    languages: ["Somali", "English"],
    approximate_location: "near Droop St",
    capabilities: [
      { tag: "physical_labour", category: "physical_help", detail: "Construction worker, very strong" },
      { tag: "can_cook_bulk", category: "food", detail: "Can cook Somali meals for groups" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 2 },
      { tag: "large_family_shelter", category: "shelter", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000009",
    name: "Yuki",
    lat: -37.7996, lng: 144.9010,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["English", "Japanese"],
    approximate_location: "near Footscray Mall",
    capabilities: [
      { tag: "first_aid", category: "medical", detail: "Red Cross first aid certified" },
      { tag: "spare_bedroom", category: "shelter", detail: "Can host 1 person" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 3 },
      { tag: "pet_care_cat", category: "care", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000010",
    name: "Dimitri",
    lat: -37.8002, lng: 144.8999,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["Greek", "English"],
    approximate_location: "near Nicholson St",
    capabilities: [
      { tag: "has_generator", category: "power", detail: "Large diesel generator" },
      { tag: "has_vehicle", category: "transport", detail: "Ute with tray" },
      { tag: "plumbing_skills", category: "equipment", detail: "Licensed plumber" }
    ],
    needs: [
      { tag: "elderly_wife", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000011",
    name: "Linh",
    lat: -37.7975, lng: 144.8993,
    suburb: "Footscray", postcode: "3011",
    household_size: 3,
    languages: ["Vietnamese", "English"],
    approximate_location: "near Albert St",
    capabilities: [
      { tag: "pharmacist", category: "medical", detail: "Community pharmacist, access to basic meds" },
      { tag: "speaks_vietnamese", category: "language", detail: "Native speaker" }
    ],
    needs: [
      { tag: "no_generator", category: "power", priority: 3 },
      { tag: "young_children", category: "childcare", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000012",
    name: "Hassan",
    lat: -37.8008, lng: 144.8975,
    suburb: "Footscray", postcode: "3011",
    household_size: 4,
    languages: ["Amharic", "English"],
    approximate_location: "near Droop St",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "Sedan, seats 4" },
      { tag: "electrician", category: "power", detail: "Licensed electrician" }
    ],
    needs: [
      { tag: "wife_limited_english", category: "language", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000013",
    name: "Nonna Rosa",
    lat: -37.7980, lng: 144.9005,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["Italian", "English"],
    approximate_location: "near Barkly St",
    capabilities: [
      { tag: "can_cook_bulk", category: "food", detail: "Italian home cooking, can make pasta for 30" },
      { tag: "large_pantry", category: "food", detail: "Always stocks 2 weeks of non-perishable food" }
    ],
    needs: [
      { tag: "mobility_impaired", category: "physical_help", priority: 1 },
      { tag: "needs_checkins", category: "care", priority: 2 },
      { tag: "no_vehicle", category: "transport", priority: 1 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000014",
    name: "James",
    lat: -37.8001, lng: 144.9015,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["English"],
    approximate_location: "near Footscray station",
    capabilities: [
      { tag: "ham_radio", category: "communication", detail: "Licensed amateur radio operator" },
      { tag: "IT_skills", category: "communication", detail: "Network engineer" },
      { tag: "has_solar", category: "power", detail: "Rooftop solar with Powerwall battery" }
    ],
    needs: []
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000015",
    name: "Fatima",
    lat: -37.7998, lng: 144.8960,
    suburb: "Footscray", postcode: "3011",
    household_size: 3,
    languages: ["Arabic", "English"],
    approximate_location: "near Geelong Rd",
    capabilities: [
      { tag: "childcare_experience", category: "childcare", detail: "Childcare worker, first aid for children" },
      { tag: "can_cook_bulk", category: "food", detail: "Can cook Middle Eastern meals for groups" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 2 },
      { tag: "needs_medication_fridge", category: "medical", priority: 1 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000016",
    name: "Tom",
    lat: -37.8010, lng: 144.9000,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["English"],
    approximate_location: "near Whitten Oval",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "4WD, experienced off-road driver" },
      { tag: "chainsaw", category: "equipment", detail: "Owns chainsaw and safety gear" },
      { tag: "physical_labour", category: "physical_help", detail: "Former SES volunteer" }
    ],
    needs: []
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000017",
    name: "Mei",
    lat: -37.7972, lng: 144.8988,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["Mandarin", "Cantonese", "English"],
    approximate_location: "near Irving St",
    capabilities: [
      { tag: "speaks_mandarin", category: "language", detail: "Interpreter, Mandarin and Cantonese" },
      { tag: "first_aid", category: "medical", detail: "St John Ambulance volunteer" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000018",
    name: "Kofi",
    lat: -37.8015, lng: 144.8985,
    suburb: "Footscray", postcode: "3011",
    household_size: 3,
    languages: ["English", "Twi"],
    approximate_location: "near Gordon St",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "Minibus, seats 12" },
      { tag: "can_cook_bulk", category: "food", detail: "Can cook West African meals in large quantities" }
    ],
    needs: [
      { tag: "no_generator", category: "power", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000019",
    name: "Angela",
    lat: -37.7986, lng: 144.9012,
    suburb: "Footscray", postcode: "3011",
    household_size: 4,
    languages: ["English"],
    approximate_location: "near Footscray Park",
    capabilities: [
      { tag: "registered_nurse", category: "medical", detail: "Emergency department nurse, 15 years experience" },
      { tag: "has_vehicle", category: "transport", detail: "Station wagon, seats 5" }
    ],
    needs: [
      { tag: "young_children", category: "childcare", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000020",
    name: "Duc",
    lat: -37.7968, lng: 144.8995,
    suburb: "Footscray", postcode: "3011",
    household_size: 5,
    languages: ["Vietnamese", "English"],
    approximate_location: "near Paisley St",
    capabilities: [
      { tag: "has_vehicle_van", category: "transport", detail: "Delivery van, can transport goods" },
      { tag: "speaks_vietnamese", category: "language", detail: "Community leader, knows many Vietnamese families" },
      { tag: "has_tools", category: "equipment", detail: "Mechanic, full workshop" }
    ],
    needs: [
      { tag: "elderly_mother", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000021",
    name: "Grace",
    lat: -37.8003, lng: 144.8965,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["English", "Auslan"],
    approximate_location: "near Geelong Rd",
    capabilities: [
      { tag: "auslan_interpreter", category: "language", detail: "Certified Auslan interpreter" },
      { tag: "disability_support", category: "care", detail: "NDIS support worker" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 2 },
      { tag: "lives_alone", category: "care", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000022",
    name: "Ahmed",
    lat: -37.7994, lng: 144.8950,
    suburb: "Footscray", postcode: "3011",
    household_size: 6,
    languages: ["Somali", "Arabic", "English"],
    approximate_location: "near Barkly St west",
    capabilities: [
      { tag: "multilingual_translator", category: "language", detail: "Somali and Arabic interpreter" },
      { tag: "has_vehicle", category: "transport", detail: "People mover, seats 8" },
      { tag: "community_leader", category: "care", detail: "Community centre coordinator" }
    ],
    needs: [
      { tag: "large_family_shelter", category: "shelter", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000023",
    name: "Wendy",
    lat: -37.8000, lng: 144.9020,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["English"],
    approximate_location: "near Footscray station",
    capabilities: [
      { tag: "veterinarian", category: "care", detail: "Vet, can care for pets during emergencies" },
      { tag: "spare_bedroom", category: "shelter", detail: "Granny flat available" }
    ],
    needs: [
      { tag: "no_generator", category: "power", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000024",
    name: "Binh",
    lat: -37.7970, lng: 144.9003,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["Vietnamese", "English"],
    approximate_location: "near Albert St",
    capabilities: [
      { tag: "has_generator", category: "power", detail: "Portable generator, petrol" },
      { tag: "carpenter", category: "equipment", detail: "Skilled carpenter, can board up windows" }
    ],
    needs: [
      { tag: "elderly_needs_checkins", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000025",
    name: "Samira",
    lat: -37.8012, lng: 144.8978,
    suburb: "Footscray", postcode: "3011",
    household_size: 3,
    languages: ["Arabic", "English"],
    approximate_location: "near Gordon St",
    capabilities: [
      { tag: "social_worker", category: "care", detail: "Licensed social worker, crisis counselling" },
      { tag: "first_aid", category: "medical", detail: "Mental health first aid" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 2 },
      { tag: "young_children", category: "childcare", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000026",
    name: "Pete",
    lat: -37.7976, lng: 144.9008,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["English", "Greek"],
    approximate_location: "near Barkly St",
    capabilities: [
      { tag: "has_boat", category: "transport", detail: "Inflatable rescue boat with motor" },
      { tag: "swimming_instructor", category: "physical_help", detail: "Qualified lifeguard" },
      { tag: "has_vehicle", category: "transport", detail: "Ute, can tow boat" }
    ],
    needs: []
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000027",
    name: "Hoa",
    lat: -37.7983, lng: 144.8975,
    suburb: "Footscray", postcode: "3011",
    household_size: 3,
    languages: ["Vietnamese", "Mandarin", "English"],
    approximate_location: "near Irving St",
    capabilities: [
      { tag: "speaks_vietnamese", category: "language", detail: "Vietnamese-Mandarin bilingual" },
      { tag: "spare_room", category: "shelter", detail: "Spare room and fold-out couch" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 2 },
      { tag: "asthma_medication", category: "medical", priority: 1 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000028",
    name: "David",
    lat: -37.8006, lng: 144.9008,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["English"],
    approximate_location: "near Whitten Oval",
    capabilities: [
      { tag: "paramedic", category: "medical", detail: "Paramedic, full trauma kit at home" },
      { tag: "has_vehicle", category: "transport", detail: "Ambulance-style 4WD" }
    ],
    needs: [
      { tag: "pet_care_2_cats", category: "care", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000029",
    name: "Asha",
    lat: -37.7997, lng: 144.8945,
    suburb: "Footscray", postcode: "3011",
    household_size: 4,
    languages: ["Somali", "English"],
    approximate_location: "near Geelong Rd",
    capabilities: [
      { tag: "childcare_experience", category: "childcare", detail: "Mother of 4, experienced with children" },
      { tag: "can_cook_bulk", category: "food", detail: "Can cook for large groups" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 1 },
      { tag: "limited_english", category: "language", priority: 2 },
      { tag: "needs_medication_fridge", category: "medical", priority: 1 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000030",
    name: "Marcus",
    lat: -37.8018, lng: 144.8995,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["English"],
    approximate_location: "near Whitten Oval",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "Motorcycle, fast transport" },
      { tag: "drone_operator", category: "communication", detail: "Licensed drone pilot, aerial assessment" },
      { tag: "physical_labour", category: "physical_help", detail: "Gym trainer, very fit" }
    ],
    needs: []
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000031",
    name: "Trang",
    lat: -37.7965, lng: 144.8990,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["Vietnamese", "English"],
    approximate_location: "near Paisley St",
    capabilities: [
      { tag: "teacher", category: "childcare", detail: "Primary school teacher" },
      { tag: "speaks_vietnamese", category: "language", detail: "Native Vietnamese" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 3 },
      { tag: "no_generator", category: "power", priority: 3 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000032",
    name: "Kevin",
    lat: -37.7990, lng: 144.9025,
    suburb: "Footscray", postcode: "3011",
    household_size: 3,
    languages: ["English", "Mandarin"],
    approximate_location: "near Footscray Park",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "SUV, seats 5" },
      { tag: "has_solar", category: "power", detail: "Solar panels with battery storage" },
      { tag: "can_mind_pets", category: "care", detail: "Dog lover, large backyard" }
    ],
    needs: []
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000033",
    name: "Feven",
    lat: -37.8009, lng: 144.8958,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["Amharic", "English"],
    approximate_location: "near Geelong Rd",
    capabilities: [
      { tag: "midwife", category: "medical", detail: "Registered midwife" },
      { tag: "speaks_amharic", category: "language", detail: "Amharic community liaison" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 2 },
      { tag: "infant_baby", category: "childcare", priority: 1 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000034",
    name: "George",
    lat: -37.7988, lng: 144.9018,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["Greek", "English"],
    approximate_location: "near Footscray station",
    capabilities: [
      { tag: "has_generator", category: "power", detail: "Industrial generator" },
      { tag: "large_garage", category: "shelter", detail: "Double garage, can shelter people" },
      { tag: "speaks_greek", category: "language", detail: "Fluent Greek" }
    ],
    needs: [
      { tag: "mobility_impaired", category: "physical_help", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000035",
    name: "Nhi",
    lat: -37.7973, lng: 144.8985,
    suburb: "Footscray", postcode: "3011",
    household_size: 5,
    languages: ["Vietnamese", "English"],
    approximate_location: "near Irving St",
    capabilities: [
      { tag: "can_cook_bulk", category: "food", detail: "Catering business, can feed 50+" },
      { tag: "has_vehicle_van", category: "transport", detail: "Catering van" },
      { tag: "speaks_vietnamese", category: "language", detail: "Vietnamese community elder" }
    ],
    needs: [
      { tag: "elderly_husband", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000036",
    name: "Jess",
    lat: -37.8014, lng: 144.9010,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["English", "Spanish"],
    approximate_location: "near Whitten Oval",
    capabilities: [
      { tag: "first_aid", category: "medical", detail: "Wilderness first aid certified" },
      { tag: "camping_gear", category: "equipment", detail: "Full camping kit, tents for 8 people" },
      { tag: "has_vehicle", category: "transport", detail: "4WD with roof rack" }
    ],
    needs: []
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000037",
    name: "Arjun",
    lat: -37.7999, lng: 144.8980,
    suburb: "Footscray", postcode: "3011",
    household_size: 3,
    languages: ["Hindi", "English"],
    approximate_location: "near Droop St",
    capabilities: [
      { tag: "doctor", category: "medical", detail: "GP, can provide medical assessments" },
      { tag: "speaks_hindi", category: "language", detail: "Hindi medical translator" }
    ],
    needs: [
      { tag: "no_generator", category: "power", priority: 3 },
      { tag: "young_children", category: "childcare", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000038",
    name: "Sue",
    lat: -37.7980, lng: 144.8960,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["English"],
    approximate_location: "near Barkly St west",
    capabilities: [
      { tag: "water_tank", category: "equipment", detail: "5000L rainwater tank" },
      { tag: "large_backyard", category: "shelter", detail: "Large yard for temporary camping" },
      { tag: "can_mind_pets", category: "care", detail: "Can look after pets, has kennels" }
    ],
    needs: [
      { tag: "lives_alone", category: "care", priority: 3 },
      { tag: "no_vehicle", category: "transport", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000039",
    name: "Min",
    lat: -37.7984, lng: 144.9000,
    suburb: "Footscray", postcode: "3011",
    household_size: 2,
    languages: ["Mandarin", "English"],
    approximate_location: "near Barkly St",
    capabilities: [
      { tag: "acupuncturist", category: "medical", detail: "Traditional Chinese medicine practitioner" },
      { tag: "speaks_mandarin", category: "language", detail: "Mandarin-English medical interpreter" }
    ],
    needs: [
      { tag: "no_vehicle", category: "transport", priority: 3 },
      { tag: "elderly_needs_checkins", category: "care", priority: 2 }
    ]
  },
  {
    id: "a1b2c3d4-1111-4000-a000-000000000040",
    name: "Jack",
    lat: -37.8020, lng: 144.8990,
    suburb: "Footscray", postcode: "3011",
    household_size: 1,
    languages: ["English"],
    approximate_location: "near Gordon St",
    capabilities: [
      { tag: "has_vehicle", category: "transport", detail: "Ute with trailer" },
      { tag: "physical_labour", category: "physical_help", detail: "Landscaper, sandbagging experience" },
      { tag: "has_radio", category: "communication", detail: "UHF CB radio" }
    ],
    needs: []
  }
];
