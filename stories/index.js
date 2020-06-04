import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ResonatorEmail from '../src/emailRenderer/ResonatorEmail'

const resonator = {
    title: 'foo bar forever',
    description: 'a description',
    content: 'some content',
    getImage() {
        return 'http://images1.ynet.co.il/PicServer5/2017/02/18/7596411/7596307492280autoresize.jpg';
    },
    questions: [{
        question: {
            id: '1',
            title: 'An obscure question.',
            description: 'What is the plan for the United States to win the war?',
            question_kind: 'numeric',
            answers: [{
                id: '1',
                rank: 1,
                body: 'Answer 1'
            }, {
                id: '2',
                rank: 2,
                body: 'Answer 2'
            }]
        }
    }, {
        question: {
            id: '1',
            title: 'An obscure question.',
            description: 'What is the plan for the United States to win the war?',
            question_kind: 'numeric',
            answers: [{
                id: '1',
                rank: 1,
                body: 'Answer 1'
            }, {
                id: '2',
                rank: 2,
                body: 'Answer 2'
            }]
        }
    }]
};

storiesOf('Resonator Email', module)
.add('resonator', () => {
    return <ResonatorEmail
                resonator={resonator}
                host='host://localhost:3000'
                trackingId='trackingId'
            />;
});

storiesOf('Resonator questions page', module)
.add('index', () => {
    return <ResonatorEmail
               resonator={resonator}
               host='host://localhost:3000'
               trackingId='foo'
           />
})
