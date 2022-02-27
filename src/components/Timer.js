// import React, {useState, useEffect} from 'react';

// export default function Timer() {
//     const [seconds, setSeconds] = useState(30);
//     const [isActive, setIsActive] = useState(true)

//     var id = 0;

//     function resetTimer() {
//         if (id) {
//             setSeconds(0);
//             clearTimeout(id);
//             setSeconds(30);
//         } 
//     }

//     function stopTimer() {
//         if (id) {
//             setSeconds(0);
//             clearTimeout(id);
//         }
//     }

//     useEffect(() => {
//         if (seconds > 0) {
//             id = setTimeout(() => setSeconds(seconds - 1), 1000);
//         }
//     }, [seconds]);

//     return (
//         <div>
//             <div>
//                 {seconds}s
//             </div>
//                 <button onClick={resetTimer}>Reset</button>
//         </div>
//     )
// }