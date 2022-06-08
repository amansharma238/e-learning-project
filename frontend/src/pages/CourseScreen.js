import React from "react";
import { useParams } from "react-router-dom";
import { useData } from "../useData";

function CourseScreen() {
    const params = useParams();
    const { id } = params;
    const { data } = useData();
    let course = data.courses.filter(element => element.id == id);
    return <div>
        <h1>{course[0].name}</h1>
    </div>;
}

export default CourseScreen;