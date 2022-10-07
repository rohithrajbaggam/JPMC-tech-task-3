import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      price_abc:'float', 
      price_def: 'float',
      ratio: 'float',
      timestamp: 'date',
      upper_bound:'float',
      lower_bound:'float',
      trigger_alert:'float',
   };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `` DOM reference.
      elem.load(this.table);
      /* changed some the attribute for table*/ 
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      /* filter the columns that we only want to display ratio lowerbound,upperbound,triggeralert in graph*/
      elem.setAttribute('columns', '["ratio","lower_bound","upper_bound","trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
      price_abc:'avg',
      price_def:'avg',
      ratio:'avg',
      timestamp: 'distinct count',
      upper_bound: 'avg',
      lower_bound: 'avg',
      trigger_alert:'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      /* passing server data to generaterow function  and store the return value as array and pass to table update function*/
        this.table.update([DataManipulator.generateRow(this.props.data)] as any);
      }
  }
}

export default Graph;
