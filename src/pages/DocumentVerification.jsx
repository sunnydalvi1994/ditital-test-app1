import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import '../styles/components/uploadDoc.css';
import '../styles/components/formAndButtons.css';
import '../styles/global.css';
import '../styles/sahamati.css';
import PageWrapper from '../components/PageWrapper';
import { toast } from 'react-toastify';
import LoaderWrapper from '../components/LoaderWrapper';
import { useNavigate } from 'react-router-dom';
import OtpVerificationModal from '../components/OtpVerificationModal';

export default function DocumentVerification() {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [allUploaded, setAllUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bankOption, setBankOption] = useState('');
  const [itrOption, setItrOption] = useState('');
  const [uploadCards, setUploadCards] = useState([
    { id: genId(), bank: '', startDate: '', endDate: '' }
  ]);
  const [savedBankStatements, setSavedBankStatements] = useState([]);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [currentOtpIndex, setCurrentOtpIndex] = useState(null);
  const [otpStage, setOtpStage] = useState(null);
  const [showAllCards, setShowAllCards] = useState(true);
  const [sahamtiCards, setSahamtiCards] = useState([
    {
      id: genId(),
      bank: '',
      mobileNumber: '',
      isVerified: false,
      hasFetched: false
    }
  ]);
  const [showAllSahamtiCards, setShowAllSahamtiCards] = useState(false);

  const navigate = useNavigate();
  const fileInputRefs = useRef({});

  // Constants
  const months = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    []
  );
  const years = useMemo(() => [2024, 2025], []);
  const banks = useMemo(() => ['HDFC', 'ICICI', 'SBI', 'AXIS'], []);

  const requiredDocs = useMemo(
    () => [
      'bankStatement',
      'itr2024',
      'itr2023',
      'itr2022',
      'salaryJan24',
      'salaryFeb24',
      'salaryMar24',
      'latestPhoto'
    ],
    []
  );

  const itrDocs = useMemo(
    () => [
      { id: 'itr2024', name: 'Form 16 / ITR', year: '2024' },
      { id: 'itr2023', name: 'Form 16 / ITR', year: '2023' },
      { id: 'itr2022', name: 'Form 16 / ITR', year: '2022' }
    ],
    []
  );

  const salaryDocs = useMemo(
    () => [
      { id: 'salaryJan24', name: 'Salary Slip', monthYear: 'JAN 24' },
      { id: 'salaryFeb24', name: 'Salary Slip', monthYear: 'FEB 24' },
      { id: 'salaryMar24', name: 'Salary Slip', monthYear: 'MAR 24' }
    ],
    []
  );

  const photoDoc = useMemo(() => [{ id: 'latestPhoto', name: 'Latest Photo' }], []);

  // Utility function
  function genId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  // Memoized options generators
  const monthYearOptions = useMemo(() => {
    const options = [];
    years.forEach((year) => {
      months.forEach((month) => options.push(`${month} ${year}`));
    });
    return options;
  }, [months, years]);

  const getEndRangeOptions = useCallback(
    (start) => {
      if (!start) return [];
      const [startMonth, startYear] = start.split(' ');
      const startIndex = months.indexOf(startMonth);
      const startYearNum = parseInt(startYear);

      const options = [];
      for (let i = 0; i < 12; i++) {
        const monthIndex = (startIndex + i) % 12;
        const year = startIndex + i > 11 ? startYearNum + 1 : startYearNum;
        options.push(`${months[monthIndex]} ${year}`);
      }
      return options;
    },
    [months]
  );

  // Document completion check
  const isDocCompleted = useCallback(
    (docId) => {
      if (docId === 'bankStatement') {
        const bankEntry = uploadedDocs['bankStatement'];
        if (bankEntry) {
          const f = bankEntry.file;
          if (Array.isArray(f) ? f.length > 0 : !!f) return true;
        }
        if (uploadCards?.some((c) => c?.file)) return true;
        if (sahamtiCards?.some((c) => c?.hasFetched)) return true;
        return false;
      }
      const entry = uploadedDocs[docId];
      const f = entry?.file;
      return Array.isArray(f) ? f.length > 0 : !!f;
    },
    [uploadedDocs, uploadCards, sahamtiCards]
  );

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setAllUploaded(requiredDocs.every(isDocCompleted));
  }, [uploadedDocs, uploadCards, sahamtiCards, requiredDocs, isDocCompleted]);

  // Generic state updater for arrays
  const updateArrayState = useCallback((setter, index, field, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }, []);

  // Handlers
  const handleFileChange = useCallback((docId, file, name, year) => {
    if (file) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docId]: { ...prev[docId], file }
      }));
      const displayYear = year ? ` (${year})` : '';
      toast.success(`${name}${displayYear} uploaded successfully! 🎉`, {
        autoClose: 2000,
        position: 'bottom-right'
      });
    }
  }, []);

  const handleRemoveFile = useCallback((docId) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], file: null }
    }));
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId].value = '';
    }
  }, []);

  const handleYearChange = useCallback((docId, year) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], year }
    }));
  }, []);

  const handleMonthYearChange = useCallback((docId, monthYear) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], monthYear }
    }));
  }, []);

  // Upload card handlers
  const handleFileUpload = useCallback(
    (index, event) => {
      const file = event.target.files[0];
      if (file) {
        const updatedCards = [...uploadCards];
        updatedCards[index].fileName = file.name;
        updatedCards[index].file = file;

        if (!updatedCards[index].saved) {
          const entry = {
            bank: updatedCards[index].bank || '',
            startDate: updatedCards[index].startDate || '',
            endDate: updatedCards[index].endDate || '',
            fileName: file.name,
            file
          };
          setSavedBankStatements((prev) => {
            const next = [...prev, entry];
            setUploadedDocs((updPrev) => ({
              ...updPrev,
              bankStatement: {
                ...(updPrev.bankStatement || {}),
                file: next
              }
            }));
            return next;
          });
          updatedCards[index].saved = true;
        }
        setUploadCards(updatedCards);
      }
    },
    [uploadCards]
  );

  const handleUploadCardChange = useCallback((index, field, value) => {
    setUploadCards((prev) =>
      prev.map((card, i) => {
        if (i !== index) return card;
        const updated = { ...card, [field]: value };
        if (field === 'startDate') updated.endDate = '';
        return updated;
      })
    );
  }, []);

  const handleAddUploadCard = useCallback(() => {
    setUploadCards((prev) => [...prev, { id: genId(), bank: '', startDate: '', endDate: '' }]);
    setShowAllCards(true);
  }, []);

  const handleRemoveUploadCard = useCallback((index) => {
    setUploadCards((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveUploadCards = useCallback(() => {
    console.log('Saved bank statements:', uploadCards);
    toast.success('Bank statements saved successfully!', { autoClose: 2000 });
    setUploadCards([
      { id: genId(), bank: '', startDate: '', endDate: '', fileName: '', file: null }
    ]);
    setShowAllCards(false);
  }, [uploadCards]);

  // Sahamati handlers
  const handleAddSahamtiCard = useCallback(() => {
    setSahamtiCards((prev) => [
      ...prev,
      {
        id: genId(),
        bank: '',
        mobileNumber: '',
        isVerified: false,
        hasFetched: false
      }
    ]);
    setShowAllSahamtiCards(true);
  }, []);

  const handleRemoveSahamtiCard = useCallback((index) => {
    setSahamtiCards((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSahamtiCardChange = useCallback(
    (index, field, value) => {
      updateArrayState(setSahamtiCards, index, field, value);
    },
    [updateArrayState]
  );

  const handleSahamtiMobileChange = useCallback(
    (index, e) => {
      const value = e.target.value.replace(/\D/g, '');
      handleSahamtiCardChange(index, 'mobileNumber', value);
    },
    [handleSahamtiCardChange]
  );

  const handleSahamtiChangeClick = useCallback((index) => {
    setSahamtiCards((prev) =>
      prev.map((card, i) =>
        i === index
          ? { ...card, mobileNumber: '', isVerified: false, hasFetched: false, bank: '' }
          : card
      )
    );
  }, []);

  const handleSahamtiVerify = useCallback(
    (index) => {
      setCurrentOtpIndex(index);
      setOtpStage('verify');
      setOtpModalOpen(true);
      updateArrayState(setSahamtiCards, index, 'isVerified', true);
    },
    [updateArrayState]
  );

  const handleSahamtiFetch = useCallback(
    (index) => {
      setCurrentOtpIndex(index);
      setOtpStage('fetch');
      setOtpModalOpen(true);
      updateArrayState(setSahamtiCards, index, 'hasFetched', true);
      toast.success('Bank statement fetched successfully!', { autoClose: 2000 });
    },
    [updateArrayState]
  );

  const handleProceed = useCallback(() => {
    if (!allUploaded) {
      toast.error('Please upload all required documents.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/thank-you');
    }, 1000);
  }, [allUploaded, navigate]);

  // Render functions
  const renderUploadBox = useCallback(
    (doc) => (
      <Grid item xs={12} sm={6} md={3} key={doc.id}>
        <Box className={`upload-box ${uploadedDocs[doc.id]?.file ? 'uploaded' : ''}`}>
          <Box className="upload-icon">{doc.icon}</Box>
          <Typography variant="h6" className="upload-title">
            {doc.name}
          </Typography>

          {doc.year && (
            <Box className="year-select-box">
              <Select
                fullWidth
                displayEmpty
                value={uploadedDocs[doc.id]?.year ?? ''}
                onChange={(e) => handleYearChange(doc.id, e.target.value)}
                variant="standard"
                className="year-select"
              >
                <MenuItem value="">
                  <em>Select Year</em>
                </MenuItem>
                {[2022, 2023, 2024, 2025].map((yr) => (
                  <MenuItem key={yr} value={yr}>
                    {yr}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {doc.monthYear && (
            <Box className="month-select-box">
              <Select
                fullWidth
                displayEmpty
                value={uploadedDocs[doc.id]?.monthYear ?? ''}
                onChange={(e) => handleMonthYearChange(doc.id, e.target.value)}
                variant="standard"
                className="month-select"
              >
                <MenuItem value="">
                  <em>Select Month & Year</em>
                </MenuItem>
                {[
                  'JAN 24',
                  'FEB 24',
                  'MAR 24',
                  'APR 24',
                  'MAY 24',
                  'JUN 24',
                  'JUL 24',
                  'AUG 24',
                  'SEP 24',
                  'OCT 24',
                  'NOV 24',
                  'DEC 24'
                ].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {doc.note && (
            <Typography variant="body2" className="doc-note">
              {doc.note}
            </Typography>
          )}

          <input
            ref={(el) => (fileInputRefs.current[doc.id] = el)}
            type="file"
            id={`file-input-${doc.id}`}
            className="hidden-file-input"
            onChange={(e) =>
              handleFileChange(doc.id, e.target.files[0], doc.name, doc.year || doc.monthYear || '')
            }
            accept=".pdf,.jpg,.png"
            disabled={!!uploadedDocs[doc.id]?.file}
          />
          <label htmlFor={`file-input-${doc.id}`}>
            <Button
              className={`verify-btn doc-btn ${uploadedDocs[doc.id]?.file ? 'verified' : ''}`}
              component="span"
              disabled={!!uploadedDocs[doc.id]?.file}
            >
              {uploadedDocs[doc.id]?.file ? 'File Selected' : 'Choose File'}
            </Button>
          </label>

          {uploadedDocs[doc.id]?.file && (
            <Box className="upload-status-box">
              <Typography className="upload-status" sx={{ display: 'flex' }}>
                {uploadedDocs[doc.id].file.name} uploaded
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRemoveFile(doc.id)}
                className="close-icon-button"
              >
                <DeleteIcon fontSize="inherit" sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Grid>
    ),
    [uploadedDocs, handleYearChange, handleMonthYearChange, handleFileChange, handleRemoveFile]
  );

  const selectStyle = {
    height: '37px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d0d0d0',
      borderWidth: '1.5px'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0d4689'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0d4689',
      borderWidth: '2px'
    },
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    '&:not(.Mui-disabled):hover': {
      backgroundColor: '#f8fbff',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(13, 70, 137, 0.12)'
    }
  };

  const proceedButtonStyle = useMemo(
    () =>
      allUploaded
        ? {
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(40,167,69,0.3)'
          }
        : {
            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(244,67,54,0.3)'
          },
    [allUploaded]
  );

  const proceedButtonText = useMemo(
    () =>
      allUploaded
        ? '✓ All Documents Verified - Proceed'
        : `Verify ${requiredDocs.filter((docId) => !isDocCompleted(docId)).length} more documents`,
    [allUploaded, requiredDocs, isDocCompleted]
  );

  return (
    <LoaderWrapper loading={loading}>
      <PageWrapper>
        <Box className="step-content">
          {/* Header */}
          <Box className="upload-header">
            <Typography variant="h4" sx={{ color: '#333' }}>
              Document Upload
            </Typography>
            <Typography variant="body1">
              Upload your documents as PDF files for quick verification
            </Typography>
          </Box>

          {/* Bank Statement Section */}
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={6}>
              <Box className="upload-box">
                <Typography variant="h6" className="upload-title">
                  Bank Statement
                </Typography>
                {bankOption === 'upload' && (
                  <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                    You can upload multiple bank statements.
                  </Typography>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 1, sm: 2, md: 2 },
                    mb: 2,
                    ml: { xs: 0, sm: 2, md: 38 },
                    fontWeight: 600,
                    fontSize: { xs: 14, sm: 16, md: 17 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'center' }, // align properly across screens
                    '& label': {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      gap: '5px', // ✅ 2px gap between radio and text
                      whiteSpace: 'nowrap' // prevent breaking on small screens
                    }
                  }}
                >
                  <label>
                    <input
                      type="radio"
                      value="sahamati"
                      checked={bankOption === 'sahamati'}
                      onChange={(e) => setBankOption(e.target.value)}
                    />
                    Sahamati
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="upload"
                      checked={bankOption === 'upload'}
                      onChange={(e) => setBankOption(e.target.value)}
                    />
                    Upload
                  </label>
                </Box>

                {/* Sahamati Section */}
                {bankOption === 'sahamati' && (
                  <Box className="sahamti-wrapper">
                    {sahamtiCards.length > 1 && (
                      <Box className="sahamti-toggle-wrapper">
                        <Tooltip
                          title={showAllSahamtiCards ? 'Hide' : 'Expand'}
                          arrow
                          placement="left"
                        >
                          <IconButton
                            onClick={() => setShowAllSahamtiCards(!showAllSahamtiCards)}
                            className="sahamti-toggle-btn"
                          >
                            {showAllSahamtiCards ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            <Typography className="sahamti-toggle-count">
                              {showAllSahamtiCards ? '' : ` (${sahamtiCards.length})`}
                            </Typography>
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    <Box className="card-box sahamti-card">
                      <Typography variant="subtitle1" className="sahamti-title">
                        Fetch Bank Statement (Sahamati)
                      </Typography>

                      <Box className="sahamti-headings-row" sx={{ mt: 4 }}>
                        <Box className="col-25">
                          <Typography variant="subtitle2" className="sahamti-heading">
                            Bank
                          </Typography>
                        </Box>
                        <Box className="col-25">
                          <Typography variant="subtitle2" className="sahamti-heading">
                            Register phone Number
                          </Typography>
                        </Box>
                        <Box className="col-25">
                          <Typography variant="subtitle2" className="sahamti-heading">
                            Action
                          </Typography>
                        </Box>
                        <Box className="col-25">{/* empty */}</Box>
                      </Box>

                      {sahamtiCards
                        .slice(0, showAllSahamtiCards ? sahamtiCards.length : 1)
                        .map((card, index) => (
                          <Box key={card.id} className="sahamti-row">
                            <Box className="col-25">
                              <Select
                                fullWidth
                                value={card.bank}
                                onChange={(e) =>
                                  handleSahamtiCardChange(index, 'bank', e.target.value)
                                }
                                displayEmpty
                                variant="outlined"
                                className="sahamti-select"
                              >
                                <MenuItem value="">
                                  <em>Select Bank</em>
                                </MenuItem>
                                {banks.map((bank) => (
                                  <MenuItem key={bank} value={bank}>
                                    {bank} Bank
                                  </MenuItem>
                                ))}
                              </Select>
                            </Box>

                            <Box className="col-25 saha-mobile-col">
                              <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter Phone number"
                                value={card.mobileNumber}
                                onChange={(e) => handleSahamtiMobileChange(index, e)}
                                inputProps={{ maxLength: 10 }}
                                className="sahamti-textfield"
                              />
                              {card.mobileNumber && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleSahamtiChangeClick(index)}
                                  className="sahamti-clear-btn"
                                >
                                  ×
                                </IconButton>
                              )}
                            </Box>

                            <Box className="col-25">
                              {!card.isVerified ? (
                                <Button
                                  variant="contained"
                                  onClick={() => handleSahamtiVerify(index)}
                                  disabled={card.mobileNumber.length !== 10 || !card.bank}
                                  fullWidth
                                  className="sahamti-action-btn"
                                  style={{
                                    background:
                                      card.mobileNumber.length === 10 && card.bank
                                        ? 'linear-gradient(135deg, #0d4689 0%, #3a76b9 100%)'
                                        : '#ccc'
                                  }}
                                >
                                  Verify
                                </Button>
                              ) : !card.hasFetched ? (
                                <Button
                                  variant="contained"
                                  onClick={() => handleSahamtiFetch(index)}
                                  fullWidth
                                  className="sahamti-fetch-btn"
                                >
                                  Fetch Statement
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  disabled
                                  fullWidth
                                  className="sahamti-fetched-btn"
                                >
                                  ✓ Fetched
                                </Button>
                              )}
                            </Box>

                            <Box className="col-25 saha-remove-col">
                              {sahamtiCards.length > 1 && (
                                <Tooltip title="Remove" arrow>
                                  <IconButton
                                    onClick={() => handleRemoveSahamtiCard(index)}
                                    className="sahamti-remove-btn"
                                  >
                                    <DeleteIcon sx={{ fontSize: '28px' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        ))}

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          mt: 2
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            mt: { xs: 1, md: 4 }
                          }}
                        >
                          <Typography sx={{ fontWeight: 700, color: '#0d4689' }}>
                            Add another bank account
                          </Typography>
                          <IconButton
                            onClick={handleAddSahamtiCard}
                            sx={{
                              color: '#fff',
                              background: 'linear-gradient(135deg, #0d4689 0%, #3a76b9 100%)',
                              width: 40,
                              height: 40,
                              transition: 'all 0.3s ease',
                              boxShadow: '0 3px 10px rgba(13, 70, 137, 0.3)',
                              '&:hover': {
                                transform: 'scale(1.2) rotate(90deg)'
                              }
                            }}
                          >
                            <AddIcon sx={{ fontSize: '22px' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Upload Section */}
                {bankOption === 'upload' && (
                  <Box sx={{ mt: 2 }}>
                    {uploadCards.length > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Tooltip title={showAllCards ? 'Hide' : 'Expand'} arrow placement="left">
                          <IconButton
                            onClick={() => setShowAllCards(!showAllCards)}
                            sx={{
                              color: '#fff',
                              background: 'linear-gradient(135deg, #0d4689 0%, #3a76b9 100%)',
                              boxShadow: '0 3px 10px rgba(13, 70, 137, 0.3)',
                              padding: '1px 4px',
                              borderRadius: 2,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #3a76b9 0%, #5a96d9 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 18px rgba(13, 70, 137, 0.5)'
                              }
                            }}
                          >
                            {showAllCards ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            <Typography sx={{ ml: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                              {showAllCards ? '' : ` (${uploadCards.length})`}
                            </Typography>
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    <Box className="card-box upload-cards-container upload-cards-wrapper">
                      <Box
                        sx={{ mb: 3, width: '100%', display: 'flex', justifyContent: 'flex-start' }}
                      >
                        <Typography
                          className="upload-warning"
                          sx={{ color: '#dc3545', fontWeight: 600, fontSize: '0.9rem' }}
                        >
                          ⚠️ Bank statement can't exceed 1 year !!!
                        </Typography>
                      </Box>

                      <Box
                        className="upload-headings-row"
                        sx={{ display: 'flex', gap: 2, mb: 1, px: 1 }}
                      >
                        <Box sx={{ flex: '0 0 calc(25% - 12px)' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: '#0d4689', fontSize: '0.95rem' }}
                          >
                            Bank
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 calc(20.83% - 12px)' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: '#0d4689',
                              fontSize: '0.95rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Start Range
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 calc(20.83% - 12px)' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: '#0d4689',
                              fontSize: '0.95rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            End Range
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 calc(27.5% - 12px)' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: '#0d4689',
                              fontSize: '0.95rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Upload Statement
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 calc(5.84% - 12px)' }}></Box>
                      </Box>

                      {uploadCards
                        .slice(0, showAllCards ? uploadCards.length : 1)
                        .map((card, index) => (
                          <Box key={card.id} className="upload-row">
                            <Box className="col-25">
                              <Select
                                fullWidth
                                value={card.bank}
                                onChange={(e) =>
                                  handleUploadCardChange(index, 'bank', e.target.value)
                                }
                                displayEmpty
                                variant="outlined"
                                sx={selectStyle}
                              >
                                <MenuItem value="">
                                  <em>Select Bank</em>
                                </MenuItem>
                                {banks.map((bank) => (
                                  <MenuItem key={bank} value={bank}>
                                    {bank} Bank
                                  </MenuItem>
                                ))}
                              </Select>
                            </Box>

                            <Box className="col-20">
                              <Select
                                fullWidth
                                value={card.startDate}
                                onChange={(e) =>
                                  handleUploadCardChange(index, 'startDate', e.target.value)
                                }
                                displayEmpty
                                variant="outlined"
                                sx={selectStyle}
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {monthYearOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Box>

                            <Box className="col-20">
                              <Select
                                fullWidth
                                value={card.endDate}
                                onChange={(e) =>
                                  handleUploadCardChange(index, 'endDate', e.target.value)
                                }
                                displayEmpty
                                variant="outlined"
                                disabled={!card.startDate}
                                sx={selectStyle}
                              >
                                <MenuItem value="">
                                  <em>Select</em>
                                </MenuItem>
                                {getEndRangeOptions(card.startDate).map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Box>

                            <Box className="col-27">
                              <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<UploadFileIcon />}
                                className="upload-file-btn"
                              >
                                {card.fileName
                                  ? card.fileName.length > 15
                                    ? card.fileName.substring(0, 10) + '...'
                                    : card.fileName
                                  : 'Choose File'}
                                <input
                                  type="file"
                                  hidden
                                  accept="*"
                                  onChange={(e) => handleFileUpload(index, e)}
                                />
                              </Button>
                              {/* {card.fileName && (
                              <Typography variant="caption" className="upload-file-name">✓ {card.fileName}</Typography>
                            )} */}
                            </Box>

                            <Box className="col-6 upload-remove-col">
                              {uploadCards.length > 1 && (
                                <Tooltip title="Remove" arrow>
                                  <IconButton
                                    onClick={() => handleRemoveUploadCard(index)}
                                    className="upload-remove-btn"
                                  >
                                    <DeleteIcon sx={{ fontSize: '18px' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        ))}

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          mt: 2
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            mt: 4,
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                          }}
                        >
                          <Typography sx={{ fontWeight: 700, color: '#0d4689' }}>
                            Add another bank statement
                          </Typography>
                          <IconButton
                            onClick={handleAddUploadCard}
                            sx={{
                              color: '#fff',
                              background: 'linear-gradient(135deg, #0d4689 0%, #3a76b9 100%)',
                              width: 40,
                              height: 40,
                              transition: 'all 0.3s ease',
                              boxShadow: '0 3px 10px rgba(13, 70, 137, 0.3)',
                              '&:hover': {
                                transform: 'scale(1.2) rotate(90deg)'
                              }
                            }}
                          >
                            <AddIcon sx={{ fontSize: '22px' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    <Button
                      onClick={handleSaveUploadCards}
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #0d4689 0%, #3a76b9 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        mt: 1,
                        padding: '5px 10px',
                        borderRadius: 1,
                        boxShadow: '0 4px 12px rgba(13, 70, 137, 0.25)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0b3b7a 0%, #33629c 100%)',
                          boxShadow: '0 8px 20px rgba(13, 70, 137, 0.35)',
                          transform: 'translateY(-3px)'
                        }
                      }}
                    >
                      Save
                    </Button>

                    {savedBankStatements.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {savedBankStatements.map((entry, idx) => (
                          <Box key={idx} className="upload-status-box" sx={{ mt: 1 }}>
                            <Typography className="upload-status" sx={{ display: 'flex' }}>
                              {entry.fileName || (entry.file && entry.file.name)} uploaded —{' '}
                              {entry.bank || 'N/A'} ({entry.startDate} - {entry.endDate})
                            </Typography>
                            {/* <IconButton
                              size="small"
                              onClick={() => {
                                const next = savedBankStatements.filter((_, i) => i !== idx);
                                setSavedBankStatements(next);
                                setUploadedDocs(prev => ({
                                  ...prev,
                                  bankStatement: { ...(prev.bankStatement || {}), file: next.length ? next : null }
                                }));
                              }}
                              className="close-icon-button"
                            >
                              <DeleteIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                            </IconButton> */}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* ITR Section */}
          <Box className="upload-header">
            <Typography variant="h6" sx={{ color: '#333' }}>
              Upload/Fetch Form 16 OR Upload ITR
            </Typography>
          </Box>
          <Box className="docu-itr-box">
            <label>
              <input
                type="radio"
                value="fetchItr"
                checked={itrOption === 'fetchItr'}
                onChange={(e) => setItrOption(e.target.value)}
              />
              &nbsp; Fetch
            </label>

            <label>
              <input
                type="radio"
                value="uploadItr"
                checked={itrOption === 'uploadItr'}
                onChange={(e) => setItrOption(e.target.value)}
              />
              &nbsp; Upload
            </label>
          </Box>
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            {itrOption === 'fetchItr' && (
              <Button
                className={`verify-btn doc-btn `}
                style={{ width: '100px', margin: '0 auto' }}
              >
                Fetch ITR
              </Button>
            )}

            {itrOption === 'uploadItr' && itrDocs.map(renderUploadBox)}
          </Grid>

          {/* Salary Slips */}
          <Box className="upload-header">
            <Typography variant="h6" sx={{ color: '#333' }}>
              Upload Salary Slip
            </Typography>
          </Box>
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            {salaryDocs.map(renderUploadBox)}
          </Grid>

          {/* Latest Photo */}
          <Grid container spacing={2} className="upload-grid" sx={{ mb: 4 }}>
            {photoDoc.map(renderUploadBox)}
          </Grid>

          {/* Navigation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              mt: 4,
              gap: 1
            }}
          >
            <Button className="prev-btn" variant="contained" color="secondary">
              Previous
            </Button>
            <Button
              className="next-btn forDisabled"
              variant="contained"
              sx={proceedButtonStyle}
              disabled={!allUploaded}
              onClick={handleProceed}
              style={{ whiteSpace: 'nowrap' }}
            >
              {proceedButtonText}
            </Button>
          </Box>
        </Box>

        <OtpVerificationModal
          key={`${otpModalOpen}-${currentOtpIndex}-${otpStage}`}
          open={otpModalOpen}
          mobileNumber={currentOtpIndex !== null ? sahamtiCards[currentOtpIndex].mobileNumber : ''}
          onClose={() => {
            setOtpModalOpen(false);
            setCurrentOtpIndex(null);
            setOtpStage(null);
          }}
          onVerify={(otp) => {
            console.log('OTP entered:', otp);
            if (currentOtpIndex !== null) {
              const updatedCards = [...sahamtiCards];
              if (otpStage === 'verify') {
                updatedCards[currentOtpIndex].isVerified = true;
                setSahamtiCards(updatedCards);
                toast.success(
                  'Mobile verified successfully! Now click "Fetch Statement" to proceed.',
                  { autoClose: 2000 }
                );
              } else if (otpStage === 'fetch') {
                updatedCards[currentOtpIndex].hasFetched = true;
                setSahamtiCards(updatedCards);
                toast.success('Bank statement fetched successfully!', { autoClose: 2000 });
              }
            }
            setOtpModalOpen(false);
            setCurrentOtpIndex(null);
            setOtpStage(null);
          }}
          onResend={() => {
            toast.info('OTP resent!');
          }}
        />
      </PageWrapper>
    </LoaderWrapper>
  );
}
