import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import PageWrapper from '../components/PageWrapper';
import '../styles/pages/home.css';
import '../styles/global.css';
import '../styles/components/formAndButtons.css';
import { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import ButtonGroup from '../components/ButtonGroup';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import handleVAPT from '../utils/globalValidation';

// ==== IMPORT STATIC DATA ====
import {
  loans as staticLoans,
  loanSubtypes as staticLoanSubtypes,
  consumerCategories as staticConsumerCategories,
  employmentTypes as staticEmploymentTypes
} from '../data/staticData';
import { toast } from 'react-toastify';
import LoaderWrapper from '../components/LoaderWrapper';

export default function HomePage() {
  const [loanType, setLoanType] = useState('home');
  const [loanSubType, setLoanSubType] = useState('');
  const [consumerCategory, setConsumerCategory] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  const [loans, setLoans] = useState([]);
  const [loanSubtypes, setLoanSubtypes] = useState([]);
  const [consumerCategories, setConsumerCategories] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleProceed = async () => {
    const isValid = await methods.trigger('loanAmount'); // Validate only loanAmount field

    if (!isValid) {
      console.log('Loan Amount validation failed');
      return; // Stop if validation fails
    }

    let path = '/apply';
    path += `/${loanType}`;
    if (loanType === 'vehicle' && loanSubType) {
      path += `/${loanSubType}`;
    }
    if (employmentType) {
      switch (employmentType) {
        case 'salaried':
          path += '/income/salaried';
          break;
        case 'business':
          path += '/income/business';
          break;
        case 'professional':
          path += '/income/professional';
          break;
        default:
          path += '/income/general';
      }
    }
    toast.success('Saved Successful!', { position: 'bottom-right' });
    navigate(path);
  };

  const methods = useForm({
    defaultValues: { loanAmount: '' },
    mode: 'onChange' // ✅ validate on change
  });

  const handleAmount = (field) => (e) => {
    const raw = e.target.value.replace(/,/g, '');
    const formatted = formatIndianNumber(raw);
    field.onChange(formatted);
  };

  const formatIndianNumber = (num = '') => {
    const x = num.replace(/\D/g, '');
    return x.length > 3
      ? x.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + x.slice(-3)
      : x;
  };

  useEffect(() => {
    // ===== COMMENTED OUT SERVER FETCH =====
    /*
    const fetchData = async () => {
      try {
        const [loansData, subtypesData, consumerData, employmentData] = await Promise.all([
          getLoans(),
          getLoanSubtypes(),
          getConsumerCategories(),
          getEmploymentTypes()
        ]);

        setLoans(loansData);
        setLoanSubtypes(subtypesData);
        setConsumerCategories(consumerData);
        setEmploymentTypes(employmentData);

        if (loansData.length) setLoanType(loansData[0].value);
        if (subtypesData.length) setLoanSubType(subtypesData[0].value);
        if (consumerData.length) setConsumerCategory(consumerData[0].value);
        if (employmentData.length) setEmploymentType(employmentData[0].value);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    */

    // ===== USE STATIC DATA INSTEAD =====
    setLoans(staticLoans);
    setLoanSubtypes(staticLoanSubtypes);
    setConsumerCategories(staticConsumerCategories);
    setEmploymentTypes(staticEmploymentTypes);

    if (staticLoans.length) setLoanType(staticLoans[0].value);
    if (staticLoanSubtypes.length) setLoanSubType(staticLoanSubtypes[0].value);
    if (staticConsumerCategories.length) setConsumerCategory(staticConsumerCategories[0].value);
    if (staticEmploymentTypes.length) setEmploymentType(staticEmploymentTypes[0].value);
  }, []);

  const { formState } = methods;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <PageWrapper>
        <Container
          className="container"
          sx={{
            maxWidth: { xs: '95%', sm: '90%', md: '80%', lg: '100%' },
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            className="home-title"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' }
            }}
          >
            Welcome to Kalolytic Loan Portal
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', // always vertical
              gap: 2, // consistent spacing
              flexWrap: 'wrap'
            }}
          >
            <ButtonGroup
              title="Loan Type"
              items={loans}
              selectedValue={loanType}
              onSelect={setLoanType}
              iconSize={21}
            />
            {['home', 'personal', 'education', 'vehicle'].includes(loanType) && (
              <ButtonGroup
                title="Consumer Category"
                items={consumerCategories}
                selectedValue={consumerCategory}
                onSelect={setConsumerCategory}
                iconSize={21}
              />
            )}

            {loanType === 'vehicle' && (
              <>
                <ButtonGroup
                  title="Loan Sub Type"
                  items={loanSubtypes}
                  selectedValue={loanSubType}
                  onSelect={setLoanSubType}
                  iconSize={21}
                />
                <ButtonGroup
                  title="Employment Type"
                  items={employmentTypes}
                  selectedValue={employmentType}
                  onSelect={setEmploymentType}
                  iconSize={21}
                />
              </>
            )}
          </Box>

          <Box sx={{ width: { xs: '80%', sm: '50%' } }}>
            <Controller
              name="loanAmount"
              control={methods.control}
              defaultValue=""
              rules={{
                required: 'Loan Amount is required',
                validate: (value) => {
                  if (!value) return true; // let "required" handle empty
                  const fakeEvent = { target: { value } };
                  const message = handleVAPT(fakeEvent, 'LOAN_AMOUNT', '', 'AMOUNT_FIELD');
                  return message === '' || message;
                }
              }}
              render={({ field, fieldState }) => (
                <Box sx={{ width: { xs: '100%', sm: '70%' } }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    label="Loan Amount"
                    placeholder="Enter loan amount"
                    value={field.value || ''}
                    // onChange={field.onChange}
                    onChange={handleAmount(field)}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                </Box>
              )}
            />

            <Box
              sx={{
                width: { xs: '100%', sm: '70%' },
                display: 'flex',
                justifyContent: { xs: 'space-between', sm: 'flex-start' },
                gap: { xs: 1, sm: 3 },
                fontSize: { xs: '0.8rem', sm: '1rem' }
              }}
              className="loan-amt-note"
            >
              <span>Min. ₹1lac</span>
              <span> Max. ₹1cr</span>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }} align="center">
            <Button
              className="next-btn"
              variant="contained"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
              disabled={!formState.isValid}
              onClick={handleProceed}
            >
              Proceed
            </Button>
          </Box>
        </Container>
      </PageWrapper>
    </LoaderWrapper>
  );
}
