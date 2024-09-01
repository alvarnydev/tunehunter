interface EmailTemplateProps {
  verificationCode: string;
}

export const VerificationTokenTemplate = ({ verificationCode }: EmailTemplateProps) => (
  <div>
    <p>Hi</p>
    <p>This is your verification code: </p>
    <p>Code: {verificationCode}</p>
  </div>
);
