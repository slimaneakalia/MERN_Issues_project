import React from 'react';
import ReactDOM from 'react-dom';
import IssueList from './IssueList.jsx'

let contentNode = document.getElementById('contents');

ReactDOM.render(<IssueList />, contentNode);

if (module.hot)
	module.hot.accept();