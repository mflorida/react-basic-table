import React, { useState } from 'react';
import { isFunction, mergeProps } from './lib/utils';
import Table from './lib/components/BasicTable';

import './App.css';

import teams from './mock/teams.json';

// Add 'rowKey' and 'key' fields
for (let [idx, team] of teams.entries()) {
  team.rowKey = team.uid || team.id || idx;
  team.key = team.key || team.rowKey;
}

const teamsListLastIndex = teams.length - 1;

function showPlayers(e, data) {
  e.preventDefault();
  console.log(data.teamMembers)
}

function moveUp(listData, rowIndex) {
  if (rowIndex === 0) {
    console.log(`Cannot move first item up.`);
    return false;
  }
  console.log('Moving up.');
  const prevIndex = rowIndex - 1;
  const currItem = listData[rowIndex];
  const prevItem = listData[prevIndex];
  listData[prevIndex] = currItem;
  listData[rowIndex] = prevItem;
  return listData
}

function moveDown(listData, rowIndex) {
  if (rowIndex === teamsListLastIndex) {
    console.log(`Cannot move last item down.`);
    return false;
  }
  console.log('Moving down.');
  const nextIndex = rowIndex + 1;
  const currItem = listData[rowIndex];
  const nextItem = listData[nextIndex];
  listData[nextIndex] = currItem;
  listData[rowIndex] = nextItem;
  return listData;
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
};

function MoveButtons({ teamsList, setTeamsList, index }) {
  // TODO: move button styling to stylesheet
  const disabledStyle = {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
  const upBtnStyle = {
    ...moveBtnStyle,
    ...(index === 0 ? disabledStyle : {})
  }
  const dnBtnStyle = {
    ...moveBtnStyle,
    ...(index === teamsListLastIndex ? disabledStyle : {})
  }
  return (
    <div className={'move-buttons'} style={{
      background: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 2
    }}>
      <button
        className={'move-up'}
        onClick={() => setTeamsList(moveUp([...teamsList], index))}
        style={upBtnStyle}
        disabled={index === 0}
      >🔼</button>
      <button
        className={'move-down'}
        onClick={() => setTeamsList(moveDown([...teamsList], index))}
        style={dnBtnStyle}
        disabled={index === teamsListLastIndex}
      >🔽</button>
    </div>
  )
}

const thLeft = {
  style: { textAlign: 'left' }
}

const tdCenter = {
  className: 'text-center',
}

// const colMap = new Map();

// const ORDER = 'Order';
// const TEAM_NAME = 'Team Name';
// const UNIFORM_TEAM_NAME = 'Team Name on Uniform';
// const SPORT = 'Sport';
// const AGE_GROUP = 'Age Group';
// const PLAYERS = 'Players';

export default function App() {
  const [teamsList, setTeamsList] = useState(teams);

  // colMap.set(ORDER, {
  //   // key: null,   // the 'key' property can be omitted altogether
  //   // header: 'Order',
  //   render: (rowData, i) => (
  //     <MoveButtons index={i} {...{teamsList, setTeamsList}} />
  //   ),
  //   th: {
  //     ...tdCenter,
  //   },
  //   td: {
  //     style: {
  //       padding: '8px'
  //     }
  //   }
  // });
  //
  // colMap.set(TEAM_NAME, {
  //   render: (rowData) => rowData.fullTeamName,
  //   th: thLeft
  // });
  //
  // colMap.set(UNIFORM_TEAM_NAME, {
  //   render: (rowData) => <b>{rowData.nameDisplayedOnUniform}</b>,
  //   th: thLeft
  // });
  //
  // colMap.set(SPORT, {
  //   render: (rowData) => rowData.sportDescription,
  //   td: tdCenter
  // })
  //
  // colMap.set(AGE_GROUP, {
  //   render: (rowData) => rowData['ageGroupDescription'],
  //   td: tdCenter
  // });
  //
  // colMap.set(PLAYERS, {
  //   render: (rowData) => (
  //     <a href={`#/teams/${rowData.uid}/players`} onClick={(e) => showPlayers(e, rowData)}>
  //       {rowData.teamMembers.length}
  //     </a>
  //   ),
  //   td: tdCenter
  // });

  // 'Order' column
  const orderColumn = {
    // key: null,   // the 'key' property can be omitted altogether
    header: 'Order',
    render: (rowData, i) => (
      <MoveButtons index={i} {...{teamsList, setTeamsList }} />
    ),
    th: {
      ...tdCenter,
    },
    td: {
      style: {
        padding: '8px'
      }
    }
  };

  // eslint-disable-next-line
  const colConfig = [
    orderColumn,
    {
      field: 'fullTeamName',  // allow use of 'field' for data object key
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
