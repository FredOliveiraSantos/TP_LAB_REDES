import React, { useState, useEffect } from "react";

export interface IScoreTextProps {
    readonly name : string;
    readonly score : number;
}

const ScoreText : React.FC<IScoreTextProps> = (props) => {

    const [name, setName] = useState<string>('');
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        if(score === props.score) return;

        const nameElement = document.getElementById(name);
        if(!nameElement) return;
        
        setTimeout(() => {
            nameElement.classList.add('animator');
        }, 100);

        setTimeout(() => {
            nameElement.classList.remove('animator');
        }, 2000);

        setName(props.name);
        setScore(props.score);
    }, [props]);

    return (
        <li id={name}>
            {name}: {score}
        </li>
    )
};

export default ScoreText;