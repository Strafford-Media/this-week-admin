import { Button, ButtonProps, Modal } from '@8thday/react'
import { ValidatedVisitorQuestion } from '../../utils/types'
import { ReactNode, useState } from 'react'
import { VisitorAnswersByQuestionFetched } from './VisitorAnswersByQuestionFetched'

const defaultLabelFunc = (q: ValidatedVisitorQuestion) => (
  <>View {q.visitor_answers_aggregate?.aggregate?.count ?? 0} Answers</>
)

export interface ViewAnswersButtonProps extends ButtonProps {
  question: ValidatedVisitorQuestion
  label?(q: ValidatedVisitorQuestion): ReactNode
}

export const ViewAnswersButton = ({
  className = '',
  question,
  label = defaultLabelFunc,
  ref: _ref,
  ...props
}: ViewAnswersButtonProps) => {
  const [openAnswers, setOpenAnswers] = useState(false)

  const count = question.visitor_answers_aggregate?.aggregate?.count ?? 0

  return (
    <>
      <Button className={`${className}`} disabled={!count} onClick={() => setOpenAnswers(true)} {...props}>
        {label(question)}
      </Button>
      {openAnswers && (
        <Modal onClose={() => setOpenAnswers(false)}>
          <VisitorAnswersByQuestionFetched questionId={question.id} />
        </Modal>
      )}
    </>
  )
}
