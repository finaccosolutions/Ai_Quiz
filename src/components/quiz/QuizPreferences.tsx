import React, { useState, useEffect } from 'react';
import { useQuizStore } from '../../store/useQuizStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { 
  BookOpen, Save, Clock, Languages, ListChecks, 
  BarChart3, Timer, AlertTriangle, Settings, 
  CheckCircle2, AlarmClock, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizPreferencesFormProps {
  userId: string;
  initialPreferences: QuizPreferences;
  onSave?: () => void;
}

const QuizPreferencesForm: React.FC<QuizPreferencesFormProps> = ({ 
  userId, 
  initialPreferences,
  onSave
}) => {
  const [preferences, setPreferences] = useState<QuizPreferences>(initialPreferences);
  const { savePreferences, isLoading, error } = useQuizStore();
  const [timingMode, setTimingMode] = useState<'per-question' | 'total'>(
    preferences.totalTimeLimit ? 'total' : 'per-question'
  );
  
  useEffect(() => {
    setPreferences(initialPreferences);
    setTimingMode(initialPreferences.totalTimeLimit ? 'total' : 'per-question');
  }, [initialPreferences]);
  
  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];
  
const questionTypeOptions = [
  { 
    value: 'multiple-choice', 
    label: 'Multiple Choice',
    description: 'Select one correct answer from multiple options'
  },
    { 
    value: 'multi-select', 
    label: 'Select All That Apply',
    description: 'Choose multiple correct options'
  },
  { 
    value: 'true-false', 
    label: 'True/False',
    description: 'Determine if a statement is true or false'
  },
  { 
    value: 'fill-blank', 
    label: 'Fill in the Blank',
    description: 'Complete sentences with missing words'
  },
  { 
    value: 'short-answer', 
    label: 'Short Answer',
    description: 'Provide brief 1-2 word answers'
  },
  { 
    value: 'sequence', 
    label: 'Sequence/Ordering',
    description: 'Arrange items in the correct order'
  },
  { 
    value: 'case-study', 
    label: 'Case Study',
    description: 'Analyze real-world scenarios and answer questions'
  },
  { 
    value: 'situation', 
    label: 'Situation Judgment',
    description: 'Choose the best action in given scenarios'
  }
];
  
  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Malayalam', label: 'Malayalam' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Telugu', label: 'Telugu' },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPreferences = {
      ...preferences,
      timeLimit: timingMode === 'total' ? null : preferences.timeLimit,
      totalTimeLimit: timingMode === 'per-question' ? null : preferences.totalTimeLimit,
      timeLimitEnabled: preferences.timeLimitEnabled
    };
    
    await savePreferences(userId, updatedPreferences);
    if (onSave) onSave();
  };
  
  const handleQuestionTypeToggle = (type: string) => {
    setPreferences(prev => {
      const currentTypes = prev.questionTypes;
      
      if (currentTypes.includes(type) && currentTypes.length > 1) {
        return {
          ...prev,
          questionTypes: currentTypes.filter(t => t !== type)
        };
      }
      
      if (!currentTypes.includes(type)) {
        return {
          ...prev,
          questionTypes: [...currentTypes, type]
        };
      }
      
      return prev;
    });
  };
  
  const isQuestionTypeSelected = (type: string) => {
    return preferences.questionTypes.includes(type);
  };

  const handleTimeSettingChange = (value: string) => {
    const numericValue = parseInt(value) || 30;
    if (timingMode === 'per-question') {
      setPreferences(prev => ({
        ...prev,
        timeLimit: value,
        totalTimeLimit: null
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        totalTimeLimit: value,
        timeLimit: null
      }));
    }
  };

  const handleTimeLimitToggle = (enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      timeLimitEnabled: enabled,
      timeLimit: enabled ? prev.timeLimit || '30' : null,
      totalTimeLimit: enabled ? prev.totalTimeLimit || '300' : null
    }));
  };

  const calculateTotalTime = () => {
    if (!preferences.timeLimitEnabled) return 'No time limit';
    
    if (timingMode === 'per-question') {
      if (!preferences.timeLimit) return 'No time limit';
      const perQuestion = parseInt(preferences.timeLimit);
      const total = perQuestion * preferences.questionCount;
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      return `${perQuestion} seconds per question (Total: ${minutes}:${seconds.toString().padStart(2, '0')})`;
    } else {
      if (!preferences.totalTimeLimit) return 'No time limit';
      const total = parseInt(preferences.totalTimeLimit);
      const perQuestion = Math.floor(total / preferences.questionCount);
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')} minutes total (${perQuestion} seconds per question)`;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="p-8 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
          <h2 className="text-3xl font-bold gradient-text mb-2">Quiz Preferences</h2>
          <p className="text-gray-600">Customize your learning experience</p>
        </div>
        
        <form onSubmit={handleSubmit} className="divide-y divide-purple-100">
          {/* Basic Settings Panel */}
          <div className="p-8 space-y-6 relative overflow-hidden group bg-gradient-to-r from-purple-50/30 to-indigo-50/30">
            <div className="relative">
              <div className="flex items-center mb-6 relative">
                <Settings className="w-6 h-6 mr-3 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-800">Basic Settings</h3>
                <div className="tooltip ml-2">
                  <Info className="w-4 h-4 text-gray-400 hover:text-purple-600 cursor-help" />
                  <span className="tooltiptext z-50">Configure your basic quiz settings including course, topic, and difficulty level</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course / Stream
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={preferences.course || ''}
                    onChange={(e) => setPreferences({ ...preferences, course: e.target.value })}
                    className="w-full transition-all duration-300 hover:border-purple-400 focus:ring-purple-400 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Topic / Subject (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Data Structures"
                    value={preferences.topic || ''}
                    onChange={(e) => setPreferences({ ...preferences, topic: e.target.value })}
                    className="w-full transition-all duration-300 hover:border-purple-400 focus:ring-purple-400 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub-topic (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Binary Trees"
                    value={preferences.subtopic || ''}
                    onChange={(e) => setPreferences({ ...preferences, subtopic: e.target.value })}
                    className="w-full transition-all duration-300 hover:border-purple-400 focus:ring-purple-400 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Difficulty Level
                  </label>
                  <Select
                    options={difficultyOptions}
                    value={preferences.difficulty}
                    onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
                    className="w-full transition-all duration-300 hover:border-purple-400 focus:ring-purple-400 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <Select
                    options={languageOptions}
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full transition-all duration-300 hover:border-purple-400 focus:ring-purple-400 text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Questions
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={preferences.questionCount}
                    onChange={(e) => {
                      const newCount = parseInt(e.target.value) || 5;
                      setPreferences({ ...preferences, questionCount: newCount });
                    }}
                    className="w-full transition-all duration-300 hover:border-purple-400 focus:ring-purple-400 text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.negativeMarking || false}
                      onChange={(e) => setPreferences({ 
                        ...preferences, 
                        negativeMarking: e.target.checked,
                        negativeMarks: e.target.checked ? -0.25 : 0
                      })}
                      className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Negative Marking</span>
                  </label>
                  
                  {preferences.negativeMarking && (
                    <div className="pl-7">
                      <Input
                        type="number"
                        min={-5}
                        max={0}
                        step={0.25}
                        value={preferences.negativeMarks || -0.25}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          negativeMarks: parseFloat(e.target.value) 
                        })}
                        className="w-full transition-all duration-300 hover:border-purple-400 focus:ring-purple-400"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter negative marks (between -5 and 0)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Question Types Panel */}
          <div className="p-8 space-y-6 relative overflow-hidden group bg-gradient-to-r from-blue-50/30 to-cyan-50/30">
            <div className="relative">
              <div className="flex items-center mb-6 relative">
                <ListChecks className="w-6 h-6 mr-3 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">Question Types</h3>
                <div className="tooltip ml-2">
                  <Info className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help" />
                  <span className="tooltiptext z-50">Choose the types of questions you want in your quiz</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {questionTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleQuestionTypeToggle(option.value)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-102 ${
                      isQuestionTypeSelected(option.value)
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-md hover:bg-blue-200'
                        : 'bg-gray-50 text-gray-600 border-2 border-gray-100 hover:bg-gray-100 hover:border-blue-200'
                    }`}
                  >
                    {isQuestionTypeSelected(option.value) ? (
                      <CheckCircle2 className="w-5 h-5 mb-2 mx-auto text-blue-600" />
                    ) : (
                      <div className="w-5 h-5 mb-2" />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Time Settings Panel */}
          <div className="p-8 space-y-6 relative overflow-hidden group bg-gradient-to-r from-emerald-50/30 to-teal-50/30">
            <div className="relative">
              <div className="flex items-center mb-6 relative">
                <Timer className="w-6 h-6 mr-3 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-800">Time Settings</h3>
                <div className="tooltip ml-2">
                  <Info className="w-4 h-4 text-gray-400 hover:text-emerald-600 cursor-help" />
                  <span className="tooltiptext z-50">Set time limits for individual questions or the entire quiz</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.timeLimitEnabled}
                    onChange={(e) => handleTimeLimitToggle(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 transition-colors"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Time Limit</span>
                </div>

                {preferences.timeLimitEnabled && (
                  <>
                    <div className="flex items-center space-x-6">
                      <button
                        type="button"
                        onClick={() => setTimingMode('per-question')}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                          timingMode === 'per-question'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-emerald-200'
                        }`}
                      >
                        <Clock className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-medium">Time per Question</div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setTimingMode('total')}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                          timingMode === 'total'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-emerald-200'
                        }`}
                      >
                        <AlarmClock className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-medium">Total Quiz Time</div>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Time Setting (in seconds)
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min={1}
                            max={3600}
                            value={timingMode === 'per-question' ? preferences.timeLimit || 30 : preferences.totalTimeLimit || 300}
                            onChange={(e) => handleTimeSettingChange(e.target.value)}
                            className="w-32 transition-all duration-300 hover:border-emerald-400 focus:ring-emerald-400 text-lg"
                          />
                          <span className="text-gray-600">seconds</span>
                        </div>
                        
                        <div className="text-sm text-gray-600 bg-emerald-50 p-4 rounded-lg mt-4">
                          <p className="font-medium text-emerald-700">Current Time Setting:</p>
                          <p>{calculateTotalTime()}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Quiz Mode Panel */}
          <div className="p-8 space-y-6 relative overflow-hidden group bg-gradient-to-r from-amber-50/30 to-orange-50/30">
            <div className="relative">
              <div className="flex items-center mb-6 relative">
                <BarChart3 className="w-6 h-6 mr-3 text-amber-600" />
                <h3 className="text-xl font-semibold text-gray-800">Quiz Mode</h3>
                <div className="tooltip ml-2">
                  <Info className="w-4 h-4 text-gray-400 hover:text-amber-600 cursor-help" />
                  <span className="tooltiptext z-50">Choose between practice mode for immediate feedback or exam mode for end-of-quiz results</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, mode: 'practice' })}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    preferences.mode === 'practice'
                      ? 'border-amber-300 bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-6 h-6 mr-2 text-amber-600" />
                    <span className="font-semibold text-lg">Practice Mode</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Get immediate feedback after each question. Perfect for learning and understanding concepts.
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, mode: 'exam' })}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    preferences.mode === 'exam'
                      ? 'border-amber-300 bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <BarChart3 className="w-6 h-6 mr-2 text-amber-600" />
                    <span className="font-semibold text-lg">Exam Mode</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    See results only at the end. Simulates real exam conditions for better preparation.
                  </p>
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          <div className="p-8 bg-gray-50 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !preferences.course}
              className="gradient-bg hover:opacity-90 transition-all duration-300 transform hover:scale-105 group text-lg px-8 py-3"
            >
              {isLoading ? 'Saving...' : 'Start Quiz'}
              <Save className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizPreferencesForm;