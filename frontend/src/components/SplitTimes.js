import React from 'react';
import { Table } from 'react-bootstrap'
import SplitTimesRow from '../components/SplitTimesRow'

const SplitTimes = ({ allTimes }) => {
    const MaxSplitPerRow = 5

    const getRowOfSplits = (allTimes) => {
        let rowsOfSplits = []
        let singleRowOfSplits = []

        allTimes.forEach((split, index) => {
            if (index % MaxSplitPerRow === 0) {
                if (index !== 0) {
                    rowsOfSplits = [...rowsOfSplits, singleRowOfSplits]
                }
                singleRowOfSplits = [split]
            } else {
                singleRowOfSplits = [...singleRowOfSplits, split]
            }
        })
        rowsOfSplits = [...rowsOfSplits, singleRowOfSplits]
        return rowsOfSplits
    }

    const rowsOfSplits = getRowOfSplits(allTimes)

    return (
        <Table>
            <tbody>
                {rowsOfSplits.map(
                    (item, index) => (
                        <tr key={index}>
                            <SplitTimesRow
                                singleRowOfSplits={item} offset={index * MaxSplitPerRow}
                            />
                        </tr>
                    )
                )}
            </tbody>
        </Table>
    )
}

export default SplitTimes;
