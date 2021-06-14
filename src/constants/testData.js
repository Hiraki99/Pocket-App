import {makeid} from '~/utils/utils';
export const STATUS_PART = {
  DONE: 'DONE',
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE',
};

export const STATUS_QUESTION = {
  CHECKED: 'CHECKED',
  NEW: 'NEW',
};

export const activityDemo = [
  {
    _id: '5e5f58077e37ba0012edae01',
    script: [
      {
        type: 'sentence',
        name: 'Sentence',
        desc: 'Câu hội thoại đơn',
        icon: '/_nuxt/img/8f3428d.png',
        id: 'sentence_hKp1rACfSFYiMOC3T6jylnMNPVgJ8XpE',
        content:
          'Sau đây là một số từ vựng đáng chú ý trong bài bạn cần ghi nhớ.',
        title: 'Vocabulary: Household chores',
        action: {
          type: 'simple',
          text: 'Bắt đầu',
        },
        attachment: {
          type: 'none',
        },
      },
      {
        type: 'flashcard_new',
        name: 'Vocabulary - Flashcard',
        desc: 'Flashcard',
        icon: '/_nuxt/img/013c660.png',
        id: 'flashcard_new_dg1FcuPFYBabTfqqDuOXhNQKFukGzjAL',
        word_group: {
          _id: '5e797ec71498b50012bc1e2b',
          name: 'Unit 1 / Getting Started',
        },
      },
    ],
    order: 1,
    status: true,
    name: 'Flashcards',
    display_name: 'Từ vựng về công việc nhà',
    description: '',
    featured_image:
      'https://eng-app.s3.ap-southeast-1.amazonaws.com/upload/1587046793642.png',
    course_id: '5e3926fba0befe2eea700938',
    lesson_id: '5e39498e30b4953bdb04c949',
    part_id: '5e43801005ea0887471041b6',
    __v: 0,
    is_vip: false,
    done: false,
    enabled: true,
  },
  {
    _id: '5e7c895b1498b50012bc1f60',
    script: [
      {
        type: 'sentence',
        name: 'Sentence',
        desc: 'Câu hội thoại đơn',
        icon: '/_nuxt/img/8f3428d.png',
        id: 'sentence_qXECws5923GgMmrlWUBdIDiqKZu8K6l0',
        title: 'Review Vocabulary',
        content:
          'Trong phần này, bạn sẽ làm bài tập giúp ôn luyện lại các từ vựng mới vừa được xem trong phần Vocabulary.',
        action: {
          type: 'full_width',
          text: 'Bắt đầu',
        },
      },
      {
        type: 'water_up_new',
        name: 'Vocabulary - Water up',
        desc: 'Water up',
        icon: '/_nuxt/img/013c660.png',
        id: 'water_up_new_EndvGIjAbywIXbyNIfJ1DkGocMiQUtk6',
        word_group: {
          _id: '5e7c884f1498b50012bc1f5b',
          name: 'Unit 6 / Getting Started',
        },
      },
    ],
    order: 1,
    status: true,
    name: 'Game Review',
    display_name: 'Ôn tập lại từ vựng',
    description: '',
    featured_image:
      'https://eng-app.s3.ap-southeast-1.amazonaws.com/upload/1587182266528.png',
    course_id: '5e3926fba0befe2eea700938',
    lesson_id: '5e71d85cc242750012e0f943',
    part_id: '5e71d9f3c242750012e0f944',
    created_at: '2020-03-26T10:52:11.476Z',
    updated_at: '2020-05-22T07:35:19.670Z',
    __v: 0,
    is_vip: false,
    done: false,
    enabled: true,
  },
];

