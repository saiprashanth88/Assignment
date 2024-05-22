import  Route  from "react";
import myvid from '../components/assets/myvid.mp4';
const Video = () => {
    return (
        <div className="video-container">
            <video src={myvid}> autoPlay loop muted</video>
        </div>
    )
}
