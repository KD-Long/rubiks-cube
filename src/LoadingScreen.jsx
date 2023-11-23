import { useProgress } from '@react-three/drei'

export default function LoadingScreen({ started, onStarted }) {
    const { progress } = useProgress()



    return <>

        <div className={`loadingScreen ${started ? "loadingScreen--started" : ""}`}>
            <div className="loadingScreen__progress">
                <div
                    className="loadingScreen__progress__value"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
            <span className="loader"></span>
            <button
                className="loadingScreen__button"
                disabled={progress < 100}
                onClick={onStarted}
            >START
            </button>
            
        </div>











    </>
}