export default {
  name: 'Đề thi thử xếp loại  năng lực giáo viên 1',
  time: 3600,
  instructions: [
    'Time allowed – ONE hour (60 mins)',
    'DO NOT put your answers on this paper. Time is not counted when you move between screen',
    'Answer ALL questions in PEN or PENCIL on the mark sheet.',
    'You will first complete the listening part and then the reading part',
  ],
  sections: [
    {
      id: makeid(16),
      name: 'Listening comprehension',
      desc:
        "Listen to these conversations and mark the bubble on the answer sheet that shows the correct answer to the man's question.",
      parts: [
        {
          id: makeid(16),
          name: 'Part 1: Listen and answer',
          audio:
            'https://eng-app.s3.ap-southeast-1.amazonaws.com/upload/1592995591949.mp3',
          desc:
            'Listen to the first part of the test. Part One: Listen to these conversations and put a tick in the box that shows the correct answer to the man’s question.',
          questions: [
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'What happened to Keith on the weekend?',
              answers: [
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/1.1.png'),
                  text: 'A',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/1.2.png'),
                  text: 'B',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/1.3.png'),
                  text: 'C',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/1.4.png'),
                  text: 'D',
                  isAnswer: false,
                },
              ],
            },
            {
              title: 'What job does Emily think is thought-provoking?',
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              answers: [
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/2.1.png'),
                  isAnswer: false,
                  text: 'A',
                },
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/2.2.png'),
                  isAnswer: false,
                  text: 'B',
                },
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/2.3.png'),
                  isAnswer: true,
                  text: 'C',
                },
                {
                  id: makeid(16),
                  image: require('~/assets/images/test/2.4.png'),
                  isAnswer: false,
                  text: 'D',
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'What did Coraline go to see?',
              answers: [
                {
                  id: makeid(16),
                  text: 'Installation',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Sculpture',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Collage',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Circus',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'How did Randal describe the book fair?',
              answers: [
                {
                  id: makeid(16),
                  text: 'Complimentary',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Affordable',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'Crucial',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Lively',
                  isAnswer: false,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'Why does Carmen like rattling cricket balls?',
              answers: [
                {
                  id: makeid(16),
                  text: 'Privileged',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Stretched',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Synchronized',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Noisy',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'What is Nina’s expectation?',
              answers: [
                {
                  id: makeid(16),
                  text: 'Adjust',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Qualify',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'Innovate',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'Differentiate',
                  isAnswer: false,
                },
              ],
            },
          ],
          status: STATUS_PART.DEACTIVE,
        },
        {
          id: makeid(16),
          name: 'Part 2: Listening comprehension',
          audio:
            'https://eng-app.s3.ap-southeast-1.amazonaws.com/upload/1592995638904.mp3',
          desc:
            'Listen to the passage about exotic foods and decide if the following sentences are true or false. Mark the correct answer on the Mark Sheet.',
          questions: [
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'The speaker is talking about food that has a very strong flavor.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'According to the talk, you can expect to find delicious pizza in Italy.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: false,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'Tomato sauce is an essential part of a Thai meal.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'Mala hot pot is a sour and sweet dish.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'Enjoying simple food with people you love makes it more special.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: false,
                },
              ],
            },
          ],
          status: STATUS_PART.DEACTIVE,
        },
        {
          id: makeid(16),
          name: 'Part 3: Use of English',
          audio:
            'https://eng-app.s3.ap-southeast-1.amazonaws.com/upload/1592995678208.mp3',
          desc:
            'Mark on the answer sheet which you think is the correct answer, A, B or C.',
          questions: [
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              answers: [
                {
                  id: makeid(16),
                  text: 'A. I’m just lost in thought.',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'B. I brought my music player today.',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'C. No, it’s not mine.',
                  isAnswer: false,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              answers: [
                {
                  id: makeid(16),
                  text: 'A. He is sought after by large corporations.',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'B. He finished the work at minimal cost.',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'C. His salary demands were too outrageous.',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              answers: [
                {
                  id: makeid(16),
                  text:
                    'A. Just follow the guidelines to open a bank account online.',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'B. You can check your finances whenever you want.',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text:
                    'C. There are identity theft problems, and your e-mail account can be hacked.',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              answers: [
                {
                  id: makeid(16),
                  text: 'A. It’s not going to print out immediately',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'B. Andy is making the call right now.',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'C. Sure, I’ll start writing it straight away.',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              answers: [
                {
                  id: makeid(16),
                  text:
                    'A. I’m in a real pickle. I just lost a lot of money gambling.',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'B. Yeah, I’m tickled pink about next week’s outing.',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'C. I finally conquered my fear of swimming.',
                  isAnswer: false,
                },
              ],
            },
          ],
          status: STATUS_PART.DEACTIVE,
        },
        {
          id: makeid(16),
          name: 'Part 4: Listening three different tours',
          audio:
            'https://eng-app.s3.ap-southeast-1.amazonaws.com/upload/1592995704948.mp3',
          desc:
            'From the information you hear, you must mark on the answer sheet whether the statements are true or false. Remember that to be true a statement must be correct in every detail, according to what you hear.',
          questions: [
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'According to the first tour, there was a hill with only one building in the area a hundred years ago.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: false,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'The downtown area used to be much larger.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'The original hotel in Seattle was torn down because it did not have a parking lot.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'The hotel went out of business because its building equipment was too old.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: true,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'Today’s libraries have to be different from before since the Internet has changed how people get information.',
              answers: [
                {
                  id: makeid(16),
                  text: 'True',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'False',
                  isAnswer: false,
                },
              ],
            },
          ],
          status: STATUS_PART.DEACTIVE,
        },
      ],
    },
    {
      id: makeid(16),
      name: 'The usage of English',
      desc:
        "Listen to these conversations and mark the bubble on the answer sheet that shows the correct answer to the man's question.",
      parts: [
        {
          id: makeid(16),
          name: 'Answer questions',
          desc:
            'Mark the answer sheet with the correct letter. Do NOT write on the test paper.',
          questions: [
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'All the top executives of the company will ____ the meeting today.',
              answers: [
                {id: makeid(16), text: 'going to attend', isAnswer: false},
                {id: makeid(16), text: 'have attended', isAnswer: false},
                {id: makeid(16), text: 'attended', isAnswer: false},
                {id: makeid(16), text: 'be attending', isAnswer: true},
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'Asian women long for white and spotless skin; ____, the average Westerner prefers having a nice tan.',
              answers: [
                {id: makeid(16), text: 'customarily', isAnswer: false},
                {id: makeid(16), text: 'regrettably', isAnswer: false},
                {id: makeid(16), text: 'conversely', isAnswer: true},
                {id: makeid(16), text: 'similarly', isAnswer: false},
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'This math question was as easy as ____, so it took me only a few minutes to solve it.',
              answers: [
                {id: makeid(16), text: 'pie', isAnswer: true},
                {id: makeid(16), text: 'fence', isAnswer: false},
                {id: makeid(16), text: 'reality ', isAnswer: false},
                {id: makeid(16), text: 'tick', isAnswer: false},
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'Which is the odd one out in this set?',
              answers: [
                {id: makeid(16), text: 'enterprise', isAnswer: false},
                {id: makeid(16), text: 'entrepreneur', isAnswer: false},
                {id: makeid(16), text: 'operation', isAnswer: true},
                {id: makeid(16), text: 'establishment', isAnswer: false},
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title:
                'The buzzing mosquitoes, a real ____, kept me awake almost all night.',
              answers: [
                {id: makeid(16), text: 'annoyed', isAnswer: false},
                {id: makeid(16), text: 'annoying', isAnswer: false},
                {id: makeid(16), text: 'annoyance', isAnswer: true},
                {id: makeid(16), text: 'annoy', isAnswer: false},
              ],
            },
          ],
          status: STATUS_PART.DEACTIVE,
        },
        {
          id: makeid(16),
          name: 'Read and answer questions',
          desc: 'You need to read the following passage about wild tigers.',
          reading: {
            title: 'Wild Tigers',
            content:
              'One hundred years ago, there were about 100,000 wild tigers. Today, there are only about 3,200. Poaching and loss of habitat are causing the tiger population’s rapid decline. Conservationists worry that more tigers may be poached because of increased demand in tiger parts for medicine. Also, tigers have been forced to live near highly populated areas that do not allow them enough land to hunt. In the 1930s, the Bali tiger went extinct. In the 1970s, it was the Caspian tiger. And in the 1980s, the Javan tiger went extinct. Currently, the most endangered is the South China tiger, with fewer than 100 living in captivity. Even though people are the cause of most of the tiger’s problems, a recent survey found that the tiger is the world’s favorite animal. Governments have created tiger reserves and banned tiger hunting and sales of tiger products, but only time will tell if these efforts are enough to save the tiger.',
          },
          questions: [
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'When someone poaches animals, they ___.',
              answers: [
                {
                  id: makeid(16),
                  text:
                    'A. make them able to work for people or keep them as pets',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text: 'B. illegally catch or shoot them',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'C. raise public awareness regarding them',
                  isAnswer: false,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'A habitat is the ___ home of a plant or an animal.',
              answers: [
                {id: makeid(16), text: 'natural', isAnswer: true},
                {id: makeid(16), text: 'temporary', isAnswer: false},
                {id: makeid(16), text: 'safe', isAnswer: false},
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'A conservationist is someone who ___.',
              answers: [
                {
                  id: makeid(16),
                  text: 'A. works to protect animals or plants',
                  isAnswer: true,
                },
                {
                  id: makeid(16),
                  text: 'B. uses as little energy as possible',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text:
                    'C. studies how organisms interact with their environment ',
                  isAnswer: false,
                },
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'Animals that live under human care are in ___.',
              answers: [
                {id: makeid(16), text: 'extinction', isAnswer: false},
                {id: makeid(16), text: 'captivity', isAnswer: true},
                {id: makeid(16), text: 'decline', isAnswer: false},
              ],
            },
            {
              id: makeid(16),
              status: STATUS_QUESTION.NEW,
              title: 'What does reserve mean in the passage?',
              answers: [
                {
                  id: makeid(16),
                  text: 'A. A supply of something kept to be used later',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text:
                    'B. A personality trait that makes one not like expressing emotions',
                  isAnswer: false,
                },
                {
                  id: makeid(16),
                  text:
                    'C. An area of land where wild animals and plants are protected',
                  isAnswer: true,
                },
              ],
            },
          ],
          status: STATUS_PART.DEACTIVE,
        },
      ],
    },
  ],
};
