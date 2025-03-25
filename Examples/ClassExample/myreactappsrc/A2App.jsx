import './A2App.css'; // Load the css.
//import FetchCourses from './components/Fetch';

function A2App() { // here we go!

	const handleCreateClick = async () => {
		// create a Student Object to send to the database.
		const student = {
			"name":document.getElementById("studentName").value,
			"dob":new Date(document.getElementById("studentDOB").value), // Date
			"studentId":Number(document.getElementById("studentId").value), // Number
			"program":document.getElementById("studentProgram").value,
			"startYear":Number(document.getElementById("studentStartYear").value), // Number
			"startSemester":document.getElementById("studentStartSem").value
		}
		// ok so we can send this onto the database!
		await fetch(`http://localhost:3001/api/students/`, {
			method:"POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify (student),
		})
        .then((response) => response.json())
        .then((result) => {
            console.log (result);
			document.getElementById("queryStatus").value = "Success"
		})
		.catch((error) => {
			console.error(error);
			document.getElementById("queryStatus").value = "Failure: " + error;
		});
	};

	const handleRetrieveClick = async () => {
		let studentId;

		if (document.getElementById("studentId").value != null &&
			document.getElementById("studentId").value !== ""){
			studentId = Number(document.getElementById("studentId").value);
		}

		await fetch(`http://localhost:3001/api/students/sid=${studentId}`, {
			method:"GET",
			headers: {'Content-Type': 'application/json'},
		})
        .then((response) => {
			console.log(response);
			return (response.json());
		})
        .then((result) => {
            console.log (result);

			if (result){
				document.getElementById("studentName").value = result[0].name;
				document.getElementById("studentDOB").value = result[0].dob;
				document.getElementById("studentProgram").value = result[0].program;
				document.getElementById("studentStartYear").value = result[0].startYear;
				document.getElementById("studentStartSem").value = result[0].startSemester;
			}
			else {
				document.getElementById("studentName").value = "";
				document.getElementById("studentDOB").value = "";
				document.getElementById("studentProgram").value = "";
				document.getElementById("studentStartYear").value = "";
				document.getElementById("studentStartSem").value = "";
			}

			if (result && result.message != "")
				document.getElementById("queryStatus").value = result.message;
			else
				document.getElementById("queryStatus").value = "Ok";
		})
		.catch((error) => {
			console.error(error);
			document.getElementById("queryStatus").value = error.message;
		});
	}

	const handleUpdateClick = async () => {
		const student = {
			"name":document.getElementById("studentName").value,
			"dob":(document.getElementById("studentDOB").value != "") ? new Date(document.getElementById("studentDOB").value):"", // Date
			"studentId":(document.getElementById("studentId").value !="") ? Number(document.getElementById("studentId").value):"", // Number
			"program":document.getElementById("studentProgram").value,
			"startYear":(document.getElementById("studentStartYear").value != "") ? Number(document.getElementById("studentStartYear").value):"", // Number
			"startSemester":document.getElementById("studentStartSem").value
		}
		// ok so we can send this onto the database!
		await fetch(`http://localhost:3001/api/students/sid=${student.studentId}`, {
			method:"PUT",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify (student),
		})
        .then((response) => response.json())
        .then((result) => {
            console.log (result);
			document.getElementById("queryStatus").value = "Success"
		})
		.catch((error) => {
			console.error(error);
			document.getElementById("queryStatus").value = "Failure: " + error;
		});
	}

	const handleDeleteClick = async () => {
		let studentId;

		if (document.getElementById("studentId").value != null &&
			document.getElementById("studentId").value !== ""){
			studentId = Number(document.getElementById("studentId").value);
		}

		await fetch(`http://localhost:3001/api/students/sid=${studentId}`, {
			method:"DELETE",
			headers: {'Content-Type': 'application/json'},
		})
        .then((response) => response.json())
        .then((result) => {
            console.log (result);
			document.getElementById("queryStatus").value = result.message;
		})
		.catch((error) => {
			console.error(error);
			document.getElementById("queryStatus").value = error.message;
		});
	}


	return (
		<div className="A2App">
			<h1>Student Record Interface</h1>
			<label htmlFor="studentName">Name:</label><input type="text" id="studentName"></input><br/>
			<label htmlFor="studentDOB">Date of Birth:</label><input type="text" id="studentDOB"></input><br/>
			<label htmlFor="studentId">Id #:</label><input type="text" id="studentId"></input><br/>
			<label htmlFor="studentProgram">Program:</label><input type="text" id="studentProgram"></input><br/>
			<label htmlFor="studentStartYear">Year Started:</label><input type="text" id="studentStartYear"></input><br/>
			<label htmlFor="studentStartSem">Semester Started:</label><input type="text" id="studentStartSem"></input><br/>
			<button type="button" id="create" onClick={handleCreateClick}>Create</button>
			<button type="button" id="retrieve" onClick={handleRetrieveClick}>Retrieve By Id</button>
			<button type="button" id="update" onClick={handleUpdateClick}>Update By Id</button>
			<button type="button" id="delete" onClick={handleDeleteClick}>Delete By Id</button>
			<input type="text" id="queryStatus" placeholder='Query Status'></input>
		</div>
	);
}

export default A2App; // We make this available so that index.js can get to it.