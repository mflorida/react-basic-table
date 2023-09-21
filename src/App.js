import React from 'react';
import './App.css';
import Table from './BasicTable';

import teams from './mock/data/teams.json'
import { useState } from 'react';
import { isFunction, mergeProps } from './lib/utils';

export default function App() {

  function showPlayers(e, data) {
    e.preventDefault();
    console.log(data.teamMembers)
  }

  // function addKey(item, idx){
  //   item.rowKey = item.uuid || item.id || idx;
  //   item.key = item.key || item.rowKey;
  // }

  for (let [idx, team] of teams.entries()) {
    team.rowKey = team.uid || team.id || idx;
    team.key = team.key || team.rowKey;
  }

  const [teamsList, setTeamsList] = useState(teams)

  const thLeft = {
    style: { textAlign: 'left' }
  }

  const tdCenter = {
    className: 'text-center',
  }

  const moveBtnStyle = {
    width: 'calc(100% - 10px)',
    margin: 5,
    padding: '5px 0',
    border: '1px solid #c0c0c0',
    borderRadius: 0,
    background: '#f0f0f0',
    cursor: 'pointer'
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
    if (rowIndex === teamsList.length - 1) {
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
      key: null,
      header: 'Order',
      cell: (rowData, i) => {
        return (
          <div style={{
            background: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
            <button className={'move-up'} onClick={() => moveUp(rowData, i)} style={moveBtnStyle}>+</button>
            <button className={'move-down'} onClick={() => moveDown(rowData, i)} style={moveBtnStyle}>-</button>
          </div>
        )
      },
      th: tdCenter,
      td: {
        style: {
          padding: 0,
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
          className: `row-${rowIndex}`,
          'data-id': rowData.id
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
        <Table header={TableHeader} footer={false} data={teamsList} columns={colConfig} config={tableConfig}/>
      </div>
      <div style={{ ...wrapperStyle, overflowY: 'hidden', border: 'none' }}>
        <textarea style={{ width: '100%', maxHeight: '100%', border: borderStyle }} rows={80} value={JSON.stringify(teamsList, null, 2)}/>
      </div>
    </div>
  );
}
