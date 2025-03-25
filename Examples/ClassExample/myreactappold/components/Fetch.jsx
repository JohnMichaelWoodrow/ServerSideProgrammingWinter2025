// This import is needed because we are going to use React's state hook.
import {useState} from 'react';

// This is a React component called FetchCourses. Notice that a click event handler is being sent
// into the component as a prop(erty). It is 'deconstructed' so that we can refer to the prop by
// its name directly.
const FetchCourses = ({clickHandler}) => {

    // A React state hook called 'courses' is initialized to be an empty array. 'setCourses' is the 
    // method that must be used to update 'courses'.
    const [courses, setCourses] = useState([]);

    let nextKey=0; // We use this to generate unique keys.

    // only one jsx element can be returned, thus a <> is used to encapsulate everything.
    return (<> 
        <button type="button" onClick={ // a button 'Get Courses' is created. When it's clicked, data is fetched.
            () => {
                // The following is only executed if the Get Courses button is activated. It's the interface to
                // our API.
                fetch('http://localhost:3001/api/courses')
                .then ((result)=> {
                    return result.json();
                })
                .then ((data) => {
                    // Here we are storing the data by first mapping the array of objects collected from the
                    // database (the course information) to an array of *container objects* with each having
                    // a unique 'keyId' (needed when we go to create buttons), and a copy of the course object
                    // which is refered to as 'details'. The setCourses method update the 'courses' state hook.
                    setCourses(data.map(course=>{return {keyId:nextKey++, details:course}}))
                });
            }
        }>Get Courses</button><br/>
        {/*console.log (keys)*/}
        {   // Here we generate the jsx for each element in the array contained in the courses state hook.
            // We perform a map over that array so that each course can be used to create a button element.
            courses.map (course => {
                // Here I've decided to treat any course that has a name of 'CP4485' a little differently from the rest.
                if(course.details.courseName === "CP4485")
                    // Notice that the supplied click event handler is used here. When the button is activated, the
                    // event handler executed. That handler is defined in APP.js.
                    // Also notice that we specify a class by using the 'className' attribute, not 'class'
                    // Finally notice that the information on the button is the name of the course.
                    return <button key={course.keyId} type="button" className="blue" onClick={clickHandler}>{course.details.courseName}</button>;
                else
                    return <button key={course.keyId} type="button" className="gray" >{course.details.courseName}</button>;
            })
        }
    </>);
};

// The component is exported so that other JS files can use it.
export {FetchCourses as default};