KALOLYTIC  — Loan Application Portal (React JS scaffold)


    
Include these sections:

==>Quick start (create-react-app, install, run mock, run start)

==> Folder structure explanation

==> How to run json-server (npm run mock)

==> How to replace mockService with Spring Boot endpoints (migration notes and which endpoints to implement):

==> POST /applications -> create application (payload)

==> GET /loanTypes and GET /loanSubtypes -> loan metadata

==> POST /applications/:id/documents -> upload documents

==> GET /applications/:id/sanction -> sanction details

==> TODO checklist for backend integration

Pages quick notes / TODOs

HomePage.jsx : loads /loanSubtypes JSON, renders LoanTabs and LoanSubTabs. Each tab links to /apply/:loanType/:subtype.

MultiLoanFormPage.jsx : contains MUI Stepper, FormProvider from react-hook-form, Step components, useFormPersistence hook to auto-save per step. On step next, call mockService.saveFormResponse (or update existing id).

DocumentVerification.jsx : allow file upload + metadata fields, preview documents (use DocumentPreview component), and save file metadata (filename, size, type, base64 placeholder) to formResponses entry.

SanctionLetter.jsx : render a printable sanction letter populated from form response; implement window.print() and a download-to-PDF helper (TODO: integrate html2pdf or server-side generation later).

ThankYou.jsx : read created application id (UUID or json-server id) and show simple summary. Provide link to print or next steps.