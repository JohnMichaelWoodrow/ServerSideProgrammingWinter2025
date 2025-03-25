function showElement (element, level)
{
    if (element instanceof Array)
    {
        console.log ("\t".repeat(level)+"[Array]: size = " + element.length);
        for (var index=0; index<element.length; ++index)
        {
            showKeyValue (index, element[index], level+1);
        }
    
    }
    else if (element instanceof Object)
    {
        console.log ("\t".repeat(level)+"[Object]:");
        for (var prop in element)
        {
            showKeyValue (prop, element[prop], level+1);
        }
    }
}

function showKeyValue (key, value, level)
{
    if (value instanceof Object || value instanceof Array){
        console.log ("\t".repeat(level)+`[${key}]:`);
        showElement (value, level+1);
    }
    else {
        console.log ("\t".repeat(level)+`[${key}]:[${value}]`);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    let domain = "localhost:3000/api/"
    let recordType = "Courses";

    // Add and event listener to the GetCourses button.
    document.getElementById ("addCourse").addEventListener("click", (evt) => {
        // if there are any child elements, remove them. We're showing
        // fresh information.
        let old = document.getElementById("root");
        if (old != null){
            old.parentElement.removeChild(old);
        }

        let root = document.createElement("div");
        root.id = "root";

        // Create a div
        let div = document.createElement("div");
        div.id = `AddCourseDiv`;
        div.appendChild(document.createElement("br")); 

        // create the input fields: courseName, courseTitle, and 5 sessions: day, startTime, duration, room
        // TBDone
        
        // Create Course name input field
        let courseName = document.createElement("input");
        courseName.id=`courseName`;
        let courseNameLabel = document.createElement("label");
        let courseNameLabelText = document.createTextNode("Course Name:");
        courseNameLabel.setAttribute("for", courseName.id);
        courseNameLabel.appendChild(courseNameLabelText);
        div.appendChild(courseNameLabel);
        div.appendChild(courseName); // Add the button to the outer div
        div.appendChild(document.createElement("br")); 

        // Create Course name input field
        let courseTitle = document.createElement("input");
        courseTitle.id=`courseTitle`;
        let courseTitleLabel = document.createElement("label");
        let courseTitleLabelText = document.createTextNode("Course Title:");
        courseTitleLabel.setAttribute("for", courseTitle.id);
        courseTitleLabel.appendChild(courseTitleLabelText);
        div.appendChild(courseTitleLabel);
        div.appendChild(courseTitle); // Add the button to the outer div
        div.appendChild(document.createElement("br")); 

        // Create 5 sessions: day, startTime, duration, room

        const sessionDay = [];
        const sessionDayLabel = [];
        const sessionDayLabelText = [];
        const sessionTime = [];
        const sessionTimeLabel = [];
        const sessionTimeLabelText = [];
        const sessionDuration = [];
        const sessionDurationLabel = [];
        const sessionDurationLabelText = [];
        const sessionRoom = [];
        const sessionRoomLabel = [];
        const sessionRoomLabelText = [];
        div.appendChild(document.createTextNode(`Sessions:`));
        div.appendChild(document.createElement("br")); 

        for (var i=0; i<5; ++i){
            // Create session Number label
            div.appendChild(document.createTextNode(` ${i+1}:`));

            // Create session day input field
            sessionDay[i] = document.createElement("input");
            sessionDay[i].id=`sessionDay${i}`;
            sessionDayLabel[i] = document.createElement("label");
            sessionDayLabelText[i] = document.createTextNode("Day:");
            sessionDayLabel[i].setAttribute("for", sessionDay[i].id);
            sessionDayLabel[i].appendChild(sessionDayLabelText[i]);
            sessionDayLabel[i].classList.add("sessionLabel");
            sessionDay[i].classList.add("sessionInput");
            div.appendChild(sessionDayLabel[i]);
            div.appendChild(sessionDay[i]); // Add the button to the outer div

            // Create session time input field
            sessionTime[i] = document.createElement("input");
            sessionTime[i].id=`sessionTime${i}`;
            sessionTimeLabel[i] = document.createElement("label");
            sessionTimeLabelText[i] = document.createTextNode("Time:");
            sessionTimeLabel[i].setAttribute("for", sessionTime[i].id);
            sessionTimeLabel[i].appendChild(sessionTimeLabelText[i]);
            sessionTimeLabel[i].classList.add("sessionLabel");
            sessionTime[i].classList.add("sessionInput");
            div.appendChild(sessionTimeLabel[i]);
            div.appendChild(sessionTime[i]); // Add the button to the outer div

            // Create session duration input field
            sessionDuration[i] = document.createElement("input");
            sessionDuration[i].id=`sessionDuration${i}`;
            sessionDurationLabel[i] = document.createElement("label");
            sessionDurationLabelText[i] = document.createTextNode("Duration:");
            sessionDurationLabel[i].setAttribute("for", sessionDuration[i].id);
            sessionDurationLabel[i].appendChild(sessionDurationLabelText[i]);
            sessionDurationLabel[i].classList.add("sessionLabel");
            sessionDuration[i].classList.add("sessionInput");
            div.appendChild(sessionDurationLabel[i]);
            div.appendChild(sessionDuration[i]); // Add the button to the outer div

            // Create session time input field
            sessionRoom[i] = document.createElement("input");
            sessionRoom[i].id=`sessionRoom${i}`;
            sessionRoomLabel[i] = document.createElement("label");
            sessionRoomLabelText[i] = document.createTextNode("Room:");
            sessionRoomLabel[i].setAttribute("for", sessionRoom[i].id);
            sessionRoomLabel[i].appendChild(sessionRoomLabelText[i]);
            sessionRoomLabel[i].classList.add("sessionLabel");
            sessionRoom[i].classList.add("sessionInput");
            div.appendChild(sessionRoomLabel[i]);
            div.appendChild(sessionRoom[i]); // Add the button to the outer div

            
            div.appendChild(document.createElement("br")); 

        }

        // Create a button
        let button = document.createElement("input");
        button.id=`AddCourseButton`;
        button.type="button";
        button.value=`Submit`;
        div.appendChild(button); // Add the button to the outer div

        button.addEventListener("click", async () => {

            // get info from input fields.
            // TBDone

            var courseObj={};
            courseObj.courseName = document.getElementById("courseName").value;
            courseObj.courseTitle = document.getElementById("courseTitle").value;
            courseObj.sessions = [];
            for (var i=0; i<5; ++i){
                if (document.getElementById(`sessionDay${i}`).value == "") break;
                courseObj.sessions.push({
                    day: document.getElementById(`sessionDay${i}`).value, 
                    startTime: document.getElementById(`sessionTime${i}`).value, 
                    duration: document.getElementById(`sessionDuration${i}`).value, 
                    room: document.getElementById(`sessionRoom${i}`).value
                });
            }

            const response = await fetch(`http://localhost:3000/api/courses`, 
            {
                method: "POST", 
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify(courseObj)
            })
            .then((response) => response.json())
            .then((result) => { //TBD
            })
        });
        // add the outer div to the DOM.
        root.appendChild(div);
        // Now link the new tree into existing DOM after the button.
        document.getElementById ("deleteCourse").parentElement.appendChild(root);
    });

    // Add and event listener to the GetCourses button.
    document.getElementById ("getCourses").addEventListener("click", async (evt) => {

        // if there are any child elements, remove them. We're showing
        // fresh information.
        let old = document.getElementById("root");
        if (old != null){
            old.parentElement.removeChild(old);
        }


        // Create a message that is to be sent to the Express.js server.
        const response = await fetch(`http://localhost:3000/api/courses`)
        .then((response) => response.json())
        .then((result) => {
            console.log (result);
            showElement (result, 0);
            
            // result.length will be the number of courses in the result set.
            // each course object will have attributes
            //  "courseName":String, "courseTitle":String,
            //  "sessions":Array of session Objs, "createdAt":Date, "updatedAt":Date
            // each session object will have attributes
            //  "day":Int, "startTime":Int, "duration":Int, "room":String

            // Let's add elements to display this information.
            if (result.length > 0) { // if there are any courses...

                // Create a container for all the info.
                let root = document.createElement("div");
                root.id = "root";

                // Then for each course, create a div. Then in that dive, create a button,
                // and another div to hold the information that pertains to that course.
                for (var c of result) {

                    // Create a div
                    let div = document.createElement("div");
                    div.id = `${c.courseName}Div`;
                    
                    // Create a button
                    let button = document.createElement("input");
                    button.id=`${c.courseName}`;
                    button.type="button";
                    button.value=`${c.courseName}`;
                    div.appendChild(button); // Add the button to the outer div

                    // Create a div container to hold the schedule info.
                    // Initially hidden.
                    let courseSessions = c.sessions;
                    let sch = document.createElement ("div");
                    sch.id = `${c.courseName}Sched`;
                    sch.hidden = true;
                    // insert the session schedule info.
                    for (s of c.sessions) {
                        sch.appendChild (document.createTextNode(
                            `day:${s.day}, startTime:${s.startTime}, duration:${s.duration}, location:${s.room}`));
                        sch.appendChild (document.createElement("br"));
                        }
                    div.appendChild(sch); // Add the schedule div to the outer div

                    button.addEventListener("click", () => {
                        // Clicking the button should show/hide the schedule info for that course.
                        sch.hidden = !sch.hidden;
                    })

                    // add the outer div to the DOM.
                    root.appendChild(div);
                }

                // Now link the new tree into existing DOM after the button.
                document.getElementById ("deleteCourse").parentElement.appendChild(root);

                // change the "Get Course" button value to "Refresh Courses"
                evt.target.value = "Refresh Courses"
            }
        })
        .catch((error) => console.error(error));
    })
});