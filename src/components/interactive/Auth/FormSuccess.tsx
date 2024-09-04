import { CircleCheck } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-x-3 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <CircleCheck className="h-4 w-4" />
      {message}
    </div>
  );
};

export default FormSuccess;
