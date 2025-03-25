async function submitCourse() {
    const courseName = document.getElementById("courseName").value.trim();
    const courseTitle = document.getElementById("courseTitle").value.trim();

    if (!courseName || !courseTitle) {
        alert("Course Name and Course Title are required.");
        return;
    }

    const courseObj = {
        courseName,
        courseTitle,
        sessions: []
    };

    // Gather session data
    for (let i = 0; i < 3; i++) {
        const day = document.getElementById(`sessionDay${i}`).value;
        const startTime = document.getElementById(`sessionTime${i}`).value;
        const duration = document.getElementById(`sessionDuration${i}`).value;
        const room = document.getElementById(`sessionRoom${i}`).value;

        if (day && startTime && duration && room) {
            courseObj.sessions.push({
                day: parseInt(day),
                startTime: parseInt(startTime),
                duration: parseInt(duration),
                room
            });
        }
    }

    try {
        const response = await fetch("http://localhost:3000/api/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courseObj)
        });

        if (response.ok) {
            alert("Course added successfully!");
            fetchCourses();
        } else {
            const error = await response.json();
            console.error("Error:", error);
            alert("Failed to add course. Check the console for details.");
        }
    } catch (error) {
        console.error("Error adding course:", error);
    }
}
