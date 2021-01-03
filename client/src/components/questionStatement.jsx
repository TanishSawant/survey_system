import React, { Component } from 'react'

export class QuestionStatement extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.question}</h1>
            </div>
        )
    }
}

export default QuestionStatement
