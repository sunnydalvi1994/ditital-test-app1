import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BasicDetailsForm from './forms/BasicDetailsForm';
import BasicDetailsFormTwo from './forms/BasicDetailsFormTwo';
import PersonalDetailsForm from './forms/PersonalDetailsForm';
import IncomeDetailsForm from './forms/IncomeDetailsForm';
import IncomeSelfEmployedForm from './forms/IncomeSelfEmployedForm';
import IncomeProfessionalForm from './forms/IncomeProfessionalForm';
import OfferPage from './forms/OfferPage';
import PageWrapper from '../components/PageWrapper';
import { Container, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import BranchSearchDialog from '../components/BranchSearchDialog';
import '../styles/components/formAndButtons.css';
import '../styles/customToast.css';

// ✅ Import Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MultiLoanFormPage() {
  const [isStepValid, setIsStepValid] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { '*': rest, loanType: routeLoanType } = useParams();
  const normalizedRest = rest?.trim().toLowerCase();
  // loanType comes from route param set when navigating from HomePage
  const selectedLoanType = (routeLoanType || '').toLowerCase();
  let employmentType = '';
  if (normalizedRest?.includes('salaried')) employmentType = 'salaried';
  if (normalizedRest?.includes('business')) employmentType = 'business';
  if (normalizedRest?.includes('professional')) employmentType = 'professional';

  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      fullName: '',
      mobile: '',
      hasAccount: '',
      loanAmount: '',
      panNumber: '',
      dob: '',
      email: '',
      kycNumber: '',
      gender: '',
      presentAddress: '',
      houseOwnership: '',
      sameAsPermanent: false,
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
      employerName: '',
      designation: '',
      grossIncome: '',
      bonusOvertime: '',
      totalEmi: '',
      firmName: '',
      grossReceipts: ''
    }
  });

  const [step, setStep] = useState(0);

  const allSteps = useMemo(() => {
    return [
      <BasicDetailsForm />,
      <BasicDetailsFormTwo />,
      <PersonalDetailsForm />,
      employmentType === 'salaried' ? (
        <IncomeDetailsForm />
      ) : employmentType === 'business' ? (
        <IncomeSelfEmployedForm />
      ) : employmentType === 'professional' ? (
        <IncomeProfessionalForm />
      ) : null,
      <OfferPage />
    ].filter(Boolean);
  }, [employmentType]);

  const sameAsPermanent = methods.watch('sameAsPermanent');

  const stepFieldsMap = [
    ['mobile', 'hasAccount'], // Step 0
    ['fullName', 'panNumber', 'dob', 'email', 'kycNumber'], // Step 1
    [
      'gender',
      'presentAddress',
      'houseOwnership',
      ...(sameAsPermanent ? ['address1', 'city', 'state', 'pincode'] : [])
    ], // Step 2
    employmentType === 'salaried'
      ? ['employerName', 'designation', 'grossIncome', 'bonusOvertime', 'totalEmi']
      : employmentType === 'business'
        ? ['firmName', 'grossReceipts']
        : employmentType === 'professional'
          ? ['firmName', 'grossReceipts']
          : []
  ];

  const stepToastMessages = {
    0: 'Basic details saved successfully',
    1: 'Additional basic details saved successfully ',
    2: 'Personal details saved successfully ',
    3:
      employmentType === 'salaried'
        ? 'Income details saved successfully '
        : employmentType === 'business'
          ? 'Business income details saved successfully'
          : 'Professional income details saved successfully',
    4: 'Offer details saved successfully'
  };

  // const isCurrentStepValid = async () => {
  //   const fieldsToValidate = stepFieldsMap[step] || [];
  //   const valid = await methods.trigger(fieldsToValidate);

  //   if (step === 1 && !methods.getValues('kycVerified')) {
  //     return false;
  //   }

  //   return valid;
  // };

  // ✅ Updated handleNext with toast
  const handleNext = async () => {
    const currentStepFields = stepFieldsMap[step] || [];
    const valid = await methods.trigger(currentStepFields);

    if (valid) {
      toast.success(stepToastMessages[step] || 'Saved successfully!', {
        autoClose: 2000,
        position: 'bottom-right'
      });
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleSubmit = (data) => {
    console.log('Final payload:', data);
  };
  const handleInterested = () => {
    setIsDialogOpen(true);
  };

  const handleDialogConfirm = (branchAddress) => {
    console.log('Branch Address:', branchAddress);
    setIsDialogOpen(false);
    // Pass the selected loanType so the dealer-invoice route can choose the correct page
    navigate(`/dealer-invoice`, { state: { loanType: selectedLoanType } });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  useEffect(() => {
    const fieldsToValidate = stepFieldsMap[step] || [];
    methods.trigger(fieldsToValidate).then(setIsStepValid);
    // eslint-disable-next-line
  }, [step]);

  const watchedFields = methods.watch(stepFieldsMap[step] || []);
  useEffect(() => {
    const validateStep = async () => {
      const fieldsToValidate = stepFieldsMap[step] || [];
      const valid = await methods.trigger(fieldsToValidate);
      setIsStepValid(valid);
    };
    validateStep();
  }, [watchedFields, step]);

  return (
    <PageWrapper>
      <Container className="container">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {allSteps[step]}

            <div className="form-navigation">
              {step > 0 && (
                <Button variant="outlined" className="prev-btn" onClick={handlePrev}>
                  Previous
                </Button>
              )}
              {step === 0 && (
                <Button variant="outlined" className="prev-btn" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              )}
              {step < allSteps.length - 1 ? (
                <Button
                  className="next-btn"
                  variant="contained"
                  disabled={!isStepValid}
                  onClick={handleNext} // ✅ use updated handleNext
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="next-btn"
                  type="submit"
                  onClick={handleInterested}
                >
                  I Am Interested
                </Button>
              )}
            </div>
          </form>
        </FormProvider>

        <BranchSearchDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDialogConfirm}
        />

        {/* ✅ Toast container */}
        {/* <ToastContainer autoClose={1000} position="top-bottom" /> */}
      </Container>
    </PageWrapper>
  );
}
