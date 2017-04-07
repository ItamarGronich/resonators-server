import _ from 'lodash';
import React from 'react';
import Oy from 'oy-vey/lib/components/DefaultElement.js';

const {
    Table,
    TR,
    TBody,
    TD
} = Oy;

function getAnswerLink({host, question, answer, resonator, sentResonatorId}) {
    return `${host}api/criteria/stats/reminders/${resonator.id}/criteria/submit?question_id=${question.id}&answer_id=${answer.id}&sent_resonator_id=${sentResonatorId}`;
}

function getUnsubscribeLink(host, user) {
    return `${host}api/users/${user.id}/unsubscribe`;
}

function renderQuestion({question, preview, resonator, host, sentResonatorId}) {
    const renderAnswer = a => (
    <div style={{padding: 10,
        border: '1px solid',
        borderRadius: 10,
        background: '#FFFF00',
        color: 'black'}}>
        {question.question_kind === 'numeric' ?
            `${a.rank} - ${a.body}` : a.body
        }
    </div>);

    const answers = _.orderBy(question.answers, 'rank').map(a => {
        return (
            <TR>
                <TD>
                    {preview ? renderAnswer(a) : (
                        <a href={getAnswerLink({host, question, answer: a, resonator, sentResonatorId})}
                            style={{textDecoration: 'none'}}>
                            {renderAnswer(a)}
                        </a>)}
                </TD>
            </TR>
        );
    });

    return (
        <div>
            <div style={{marginBottom: 12}}>{question.description}</div>
            <Table cellPadding="3px" >
                <TBody>
                    {answers}
                </TBody>
            </Table>
        </div>
    );
}

export default ({resonator, host, preview, sentResonatorId, recipientUser = {}}) => {
    const resonatorQuestion = resonator.questions[0];
    const question = _.get(resonatorQuestion, 'question');

    const questionEl = question && renderQuestion({question, preview, resonator, host, sentResonatorId});
    const imageUrl = resonator.getImage();

    const mainCol = (
        <TD>
            {imageUrl &&
                <div>
                    <img src={imageUrl} alt={resonator.title} style={{
                        width: 'auto',
                        maxHeight: 480
                    }}/>
                </div>
            }
            {resonator.link && (
                <p>
                    <h2>
                        <a href={resonator.link}>
                            {_.truncate(resonator.link, {length: 50})}
                        </a>
                    </h2>
                </p>
            )}
            {resonator.content && (
                <p>
                  <h2><b>{resonator.content}</b></h2>
                </p>
            )}
            {questionEl}
            {!preview && [
                <hr/>,
                <div style={{fontSize: 10, textAlign: 'center'}}>
                    <a href={getUnsubscribeLink(host, recipientUser)}>Unsubscribe</a>
                </div>
            ]}
        </TD>
    );

    return (
        <Table style={{width: '100%', maxWidth: 600}}>
            <TBody>
                <TR>
                    {mainCol}
                </TR>
            </TBody>
        </Table>
    );
}
