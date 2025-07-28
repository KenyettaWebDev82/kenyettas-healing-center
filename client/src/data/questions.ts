import { ChakraTestQuestion } from '../types';

export const chakraTestQuestions: ChakraTestQuestion[] = [
  {
    id: 1,
    text: "How often do you feel grounded and secure in your daily life?",
    chakra: "root",
    answers: [
      { text: "Never - I often feel anxious and unsafe", value: 1 },
      { text: "Rarely - I struggle with feeling secure", value: 2 },
      { text: "Sometimes - It varies depending on the situation", value: 3 },
      { text: "Often - I generally feel stable and grounded", value: 4 },
      { text: "Always - I feel completely secure and rooted", value: 5 }
    ]
  },
  {
    id: 2,
    text: "Do you feel comfortable expressing your creativity and sexuality?",
    chakra: "sacral",
    answers: [
      { text: "Never - I feel blocked and inhibited", value: 1 },
      { text: "Rarely - I struggle with creative expression", value: 2 },
      { text: "Sometimes - I have creative moments but often feel stuck", value: 3 },
      { text: "Often - I express myself creatively and feel comfortable with intimacy", value: 4 },
      { text: "Always - I freely express my creativity and sexuality", value: 5 }
    ]
  },
  {
    id: 3,
    text: "How confident do you feel in making decisions and taking action?",
    chakra: "solar",
    answers: [
      { text: "Never - I feel powerless and indecisive", value: 1 },
      { text: "Rarely - I struggle with self-confidence", value: 2 },
      { text: "Sometimes - My confidence varies by situation", value: 3 },
      { text: "Often - I feel confident in most situations", value: 4 },
      { text: "Always - I feel empowered and decisive", value: 5 }
    ]
  },
  {
    id: 4,
    text: "How easily can you give and receive love?",
    chakra: "heart",
    answers: [
      { text: "Never - I feel closed off and guarded", value: 1 },
      { text: "Rarely - I struggle with intimacy and connection", value: 2 },
      { text: "Sometimes - I have moments of openness but often withdraw", value: 3 },
      { text: "Often - I can give and receive love fairly easily", value: 4 },
      { text: "Always - Love flows freely to and from me", value: 5 }
    ]
  },
  {
    id: 5,
    text: "Do you feel comfortable speaking your truth and expressing yourself authentically?",
    chakra: "throat",
    answers: [
      { text: "Never - I often stay silent when I should speak up", value: 1 },
      { text: "Rarely - I struggle to express my true thoughts and feelings", value: 2 },
      { text: "Sometimes - I speak my truth in some situations but not others", value: 3 },
      { text: "Often - I express myself authentically in most situations", value: 4 },
      { text: "Always - I speak my truth with confidence and clarity", value: 5 }
    ]
  },
  {
    id: 6,
    text: "How often do you trust your intuition and inner guidance?",
    chakra: "third-eye",
    answers: [
      { text: "Never - I doubt my intuition and rely only on logic", value: 1 },
      { text: "Rarely - I sometimes sense things but don't trust it", value: 2 },
      { text: "Sometimes - I trust my intuition in certain areas", value: 3 },
      { text: "Often - I regularly follow my intuitive guidance", value: 4 },
      { text: "Always - I completely trust my inner knowing", value: 5 }
    ]
  },
  {
    id: 7,
    text: "Do you feel connected to something greater than yourself?",
    chakra: "crown",
    answers: [
      { text: "Never - I feel spiritually disconnected", value: 1 },
      { text: "Rarely - I sometimes wonder about spiritual connection", value: 2 },
      { text: "Sometimes - I have moments of spiritual awareness", value: 3 },
      { text: "Often - I feel connected to something greater", value: 4 },
      { text: "Always - I feel deeply connected to divine consciousness", value: 5 }
    ]
  },
  {
    id: 8,
    text: "How stable is your sense of identity and belonging?",
    chakra: "root",
    answers: [
      { text: "Very unstable - I often feel lost and disconnected", value: 1 },
      { text: "Somewhat unstable - I question my place in the world", value: 2 },
      { text: "Moderately stable - I have some sense of belonging", value: 3 },
      { text: "Quite stable - I know who I am and where I belong", value: 4 },
      { text: "Very stable - I have a strong sense of identity and belonging", value: 5 }
    ]
  },
  {
    id: 9,
    text: "How is your relationship with pleasure and enjoyment?",
    chakra: "sacral",
    answers: [
      { text: "Very poor - I feel guilty about pleasure", value: 1 },
      { text: "Poor - I rarely allow myself to enjoy things", value: 2 },
      { text: "Moderate - I sometimes enjoy life's pleasures", value: 3 },
      { text: "Good - I regularly enjoy life and its pleasures", value: 4 },
      { text: "Excellent - I embrace pleasure and joy fully", value: 5 }
    ]
  },
  {
    id: 10,
    text: "How do you handle personal boundaries and saying no?",
    chakra: "solar",
    answers: [
      { text: "Very poorly - I can't say no and have no boundaries", value: 1 },
      { text: "Poorly - I struggle with boundaries", value: 2 },
      { text: "Moderately - I sometimes maintain boundaries", value: 3 },
      { text: "Well - I usually maintain healthy boundaries", value: 4 },
      { text: "Very well - I have strong, healthy boundaries", value: 5 }
    ]
  },
  {
    id: 11,
    text: "How do you experience forgiveness (of self and others)?",
    chakra: "heart",
    answers: [
      { text: "Very difficult - I hold onto resentment", value: 1 },
      { text: "Difficult - I struggle to forgive", value: 2 },
      { text: "Moderate - I can forgive some things", value: 3 },
      { text: "Easy - I forgive relatively easily", value: 4 },
      { text: "Very easy - Forgiveness comes naturally to me", value: 5 }
    ]
  },
  {
    id: 12,
    text: "How well do you listen to others and communicate clearly?",
    chakra: "throat",
    answers: [
      { text: "Very poorly - I interrupt and don't listen well", value: 1 },
      { text: "Poorly - I struggle with communication", value: 2 },
      { text: "Moderately - I'm working on my communication skills", value: 3 },
      { text: "Well - I'm a good listener and communicator", value: 4 },
      { text: "Very well - I excel at listening and clear communication", value: 5 }
    ]
  },
  {
    id: 13,
    text: "How often do you experience meaningful dreams or synchronicities?",
    chakra: "third-eye",
    answers: [
      { text: "Never - I don't remember dreams or notice patterns", value: 1 },
      { text: "Rarely - Occasionally something seems meaningful", value: 2 },
      { text: "Sometimes - I notice some patterns and remember some dreams", value: 3 },
      { text: "Often - I regularly experience meaningful dreams and synchronicities", value: 4 },
      { text: "Always - I'm constantly receiving guidance through dreams and signs", value: 5 }
    ]
  },
  {
    id: 14,
    text: "How do you experience purpose and meaning in your life?",
    chakra: "crown",
    answers: [
      { text: "No sense of purpose - Life feels meaningless", value: 1 },
      { text: "Little purpose - I sometimes wonder about my purpose", value: 2 },
      { text: "Some purpose - I have some sense of direction", value: 3 },
      { text: "Clear purpose - I feel guided by a higher purpose", value: 4 },
      { text: "Deep purpose - I feel deeply connected to my life's mission", value: 5 }
    ]
  }
];
