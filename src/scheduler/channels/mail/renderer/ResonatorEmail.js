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
    return `${host}stats/reminders/${resonator.id}/criteria/submit?question_id=${question.id}&answer_id=${answer.id}&sent_resonator_id=${sentResonatorId}`;
}

function getInputAnswerLink({host, question, resonator, sentResonatorId}){
    return `${host}stats/reminders/${resonator.id}/criteria/submit?question_id=${question.id}&sent_resonator_id=${sentResonatorId}&type=text`;
}

function getUnsubscribeLink(host, user) {
    return `${host}api/users/${user.id}/unsubscribe`;
}

function getResubscribeLink(host, user) {
    return `${host}api/users/${user.id}/resubscribe`;
}

function renderQuestion({
    question, preview, resonator, host, sentResonatorId, totalQuestionsCount
}) {
    const renderAnswer = a => (
    <div style={{
        padding: 10,
        border: 10,
        boxSizing: 'border-box',
        display: 'inline-block',
        fontFamily: 'Roboto, sans-serif',
        textDecoration: 'none',
        outline: 'none',
        position: 'relative',
        height: 36,
        width: '100%',
        borderRadius: 2,
        color: '#fff',
        backgroundColor: 'rgb(0, 188, 212)',
        fontSize: 14,
        marginBottom: 25
    }}>
        {question.question_kind === 'numeric' ?
            (!a.body ? a.rank : `${a.rank} - ${a.body}`) :
            a.body
        }
    </div>);

    let answers;
    if (question.question_kind === 'text') {
        answers = (
            <TR>
                <TD>
                    {preview ? (
                        <input type="text" name={"question_"+question.id} placeholder="Text..." style={{pointerEvents:"none"}}/>
                    ) : (
                        <a href={getInputAnswerLink({host, question, resonator, sentResonatorId})}
                           style={{
                               textDecoration: 'none',
                           }}>
                            {<input type="text" name={"question_"+question.id} placeholder="Text..." style={{pointerEvents:"none"}}/>}
                        </a>
                    )}
                </TD>
            </TR>
        );
    } else {
        answers = _.orderBy(question.answers, 'rank').map(a => {
            return (
                <TR>
                    <TD>
                        {preview ? renderAnswer(a) : (
                            <a href={getAnswerLink({host, question, answer: a, resonator, sentResonatorId})}
                               target="_blank"
                               style={{
                                   textDecoration: 'none',
                               }}>
                                {renderAnswer(a)}
                            </a>)}
                    </TD>
                </TR>
            );
        });
    }

    return (
        <div style={{
            border: '1px solid rgba(0, 0, 0, 0.117647)',
            borderRadius: 2,
            padding: 10
        }}>
            {totalQuestionsCount > 1 &&
            <div style={{
                fontSize: 12,
                marginBottom: 4
            }}>
                {`(1 / ${totalQuestionsCount})`}
            </div>}
            <div style={{marginBottom: 32}}>{question.description}</div>
            <Table cellPadding="3px" >
                <TBody>
                    {answers}
                </TBody>
            </Table>
        </div>
    );
}

export default ({resonator, leader, clinic, host, preview, sentResonatorId, recipientUser = {}}) => {
    const resonatorQuestion = resonator.questions[0];
    const question = _.get(resonatorQuestion, 'question');

    const questionEl = question && renderQuestion({question, preview, resonator, host, sentResonatorId, totalQuestionsCount: resonator.questions.length});
    const imageUrl = resonator.getImage();

    const clinicBranding = leader && leader.dataValues?.clinicBranding !== false;

    const mainCol = (
        <TD>
            {imageUrl &&
                <div>
                    <img src={imageUrl} alt={resonator.title} style={{
                        width: 'auto',
                        maxWidth: '100%'
                    }}/>
                </div>
            }
            {resonator.link && (
                <p>
                    <h2>
                        <a href={resonator.link} target="_blank">
                            {_.truncate(resonator.link, {length: 50})}
                        </a>
                    </h2>
                </p>
            )}
            {resonator.content && (
                <div dangerouslySetInnerHTML={{ __html: resonator.content }}/>
            )}
            {questionEl}
            {!preview && [
                <hr/>,
                <div style={{fontSize: 10, textAlign: 'center'}}>
                    <a href={getUnsubscribeLink(host, recipientUser)}>Unsubscribe</a>&nbsp;|&nbsp;
                    <a href={getResubscribeLink(host, recipientUser)}>Resubscribe</a>
                </div>
            ]}
        </TD>
    );

    const footer = (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <div style={{ display: "inline-flex", flexDirection:"column", alignItems: "center" }}>
                    {clinic?.dataValues?.logo && <img src={clinic.dataValues.logo} style={{height:"100px", maxWidth: "150px"}} />}
                    {clinic?.dataValues?.name && <span>{clinic.dataValues.name}</span>}
                </div>
                <div style={{ display: "inline-flex", flexDirection:"column", alignItems: "center" }}>
                    {clinic?.dataValues?.qr && <img src={clinic.dataValues.qr} style={{ marginBottom: "10px" }} />}
                    {clinic?.dataValues?.phone && <a href={'tel:'+clinic.dataValues.phone} style={{ direction: "ltr" }} target="_blank">{clinic.dataValues.phone}</a>}
                    {clinic?.dataValues?.website && <a href={clinic.dataValues.website} target="_blank">{clinic.dataValues.website}</a>}
                </div>
                <div style={{ display: "inline-flex", flexDirection:"column", alignItems: "center" }}>
                    {leader?.dataValues?.photo && <img src={leader.dataValues.photo} style={{height:"100px", maxWidth: "150px"}} />}
                    {leader?.dataValues?.user?.name && <span>{leader.dataValues.user?.name}</span>}
                </div>
            </div>
        </>
    );

    return (
        <>
            <Table style={{width: '100% !important'}}>
                <TBody>
                    <TR>{mainCol}</TR>
                </TBody>
            </Table>
            {clinicBranding && <div>{footer}</div>}
        </>
    );
}
