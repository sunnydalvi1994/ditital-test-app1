import React, { useState } from 'react';
import '../styles/components/stepper.css';
import '../styles/components/formAndButtons.css';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const steps = [
  { label: 'About You' },
  { label: 'About You 2' },
  { label: 'Personal details' },
  { label: 'Income Details' },
  { label: 'Your Offer' }
];

export default function StepperFormWrapper({ children }) {
  const [activeStep, setActiveStep] = useState(0);
  const { handleSubmit } = useFormContext();
  const navigate = useNavigate();

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };
  const onValidStep = (data) => {
    if (activeStep === steps.length - 1) {
      const loanType = data.loanType || 'defaultLoanType';
      const subtype = data.subtype || 'defaultSubtype';
      navigate(`/apply/${loanType}/${subtype}/documents`);
    } else {
      nextStep();
    }
  };

  return (
    <div>
      {/* Custom Progress Stepper */}
      <div className="progress-stepper">
        {/* {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`step ${
                index === activeStep ? 'active' : index < activeStep ? 'completed' : ''
              }`}
            >
              <div className="step-circle">{index + 1}</div>
              <div className="step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="step-connector">
                <div className="arrow-line"></div>
              </div>
            )}
          </React.Fragment>
        ))} */}
      </div>

      {/* Step content */}
      <div className="step-content">
        {children[activeStep] || <p>Step {activeStep + 1} content here</p>}
      </div>

      {/* Navigation */}
      <div className="navigation-buttons">
        {activeStep > 0 && (
          <button className="prev-btn" onClick={prevStep}>
            Previous
          </button>
        )}
        <button className="next-btn" onClick={handleSubmit(onValidStep)}>
          {activeStep < steps.length - 1 ? 'Next' : 'Yes I am Interested'}
        </button>
      </div>
    </div>
  );
}
