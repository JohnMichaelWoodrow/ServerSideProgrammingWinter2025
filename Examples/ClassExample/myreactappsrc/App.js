// This is our app's starting component. index.js uses this.

import './App.css'; // Load the css.
import FetchCourses from './components/Fetch'; // Bring in our FetchCourses Component.

function App() { // here we go!

	// This is the event handler that is common to all the buttons that we create.
	// It could have been placed in the FetchCourses module, but I thought it would be
	// cool to pass it as a prop to the component. It has no dependancies on either
	// of the App or FetchCourses components, so it could have existed in it's own file.
	// A separate file of event handlers might be a workable idea.
	function handleCourseClick (e) {
		// Action taken when a course button is clicked.
		// This is function is passed to the component as a prop
		if (e.target.innerHTML === "CP4485"){ // if the button says 'CP4485'...
			if (e.target.style.background === 'red')		// if the color is red, 
				e.target.style.background = 'lightblue';	// then turn it blue,
			else											// otherwise
				e.target.style.background = 'red';			// make it red.
		}
	}

	// Our app just creates a FetchCourse Component, indicating the event handler for any
	// resulting buttons.
	return (
		<div className="App">
			<FetchCourses clickHandler={handleCourseClick}/>
		</div>
	);
}

export default App; // We make this available so that index.js can get to it.