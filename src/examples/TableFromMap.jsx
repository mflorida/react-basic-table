/**
 * Define the column config in a Map.
 * @type {Map<any, any>}
 */
import { useState } from 'react';
import { Table } from '../lib/components/BasicTableComponents';

const DELETE = 'delete';
const TEAM_NAME = 'Team Name';
const UNIFORM_TEAM_NAME = 'Team Name on Uniform';
const SPORT = 'Sport';
const AGE_GROUP = 'Age Group';
const PLAYERS = 'Players';

const colMap = new Map();

// Dummy function
function showPlayers(e, rowData) {
  e.preventDefault();
  console.log(e);
  console.log(rowData);
}

export function TableFromMap({ data }) {
  const [tableData, setTableData] = useState(data);

  // In this case the Map key will be used for the column header
  colMap.set(DELETE, {
    // key: null,   // the 'key' property can be omitted altogether
    header: ' ',
    render: (rowData, i) => (
      <button type={'button'} onClick={() => {
        setTableData(prev => prev.filter(item => rowData.uid !== item.uid));
      }}>
        Delete
      </button>
    )
  });

  // The map key will be used for the field and 'header' defines the column header
  colMap.set('fullTeamName', {
    header: TEAM_NAME,
    th: { style: { textAlign: 'left' }}
  });

  colMap.set(UNIFORM_TEAM_NAME, {
    render: (rowData) => <b>{rowData['nameDisplayedOnUniform']}</b>,
    th: { style: { textAlign: 'left' }}
  });

  colMap.set(SPORT, {
    key: 'sportDescription',
    td: { style: { textAlign: 'center' }},
  });

  colMap.set(AGE_GROUP, {
    field: 'ageGroupDescription',
    td: { style: { textAlign: 'center' }},
  });

  colMap.set(PLAYERS, {
    // Can also use the 'cell' property
    cell: (rowData) => (
      <a href={`#/teams/${rowData.uid}/players`} onClick={(e) => showPlayers(e, rowData)}>
        {rowData['teamMembers'].length}
      </a>
    ),
    td: { style: { textAlign: 'center' }},
  });

  const cellStyle = {
    padding: '6px 8px'
  }

  const config = {
    table: {
      __: { style: { width: '100%' } },
      thead: {
        th: { style: cellStyle },
      },
      tbody: {
        td: { style: cellStyle },
      },
      tfoot: {
        td: { style: cellStyle },
      }
    }
  };

  return (
    <div style={{ width: 800, margin: '1rem auto', fontFamily: 'Arial, sans-serif' }}>
      <Table data={tableData} columns={colMap} header={true} config={config.table} />
    </div>
  );
}
