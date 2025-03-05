export default function RequirementAnalyzer() {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Input Requirements</h2>
        
        <div 
          className="border-2 border-dashed p-6 text-center rounded-2xl"
          style={{
            borderColor: '#FF5B27',
            backgroundColor: 'rgba(255, 91, 39, 0.1)'
          }}
        >
          <input 
            type="file" 
            className="hidden" 
            id="file-upload"
            accept=".pdf,.doc,.docx"
          />
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer px-4 py-2 rounded"
            style={{
              backgroundColor: '#FF5B27',
              color: 'white'
            }}
          >
            Browse Files
          </label>
          <p className="mt-2 text-gray-600">
            Drag and drop PDF or Word documents here
          </p>
        </div>
        <div>
            <p>Or enter input here..</p>
        </div>
  
        <div className="mt-4">
          <textarea 
            placeholder="Paste requirements text here..." 
            className="w-full p-2 border rounded min-h-[100px] rounded-2xl"
          ></textarea>
        </div>
  
        <button 
          className="mt-4 px-4 py-2 rounded text-white bg-blue-600 cursor-pointer"
        >
          Process Requirements
        </button>
  
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Functional Requirements</h4>
              {/* Placeholder for results */}
            </div>
            <div>
              <h4 className="font-medium">Non-Functional Requirements</h4>
              {/* Placeholder for results */}
            </div>
          </div>
        </div>
      </div>
    );
  }