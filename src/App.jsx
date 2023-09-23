import React, { useState } from 'react';
import { isFunction, mergeProps } from './lib/utils';
import Table from './lib/components/BasicTable';

import './App.css';

import teams from './mock/teams.json'

// Add 'rowKey' and 'key' fields
for (let [idx, team] of teams.entries()) {
  team.rowKey = team.uid || team.id || idx;
  team.key = team.key || team.rowKey;
}

function showPlayers(e, data) {
  e.preventDefault();
  console.log(data.teamMembers)
}

export default function App() {
  const [teamsList, setTeamsList] = useState([...teams]);

  const teamsListLastIndex = teamsList.length - 1;

  const thLeft = {
    style: { textAlign: 'left' }
  }

  const tdCenter = {
    className: 'text-center',
  }

  const moveBtnStyle = {
    // width: 'calc(100% - 10px)',
    width: '100%',
    margin: 0,
    padding: 0,
    border: 'none',
    borderRadius: 0,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1.2rem'
  }

  function moveUp(rowData, rowIndex) {
    if (rowIndex === 0) {
      console.log(`Cannot move first item up.`);
      return false;
    }
    console.log('Moving up.');
    const prevIndex = rowIndex - 1;
    const currItem = teamsList[rowIndex];
    const prevItem = teamsList[prevIndex];
    teamsList[prevIndex] = currItem;
    teamsList[rowIndex] = prevItem;
    setTeamsList([].concat(teamsList));
  }

  function moveDown(rowData, rowIndex) {
    if (rowIndex === teamsListLastIndex) {
      console.log(`Cannot move last item down.`);
      return false;
    }
    console.log('Moving down.');
    const nextIndex = rowIndex + 1;
    const currItem = teamsList[rowIndex];
    const nextItem = teamsList[nextIndex];
    teamsList[nextIndex] = currItem;
    teamsList[rowIndex] = nextItem;
    setTeamsList([].concat(teamsList));
  }

  const colConfig = [
    {
      // key: null,   // the 'key' property can be omitted altogether
      header: 'Order',
      render: (rowData, i) => {
        // TODO: move button styling to stylesheet
        const disabledStyle = {
          opacity: 0.5,
          cursor: 'not-allowed'
        }
        const upBtnStyle = {
          ...moveBtnStyle,
          ...(i === 0 ? disabledStyle : {})
        }
        const dnBtnStyle = {
          ...moveBtnStyle,
          ...(i === teamsListLastIndex ? disabledStyle : {})
        }
        return (
          <div style={{
            background: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 2
          }}>
            <button
              className={'move-up'}
              onClick={() => moveUp(rowData, i)}
              style={upBtnStyle}
              disabled={i === 0}
            >🔼</button>
            <button
              className={'move-down'}
              onClick={() => moveDown(rowData, i)}
              style={dnBtnStyle}
              disabled={i === teamsListLastIndex}
            >🔽</button>
          </div>
        )
      },
      th: {
        ...tdCenter,
        style: {
          width: 'auto'
        }
      },
      td: {
        style: {
          padding: '8px',
          width: 'auto'
        }
      }
    },
    {
      key: 'fullTeamName',
      header: () => 'Team Name',
      cell: (rowData) => rowData.fullTeamName,
      th: thLeft
    },
    {
      key: 'nameDisplayedOnUniform',
      header: 'Team Name on Uniform',
      cell: (rowData) => <b>{rowData.nameDisplayedOnUniform}</b>,
      th: thLeft
    },
    {
      key: 'sportDescription',
      header: <span>Sport</span>,
      td: tdCenter,
    },
    {
      key: 'ageGroupDescription',
      header: () => 'Age Group',
      cell: (rowData) => rowData['ageGroupDescription'],
      td: tdCenter
    },
    {
      key: null,
      header: 'Players',
      cell: (rowData) => (
        <a href={`#/teams/${rowData.uid}/players`} onClick={(e) => showPlayers(e, rowData)}>
          {rowData.teamMembers.length}
        </a>
      ),
      td: tdCenter
    },
  ]


  // props for main <table> element
  const tableConfig = {
    __: {
      className: 'bogus sticky',
      style: {
        width: '100%'
      }
    },
    thead: {
      __: {
        // key: 'thead',
        className: 'sticky shadow'
      },
      tr: {},
      th: {},
      td: {}
    },
    tbody: {
      __: {
        // key: 'tbody',
        className: 'sticky'
      },
      tr: (rowData, rowIndex) => {
        return {
          className: `row-${rowIndex + 1}`,
          'data-index': rowIndex,
          'data-id': rowData.id,
          'data-uid': rowData.uid,
        }
      },
      td: {}
    },
    tfoot: {
      __: {
        // key: 'tfoot',
        className: 'sticky shadow',
        style: { height: 0 }
      },
      tr: {},
      td: {
        style: { padding: 0 }
      }
    }
  }

  const borderStyle = '1px solid #c0c0c0';

  const wrapperStyle = {
    width: 960,
    height: 'calc((100vh - 50%) - 20px)',
    margin: 'auto',
    overflowY: 'scroll',
    boxShadow: 'inset 0 -12px 12px -12px rgba(0, 0, 0, 0.25)',
    border: borderStyle
  }

  const outerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }

  function TableHeader({thead, columns}) {
    return (
      <thead {...thead.__}>
      <tr {...thead.tr}>
        {columns.map((col, i) => {
          const header = isFunction(col.header) ? col.header() : col.header;
          const thProps = mergeProps(thead.th, col.th);
          return (
            <th key={`col-${i}`} {...thProps}>{header}</th>
          )
        })}
      </tr>
      </thead>
    )
  }

  return (
    <div className="App" style={outerStyle}>
      <div style={{ ...wrapperStyle, borderLeft: 'none', borderTop: 'none' }}>
        <Table
          header={TableHeader}
          footer={false}
          data={teamsList}
          columns={colConfig}
          config={tableConfig}
        />
      </div>
      <div style={{ ...wrapperStyle, overflowY: 'hidden', border: 'none' }}>
        <textarea
          style={{ width: '100%', maxHeight: '100%', border: borderStyle }}
          rows={80}
          value={JSON.stringify(teamsList, null, 2)}
          readOnly
        />
      </div>
    </div>
  );
}
