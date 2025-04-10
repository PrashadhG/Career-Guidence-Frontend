const ProgressStepper = ({ activeTab, result, selectedCareer, evaluationResult, setActiveTab }) => {
    return (
      <div className="flex justify-center mb-10">
        <div className="flex items-center">
          {['assessment', 'results', 'activity', 'evaluation'].map((step, index) => (
            <div key={step} className="flex items-center">
              <button
                onClick={() => setActiveTab(step)}
                className={`flex flex-col items-center cursor-pointer ${activeTab === step ? 'text-white' : 'text-gray-400'}`}
                disabled={
                  (step === 'results' && !result) ||
                  (step === 'activity' && !selectedCareer) ||
                  (step === 'evaluation' && !evaluationResult)
                }
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeTab === step ? 'bg-purple-600' :
                  (step === 'assessment' ||
                    (step === 'results' && result) ||
                    (step === 'activity' && selectedCareer) ||
                    (step === 'evaluation' && evaluationResult)) ? 'bg-gray-700' : 'bg-gray-800'
                  }`}>
                  {index + 1}
                </div>
                <span className="text-xs capitalize">{step}</span>
              </button>
              {index < 3 && (
                <div className={`h-1 w-16 mx-2 ${activeTab === step ? 'bg-purple-500' : 'bg-gray-700'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ProgressStepper;