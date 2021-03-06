import React from 'react';
import 'whatwg-fetch';

import IssueAdd from './IssueAdd.jsx'
import IssueFilter from './IssueFilter.jsx'

class IssueRow extends React.Component
{
	render(){
		const issue = this.props.issue;
		return(
			<tr>
				<td>{issue._id}</td>
				<td>{issue.status}</td>
				<td>{issue.owner}</td>
				<td>{issue.created.toDateString()}</td>
				<td>{issue.effort}</td>
				<td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
				<td>{issue.title}</td>
			</tr>
		);
	}
}

class IssueTable extends React.Component{
	render(){
		const issueRows = this.props.issues.map(issue => <IssueRow key={issue._id} issue={issue} />);
		return(
			<table className='bordered-table'>
				<thead>
					<tr>
						<th>Id</th>
						<th>Status</th>
						<th>Owner</th>
						<th>Created</th>
						<th>Effort</th>
						<th>Completion date</th>
						<th>Title</th>
					</tr>
				</thead>
				<tbody>{issueRows}</tbody>
			</table>
		);
	}
}

export default class IssueList extends React.Component{
	constructor()
	{
		super();
		this.state = { issues : [] };
		//this.createTestIssue = this.createTestIssue.bind(this);
		this.createIssue = this.createIssue.bind(this);
		//setTimeout(this.createTestIssue, 2000);
	}

	componentDidMount()
	{
		this.loadData();
	}

	loadData()
	{
		fetch('/api/issues').then(
			response => {
				if (response.ok){
					response.json()
							.then(data => {
								console.log('Total count of records : ', data._metadata.total_count);
								data.records.forEach( issue => {
									issue.created = new Date(issue.created);
									if (issue.completionDate)
										issue.completionDate = new Date(issue.completionDate);
								});
								this.setState({ issues : data.records });
							});
				}else{
					response.json().then(error => {
						alert(`Failed to fetch issues : ${error.message}`);
					});
				}
			}).catch( error => {
				alert(`Error in fetching data from server :  ${error}`);
			});
	}

	createIssue(newIssue)
	{
		fetch('/api/issues', {
			method : 'POST',
			headers : { 'Content-Type' : 'application/json'},
			body : JSON.stringify(newIssue)
		}).then( response => {
			if (response.ok){
				response.json().then( updatedIssue => {
					updatedIssue.created = new Date(updatedIssue.created);
					if (updatedIssue.completionDate)
						updatedIssue.completionDate = new Date(updatedIssue.completionDate);
					const newIssues = this.state.issues.concat(updatedIssue);
					this.setState({ issues : newIssues });	
				  }).catch(error => {
					alert("Error sending data to the server : ", error.message);
				  });
			}else
				response.json().then(error => {
					alert (`Failed to add issue : ${error.message}`);
				});
		});
	}

	createTestIssue()
	{
		this.createIssue({
			status: 'New', owner: 'Pieta', created: new Date(),
			title: 'Completion date should be optional',
		});
	}

	render(){
		return(
			<div>
				<IssueFilter />
				<hr/>
				<IssueTable issues={this.state.issues} />
				<hr/>
				<IssueAdd createIssue={this.createIssue}/>
				<hr/>
			</div>
		);
	}
}