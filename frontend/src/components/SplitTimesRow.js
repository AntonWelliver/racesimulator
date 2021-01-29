import React from 'react';

const SplitTimesRow = ({ singleRowOfSplits, offset }) => {
    const runnerTime = (times) => {
        let timeLeft = times;

        let minutes = Math.floor(timeLeft / 60);
        timeLeft = timeLeft - minutes * 60;

        let seconds = Math.floor(timeLeft);
        timeLeft = timeLeft - seconds;

        const mm = minutes.toString();
        const ss = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

        const time = `${mm}:${ss}`;

        return time;
    }

    const boldText = {
        fontWeight: 'bold',
    };

    return (
        <>
            {singleRowOfSplits.map(
                (split, index) => (
                    <td key={index}><span style={boldText}>Km {index + offset + 1}:</span> {'\u00A0'}{runnerTime(split.totalTime)} {'\u00A0'} ({runnerTime(split.kmTime)})</td>
                )
            )}
        </>
    )
}

export default SplitTimesRow;