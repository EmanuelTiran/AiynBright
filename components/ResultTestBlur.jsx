
const ResultTestBlur = ({ size, setSize, isLeftEye, setIsLeftEye, setCountFalse }) => {
    const handleButton = () => {
        if (!isLeftEye) {
            setCountFalse(0)
            setIsLeftEye(!isLeftEye)
            setSize(14.6)
        } else {
            // window.history.pushState({}, '', `/blur/improve/${size}_1_right`);
            window.location.href = `/blur/improve/${size}_1_right`;
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full transform transition-all duration-500 ease-in-out hover:scale-105">
                <h2 className="text-3xl font-bold mb-4 text-center text-yellow-400">{`The result of the test of the ${isLeftEye ? 'left' : 'right'} eye`} </h2>
                <p className="text-xl mb-6 text-center">
                    הגודל המינימלי שבו הצלחת לראות הוא:
                    <span className="font-bold text-2xl text-yellow-400 block mt-2 animate-pulse">
                        {size}mm
                    </span>
                </p>
                <div className="text-center">
                    <button
                        onClick={() => handleButton()}
                        // onClick={() => window.location.reload()}
                        className="bg-yellow-400 text-white px-6 py-2 rounded-full hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105"
                    >
                        {!isLeftEye ? "Try left eye" : "Go to improve vision"}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ResultTestBlur;